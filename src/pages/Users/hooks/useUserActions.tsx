import { toast } from 'react-toastify'
import { useDrawer } from '~/contexts/DrawerContext'
import { Form } from '~/components/Form'
import type { Project } from '~/lib/queries/projects'
import { useInviteUser, useUpdateUser, useResendInvitation } from '~/lib/queries/users'
import { InviteUserForm } from '../InviteUserForm'
import { EditUserForm } from '../EditUserForm'
import type { BackendUpdateUserDto } from '../types'
import {
  inviteUserSchema,
  editUserSchema,
  isValidRole,
  type InviteUserFormData,
  type EditUserFormData,
  type BackendUser,
  type BackendInviteUserDto,
} from '../types'

interface UseUserActionsProps {
  projects: Project[]
}

interface UseUserActionsReturn {
  handleInvite: () => void
  handleEdit: (user: BackendUser) => void
  handleResendInvitation: (userId: string) => Promise<void>
  isResendingInvitation: boolean
}

export const useUserActions = ({ projects }: UseUserActionsProps): UseUserActionsReturn => {
  const { openDrawer, closeDrawer } = useDrawer()
  const inviteUser = useInviteUser()
  const updateUser = useUpdateUser()
  const resendInvitation = useResendInvitation()

  const handleInvite = (): void => {
    openDrawer({
      content: (
        <Form<InviteUserFormData>
          onSubmit={async (data): Promise<void> => {
            const inviteData: BackendInviteUserDto = {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              role: data.role,
              projects: data.projects,
            }

            await inviteUser.mutateAsync(inviteData)
            closeDrawer()
            toast.success('Invitation sent successfully')
          }}
          onCancel={closeDrawer}
          schema={inviteUserSchema}
          defaultValues={{
            role: 'member' as const,
          }}
        >
          {(control): JSX.Element => <InviteUserForm control={control} projects={projects || []} />}
        </Form>
      ),
      title: 'Invite User',
    })
  }

  const handleEdit = (user: BackendUser): void => {
    // Extract role safely with type checking
    const userRole = user.organizations[0]?.role
    if (!userRole || !isValidRole(userRole)) {
      toast.error('Invalid user role detected')
      return
    }

    openDrawer({
      content: (
        <Form<EditUserFormData>
          onSubmit={async (data): Promise<void> => {
            const updateData: BackendUpdateUserDto = {
              role: data.role,
              projects: data.projects,
            }

            await updateUser.mutateAsync({
              id: user._id,
              ...updateData,
            })
            closeDrawer()
            toast.success('User updated successfully')
          }}
          onCancel={closeDrawer}
          schema={editUserSchema}
          defaultValues={{
            email: user.email,
            role: userRole as NonNullable<BackendInviteUserDto['role']>,
            projects: user.projects.map((project: Project) => project._id),
          }}
        >
          {(control): JSX.Element => <EditUserForm control={control} projects={projects || []} />}
        </Form>
      ),
      title: 'Edit User',
    })
  }

  const handleResendInvitation = async (userId: string): Promise<void> => {
    try {
      await resendInvitation.mutateAsync(userId)
      toast.success('Invitation resent successfully')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to resend invitation')
    }
  }

  return {
    handleInvite,
    handleEdit,
    handleResendInvitation,
    isResendingInvitation: resendInvitation.isPending,
  }
}

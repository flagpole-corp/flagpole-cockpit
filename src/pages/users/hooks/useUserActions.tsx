import { toast } from 'react-toastify'
import { useDrawer } from '~/contexts/DrawerContext'
import { Form } from '~/components/forms'
import { useInviteUser, useUpdateUser, useResendInvitation } from '~/lib/api/users'
import type { Project } from '~/lib/api/projects'
import { useProjects } from '~/lib/api/projects'
import { InviteUserForm } from '../components/InviteUserForm'
import { EditUserForm } from '../components/EditUserForm'
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

interface UseUserActionsReturn {
  handleInvite: () => void
  handleEdit: (user: BackendUser) => void
  handleResendInvitation: (userId: string) => Promise<void>
  isResendingInvitation: boolean
}

export const useUserActions = (): UseUserActionsReturn => {
  const { openDrawer, closeDrawer } = useDrawer()
  const inviteUser = useInviteUser()
  const updateUser = useUpdateUser()
  const resendInvitation = useResendInvitation()
  const { data: projects } = useProjects()

  const handleInvite = (): void => {
    openDrawer({
      content: (
        <Form<InviteUserFormData>
          onSubmit={async (data): Promise<void> => {
            // If admin or owner, assign all projects
            let projectsToAssign = data.projects || []
            if ((data.role === 'admin' || data.role === 'owner') && projects) {
              projectsToAssign = projects.map((p) => p._id)
            }

            const inviteData: BackendInviteUserDto = {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              role: data.role,
              projects: projectsToAssign,
            }

            await inviteUser.mutateAsync(inviteData)
            closeDrawer()
            toast.success('Invitation sent successfully')
          }}
          onCancel={closeDrawer}
          schema={inviteUserSchema}
          defaultValues={{
            role: 'member' as const,
            projects: [],
          }}
        >
          {(control): JSX.Element => <InviteUserForm control={control} />}
        </Form>
      ),
      title: 'Invite User',
    })
  }

  const handleEdit = (user: BackendUser): void => {
    const userRole = user.organizationRole
    if (!userRole || !isValidRole(userRole)) {
      toast.error('Invalid user role detected')
      return
    }

    // Get user's current project IDs
    const userProjectIds = user.projects?.map((p: Project) => p._id) || []

    openDrawer({
      content: (
        <Form<EditUserFormData>
          onSubmit={async (data): Promise<void> => {
            // If admin or owner, assign all projects
            let projectsToAssign = data.projects || []
            if ((data.role === 'admin' || data.role === 'owner') && projects) {
              projectsToAssign = projects.map((p) => p._id)
            }

            const updateData: BackendUpdateUserDto = {
              role: data.role,
              projects: projectsToAssign,
              firstName: data.firstName,
              lastName: data.lastName,
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
            firstName: user.firstName,
            lastName: user.lastName,
            projects: userProjectIds,
          }}
        >
          {(control): JSX.Element => <EditUserForm control={control} />}
        </Form>
      ),
      title: 'Edit User',
    })
  }

  const handleResendInvitation = async (userId: string): Promise<void> => {
    try {
      await resendInvitation.mutateAsync(userId)
      toast.success('Invitation resent successfully')
      // eslint-disable-next-line
    } catch (error: any) {
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

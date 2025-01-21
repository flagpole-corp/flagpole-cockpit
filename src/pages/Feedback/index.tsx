import { z } from 'zod'
import { Form } from '~/components/Form'
import { FormSelect } from '~/components/FormSelect'
import { FormTextField } from '~/components/FormTextField'
import { useSendFeedback } from '~/lib/queries/feedback'
import { Box, Typography } from '@mui/material'

const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'other']),
  title: z.string().min(3),
  description: z.string().min(10),
})

type FeedbackForm = z.infer<typeof feedbackSchema>

const typeOptions = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'other', label: 'Other' },
]

export const Feedback = (): JSX.Element => {
  const { mutateAsync } = useSendFeedback()

  const handleSubmit = async (data: FeedbackForm): Promise<void> => {
    await mutateAsync(data)
  }

  return (
    <Box width="100%">
      <Typography variant="h5" component="h1">
        Feedback
      </Typography>

      <Typography paragraph color="text.secondary" sx={{ mb: 4 }}>
        We value your input! Use this form to report bugs, suggest new features, or share any other feedback about our
        platform. Your feedback helps us improve and better serve your needs.
      </Typography>

      <Form<FeedbackForm> schema={feedbackSchema} onSubmit={handleSubmit} onCancel={(reset): void => reset()}>
        {(control): JSX.Element => (
          <>
            <FormSelect control={control} name="type" label="Feedback Type" options={typeOptions} fullWidth />
            <FormTextField control={control} name="title" label="Title" fullWidth />
            <FormTextField control={control} name="description" label="Description" multiline rows={4} fullWidth />
          </>
        )}
      </Form>
    </Box>
  )
}

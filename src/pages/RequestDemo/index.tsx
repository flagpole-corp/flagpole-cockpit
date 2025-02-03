import { Container, Typography, Box, Card, CardContent } from '@mui/material'
import type { Control } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FormTextField } from '~/components/FormTextField'
import type { RequestDemo as RequestDemoType } from '~/lib/queries/request-demo'
import { requestDemoSchema, useRequestDemo } from '~/lib/queries/request-demo'
import { Form } from '~/components/Form'
import { Logo } from '~/components'

const RequestDemo = (): JSX.Element => {
  const navigate = useNavigate()
  const requestDemo = useRequestDemo()

  const handleSubmit = async (data: RequestDemoType): Promise<void> => {
    await requestDemo.mutateAsync(data)
  }

  const handleCancel = (): void => {
    navigate('/')
  }

  const renderForm = (control: Control<RequestDemoType>): JSX.Element => (
    <>
      <FormTextField control={control} name="name" label="Full Name" placeholder="John Doe" fullWidth required />
      <FormTextField
        control={control}
        name="email"
        label="Work Email"
        placeholder="john.doe@company.com"
        type="email"
        fullWidth
        required
      />
      <FormTextField
        control={control}
        name="companyName"
        label="Company Name"
        placeholder="Acme Inc."
        fullWidth
        required
      />
      <FormTextField
        control={control}
        name="notes"
        label="Additional Notes"
        placeholder="Tell us more about your use case..."
        multiline
        rows={4}
        fullWidth
      />
    </>
  )
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Try Our Feature Flag Management
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Get started with a personalized demo of our feature flag platform
        </Typography>

        <Card>
          <CardContent>
            <Logo />
            <Typography variant="h5" gutterBottom>
              Request a Demo
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Fill out the form below and our team will get in touch with you shortly to set up your demo.
            </Typography>

            <Form<RequestDemoType>
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              schema={requestDemoSchema}
              defaultValues={{
                name: '',
                email: '',
                companyName: '',
                notes: '',
              }}
            >
              {renderForm}
            </Form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default RequestDemo

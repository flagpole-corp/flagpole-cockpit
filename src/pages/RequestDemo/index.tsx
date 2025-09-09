import type { Theme } from '@mui/material'
import { Container, Typography, Box, Card, CardContent, Stack, Link } from '@mui/material'
import type { Control } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FormTextField } from '~/components/FormTextField'
import type { RequestDemo as RequestDemoType } from '~/lib/queries/request-demo'
import { requestDemoSchema, useRequestDemo } from '~/lib/queries/request-demo'
import { Form } from '~/components/Form'
import { Logo } from '~/components'
import Content from '../SignIn/Content'
import type { SystemStyleObject } from '@mui/system'

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
        <Stack
          direction={{ xs: 'column-reverse', sm: 'row' }}
          sx={[
            {
              justifyContent: 'center',
              minHeight: '100%',
              gap: { xs: 6, sm: 12 },
            },

            (theme): SystemStyleObject<Theme> => ({
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                zIndex: -1,
                inset: 0,
                backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
                backgroundRepeat: 'no-repeat',
                ...theme.applyStyles('dark', {
                  backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
                }),
              },
            }),
          ]}
        >
          <Content />
          <Card>
            <CardContent>
              <Link href="/">
                <Logo />
              </Link>
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
        </Stack>
      </Box>
    </Container>
  )
}

export default RequestDemo

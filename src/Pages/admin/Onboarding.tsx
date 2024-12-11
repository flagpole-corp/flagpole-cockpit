import type { FormEvent } from 'react'
import { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  Grid2 as Grid,
  Alert,
  OutlinedInput,
  FormHelperText,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import api from '~/lib/axios'
import { toast } from 'react-toastify'

export const OnboardingPage = (): JSX.Element => {
  const [formData, setFormData] = useState({
    name: '',
    ownerEmail: '',
    ownerName: '',
    plan: 'TRIAL',
  })

  const createOrganization = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/api/admin/organizations/create', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Organization created successfully!')
      setFormData({
        name: '',
        ownerEmail: '',
        ownerName: '',
        plan: 'TRIAL',
      })
    },
    onError: (error) => {
      toast.success('Failed to create organization')
      console.error('Error:', error)
    },
  })

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    createOrganization.mutate(formData)
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Customer Onboarding
      </Typography>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                  Organization Details
                </Typography>
              </Grid>

              <Grid size={12}>
                <OutlinedInput
                  fullWidth
                  placeholder="Organization Name"
                  value={formData.name}
                  onChange={(e): void => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <OutlinedInput
                  fullWidth
                  placeholder="Owner Email"
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e): void => setFormData({ ...formData, ownerEmail: e.target.value })}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <OutlinedInput
                  fullWidth
                  placeholder="Owner Name"
                  value={formData.ownerName}
                  onChange={(e): void => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                />
              </Grid>

              <Grid size={12}>
                <FormControl fullWidth>
                  <Select
                    label="testing"
                    value={formData.plan}
                    onChange={(e): void => setFormData({ ...formData, plan: e.target.value })}
                  >
                    <MenuItem value="TRIAL">Trial</MenuItem>
                    <MenuItem value="IC">Individual Contributor</MenuItem>
                    <MenuItem value="PRO">Pro</MenuItem>
                    <MenuItem value="ENTERPRISE">Enterprise</MenuItem>
                  </Select>
                  <FormHelperText>Choose a plan to onboard the customer</FormHelperText>
                </FormControl>
              </Grid>

              {formData.plan === 'TRIAL' && (
                <Grid size={12}>
                  <Alert severity="info">Trial accounts will be automatically set to expire in 7 days</Alert>
                </Grid>
              )}

              <Grid size={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button variant="contained" color="primary" type="submit" disabled={createOrganization.isPending}>
                    {createOrganization.isPending ? 'Creating...' : 'Create Organization'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

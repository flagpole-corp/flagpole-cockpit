import type { FormEvent } from 'react'
import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
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
      toast.error('Failed to create organization')
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
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Organization Details
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization Name"
                  value={formData.name}
                  onChange={(e): void => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Owner Email"
                  type="email"
                  value={formData.ownerEmail}
                  onChange={(e): void => setFormData({ ...formData, ownerEmail: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Owner Name"
                  value={formData.ownerName}
                  onChange={(e): void => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Plan</InputLabel>
                  <Select
                    value={formData.plan}
                    label="Plan"
                    onChange={(e): void => setFormData({ ...formData, plan: e.target.value })}
                  >
                    <MenuItem value="TRIAL">Trial</MenuItem>
                    <MenuItem value="IC">Individual Contributor</MenuItem>
                    <MenuItem value="PRO">Pro</MenuItem>
                    <MenuItem value="ENTERPRISE">Enterprise</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {formData.plan === 'TRIAL' && (
                <Grid item xs={12}>
                  <Alert severity="info">Trial accounts will be automatically set to expire in 7 days</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
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

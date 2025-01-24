import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import { Card, CardContent, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type CardAlertsProps = {
  icon?: ReactNode
  title: string
  text: string
  action?: ReactNode
}

export const CardAlert = ({ icon, title, text, action }: CardAlertsProps): JSX.Element => {
  return (
    <Card variant="outlined" sx={{ m: 1.5, p: 1.5 }}>
      <CardContent>
        {icon ? icon : <AutoAwesomeRoundedIcon fontSize="small" />}

        <Typography gutterBottom sx={{ fontWeight: 600 }}>
          {title}
          {/* Plan about to expire */}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {text}
          {/* Enjoy 10% off when renewing your plan today. */}
        </Typography>
        {action ? action : undefined}
      </CardContent>
    </Card>
  )
}

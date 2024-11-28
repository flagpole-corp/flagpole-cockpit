import Badge, { badgeClasses } from '@mui/material/Badge'
import type { IconButtonProps } from '@mui/material/IconButton'
import IconButton from '@mui/material/IconButton'

export interface MenuButtonProps extends IconButtonProps {
  showBadge?: boolean
}

export const MenuButton = ({ showBadge = false, ...props }: MenuButtonProps): JSX.Element => {
  return (
    <Badge
      color="error"
      variant="dot"
      invisible={!showBadge}
      sx={{ [`& .${badgeClasses.badge}`]: { right: 2, top: 2 } }}
    >
      <IconButton size="small" {...props} />
    </Badge>
  )
}
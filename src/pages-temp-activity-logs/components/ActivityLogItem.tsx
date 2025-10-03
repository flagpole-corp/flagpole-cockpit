import { ListItem, ListItemAvatar, ListItemText, Avatar, Box, Chip, Typography, Tooltip } from '@mui/material'
import { formatDistanceToNow, format } from 'date-fns'
import type { ActivityLog } from '~/lib/api/activity-logs/types'

interface ActivityLogItemProps {
  log: ActivityLog
}

export const ActivityLogItem = ({ log }: ActivityLogItemProps): JSX.Element => {
  const getActionColor = (action: string): 'success' | 'primary' | 'error' | 'warning' | 'default' => {
    switch (action) {
      case 'feature_flag.created':
      case 'project.created':
        return 'success'
      case 'feature_flag.updated':
      case 'project.updated':
        return 'primary'
      case 'feature_flag.deleted':
      case 'project.deleted':
        return 'error'
      case 'feature_flag.toggled':
        return 'warning'
      default:
        return 'default'
    }
  }

  const formatActionText = (action: string, _: string, entityName: string): string => {
    const actionMap: Record<string, string> = {
      'feature_flag.created': 'created feature flag',
      'feature_flag.updated': 'updated feature flag',
      'feature_flag.deleted': 'deleted feature flag',
      'feature_flag.toggled': 'toggled feature flag',
      'project.created': 'created project',
      'project.updated': 'updated project',
      'project.deleted': 'deleted project',
      'project.member_added': 'added member to project',
      'project.member_removed': 'removed member from project',
      'project.member_role_changed': 'changed member role in project',
    }

    const actionText = actionMap[action] || action
    return `${actionText} "${entityName}"`
  }

  const getUserInitials = (actorName: string, actorEmail: string): string => {
    if (actorName && actorName.includes(' ')) {
      return actorName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    }
    return actorEmail[0].toUpperCase()
  }

  const formatTimestamp = (timestamp: string): { relative: string; full: string } => {
    try {
      const date = new Date(timestamp)
      return {
        relative: formatDistanceToNow(date, { addSuffix: true }),
        full: format(date, 'PPpp'),
      }
    } catch {
      return {
        relative: 'Unknown time',
        full: 'Unknown time',
      }
    }
  }

  const timestamp = formatTimestamp(log.createdAt)

  return (
    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'primary.main' }}>{getUserInitials(log.actorName, log.actorEmail)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
            <Typography variant="subtitle1" component="span" fontWeight="medium">
              {log.actorName}
            </Typography>
            <Typography variant="body2" component="span" color="text.secondary">
              {formatActionText(log.action, log.entityType, log.entityName)}
            </Typography>
            <Chip label={log.action.split('.')[0]} color={getActionColor(log.action)} size="small" />
          </Box>
        }
        secondary={
          <Box mt={0.5}>
            {log.metadata?.description && (
              <Typography variant="body2" color="text.primary" gutterBottom>
                {log.metadata.description}
              </Typography>
            )}
            <Tooltip title={timestamp.full} arrow placement="top">
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  cursor: 'help',
                  display: 'inline-block',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {timestamp.relative}
              </Typography>
            </Tooltip>
          </Box>
        }
      />
    </ListItem>
  )
}

// ~/pages/activity-logs/components/ActionCell.tsx
import { Chip } from '@mui/material'
import type { ChipProps } from '@mui/material/Chip'

interface ActionCellProps {
  action: string
  entityType: string
}

export const ActionCell = ({ action, entityType }: ActionCellProps): JSX.Element => {
  const getActionColor = (action: string): ChipProps['color'] => {
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

  const formatAction = (action: string, entityType: string): string => {
    const actionMap: Record<string, string> = {
      'feature_flag.created': 'Created',
      'feature_flag.updated': 'Updated',
      'feature_flag.deleted': 'Deleted',
      'feature_flag.toggled': 'Toggled',
      'project.created': 'Created',
      'project.updated': 'Updated',
      'project.deleted': 'Deleted',
      'project.member_added': 'Member Added',
      'project.member_removed': 'Member Removed',
      'project.member_role_changed': 'Role Changed',
    }

    const entityMap: Record<string, string> = {
      feature_flag: 'Feature Flag',
      project: 'Project',
    }

    const actionText = actionMap[action] || action
    const entityText = entityMap[entityType] || entityType

    return `${actionText} ${entityText}`
  }

  return <Chip label={formatAction(action, entityType)} color={getActionColor(action)} size="small" />
}

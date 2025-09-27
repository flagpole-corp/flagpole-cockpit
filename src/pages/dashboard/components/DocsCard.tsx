import { Button } from '@mui/material'
import { CardAlert } from '~/components'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'

export const DocsCard = (): JSX.Element => {
  return (
    <CardAlert
      title="Docs"
      icon={<LibraryBooksIcon />}
      text="Read our docs to learn how to easily integrate with your code"
      action={
        <Button
          variant="contained"
          onClick={(): Window | null => window.open('https://docs.useflagpole.dev', '_blank', 'noopener,noreferrer')}
          size="small"
          fullWidth
        >
          Go to docs
        </Button>
      }
    />
  )
}

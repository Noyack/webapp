import { Alert, AlertTitle, Button, Typography } from '@mui/material'

function FetchError() {
  return (
    <Alert severity="error" className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertTitle>Error</AlertTitle>
        <Typography className="text-red-600 mt-2">An unknow error has occured</Typography>
        <Typography className="mt-4">
          You may need to refresh the page or reconnect your bank account. Please try again or contact support.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Alert>
  )
}

export default FetchError
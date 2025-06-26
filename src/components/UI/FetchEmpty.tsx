import { Alert, AlertTitle, Typography } from '@mui/material'

function FetchEmpty() {
  return (
    <Alert severity="warning" className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertTitle>No Accounts Found</AlertTitle>
        <Typography className="text-yellow-600 mt-2">
          You haven't connected any financial accounts yet.
        </Typography>
      </Alert>
  )
}

export default FetchEmpty
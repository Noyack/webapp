import { Typography } from "@mui/material"

type Props = {
    step: number; // Explicitly define step as a number
  };

function StepperText({step}:Props) {
  return (
    <div className='w-10 h-10 rounded-full border-1
        flex justify-center items-center'>
        <Typography>{step}</Typography>
    </div>
  )
}

export default StepperText
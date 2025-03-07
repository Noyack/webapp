import { CheckRounded } from "@mui/icons-material";
import { Typography } from "@mui/material"

type Props = {
    step: number; // Explicitly define step as a number
    currentStep: number
  };

function StepperText({step, currentStep}:Props) {

  return (
    <>
    {
      currentStep < step &&
      <div className='w-10 h-10 rounded-full border-1
        flex justify-center items-center bg-white'>
          <Typography>{step}</Typography>
      </div>
    }
    {
      currentStep === step &&
      <div className='w-10 h-10 rounded-full 
        flex justify-center items-center bg-blue-600 text-white'>
          <Typography>{step}</Typography>
      </div>
    }
    {
      currentStep > step &&
      <div className='w-10 h-10 rounded-full 
        flex justify-center items-center text-blue-600 '>
          <CheckRounded />
      </div>
    }
    </>
  )
}

export default StepperText
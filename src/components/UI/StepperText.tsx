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
      <div className='w-[40px] h-[40px] rounded-full border-1
        flex justify-center items-center bg-white'>
          <Typography fontSize={"18px"}>{step}</Typography>
      </div>
    }
    {
      currentStep === step &&
      <div className='w-[40px] h-[40px] rounded-full 
        flex justify-center items-center bg-[#2E7D32] text-white'>
          <Typography fontSize={"18px"}>{step}</Typography>
      </div>
    }
    {
      currentStep > step &&
      <div className='w-[40px] h-[40px] rounded-full 
        flex justify-center items-center text-blue-600 '>
          <CheckRounded sx={{color:"#009FE3"}}/>
      </div>
    }
    </>
  )
}

export default StepperText
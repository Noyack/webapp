// components/Layout/Aside.tsx
import { 
    // Button, 
    LinearProgress,
    // Stack,
    Typography
} from '@mui/material';
// import StepperText from '../UI/StepperText';
// import { Link } from 'react-router';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Aside() {
    // const [member] = useState(false)
    const [completion] = useState<number>(78)
    // const currentStep = 2
  return (
    <aside className="fixed right-0 top-0 h-screen w-85  border-l border-gray-200 p-4 bg-gray-100">
        <div className="flex flex-col pt-4 h-full justify-between">
            <div className='mb-4'></div>
            <div className='status flex flex-col gap-2'>
                <Typography>Account Completion Status</Typography>
                {/* <Stack direction={'row'} justifyContent={'space-evenly'}> */}
                    {/* <StepperText step={1} currentStep={currentStep}/>
                    <StepperText step={2} currentStep={currentStep}/>
                    <StepperText step={3} currentStep={currentStep}/>
                    <StepperText step={4} currentStep={currentStep}/> */}
                {/* </Stack> */}
                <Typography>{completion}% Completed</Typography>
                <LinearProgress className=' rounded-2xl' sx={{height:"8px", background:"lightgray"}} variant="determinate" color='success' value={50} />
                <div className='border-1 rounded-lg px-2 py-4 text-[14px]'>
                    <div className='flex justify-between'>
                        <p>Complete Wealth IQ...</p>
                        <Link to={'/'} className='underline noyack-green' >Here</Link>
                    </div>
                    <div className='flex justify-between'>
                        <p>Complete financial info...</p>
                        <Link to={'/'} className='underline noyack-green'>Here</Link>
                    </div>
                    {/* <div className='flex justify-between'>
                        <p>Start Learning...</p>
                        <Link to={'/'}>here</Link>
                    </div> */}
                </div>
            </div>
            
            <div className='newscard flex flex-col gap-2'>
                <Typography>
                    Next Masterclass
                </Typography>
                <div className='min-h-[200px] rounded-xl shadow-md bg-white'>

                </div>
            </div>

        </div>
        
    </aside>
  );
}

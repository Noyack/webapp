// components/Layout/Aside.tsx
import { Notifications } from '@mui/icons-material';
import UserProfileButton from '../UI/UserProfileButton';
import { Button, LinearProgress, Stack, Typography } from '@mui/material';
import StepperText from '../UI/StepperText';
import { Link } from 'react-router';
import { UpcomingEvents } from '../UI/UpcomingEvents';
import { useState } from 'react';

export default function Aside() {
    const [member] = useState(false)
    const currentStep = 2
  return (
    <aside className="fixed right-0 top-0 h-screen w-70  border-l border-gray-200 p-4 bg-gray-100">
        <div className="flex flex-col h-full justify-between">
            <div className="flex  content-center">
                <Notifications className='self-center'/>
                <UserProfileButton />
            </div>
            <div className='status flex flex-col gap-3'>
                <Typography>Member Status</Typography>
                <Stack direction={'row'} justifyContent={'space-evenly'}>
                    <StepperText step={1} currentStep={currentStep}/>
                    <StepperText step={2} currentStep={currentStep}/>
                    <StepperText step={3} currentStep={currentStep}/>
                    <StepperText step={4} currentStep={currentStep}/>
                </Stack>
                <LinearProgress className=' rounded-2xl' sx={{height:"8px", background:"lightgray"}} variant="determinate" color='success' value={50} />
            </div>
            <div className="flex justify-center">
                <Link to="/" >
                    <Button variant='contained' sx={{background:"#bdee6f", color:"#000"}} className='w-50'>
                        {!member?
                        <Typography fontWeight={600}>
                            Join Now
                        </Typography>
                        :
                        <Typography fontWeight={600}>
                            Invest Now
                        </Typography>
                        }
                    </Button>
                </Link>
            </div>

            <UpcomingEvents />
            
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
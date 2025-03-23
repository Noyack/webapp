// components/Layout/Aside.tsx
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
    <aside className="fixed right-0 top-0 h-screen w-85  border-l border-gray-200 p-4 bg-gray-100">
        <div className="flex flex-col pt-4 h-full justify-between">
            <div className="flex  content-center gap-2 items-center">
                <div className='flex justify-center items-center bg-white w-[50px] h-[50px] rounded-full shadow-xl'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M12 24.0002C12 26.2135 13.7867 28.0002 16 28.0002C18.2134 28.0002 20 26.2135 20 24.0002M25.3334 16.0002C25.3334 16.0002 25.3334 1.3335 16 1.3335C6.6667 1.3335 6.6667 16.0002 6.6667 16.0002C3.89337 16.0002 3.04004 19.1735 2.77337 21.1468C2.6667 21.9468 3.3067 22.6668 4.1067 22.6668H27.8934C28.6934 22.6668 29.3334 21.9468 29.2267 21.1468C28.96 19.1735 28.1067 16.0002 25.3334 16.0002Z" stroke="#009FE3" stroke-width="2.66667" stroke-linejoin="round"></path>
                    </svg>
                </div>
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
                    <Button variant='contained' sx={{background:"#2E7D32", color:"#fff"}} className='w-50'>
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
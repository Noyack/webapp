// components/Layout/Aside.tsx
import { Notifications } from '@mui/icons-material';
import UserProfileButton from '../UI/UserProfileButton';
import { LinearProgress, Stack, Typography } from '@mui/material';
import StepperText from '../UI/stepperText';
import { Link } from 'react-router';

export default function Aside() {
  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-white border-l border-gray-200 p-4">
        <div className="flex flex-col h-full justify-between">
            <div className="flex  content-center">
                <Notifications className='self-center'/>
                <UserProfileButton />
            </div>
            <div className='status flex flex-col gap-3'>
                <Typography>Member Status</Typography>
                <Stack direction={'row'} justifyContent={'space-evenly'}>
                    <StepperText step={1}/>
                    <StepperText step={2}/>
                    <StepperText step={3}/>
                    <StepperText step={4}/>
                </Stack>
                <LinearProgress className=' rounded-2xl' sx={{height:"8px"}} variant="determinate" color='success' value={50} />
            </div>
            <div className='min-h-[200px] rounded-xl shadow-md'>

            </div>
            <div className="flex justify-center">
                <Link to="/" color="#fff" className="py-2 px-5 rounded-lg bg-green-700 text-white">
                    <Typography>
                        Invest Now
                    </Typography>
                </Link>
            </div>
           
            <div className='newscard flex flex-col gap-2'>
                <Typography>
                    Newsletter
                </Typography>
                <div className='min-h-[200px] rounded-xl shadow-md'>

                </div>
            </div>

        </div>
        
    </aside>
  );
}
import { Box, Button, TextField, Typography } from '@mui/material'
import BoxCard from '../../../components/UI/BoxCard'
import { Link } from 'react-router'
import { ArrowForward, PollOutlined, Share } from '@mui/icons-material'


const Community = () => {

    const articles = [
        {
            image: "https://picsum.photos/seed/picsum/200/300",
            title: "The state of saas investing in 2025",
            desc: "2,200 investors, $7M+ invested and 27",
        },
        {
            image: "https://picsum.photos/seed/picsum/200/300",
            title: "The state of saas investing in 2025",
            desc: "2,200 investors, $7M+ invested and 27",
        },
        {
            image: "https://picsum.photos/seed/picsum/200/300",
            title: "The state of saas investing in 2025",
            desc: "2,200 investors, $7M+ invested and 27",
        },
    ]
  return (
    <Box className="flex flex-col gap-4">
        <div className='flex justify-between'>
            <Typography variant='h2' fontSize={"24px"}>
                Noyack Community Updates
            </Typography>
            <Link to="/">
                <div className='flex gap-5 '>
                    <Typography>
                        See All Events
                    </Typography>
                    <ArrowForward />
                </div>
            </Link>
        </div>
        <BoxCard height={20} width={100}>
            <div className='flex flex-wrap gap-y-5 gap-x-10 justify-around px-5'>
            {
                articles && articles.map((x,i)=>(
                    <div className='flex flex-col gap-4'>
                <img className='w-50 h-40 object-cover rounded-xl' src={x.image} />
                <div className='flex  flex-col gap-2'>
                    <Typography variant='h3' maxWidth={"15ch"} fontSize={"18px"} fontWeight={500}>
                        {x.title}
                    </Typography>
                    <Typography variant='caption' className='text-gray-500 max-w-[20ch]'>
                        {x.desc}
                    </Typography>
                </div>
            </div>
            ))
        }
            <div className='flex flex-col gap-4'>
                <img className='w-50 h-40 object-cover rounded-xl' src='https://picsum.photos/seed/picsum/200/300' />
                <div className='flex  flex-col gap-2'>
                    <Typography variant='h3' maxWidth={"15ch"} fontSize={"18px"} fontWeight={500}>
                        The state of saas investing in 2025
                    </Typography>
                    <Typography variant='caption' className='text-gray-500 max-w-[20ch]'>
                        2,200 investors, $7M+ invested and 27
                    </Typography>
                </div>
            </div>
            <div className='flex flex-col gap-4'>
                <img className='w-50 h-40 object-cover rounded-xl' src='https://picsum.photos/seed/picsum/200/300' />
                <div className='flex  flex-col gap-2'>
                    <Typography variant='h3' maxWidth={"15ch"} fontSize={"18px"} fontWeight={500}>
                        The state of saas investing in 2025
                    </Typography>
                    <Typography variant='caption' className='text-gray-500 max-w-[20ch]'>
                        2,200 investors, $7M+ invested and 27
                    </Typography>
                </div>
            </div>
            </div>
        </BoxCard>
        <div 
        className='flex flex-wrap gap-5 w-full justify-center'>
            <Box  minHeight={`200px`} width={`calc(min(320px,80dvw))`}
                className="
                flex flex-wrap py-6
                bg-white px-5 shadow-lg rounded-lg
                ">
            <div className='flex flex-col gap-3'>
                <Typography fontWeight={'bold'}>Featured Resources</Typography>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-1'>
                        <Typography variant='body2'>Q4 2024 Roots Fund Updates</Typography>
                        <Typography variant='caption'>2,200 now investor, $7M+ invested and 27</Typography>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Typography variant='body2'>Q4 2024 Roots Fund Updates</Typography>
                        <Typography variant='caption'>2,200 now investor, $7M+ invested and 27</Typography>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Typography variant='body2'>Q4 2024 Roots Fund Updates</Typography>
                        <Typography variant='caption'>2,200 now investor, $7M+ invested and 27</Typography>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Typography variant='body2'>Q4 2024 Roots Fund Updates</Typography>
                        <Typography variant='caption'>2,200 now investor, $7M+ invested and 27</Typography>
                    </div>
                </div>
            </div>
            </Box>
            <Box  minHeight={`200px`} width={`calc(min(320px,80dvw))`}
                className="
                flex flex-wrap py-6
                bg-white px-5 shadow-lg rounded-lg
                ">
            <div className='flex flex-col gap-3'>
               <div className='flex gap-1'>
                <PollOutlined />
                <Typography fontWeight={'bold'}>NOYACK Poll</Typography>
                </div>
                <Typography variant='caption'>416 votes</Typography>
                <Typography variant='body2'>What should our next webinar be on?</Typography>
            </div>
            </Box>
        </div>
        <Box minHeight={`200px`} width={`100%`}
                className="
                flex flex-wrap py-6
                bg-white px-5 shadow-lg rounded-lg
                ">
            <div className='flex flex-col gap-4'>
                <Typography fontWeight={'bold'} variant='h3' fontSize={"20px"}>Invite your Friends!</Typography>
                <TextField fullWidth placeholder='https://noyack.randomlink.com'/>
                <Button startIcon={<Share />} variant='contained' color='success' sx={{width:"15ch"}}>Share</Button>
                <Typography variant='caption'>
                It's not fun to grow alone! 1 referral and no transaction fee for a year
                </Typography>
            </div>
        </Box>
    </Box>
  )
}

export default Community
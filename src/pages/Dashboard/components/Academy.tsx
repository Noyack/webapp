import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom' // Updated from 'react-router'
import { KeyboardArrowRightOutlined } from '@mui/icons-material'
import stock from './../../../assets/NOYACK Logo transparent background .png'
import { FC, useState } from 'react'
import { UpcomingEvents } from '../../../components/UI/UpcomingEvents';
import { 
  Article, 
  CommunityProps 
} from '../../../types'
import { usePermissions } from '../../../hooks/usePermissions'

// SVG component for the share button
const ShareBtn = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26.6663 16.0001L18.133 6.66675V11.3334C13.8663 11.3334 5.33301 14.1334 5.33301 25.3334C5.33301 23.7774 7.89301 20.6667 18.133 20.6667V25.3334L26.6663 16.0001Z" fill="#fff" stroke="#fff" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
)

const Academy = ({ events, referralCode, fetching }: CommunityProps = {}) => {
  const { hasPermission } = usePermissions()

  // Set up state for articles
  const [articles] = useState<Article[]>([
    {
      id: '1',
      image: stock,
      title: "Introduction to Noyack Academy",
      desc: "By Noyack",
    },
    {
      id: '2',
      image: stock,
      title: "Foundations of personal wealth management",
      desc: "By Noyack",
    },
    {
      id: '3',
      image: stock,
      title: "Navigating the transition",
      desc: "By Noyack",
    },
  ]);


  // State for referral URL
  const [referralUrl] = useState<string>(
    referralCode || "https://noyack.randomlink.com"
  );
  

  const handleShareReferral = () => {
    // In a real app, this would share via social media or email
    // For now, just copy to clipboard
    navigator.clipboard.writeText(referralUrl)
      .then(() => alert("Referral link copied to clipboard!"))
      .catch(err => console.error("Failed to copy: ", err));
  };

  return (
    <Box className="flex flex-col gap-8 w-full ">
      {hasPermission("academy", "access") && (
        <>
        <div className='w-full  flex flex-col flex-wrap'>
        <Typography variant='h2' fontSize={"24px"} fontWeight={'medium'}>
          Noyack Academy
        </Typography>
        <div className="flex justify-end mt-2 mb-2">
         <Link to={"https://academy.wearenoyack.com"} className="flex items-center text-sm">
            See More
            <KeyboardArrowRightOutlined fontSize="small" />
          </Link>
        </div>
      </div>
      
      <div className='flex flex-wrap gap-y-5 gap-x-10 justify-around px-5 mb-8 relative'>
        <div className='absolute top-0 w-[100%] h-[100%] bg-[#eeeeeecc] rounded-2xl flex items-center justify-center'>
          <Typography textAlign={'center'} fontWeight={"bold"} fontSize={"32px"}>Coming Soon...</Typography>
        </div>
        {articles && articles.map((article) => (
          <div key={article.id} className='flex flex-col gap-4'>
            <img 
              className='w-[260px] h-[205px] object-contain rounded-xl' 
              src={article.image} 
              alt={article.title}
            />
            <div className='flex flex-col gap-2'>
              <Typography 
                variant='h3' 
                maxWidth={"15ch"}
                fontSize={"18px"}
                fontWeight={500}
              >
                {article.title}
              </Typography>
              <Typography
                variant='caption' 
                className='text-gray-500 max-w-[20ch]'
              >
                {article.desc}
              </Typography>
            </div>
          </div>
        ))}
      </div>
      </>
      )}
      
      <div className='flex flex-wrap gap-5 w-full justify-center'>
        <Box  
          minHeight={`200px`} 
          width={`calc(min(400px,80dvw))`}
          className="flex flex-wrap py-6 bg-white px-5 shadow-lg rounded-2xl"
        >
          <div className='flex flex-col gap-3'>
            <Typography>Previous Events</Typography>
            <div className='flex flex-col gap-4'>
              {events?.length && events.map((e,i) => (
                <div key={i} className='flex flex-col gap-1'>
                  <Typography variant='body2' fontWeight={'bold'}>
                    {e?.name}
                  </Typography>
                  <Typography variant='caption'>
                    {e?.date}
                  </Typography>
                </div>
              ))}
              {(fetching === false && events.length === 0) && (
                <Typography>We couldn't find any Previous event</Typography>
              )}
              {(fetching === true) && ( 
                <Typography>Retrieving previous event</Typography>
              )}
            </div>
          </div>
        </Box>
        
	<UpcomingEvents />
      </div>
      
      {/* <Box 
        minHeight={`200px`} 
        width={`100%`}
        className="flex flex-wrap justify-center py-6 bg-white px-5 shadow-lg rounded-lg"
      >
        <div className='flex flex-col items-center text-center gap-4'>
          <Typography variant='h3' fontWeight={"medium"} fontSize={"24px"}>
            Invite your Friends!
          </Typography>
          <input 
            className='border-1 p-4 w-[100%] rounded-xl' 
            placeholder='https://noyack.randomlink.com'
            value={referralUrl}
            readOnly
          />
          <Typography variant='caption'>
            It's not fun to grow alone! 1 referral and no transaction fee for a year
          </Typography>
          <Button 
            startIcon={<ShareBtn />} 
            variant='contained' 
            onClick={handleShareReferral}
            sx={{width:"15ch", background:"#2E7D32", color:"#fff"}}
          >
            Share
          </Button>
        </div>
      </Box> */}
    </Box>
  )
}

export default Academy

import { Box, Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom' // Updated from 'react-router'
import { ArrowForward, PollOutlined } from '@mui/icons-material'
import stock from './../../../assets/blank.jpg'
import { useState } from 'react'
import { 
  Article, 
  Resource, 
  Poll, 
  CommunityProps 
} from './../../../types' // Import types

// SVG component for the share button
const ShareBtn = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26.6663 16.0001L18.133 6.66675V11.3334C13.8663 11.3334 5.33301 14.1334 5.33301 25.3334C5.33301 23.7774 7.89301 20.6667 18.133 20.6667V25.3334L26.6663 16.0001Z" fill="#fff" stroke="#fff" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
)

const Community = ({ referralCode }: CommunityProps = {}) => {
  // Set up state for articles
  const [articles] = useState<Article[]>([
    {
      id: '1',
      image: stock,
      title: "The state of saas investing in 2025",
      desc: "2,200 investors, $7M+ invested and 27",
    },
    {
      id: '2',
      image: stock,
      title: "The state of saas investing in 2025",
      desc: "2,200 investors, $7M+ invested and 27",
    },
    {
      id: '3',
      image: stock,
      title: "The state of saas investing in 2025",
      desc: "2,200 investors, $7M+ invested and 27",
    },
  ]);

  // State for resources
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: "Q4 2024 Roots Fund Updates",
      description: "2,200 now investor, $7M+ invested and 27",
      type: 'document'
    },
    {
      id: '2',
      title: "Q4 2024 Roots Fund Updates",
      description: "2,200 now investor, $7M+ invested and 27",
      type: 'document'
    },
    {
      id: '3',
      title: "Q4 2024 Roots Fund Updates",
      description: "2,200 now investor, $7M+ invested and 27",
      type: 'document'
    },
    {
      id: '4',
      title: "Q4 2024 Roots Fund Updates",
      description: "2,200 now investor, $7M+ invested and 27",
      type: 'document'
    },
  ]);

  // State for current poll
  const [currentPoll] = useState<Poll>({
    id: '1',
    question: "What should our next webinar be on?",
    options: [
      { id: '1', text: "Real Estate Investing", votes: 120 },
      { id: '2', text: "Tax Strategies", votes: 89 },
      { id: '3', text: "Retirement Planning", votes: 207 },
    ],
    totalVotes: 416,
    isActive: true
  });

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
    <Box className="flex flex-col gap-8">
      <div className='flex justify-between'>
        <Typography variant='h2' fontSize={"24px"} fontWeight={'medium'}>
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
      
      <div className='flex flex-wrap gap-y-5 gap-x-10 justify-around px-5 mb-8'>
        {articles && articles.map((article) => (
          <div key={article.id} className='flex flex-col gap-4'>
            <img 
              className='w-[260px] h-[205px] object-cover rounded-xl' 
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
      
      <div className='flex flex-wrap gap-5 w-full justify-center'>
        <Box  
          minHeight={`200px`} 
          width={`calc(min(400px,80dvw))`}
          className="flex flex-wrap py-6 bg-white px-5 shadow-lg rounded-2xl"
        >
          <div className='flex flex-col gap-3'>
            <Typography>Featured Resources</Typography>
            <div className='flex flex-col gap-4'>
              {resources.map(resource => (
                <div key={resource.id} className='flex flex-col gap-1'>
                  <Typography variant='body2' fontWeight={'bold'}>
                    {resource.title}
                  </Typography>
                  <Typography variant='caption'>
                    {resource.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </Box>
        
        <Box  
          minHeight={`200px`} 
          width={`calc(min(420px,80dvw))`}
          className="flex flex-wrap py-6 bg-white px-5 shadow-lg rounded-lg"
        >
          <div className='flex flex-col gap-3'>
            <div className='flex gap-1'>
              <PollOutlined />
              <Typography fontWeight={'bold'}>NOYACK Poll</Typography>
            </div>
            <Typography variant='caption'>{currentPoll.totalVotes} votes</Typography>
            <Typography variant='body2'>{currentPoll.question}</Typography>
          </div>
        </Box>
      </div>
      
      <Box 
        minHeight={`200px`} 
        width={`100%`}
        className="flex flex-wrap py-6 bg-white px-5 shadow-lg rounded-lg"
      >
        <div className='flex flex-col gap-4'>
          <Typography variant='h3' fontWeight={"medium"} fontSize={"24px"}>
            Invite your Friends!
          </Typography>
          <input 
            className='border-1 p-4 rounded-xl' 
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
      </Box>
    </Box>
  )
}

export default Community
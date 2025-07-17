import { Typography } from '@mui/material'
import BoxCard from '../../../components/UI/BoxCard'

import { FundStatusProps } from '../../../types'
import { Link } from 'react-router'

const FundStatus = ({ statusElements }: FundStatusProps) => {
  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h2" fontSize={"24px"} fontWeight={'medium'}>
        Fund Status
      </Typography>
      <div className="px-5">
        <BoxCard height={20} width={100}>
          {statusElements?.length === 0 && (
            <div className='flex gap-1'>
              <Typography>You haven't setup you Investor Profile yet,</Typography>
              <Link to={"/account"} className='text-blue-500'>complete here.</Link>
            </div>
          )}
          {statusElements && statusElements.map((item) => (
            <div key={item.id} className="flex gap-2">
              <div className="flex justify-center items-center rounded-full bg-[#2E7D32] w-[30px] h-[30px]">
                {item.icon}
              </div>
              <div className="">
                <Typography maxWidth={"13ch"}>
                  {item.title}
                </Typography>
                <Typography fontWeight={'800'} fontSize={"22px"}>
                  {item.value}
                </Typography>
              </div>
            </div>
          ))}
        </BoxCard>
      </div>
    </div>
  )
}

export default FundStatus
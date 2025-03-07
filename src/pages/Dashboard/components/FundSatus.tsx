import { Typography } from '@mui/material'
import BoxCard from '../../../components/UI/BoxCard'
import { FundStatusProp } from '../Dashboard'

type Props = {
    statusElements: FundStatusProp[]
}
const FundSatus = ({statusElements}:Props) => {
  return (
    <div className="flex flex-col gap-6">
        <Typography variant="h2" fontSize={"24px"}>Fund Status</Typography>
        <div className="px-5">
          <BoxCard height={20} width={100}>
            {statusElements &&
            statusElements.map((x,i)=>(

              <div key={i} className="flex gap-2">
                <div className="flex justify-center items-center rounded-full bg-green-700 w-[30px] h-[30px]">
                {x?.icon}
                </div>
                <div className="">
                  <Typography maxWidth={"13ch"}>
                    {x.title}
                  </Typography>
                  <Typography fontWeight={'800'} fontSize={"18px"}>
                    {x?.value}
                  </Typography>
                </div>
              </div>
              ))
            }

          </BoxCard>
          </div>
      </div>
  )
}

export default FundSatus
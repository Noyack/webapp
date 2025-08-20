import { Box, Typography } from "@mui/material"
import BoxCard from "../../../components/UI/BoxCard"
import { Link } from "react-router"

function WealthStatus(wealth:any) {

  const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

    const wealthMap = [
        {
          id:"Income",
          title:"Yearly Income",
          color:"bg-blue-800",
          amount: formatter.format(wealth.wealth.income)
        },{
          id:"Debt",
          title:"Total Debt",
          color:"bg-red-700",
          amount: formatter.format(wealth.wealth.debt)
        },{
          id:"Expenses",
          title:"Monthly Expenses",
          color:"bg-green-700",
          amount: formatter.format(wealth.wealth.expenses)
        }
        // ,{
        //     title:"Emergency Fund",
        //     color:"bg-green-700",
        //     amount:0
        // }
    ]
  return (
    <div className="flex flex-col gap-6">
        <Typography variant="h2" fontSize={"24px"} fontWeight={'medium'}>
        Wealth Status
      </Typography>
        <BoxCard height={20} width={100}>
      <div className="flex flex-wrap gap-5 px-5 w-full justify-evenly">
            {wealthMap.map((x,i)=>(
                <div key={i} className="flex flex-col gap-3 items-center">
                <Typography fontWeight={"bold"}>{x.title}</Typography>
                {
                x.amount !== "$0.00" ? 
                <div className={`${x.color} w-[12ch] py-3 rounded-full text-white flex justify-center items-center`}>
                    <Typography textAlign={"center"} fontWeight={"bold"}>{x.amount}</Typography>
                </div>
                :
                <div >
                    <Typography textAlign={"center"} fontWeight={"bold"}>You currently have {x.amount} {x.id} </Typography>
                </div>
                }
                </div>
            ))}
      </div>
      <div className="flex gap-1 mt-5">
        <Typography>Modify your wealth profile</Typography>
        <Link to={"/wealthview"} className="text-blue-500">here</Link>
      </div>
        </BoxCard>
    </div>
  )
}

export default WealthStatus
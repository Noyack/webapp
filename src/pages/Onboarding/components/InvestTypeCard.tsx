import { Typography } from "@mui/material"

type Infos={
  id: number;
  title : string;
  caption: string;
  desc : string;
  setChoice: (id:number)=>void
}

function InvestTypeCard({id, title, caption, desc, setChoice}:Infos,) {
  return (
    <div className="w-[280px] min-h-[400px] bg-white 
      border-2 rounded-2xl flex flex-col gap-2 
      justify-center items-center"
      onClick={()=>setChoice(id)}
    >
        <Typography fontWeight={'bold'}>{title}</Typography>
        <Typography variant="caption" color="primary">{caption}</Typography>
        <Typography maxWidth={"24ch"} textAlign={'center'}>{desc}</Typography>
    </div>
  )
}

export default InvestTypeCard
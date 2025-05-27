import { Typography } from "@mui/material"
import { Link } from "react-router-dom"

function ComingSoon() {
  return (
    <div className="text-center">
        <Typography variant="h2" fontSize={32}>
            This page is coming soon...
        </Typography>
        <Typography variant="body1" fontSize={24}>
        Subscribe to our 
        <Link className="px-2 underline text-[#2E7D32]" to={"https://wealth.wearenoyack.com/noyack-wealth-weekly-subscribe?hs_preview=yafDUDRe-174652172685"}>
        Newsletter 
        </Link>
        to stay up to date with our new features.
        </Typography>
    </div>
  )
}

export default ComingSoon
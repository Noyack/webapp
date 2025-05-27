import { Typography } from "@mui/material"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

function NotFound() {
    const navigate = useNavigate()
    useEffect(() => {
        const timing = setTimeout(() => {
            navigate('/', { replace: true });
        }, 2000);
    
        return () => clearTimeout(timing); // Proper cleanup function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
        return (
    <div className=" flex flex-col items-center h-full w-full">
        <Typography fontWeight={'bold'} fontSize={"72px"} sx={{color:"#2E7D32"}} textAlign={'center'}>
            404
        </Typography>
        <Typography fontSize={"52px"} sx={{color:"#000"}}>
            This Page does not exist
        </Typography>
    </div>
  )
}

export default NotFound
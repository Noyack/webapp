import { Box } from '@mui/material'
import { ReactNode } from 'react'

type Props = {
    children: ReactNode,
    height: number,
    width: number
}

const BoxCard = ({children,height, width=100}: Props) => {
  return (
    <Box minHeight={`${height}px`} width={`${width}`}
        className="
        flex flex-wrap justify-evenly items-center py-8
         bg-white p-2 shadow-lg rounded-lg
        "
    >
        {children}
    </Box>
  )
}

export default BoxCard
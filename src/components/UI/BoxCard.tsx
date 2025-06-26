import { Box } from '@mui/material'
import { BoxCardProps } from '../../types'


const BoxCard = ({ children, height, width = 100, className = "" }: BoxCardProps) => {
  return (
    <Box 
      minHeight={`${height}px`} 
      width={`${width}%`}
      className={`
        flex flex-wrap justify-evenly items-center py-8
        bg-white p-2 shadow-lg rounded-lg
        ${className}
      `}
    >
      {children}
    </Box>
  )
}

export default BoxCard
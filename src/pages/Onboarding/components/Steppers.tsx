import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Typography } from '@mui/material';

const steps = [
  'Setup',
  'Invest',
  'Sign Doc',
  'Checout',
];

type step={
  completed: number
}

export default function Steppers({completed}:step) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={completed} alternativeLabel>
        {steps.map((label) => (
          <Step key={label} >
            <StepLabel>
              <Typography fontSize={"20px"}>
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { calculatorModes } from '../../../../constants/TaxConstants';

interface CalculatorModeStepProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
}

const CalculatorModeStep: React.FC<CalculatorModeStepProps> = ({ activeMode, onModeChange }) => {
  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-4">Select Calculator Mode</Typography>
      <Grid container spacing={3}>
        {calculatorModes.map((modeOption) => (
          <Grid item xs={12} sm={6} md={3} key={modeOption.value}>
            <Card 
              className={`h-full cursor-pointer transition-all ${activeMode === modeOption.value ? 'border-2 border-primary-500 shadow-lg' : 'border border-gray-200'}`}
              onClick={() => onModeChange(modeOption.value)}
            >
              <CardContent className="flex flex-col items-center p-4 text-center h-full">
                <Typography variant="h6" className="mb-2">{modeOption.label}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {modeOption.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CalculatorModeStep;
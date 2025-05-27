// components/income/IncomeInfoDisplay.tsx
import React from 'react';
import {
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from "@mui/material";

import {
  IncomeInfoForm,
  formatCurrency,
  calculateAnnualEquivalent
} from './types';

// Info Item component for displaying key-value pairs
function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col w-full md:w-[calc(max(250px,40%))] gap-2 mb-4">
      <div className="flex flex-col">
        <Typography variant="subtitle1" fontWeight="medium">{label}</Typography>
        <Divider />
      </div>
      <Typography variant="body1">{value}</Typography>
    </div>
  );
}

interface IncomeInfoDisplayProps {
  formData: IncomeInfoForm;
  totalAnnualIncome: number;
  onEdit: () => void;
  loading: boolean;
}

const IncomeInfoDisplay: React.FC<IncomeInfoDisplayProps> = ({
  formData,
  totalAnnualIncome,
  onEdit,
  loading
}) => {
  const showPrimaryIncome = formData.employmentStatus !== "Unemployed" && formData.employmentStatus !== "Student";

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={onEdit}
          disabled={loading}
        >
          Edit Income Information
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Employment Status: {formData.employmentStatus}
          </Typography>
          {formData.employmentStatus !== "Unemployed" && (
            <Typography variant="h6" color="primary">
              Total Annual Income: {formatCurrency(totalAnnualIncome)}
            </Typography>
          )}
        </Box>
        
        {showPrimaryIncome && (
          <>
            <Typography variant="h6" gutterBottom>Primary Income</Typography>
            <div className="flex flex-wrap gap-5 justify-between">
              <InfoItem label="Annual Gross Salary" value={formatCurrency(formData.primaryIncome.salary)} />
              <InfoItem label="Payment Frequency" value={formData.primaryIncome.paymentFrequency} />
              <InfoItem label="Income Stability" value={formData.primaryIncome.stabilityType} />
              <InfoItem label="Expected Growth Rate" value={`${formData.primaryIncome.annualGrowthRate}%`} />
              <InfoItem label="Future Income Changes" value={formData.primaryIncome.futureChanges} />
              {formData.primaryIncome.futureChangeTimeframe > 0 && (
                <InfoItem label="Change Timeframe" value={`${formData.primaryIncome.futureChangeTimeframe} months`} />
              )}
              {formData.primaryIncome.averageBonus > 0 && (
                <InfoItem label="Average Annual Bonus" value={formatCurrency(formData.primaryIncome.averageBonus)} />
              )}
            </div>
          </>
        )}
      </Paper>
      
      {formData.additionalIncomes.length > 0 && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Additional Income Sources</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>Annual Equivalent</TableCell>
                  <TableCell>Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.additionalIncomes.map((income) => {
                  // Ensure amount is a number
                  const amount = typeof income.amount === 'string' 
                    ? parseFloat(income.amount) 
                    : income.amount;
                    
                  return (
                    <TableRow key={income.id}>
                      <TableCell>{income.type}</TableCell>
                      <TableCell>{income.name || "-"}</TableCell>
                      <TableCell>{formatCurrency(amount)}</TableCell>
                      <TableCell>{income.frequency}</TableCell>
                      <TableCell>{formatCurrency(calculateAnnualEquivalent(amount, income.frequency))}</TableCell>
                      <TableCell>{income.duration}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

    </div>
  );
};

export default IncomeInfoDisplay;
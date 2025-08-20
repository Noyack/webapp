import React from 'react';
import {
  Typography,
  Paper,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import { AssetsFormData } from '../../../types';

interface AssetsSummaryProps {
  formData: AssetsFormData;
  totalValue: number;
}

const AssetsSummary: React.FC<AssetsSummaryProps> = ({ formData, totalValue }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total for each asset category
  const calculateCategoryTotal = (assets: any[]): number => {
    return assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  };

  const categoryTotals = {
    liquid: calculateCategoryTotal(formData.liquidAssets),
    investment: calculateCategoryTotal(formData.investmentAssets),
    retirement: calculateCategoryTotal(formData.retirementAssets),
    realEstate: calculateCategoryTotal(formData.realEstateAssets),
    business: calculateCategoryTotal(formData.businessAssets),
    personalProperty: calculateCategoryTotal(formData.personalPropertyAssets)
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>Assets Summary</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="primary">
          Total Assets Value: {formatCurrency(totalValue)}
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Assets by Category:</Typography>
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Liquid Assets:</TableCell>
                  <TableCell align="right">{formatCurrency(categoryTotals.liquid)}</TableCell>
                  <TableCell align="right">
                    {totalValue > 0 ? `${(categoryTotals.liquid / totalValue * 100).toFixed(1)}%` : '0%'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Investment Assets:</TableCell>
                  <TableCell align="right">{formatCurrency(categoryTotals.investment)}</TableCell>
                  <TableCell align="right">
                    {totalValue > 0 ? `${(categoryTotals.investment / totalValue * 100).toFixed(1)}%` : '0%'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Retirement Assets:</TableCell>
                  <TableCell align="right">{formatCurrency(categoryTotals.retirement)}</TableCell>
                  <TableCell align="right">
                    {totalValue > 0 ? `${(categoryTotals.retirement / totalValue * 100).toFixed(1)}%` : '0%'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Real Estate:</TableCell>
                  <TableCell align="right">{formatCurrency(categoryTotals.realEstate)}</TableCell>
                  <TableCell align="right">
                    {totalValue > 0 ? `${(categoryTotals.realEstate / totalValue * 100).toFixed(1)}%` : '0%'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Business Assets:</TableCell>
                  <TableCell align="right">{formatCurrency(categoryTotals.business)}</TableCell>
                  <TableCell align="right">
                    {totalValue > 0 ? `${(categoryTotals.business / totalValue * 100).toFixed(1)}%` : '0%'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Personal Property:</TableCell>
                  <TableCell align="right">{formatCurrency(categoryTotals.personalProperty)}</TableCell>
                  <TableCell align="right">
                    {totalValue > 0 ? `${(categoryTotals.personalProperty / totalValue * 100).toFixed(1)}%` : '0%'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Allocation Summary */}
      <Paper elevation={1} sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Asset Allocation</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Current Allocation</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Stocks:</TableCell>
                  <TableCell align="right">{formData.currentAllocation.stocks}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bonds:</TableCell>
                  <TableCell align="right">{formData.currentAllocation.bonds}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cash:</TableCell>
                  <TableCell align="right">{formData.currentAllocation.cash}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Real Estate:</TableCell>
                  <TableCell align="right">{formData.currentAllocation.realEstate}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Alternatives:</TableCell>
                  <TableCell align="right">{formData.currentAllocation.alternatives}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Other:</TableCell>
                  <TableCell align="right">{formData.currentAllocation.other}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Target Allocation</Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Stocks:</TableCell>
                  <TableCell align="right">{formData.targetAllocation.stocks}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bonds:</TableCell>
                  <TableCell align="right">{formData.targetAllocation.bonds}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Cash:</TableCell>
                  <TableCell align="right">{formData.targetAllocation.cash}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Real Estate:</TableCell>
                  <TableCell align="right">{formData.targetAllocation.realEstate}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Alternatives:</TableCell>
                  <TableCell align="right">{formData.targetAllocation.alternatives}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Other:</TableCell>
                  <TableCell align="right">{formData.targetAllocation.other}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              Liquidity Needs: {formData.liquidityNeeds}%
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Paper>
  );
};

export default AssetsSummary;
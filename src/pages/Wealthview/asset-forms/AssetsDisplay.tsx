import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AssetsFormData } from '../../../types';
import { 
  liquidAssetTypes,
  investmentAssetTypes,
  retirementAssetTypes,
  realEstateAssetTypes,
  businessAssetTypes,
  personalPropertyAssetTypes
} from '../../../types';

interface AssetsDisplayProps {
  formData: AssetsFormData;
}

const AssetsDisplay: React.FC<AssetsDisplayProps> = ({ formData }) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get type label helper
  const getTypeLabel = (type: string, typeOptions: any[]) => {
    return typeOptions.find(option => option.value === type)?.label || type;
  };

  return (
    <>
      {/* Liquid Assets */}
      {formData.liquidAssets.length > 0 && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Liquid Assets ({formData.liquidAssets.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Institution</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Interest Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.liquidAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{getTypeLabel(asset.type, liquidAssetTypes)}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.institution}</TableCell>
                      <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                      <TableCell>{asset.interestRate ? `${asset.interestRate}%` : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Investment Assets */}
      {formData.investmentAssets.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Investment Assets ({formData.investmentAssets.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Institution</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Ticker</TableCell>
                    <TableCell>Shares</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.investmentAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{getTypeLabel(asset.type, investmentAssetTypes)}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.institution}</TableCell>
                      <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                      <TableCell>{asset.ticker || 'N/A'}</TableCell>
                      <TableCell>{asset.shares || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Retirement Assets */}
      {formData.retirementAssets.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Retirement Assets ({formData.retirementAssets.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Institution</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Contribution</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.retirementAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{getTypeLabel(asset.type, retirementAssetTypes)}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.institution}</TableCell>
                      <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                      <TableCell>{asset.contributionRate ? `${asset.contributionRate}%` : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Real Estate Assets */}
      {formData.realEstateAssets.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Real Estate Assets ({formData.realEstateAssets.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Remaining Mortgage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.realEstateAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{getTypeLabel(asset.type, realEstateAssetTypes)}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.address}</TableCell>
                      <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                      <TableCell>{asset.remainingMortgage ? formatCurrency(asset.remainingMortgage) : 'None'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Business Assets */}
      {formData.businessAssets.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Business Assets ({formData.businessAssets.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Ownership %</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Annual Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.businessAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{getTypeLabel(asset.type, businessAssetTypes)}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.ownershipPercentage ? `${asset.ownershipPercentage}%` : 'N/A'}</TableCell>
                      <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                      <TableCell>{asset.annualRevenue ? formatCurrency(asset.annualRevenue) : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Personal Property Assets */}
      {formData.personalPropertyAssets.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Personal Property Assets ({formData.personalPropertyAssets.length})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Insured Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.personalPropertyAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell>{getTypeLabel(asset.type, personalPropertyAssetTypes)}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.description}</TableCell>
                      <TableCell>{formatCurrency(asset.currentValue)}</TableCell>
                      <TableCell>{asset.insuredValue ? formatCurrency(asset.insuredValue) : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};

export default AssetsDisplay;
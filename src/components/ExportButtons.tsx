import React from 'react';
import { Box, Button } from '@mui/material';
import { Download, PictureAsPdf } from '@mui/icons-material';
import { exportGenericToPDF, exportGenericToCSV, GenericExportData } from '../utils/exportUtils';

interface ExportButtonsProps {
  data: GenericExportData;
  disabled?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ data, disabled = false }) => {
  const handlePDFExport = () => {
    try {
      exportGenericToPDF(data);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleCSVExport = () => {
    try {
      exportGenericToCSV(data);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error generating CSV. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
      <Button
        variant="contained"
        color="error"
        startIcon={<PictureAsPdf />}
        onClick={handlePDFExport}
        disabled={disabled}
        sx={{
          backgroundColor: '#d32f2f',
          '&:hover': {
            backgroundColor: '#b71c1c',
          }
        }}
      >
        Export PDF
      </Button>
      
      <Button
        variant="contained"
        color="success"
        startIcon={<Download />}
        onClick={handleCSVExport}
        disabled={disabled}
        sx={{
          backgroundColor: '#2e7d32',
          '&:hover': {
            backgroundColor: '#1b5e20',
          }
        }}
      >
        Export CSV
      </Button>
    </Box>
  );
};

export default ExportButtons; 
import React, { cloneElement, useState } from 'react';
import { 
  Typography, 
  Button,
  Box,
  Paper
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const AssetSectionWrapper = ({
  title,
  assets,
  children,
  onRemove,
  formatCurrency
}) => {
  const [showForm, setShowForm] = useState(false);

  // Clone the form component and add our onAdd handler
  const formWithHandler = cloneElement(children, {
    ...children.props,
    onAdd: (asset: any) => {
      // Call the original onAdd from parent
      if (children.props.onAdd) {
        children.props.onAdd(asset);
      }
      // Hide the form after adding
      setShowForm(false);
    }
  });

  return (
    <Box>
      <Typography variant="h5" gutterBottom>{title}</Typography>
      
      {/* Existing Assets */}
      {assets.length > 0 && (
        <Paper sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>Current {title}:</Typography>
          {assets.map(asset => (
            <Box 
              key={asset.id} 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 1, 
                border: '1px solid #ddd', 
                borderRadius: 1,
                mt: 1 
              }}
            >
              <Box>
                <Typography variant="body1">
                  {asset.name} - {formatCurrency(asset.currentValue)}
                </Typography>
                {asset.institution && (
                  <Typography variant="body2" color="text.secondary">
                    {asset.institution}
                  </Typography>
                )}
              </Box>
              <Button 
                size="small" 
                color="error" 
                onClick={() => onRemove(asset.id)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Paper>
      )}

      {/* Add Button or Form */}
      {!showForm ? (
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={() => setShowForm(true)}
        >
          Add {title.slice(0, -1)} {/* Remove 's' from title */}
        </Button>
      ) : (
        <Paper sx={{ p: 2, border: '2px solid #1976d2', borderRadius: 2 }}>
          {formWithHandler}
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AssetSectionWrapper;
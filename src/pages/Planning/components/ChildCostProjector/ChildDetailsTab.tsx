import { FC } from 'react';
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Slider,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { ChildCostInputs, ChildData } from '../../../../types/childCost';
import { generateUniqueChildId, validateChildData } from '../../../../utils/childCostCalculations';

interface ChildDetailsTabProps {
  inputs: ChildCostInputs;
  onInputChange: <K extends keyof ChildCostInputs>(field: K, value: ChildCostInputs[K]) => void;
}

const ChildDetailsTab: FC<ChildDetailsTabProps> = ({
  inputs,
  onInputChange
}) => {
  const addChild = () => {
    const newChild: ChildData = {
      id: generateUniqueChildId(),
      name: `Child ${inputs.children.length + 1}`,
      currentAge: inputs.calculationType === 'future' ? 0 : 5,
      birthYear: inputs.calculationType === 'future' ? inputs.birthYear : undefined,
      education: {
        k12Type: 'public',
        collegeType: 'public',
        gradSchool: false,
        collegeYears: 4,
        gradYears: 2
      },
      additionalCosts: {
        extracurriculars: 2000,
        healthConditions: false,
        travel: 1000
      }
    };

    onInputChange('children', [...inputs.children, newChild]);
    
    // Auto-select the new child
    onInputChange('selectedChild', newChild.id);
  };

  const removeChild = (id: string) => {
    if (inputs.children.length <= 1) return; // Don't allow removing the last child
    
    const updatedChildren = inputs.children.filter(child => child.id !== id);
    onInputChange('children', updatedChildren);
    
    // If we removed the selected child, select the first one
    if (inputs.selectedChild === id) {
      onInputChange('selectedChild', updatedChildren[0]?.id || '');
    }
  };

  const updateChildData = (id: string, field: keyof ChildData, value: any) => {
    const updatedChildren = inputs.children.map(child => {
      if (child.id === id) {
        if (field === 'education') {
          return {
            ...child,
            education: {
              ...child.education,
              ...value
            }
          };
        } else if (field === 'additionalCosts') {
          return {
            ...child,
            additionalCosts: {
              ...child.additionalCosts,
              ...value
            }
          };
        } else {
          return {
            ...child,
            [field]: value
          };
        }
      }
      return child;
    });
    
    onInputChange('children', updatedChildren);
  };

  const getSelectedChild = (): ChildData | undefined => {
    return inputs.children.find(child => child.id === inputs.selectedChild);
  };

  const selectedChild = getSelectedChild();

  return (
    <Grid container spacing={4}>
      {/* Child Selection Panel */}
      <Grid item xs={12} md={4}>
        <Paper elevation={2} className="p-4">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6">Your Children</Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={addChild}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Child
            </Button>
          </Box>
          
          <Box className="space-y-2">
            {inputs.children.map((child) => {
              const errors = validateChildData(child);
              
              return (
                <Card
                  key={child.id}
                  className={`cursor-pointer transition-all ${
                    child.id === inputs.selectedChild 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onInputChange('selectedChild', child.id)}
                >
                  <CardContent className="py-2">
                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center space-x-2">
                        <PersonIcon className="text-gray-500" />
                        <Box>
                          <Typography variant="subtitle2" className="font-medium">
                            {child.name}
                          </Typography>
                          <Typography variant="body2" className="text-gray-600">
                            Age: {child.currentAge}
                            {child.birthYear && ` (Born ${child.birthYear})`}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {inputs.children.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeChild(child.id);
                          }}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    
                    {errors.length > 0 && (
                      <Alert severity="warning" className="mt-2">
                        <Typography variant="caption">
                          {errors.length} validation issue{errors.length > 1 ? 's' : ''}
                        </Typography>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Paper>
      </Grid>
      
      {/* Child Details Panel */}
      <Grid item xs={12} md={8}>
        {selectedChild ? (
          <Paper elevation={2} className="p-4">
            <Typography variant="h6" className="mb-4">
              Details for {selectedChild.name}
            </Typography>
            
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Child Name"
                  value={selectedChild.name}
                  onChange={(e) => updateChildData(selectedChild.id, 'name', e.target.value)}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                {inputs.calculationType === 'current' ? (
                  <TextField
                    label="Current Age"
                    type="number"
                    value={selectedChild.currentAge}
                    onChange={(e) => updateChildData(selectedChild.id, 'currentAge', Number(e.target.value))}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputProps={{ inputProps: { min: 0, max: 30 } }}
                  />
                ) : (
                  <TextField
                    label="Birth Year"
                    type="number"
                    value={selectedChild.birthYear || inputs.birthYear}
                    onChange={(e) => updateChildData(selectedChild.id, 'birthYear', Number(e.target.value))}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputProps={{ 
                      inputProps: { 
                        min: new Date().getFullYear(), 
                        max: new Date().getFullYear() + 10 
                      } 
                    }}
                  />
                )}
              </Grid>
              
              {/* Education Planning */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" className="mb-3 font-medium">
                  Education Planning
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>K-12 Education Type</InputLabel>
                  <Select
                    value={selectedChild.education.k12Type}
                    label="K-12 Education Type"
                    onChange={(e) => updateChildData(selectedChild.id, 'education', {
                      k12Type: e.target.value as 'public' | 'private'
                    })}
                  >
                    <MenuItem value="public">Public School</MenuItem>
                    <MenuItem value="private">Private School</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>College Plans</InputLabel>
                  <Select
                    value={selectedChild.education.collegeType}
                    label="College Plans"
                    onChange={(e) => updateChildData(selectedChild.id, 'education', {
                      collegeType: e.target.value as 'none' | 'public' | 'private'
                    })}
                  >
                    <MenuItem value="none">No College</MenuItem>
                    <MenuItem value="public">Public College</MenuItem>
                    <MenuItem value="private">Private College</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  College Duration (Years): {selectedChild.education.collegeYears}
                </Typography>
                <Slider
                  value={selectedChild.education.collegeYears}
                  onChange={(_e, value) => updateChildData(selectedChild.id, 'education', {
                    collegeYears: value as number
                  })}
                  disabled={selectedChild.education.collegeType === 'none'}
                  min={2}
                  max={6}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedChild.education.gradSchool}
                      onChange={(e) => updateChildData(selectedChild.id, 'education', {
                        gradSchool: e.target.checked
                      })}
                    />
                  }
                  label="Graduate School Plans"
                />
                
                {selectedChild.education.gradSchool && (
                  <Box className="mt-2">
                    <Typography variant="subtitle2" gutterBottom>
                      Graduate School Duration (Years): {selectedChild.education.gradYears}
                    </Typography>
                    <Slider
                      value={selectedChild.education.gradYears}
                      onChange={(_e, value) => updateChildData(selectedChild.id, 'education', {
                        gradYears: value as number
                      })}
                      min={1}
                      max={6}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                    />
                  </Box>
                )}
              </Grid>
              
              {/* Additional Costs */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" className="mb-3 font-medium">
                  Additional Annual Costs
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Extracurricular Activities"
                  type="number"
                  value={selectedChild.additionalCosts.extracurriculars}
                  onChange={(e) => updateChildData(selectedChild.id, 'additionalCosts', {
                    extracurriculars: Number(e.target.value)
                  })}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  helperText="Sports, music lessons, clubs, etc."
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Travel & Vacation"
                  type="number"
                  value={selectedChild.additionalCosts.travel}
                  onChange={(e) => updateChildData(selectedChild.id, 'additionalCosts', {
                    travel: Number(e.target.value)
                  })}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  helperText="Family trips, visits, etc."
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedChild.additionalCosts.healthConditions}
                      onChange={(e) => updateChildData(selectedChild.id, 'additionalCosts', {
                        healthConditions: e.target.checked
                      })}
                    />
                  }
                  label="Special Healthcare Needs (+$2,000/year)"
                />
                <Typography variant="body2" className="text-gray-600 ml-8">
                  Check if child has ongoing medical conditions requiring additional care
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Paper elevation={2} className="p-4 text-center">
            <Typography variant="h6" className="text-gray-500">
              Select a child to view details
            </Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default ChildDetailsTab; 
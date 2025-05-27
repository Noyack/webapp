import { FC } from 'react';
import {
  Typography,
  TextField,
  Grid,
  Box,
  Paper,
  InputAdornment,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  School as SchoolIcon,
  AccountBalance as CollegeIcon,
  Psychology as GradIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { ChildCostInputs, EducationCosts } from '../../../../types/childCost';
import { formatCurrency } from '../../../../utils/childCostCalculations';

interface EducationCostsTabProps {
  inputs: ChildCostInputs;
  onInputChange: <K extends keyof ChildCostInputs>(field: K, value: ChildCostInputs[K]) => void;
}

const EducationCostsTab: FC<EducationCostsTabProps> = ({
  inputs,
  onInputChange
}) => {
  const updateEducationCost = (type: keyof EducationCosts, value: number) => {
    onInputChange('educationCosts', {
      ...inputs.educationCosts,
      [type]: {
        ...inputs.educationCosts[type],
        annual: value
      }
    });
  };

  const calculateInflationAdjustedCost = (annualCost: number, yearsFromNow: number) => {
    const inflationRate = inputs.household.inflationRate / 100;
    return annualCost * Math.pow(1 + inflationRate, yearsFromNow);
  };

  const getEducationTimeline = () => {
    const child = inputs.children.find(c => c.id === inputs.selectedChild);
    if (!child) return [];

    const timeline = [];
    const currentYear = new Date().getFullYear();

    // K-12 Education
    if (child.currentAge < 18) {
      const k12StartYear = child.currentAge < 5 ? currentYear + (5 - child.currentAge) : currentYear;
      const k12EndYear = currentYear + (18 - child.currentAge);
      const yearsUntilK12 = Math.max(0, 5 - child.currentAge);
      
      timeline.push({
        type: 'K-12',
        icon: <SchoolIcon />,
        startYear: k12StartYear,
        endYear: k12EndYear,
        duration: Math.max(0, k12EndYear - k12StartYear),
        currentCost: child.education.k12Type === 'private' 
          ? inputs.educationCosts.privateK12.annual 
          : inputs.educationCosts.publicK12.annual,
        futureCost: calculateInflationAdjustedCost(
          child.education.k12Type === 'private' 
            ? inputs.educationCosts.privateK12.annual 
            : inputs.educationCosts.publicK12.annual,
          yearsUntilK12
        ),
        schoolType: child.education.k12Type
      });
    }

    // College
    if (child.education.collegeType !== 'none') {
      const collegeStartYear = currentYear + Math.max(0, 18 - child.currentAge);
      const collegeEndYear = collegeStartYear + child.education.collegeYears;
      const yearsUntilCollege = Math.max(0, 18 - child.currentAge);
      
      timeline.push({
        type: 'College',
        icon: <CollegeIcon />,
        startYear: collegeStartYear,
        endYear: collegeEndYear,
        duration: child.education.collegeYears,
        currentCost: child.education.collegeType === 'private'
          ? inputs.educationCosts.privateCollege.annual
          : inputs.educationCosts.publicCollege.annual,
        futureCost: calculateInflationAdjustedCost(
          child.education.collegeType === 'private'
            ? inputs.educationCosts.privateCollege.annual
            : inputs.educationCosts.publicCollege.annual,
          yearsUntilCollege
        ),
        schoolType: child.education.collegeType
      });
    }

    // Graduate School
    if (child.education.gradSchool) {
      const gradStartYear = currentYear + Math.max(0, 18 + child.education.collegeYears - child.currentAge);
      const gradEndYear = gradStartYear + child.education.gradYears;
      const yearsUntilGrad = Math.max(0, 18 + child.education.collegeYears - child.currentAge);
      
      timeline.push({
        type: 'Graduate',
        icon: <GradIcon />,
        startYear: gradStartYear,
        endYear: gradEndYear,
        duration: child.education.gradYears,
        currentCost: inputs.educationCosts.gradSchool.annual,
        futureCost: calculateInflationAdjustedCost(
          inputs.educationCosts.gradSchool.annual,
          yearsUntilGrad
        ),
        schoolType: 'graduate'
      });
    }

    return timeline;
  };

  const timeline = getEducationTimeline();
  const totalEducationCost = timeline.reduce((sum, item) => sum + (item.futureCost * item.duration), 0);

  return (
    <Grid container spacing={4}>
      {/* Education Cost Settings */}
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Education Cost Settings</Typography>
          
          <Grid container spacing={3}>
            {/* K-12 Costs */}
            <Grid item xs={12}>
              <Box className="mb-3">
                <Box className="flex items-center space-x-2 mb-2">
                  <SchoolIcon className="text-blue-600" />
                  <Typography variant="subtitle1" className="font-medium">
                    K-12 Education (Annual Costs)
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Public K-12"
                    type="number"
                    value={inputs.educationCosts.publicK12.annual}
                    onChange={(e) => updateEducationCost('publicK12', Number(e.target.value))}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Supplies, activities, fees"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Private K-12"
                    type="number"
                    value={inputs.educationCosts.privateK12.annual}
                    onChange={(e) => updateEducationCost('privateK12', Number(e.target.value))}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Tuition, fees, activities"
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* College Costs */}
            <Grid item xs={12}>
              <Box className="mb-3">
                <Box className="flex items-center space-x-2 mb-2">
                  <CollegeIcon className="text-green-600" />
                  <Typography variant="subtitle1" className="font-medium">
                    College Education (Annual Costs)
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Public College (In-State)"
                    type="number"
                    value={inputs.educationCosts.publicCollege.annual}
                    onChange={(e) => updateEducationCost('publicCollege', Number(e.target.value))}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Tuition, room, board, books"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Private College"
                    type="number"
                    value={inputs.educationCosts.privateCollege.annual}
                    onChange={(e) => updateEducationCost('privateCollege', Number(e.target.value))}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    helperText="Tuition, room, board, books"
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Graduate School */}
            <Grid item xs={12}>
              <Box className="mb-3">
                <Box className="flex items-center space-x-2 mb-2">
                  <GradIcon className="text-purple-600" />
                  <Typography variant="subtitle1" className="font-medium">
                    Graduate Education (Annual Costs)
                  </Typography>
                </Box>
              </Box>
              
              <TextField
                label="Graduate School"
                type="number"
                value={inputs.educationCosts.gradSchool.annual}
                onChange={(e) => updateEducationCost('gradSchool', Number(e.target.value))}
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                helperText="Masters, PhD, professional degrees"
              />
            </Grid>
          </Grid>
          
          <Alert severity="info" className="mt-4">
            <Typography variant="body2">
              💡 <strong>Tip:</strong> These costs will be automatically adjusted for inflation 
              based on when your child reaches each education level.
            </Typography>
          </Alert>
        </Paper>
      </Grid>
      
      {/* Education Timeline & Projections */}
      <Grid item xs={12} md={6}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Education Timeline & Costs</Typography>
          
          {timeline.length > 0 ? (
            <>
              <List>
                {timeline.map((item, index) => (
                  <ListItem key={index} className="border-l-4 border-l-blue-200 mb-2 bg-gray-50 rounded">
                    <Box className="flex items-center space-x-2 mr-3">
                      {item.icon}
                    </Box>
                    <ListItemText
                      primary={
                        <Box className="flex items-center space-x-2">
                          <Typography variant="subtitle1" className="font-medium">
                            {item.type}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={item.schoolType} 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" className="text-gray-600">
                            {item.startYear} - {item.endYear} ({item.duration} years)
                          </Typography>
                          <Typography variant="body2">
                            Current cost: {formatCurrency(item.currentCost)}/year
                          </Typography>
                          {item.futureCost !== item.currentCost && (
                            <Box className="flex items-center space-x-1 mt-1">
                              <TrendingUpIcon fontSize="small" className="text-orange-500" />
                              <Typography variant="body2" className="text-orange-600">
                                Future cost: {formatCurrency(item.futureCost)}/year
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box className="text-right">
                        <Typography variant="subtitle2" className="font-medium">
                          {formatCurrency(item.futureCost * item.duration)}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          Total
                        </Typography>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              
              <Box className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                <Typography variant="subtitle1" className="font-bold text-blue-800 mb-1">
                  Total Education Investment
                </Typography>
                <Typography variant="h5" className="text-purple-700 font-bold">
                  {formatCurrency(totalEducationCost)}
                </Typography>
                <Typography variant="body2" className="text-gray-600 mt-1">
                  Includes inflation adjustments based on {inputs.household.inflationRate}% annual rate
                </Typography>
              </Box>
            </>
          ) : (
            <Box className="text-center py-8">
              <SchoolIcon className="text-gray-400 mb-2" style={{ fontSize: 48 }} />
              <Typography variant="h6" className="text-gray-500 mb-2">
                No Education Plans
              </Typography>
              <Typography variant="body2" className="text-gray-400">
                Select a child and configure their education plans in the Child Details tab.
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
      
      {/* Cost Comparison */}
      <Grid item xs={12}>
        <Paper elevation={2} className="p-4">
          <Typography variant="h6" className="mb-4">Education Cost Comparison</Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Box className="text-center p-3 bg-blue-50 rounded">
                <SchoolIcon className="text-blue-600 mb-2" style={{ fontSize: 32 }} />
                <Typography variant="subtitle2" className="text-blue-800 mb-1">
                  Public K-12 (13 years)
                </Typography>
                <Typography variant="h6" className="text-blue-700">
                  {formatCurrency(inputs.educationCosts.publicK12.annual * 13)}
                </Typography>
                <Typography variant="caption" className="text-blue-600">
                  Current dollars
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box className="text-center p-3 bg-green-50 rounded">
                <SchoolIcon className="text-green-600 mb-2" style={{ fontSize: 32 }} />
                <Typography variant="subtitle2" className="text-green-800 mb-1">
                  Private K-12 (13 years)
                </Typography>
                <Typography variant="h6" className="text-green-700">
                  {formatCurrency(inputs.educationCosts.privateK12.annual * 13)}
                </Typography>
                <Typography variant="caption" className="text-green-600">
                  Current dollars
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box className="text-center p-3 bg-orange-50 rounded">
                <CollegeIcon className="text-orange-600 mb-2" style={{ fontSize: 32 }} />
                <Typography variant="subtitle2" className="text-orange-800 mb-1">
                  Public College (4 years)
                </Typography>
                <Typography variant="h6" className="text-orange-700">
                  {formatCurrency(inputs.educationCosts.publicCollege.annual * 4)}
                </Typography>
                <Typography variant="caption" className="text-orange-600">
                  Current dollars
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Box className="text-center p-3 bg-purple-50 rounded">
                <CollegeIcon className="text-purple-600 mb-2" style={{ fontSize: 32 }} />
                <Typography variant="subtitle2" className="text-purple-800 mb-1">
                  Private College (4 years)
                </Typography>
                <Typography variant="h6" className="text-purple-700">
                  {formatCurrency(inputs.educationCosts.privateCollege.annual * 4)}
                </Typography>
                <Typography variant="caption" className="text-purple-600">
                  Current dollars
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Alert severity="warning" className="mt-4">
            <Typography variant="body2">
              <strong>Important:</strong> Education costs have historically increased faster than general inflation. 
              Consider using a higher inflation rate specifically for education planning (3-5% annually).
            </Typography>
          </Alert>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EducationCostsTab; 
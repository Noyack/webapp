import React, { useState, useEffect, useContext } from 'react';
import { 
  Divider, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Slider, 
  Checkbox, 
  FormControlLabel, 
  FormGroup, 
  Button,
  Box,
  Grid,
  Paper,
  SelectChangeEvent,
  Alert,
  Snackbar
} from "@mui/material";
import { InfoProps, PersonalInfoForm } from '../../types';
import wealthViewService from '../../services/wealthView.service';
import { UserContext } from '../../context/UserContext';

const maritalStatusOptions = ["single", "married", "divorced", "widowed", "separated", "domestic_partnership"];
const employmentOptions = ["employed", "self-employed", "unemployed", "retired", "student"];
const careerChangeOptions = ["None expected", "Career change planned", "Promotion expected", "Scaling back", "Other"];
const healthOptions = ["excellent", "good", "fair", "poor"];
const familyHealthOptions = ["Heart disease", "Cancer", "Diabetes", "Alzheimer's", "Longevity", "Other"];
const medicalConditionOptions = ["Hypertension", "Diabetes", "Heart disease", "Cancer", "Arthritis", "Depression/Anxiety", "None", "Other"];
const futureCareOptions = ["Regular checkups", "Prescription medications", "Surgeries", "Specialized care", "None anticipated"];
const investmentResponseOptions = ["Sell immediately", "Wait and see", "Buy more"];
const investmentExperienceOptions = ["Stocks", "Bonds", "Real Estate", "Cryptocurrencies", "Options/Derivatives", "None"];

// Info display component
function Info({ label, value }: InfoProps) {
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

function BasicInfo() {
  const [basicInfoId, setBasicInfoId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { userInfo } = useContext(UserContext)

  // Initial form state
  const [formData, setFormData] = useState<PersonalInfoForm>({
    // Age and Retirement
    currentAge: 0,
    expectedRetirementAge: 0,

    // Marital Status and Family
    maritalStatus: "single",
    spouseAge: undefined,
    dependentsCount: 0,
    dependentAges: "",
    supportingParents: false,
    supportingAdultChildren: false,
    supportingOtherRelatives: false,

    // Employment
    employmentStatus: "employed",
    profession: "",
    yearsInPosition: 0,
    expectedCareerChange: "None expected",
    careerChangeYears: undefined,
    hasPension: false,
    has401kMatch: false,
    hasStockOptions: false,

    // Health
    healthStatus: "good",
    familyHealthConcerns: [],
    medicalConditions: [],
    otherMedicalConditions: "",
    futureCareNeeds: [],
    longTermCare: 1,

    // Risk Tolerance
    riskTolerance: 1,
    investmentResponse: "Wait and see",
    investmentExperience: [],
    majorInvestmentTimeHorizon: 1,
    lifestyleSacrifice: 1,
  });

  // Form display mode vs edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user ID on component mount
  useEffect(() => {
     if (userInfo?.id) {
    fetchUserBasicInfo(userInfo.id);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIsEditing = () =>{
    setIsEditing(!isEditing)
  }

  // Fetch user's basic info from the API
  const fetchUserBasicInfo = async (userId: string) => {
    try {
      setLoading(true);
      const data = await wealthViewService.getWealthBasicInfo(userId);
      
      if (data) {
        if(data.id)setBasicInfoId(data.id);
        
        // Safely parse JSON fields
        const safeParseJson = (jsonValue: object) => {
          if (!jsonValue) return [];
          if (Array.isArray(jsonValue)) return jsonValue;
          if (typeof jsonValue === 'object') return Object.values(jsonValue);
          
          try {
            const parsed = JSON.parse(jsonValue);
            return Array.isArray(parsed) ? parsed : Object.values(parsed);
          } catch (e) {
            console.warn('Failed to parse JSON:', jsonValue);
            console.error('Error:', e);
            return [];
          }
        };
        
        // Map API data to form data
        setFormData({
          ...formData,
          currentAge: data.currentAge ?? formData.currentAge,
          expectedRetirementAge: data.expectedRetirementAge ?? formData.expectedRetirementAge,
          maritalStatus: data.maritalStatus ?? formData.maritalStatus,
          spouseAge: data.spouseAge ?? formData.spouseAge,
          dependentsCount: data.dependentsCount ?? formData.dependentsCount,
          dependentAges: data.dependentAges ?? formData.dependentAges,
          employmentStatus: data.employmentStatus ?? formData.employmentStatus,
          profession: data.profession ?? formData.profession,
          yearsInPosition: data.yearsInPosition ?? formData.yearsInPosition,
          expectedCareerChange: data.expectedCareerChange ?? formData.expectedCareerChange,
          careerChangeYears: data.careerChangeYears ?? formData.careerChangeYears,
          hasPension: data.hasPension ?? formData.hasPension,
          has401kMatch: data.has401kMatch ?? formData.has401kMatch,
          hasStockOptions: data.hasStockOptions ?? formData.hasStockOptions,
          healthStatus: data.healthStatus ?? formData.healthStatus,
          riskTolerance: data.riskTolerance ?? formData.riskTolerance,
          
          // Parse JSON fields
          familyHealthConcerns: safeParseJson(data.familyHealthConcerns),
          medicalConditions: safeParseJson(data.medicalConditions),
          investmentExperience: safeParseJson(data.investmentExperience),
        });
      }
    } catch (err) {
      console.error('Error fetching basic info:', err);
      // It's okay if no data exists yet
    } finally {
      setLoading(false);
    }
  };

  // Handle text field changes
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof PersonalInfoForm;
    const value = event.target.value;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle numeric field changes
  const handleNumericFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof PersonalInfoForm;
    const value = event.target.value === '' ? undefined : Number(event.target.value);
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle dropdown select changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof PersonalInfoForm;
    const value = event.target.value;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle marital status changes
  const handleMaritalStatusChange = (event: SelectChangeEvent) => {
    const newMaritalStatus = event.target.value;
    
    // Create updated form data
    const updatedFormData = {
      ...formData,
      maritalStatus: newMaritalStatus
    };
    
    // Reset spouse age if not married or in domestic partnership
    if (newMaritalStatus !== 'married' && newMaritalStatus !== 'domestic_partnership') {
      updatedFormData.spouseAge = undefined;
    }
    
    setFormData(updatedFormData);
  };

  // Handle dependents count changes
  const handleDependentsCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(event.target.value) || 0;
    
    // Create updated form data
    const updatedFormData = {
      ...formData,
      dependentsCount: newCount
    };
    
    // Reset dependent ages if no dependents
    if (newCount === 0) {
      updatedFormData.dependentAges = '';
    }
    
    setFormData(updatedFormData);
  };

  // Handle career change selection
  const handleCareerChangeSelect = (event: SelectChangeEvent) => {
    const newCareerChange = event.target.value;
    
    // Create updated form data
    const updatedFormData = {
      ...formData,
      expectedCareerChange: newCareerChange
    };
    
    // Reset career change years if no career change planned
    if (newCareerChange === 'None expected') {
      updatedFormData.careerChangeYears = undefined;
    }
    
    setFormData(updatedFormData);
  };

  // Handle checkbox changes
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof PersonalInfoForm;
    
    setFormData({
      ...formData,
      [name]: event.target.checked,
    });
  };

  // Handle medical condition changes
  const handleMedicalConditionChange = (option: string) => {
    let newConditions = [...formData.medicalConditions];
    
    if (newConditions.includes(option)) {
      newConditions = newConditions.filter(v => v !== option);
    } else {
      newConditions.push(option);
    }
    
    const updatedFormData = {
      ...formData,
      medicalConditions: newConditions
    };
    
    // Reset other medical conditions if "Other" is not selected
    if (!newConditions.includes("Other")) {
      updatedFormData.otherMedicalConditions = '';
    }
    
    setFormData(updatedFormData);
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (name: keyof PersonalInfoForm, value: string) => {
    const currentValues = formData[name] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setFormData({
      ...formData,
      [name]: newValues,
    });
  };

  // Handle slider changes
  const handleSliderChange = (name: keyof PersonalInfoForm) => (_event: Event, newValue: number | number[]) => {
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  // Prepare data for API
  const prepareDataForApi = () => {
    // Create a copy of the form data
    const apiData = { ...formData };
    
    // Handle dependent fields
    if (apiData.maritalStatus !== 'married' && apiData.maritalStatus !== 'domestic_partnership') {
      // Reset spouse age if not married or in domestic partnership
      apiData.spouseAge = null;
    }
    
    // Reset dependent ages if no dependents
    if (apiData.dependentsCount === null) {
      apiData.dependentAges = '';
    }
    
    // Reset career change years if no career change planned
    if (apiData.expectedCareerChange === 'None expected') {
      apiData.careerChangeYears = null;
    }
    
    // Reset other medical conditions if "Other" is not selected
    if (!apiData.medicalConditions.includes('Other')) {
      apiData.otherMedicalConditions = '';
    }
    
    return apiData;
  };

  // Submit form to API
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const apiData = prepareDataForApi();
      
      let response;
      
      if (basicInfoId) {
        // Update existing record
        response = await wealthViewService.patchWealthBasicInfo(basicInfoId, apiData)
        setSuccess('Basic information updated successfully');
      } else {
        // Create new record
        if(userInfo?.id){
          response = await wealthViewService.postWealthBasicInfo(userInfo?.id, apiData);
          if(response.id) setBasicInfoId(response.id);
          setSuccess('Basic information created successfully');
        }
      }
      
      // Update the form data to reflect the cleaned/prepared data
      setFormData(apiData);
      handleIsEditing();
    } catch (err) {
      console.error('Error saving basic info:', err);
      setError('Failed to save information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Close alert
  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Box display={'flex'} flexDirection={'column'} sx={{ p: {xs:0, md:3}, gap: 2 }}>
      <Typography variant="h4" fontSize={{xs:"24px", md:"34px"}} gutterBottom>Personal Information</Typography>
      
      {/* Notifications */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Age and Retirement</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Age"
                  type="number"
                  name="currentAge"
                  value={formData.currentAge}
                  onChange={handleNumericFieldChange}
                  InputProps={{ inputProps: { min: 18, max: 100 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expected Retirement Age"
                  type="number"
                  name="expectedRetirementAge"
                  value={formData.expectedRetirementAge}
                  onChange={handleNumericFieldChange}
                  InputProps={{ inputProps: { min: 45, max: 100 } }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Marital Status and Family</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Marital Status</InputLabel>
                  <Select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    label="Marital Status"
                    onChange={handleMaritalStatusChange}
                  >
                    {maritalStatusOptions.map(option => (
                      <MenuItem key={option} value={option}>{option.replace('_', ' ')}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {formData.maritalStatus === "married" || formData.maritalStatus === "domestic_partnership" ? (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Spouse/Partner Age"
                    type="number"
                    name="spouseAge"
                    value={formData.spouseAge || ''}
                    onChange={handleNumericFieldChange}
                    InputProps={{ inputProps: { min: 18, max: 100 } }}
                  />
                </Grid>
              ) : null}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of Dependents"
                  type="number"
                  name="dependentsCount"
                  value={formData.dependentsCount}
                  onChange={handleDependentsCountChange}
                  InputProps={{ inputProps: { min: 0, max: 20 } }}
                />
              </Grid>
              {formData.dependentsCount > 0 ? (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ages of Dependents (comma separated)"
                    name="dependentAges"
                    value={formData.dependentAges}
                    onChange={handleTextFieldChange}
                    placeholder="e.g., 4, 7, 12"
                  />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Family Members Requiring Financial Support</Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.supportingParents}
                        onChange={handleCheckboxChange}
                        name="supportingParents"
                      />
                    }
                    label="Parents/Elderly Relatives"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.supportingAdultChildren}
                        onChange={handleCheckboxChange}
                        name="supportingAdultChildren"
                      />
                    }
                    label="Adult Children"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.supportingOtherRelatives}
                        onChange={handleCheckboxChange}
                        name="supportingOtherRelatives"
                      />
                    }
                    label="Other Relatives"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Employment Information</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Employment Status</InputLabel>
                  <Select
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    label="Employment Status"
                    onChange={handleSelectChange}
                  >
                    {employmentOptions.map(option => (
                      <MenuItem key={option} value={option}>{option.replace('-', ' ')}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Current Profession/Industry"
                  name="profession"
                  value={formData.profession}
                  onChange={handleTextFieldChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Years in Current Position"
                  type="number"
                  name="yearsInPosition"
                  value={formData.yearsInPosition}
                  onChange={handleNumericFieldChange}
                  InputProps={{ inputProps: { min: 0, max: 60 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Expected Career Changes</InputLabel>
                  <Select
                    name="expectedCareerChange"
                    value={formData.expectedCareerChange}
                    label="Expected Career Changes"
                    onChange={handleCareerChangeSelect}
                  >
                    {careerChangeOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {formData.expectedCareerChange !== "None expected" ? (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expected Timing (years from now)"
                    type="number"
                    name="careerChangeYears"
                    value={formData.careerChangeYears || ''}
                    onChange={handleNumericFieldChange}
                    InputProps={{ inputProps: { min: 1, max: 40 } }}
                  />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Retirement Package Available</Typography>
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.hasPension}
                        onChange={handleCheckboxChange}
                        name="hasPension"
                      />
                    }
                    label="Pension"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.has401kMatch}
                        onChange={handleCheckboxChange}
                        name="has401kMatch"
                      />
                    }
                    label="Employer 401(k) Match"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.hasStockOptions}
                        onChange={handleCheckboxChange}
                        name="hasStockOptions"
                      />
                    }
                    label="Stock Options"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Health Considerations</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Current Overall Health</InputLabel>
                  <Select
                    name="healthStatus"
                    value={formData.healthStatus}
                    label="Current Overall Health"
                    onChange={handleSelectChange}
                  >
                    {healthOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Family Health History Concerns</Typography>
                <FormGroup row>
                  {familyHealthOptions.map(option => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={formData.familyHealthConcerns.includes(option)}
                          onChange={() => handleMultiSelectChange('familyHealthConcerns', option)}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Existing Medical Conditions</Typography>
                <FormGroup row>
                  {medicalConditionOptions.map(option => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={formData.medicalConditions.includes(option)}
                          onChange={() => handleMedicalConditionChange(option)}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </Grid>
              {formData.medicalConditions.includes("Other") ? (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Other Medical Conditions"
                    name="otherMedicalConditions"
                    value={formData.otherMedicalConditions}
                    onChange={handleTextFieldChange}
                    multiline
                    rows={2}
                  />
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Expected Future Healthcare Needs</Typography>
                <FormGroup row>
                  {futureCareOptions.map(option => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={formData.futureCareNeeds.includes(option)}
                          onChange={() => handleMultiSelectChange('futureCareNeeds', option)}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Long-term Care Considerations (1-5)</Typography>
                <Slider
                  value={formData.longTermCare}
                  onChange={handleSliderChange('longTermCare')}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={5}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Not a concern</Typography>
                  <Typography variant="caption">Major concern</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Risk Tolerance</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Investment Risk Comfort (1-10)</Typography>
                <Slider
                  value={formData.riskTolerance}
                  onChange={handleSliderChange('riskTolerance')}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={10}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Very Conservative</Typography>
                  <Typography variant="caption">Very Aggressive</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Response to 20% Investment Loss</InputLabel>
                  <Select
                    name="investmentResponse"
                    value={formData.investmentResponse}
                    label="Response to 20% Investment Loss"
                    onChange={handleSelectChange}
                  >
                    {investmentResponseOptions.map(option => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>Prior Investment Experience</Typography>
                <FormGroup row>
                  {investmentExperienceOptions.map(option => (
                    <FormControlLabel
                      key={option}
                      control={
                        <Checkbox
                          checked={formData.investmentExperience.includes(option)}
                          onChange={() => handleMultiSelectChange('investmentExperience', option)}
                        />
                      }
                      label={option}
                    />
                  ))}
                </FormGroup>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Time Horizon for Major Investments (years)</Typography>
                <Slider
                  value={formData.majorInvestmentTimeHorizon}
                  onChange={handleSliderChange('majorInvestmentTimeHorizon')}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={30}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>Willingness to Sacrifice Current Lifestyle (1-5)</Typography>
                <Slider
                  value={formData.lifestyleSacrifice}
                  onChange={handleSliderChange('lifestyleSacrifice')}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={5}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">Not willing</Typography>
                  <Typography variant="caption">Very willing</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              type="button" 
              variant="outlined" 
              color="secondary" 
              size="large" 
              onClick={()=>handleIsEditing()}
              sx={{ mr: 2 }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Information'}
            </Button>
          </Box>
        </form>
      ) : (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="outlined" color="primary" onClick={()=>handleIsEditing()}>
              Edit Information
            </Button>
          </Box>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <div className="flex flex-wrap gap-5 justify-between">
              <Info label="Current Age" value={formData.currentAge} />
              <Info label="Expected Retirement" value={formData.expectedRetirementAge} />
              <Info label="Marital Status" value={formData.maritalStatus.replace('_', ' ')} />
              {formData.spouseAge && <Info label="Spouse/Partner Age" value={formData.spouseAge} />}
              <Info label="Dependents" value={formData.dependentsCount} />
              {formData.dependentsCount > 0 && <Info label="Dependent Ages" value={formData.dependentAges} />}
              <Info label="Employment" value={formData.employmentStatus.replace('-', ' ')} />
              <Info label="Profession" value={formData.profession} />
              <Info label="Health Status" value={formData.healthStatus} />
              <Info label="Risk Tolerance" value={`${formData.riskTolerance}/10`} />
            </div>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Career & Retirement Factors</Typography>
            <div className="flex flex-wrap gap-5 justify-between">
              <Info label="Years in Position" value={formData.yearsInPosition} />
              <Info label="Career Change" value={formData.expectedCareerChange} />
              {formData.careerChangeYears && <Info label="Change Timeline" value={`${formData.careerChangeYears} years`} />}
              <Info label="Pension" value={formData.hasPension ? "Yes" : "No"} />
              <Info label="401(k) Match" value={formData.has401kMatch ? "Yes" : "No"} />
              <Info label="Stock Options" value={formData.hasStockOptions ? "Yes" : "No"} />
            </div>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Health & Family Support</Typography>
            <div className="flex flex-wrap gap-5 justify-between">
              <Info label="Family Health History" value={formData.familyHealthConcerns.join(", ") || "None reported"} />
              <Info label="Medical Conditions" value={formData.medicalConditions.join(", ") || "None reported"} />
              <Info label="Long-term Care Level" value={`${formData.longTermCare}/5`} />
              <Info label="Supporting Parents" value={formData.supportingParents ? "Yes" : "No"} />
              <Info label="Supporting Adult Children" value={formData.supportingAdultChildren ? "Yes" : "No"} />
            </div>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Investment Profile</Typography>
            <div className="flex flex-wrap gap-5 justify-between">
              <Info label="Investment Experience" value={formData.investmentExperience.join(", ") || "None"} />
              <Info label="Response to Market Drop" value={formData.investmentResponse} />
              <Info label="Investment Time Horizon" value={`${formData.majorInvestmentTimeHorizon} years`} />
              <Info label="Lifestyle Sacrifice" value={`${formData.lifestyleSacrifice}/5`} />
            </div>
          </Paper>
        </div>
      )}
    </Box>
  );
}

export default BasicInfo;
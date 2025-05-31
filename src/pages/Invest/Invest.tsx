import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import {
  CheckCircle,
  Visibility,
  TrendingUp,
  Assignment,
  MonetizationOn,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Form data interface
interface InvestmentFormData {
  // Step 1: Investment Details
  firstName: string;
  lastName: string;
  email: string;
  isAccreditedInvestor: string;
  investmentAccount: string;
  iraAccountNumber: string;
  investmentAmount: string;
  
  // Step 2: Document Review
  reitInvestmentDocument: boolean;
  equityTrustDirections: boolean;
  
  // Step 3: Confirmation
  selectedInvestment: string;
  confirmationAmount: string;
  fundingSource: string;
  iraAccountForFunding: string;
}

const steps = ['Invest', 'Sign', 'Fund', ''];

// Investment options
const investmentOptions = [
  { value: 'noyack_logistics_reit', label: 'NOYACK Logistics Income REIT I', availableCash: 50000 },
  { value: 'equity_real_estate_fund', label: 'Equity Real Estate Income Fund', availableCash: 75000 },
  { value: 'industrial_growth_reit', label: 'Industrial Growth REIT II', availableCash: 100000 },
];

// IRA Account options (mock data)
const iraAccounts = [
  { value: '20001234', label: '20001234 - Traditional IRA', balance: 50000 },
  { value: '20005678', label: '20005678 - Roth IRA', balance: 75000 },
  { value: '20009012', label: '20009012 - SEP IRA', balance: 100000 },
];

// Validation schemas
const step1Schema = Yup.object({
  firstName: Yup.string()
    .matches(/^[a-zA-Z\s-']+$/, 'Only letters, spaces, hyphens, and apostrophes allowed')
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .matches(/^[a-zA-Z\s-']+$/, 'Only letters, spaces, hyphens, and apostrophes allowed')
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  isAccreditedInvestor: Yup.string()
    .required('Please specify if you are an accredited investor'),
  investmentAccount: Yup.string()
    .required('Please select an investment account'),
  iraAccountNumber: Yup.string()
    .when('investmentAccount', {
      is: 'equity_trust_ira',
      then: (schema) => schema.required('IRA account number is required'),
      otherwise: (schema) => schema,
    }),
  investmentAmount: Yup.number()
    .min(1000, 'Minimum investment amount is $1,000')
    .max(1000000, 'Maximum investment amount is $1,000,000')
    .required('Investment amount is required'),
});

const step2Schema = Yup.object({
  reitInvestmentDocument: Yup.boolean()
    .oneOf([true], 'You must review the REIT Investment Document'),
  equityTrustDirections: Yup.boolean()
    .oneOf([true], 'You must review the Equity Trust Direction of Investment Terms'),
});

const step3Schema = Yup.object({
  selectedInvestment: Yup.string()
    .required('Investment selection is required'),
  confirmationAmount: Yup.string()
    .required('Amount confirmation is required'),
  fundingSource: Yup.string()
    .required('Funding source is required'),
  iraAccountForFunding: Yup.string()
    .required('IRA account selection is required'),
});

const Invest: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState<string>('');
  const [availableCash, setAvailableCash] = useState<number>(0);

  const formik = useFormik<InvestmentFormData>({
    initialValues: {
      // Step 1
      firstName: '',
      lastName: '',
      email: '',
      isAccreditedInvestor: '',
      investmentAccount: '',
      iraAccountNumber: '',
      investmentAmount: '',
      
      // Step 2
      reitInvestmentDocument: false,
      equityTrustDirections: false,
      
      // Step 3
      selectedInvestment: 'noyack_logistics_reit',
      confirmationAmount: '',
      fundingSource: 'equity_trust_ira',
      iraAccountForFunding: '',
    },
    validationSchema: 
      activeStep === 0 ? step1Schema : 
      activeStep === 1 ? step2Schema : 
      activeStep === 2 ? step3Schema : 
      Yup.object(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (activeStep < 3) {
        if (activeStep === 0) {
          // Set values for step 3 based on step 1
          formik.setFieldValue('selectedInvestment', values.investmentAccount);
          formik.setFieldValue('confirmationAmount', values.investmentAmount);
        }
        setActiveStep(activeStep + 1);
      } else {
        setIsSubmitting(true);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          setConfirmationNumber('AP1450546');
          setActiveStep(activeStep + 1);
        } catch (error) {
          console.error('Submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
  });

  // Handle investment account change
  const handleInvestmentAccountChange = (value: string) => {
    formik.setFieldValue('investmentAccount', value);
    
    const selectedOption = investmentOptions.find(option => option.value === value);
    if (selectedOption) {
      setAvailableCash(selectedOption.availableCash);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // Handle next button click
  const handleNext = async () => {
    // Trigger validation for current step
    const errors = await formik.validateForm();
    
    // Get current step fields
    let currentStepFields: string[] = [];
    if (activeStep === 0) {
      currentStepFields = ['firstName', 'lastName', 'email', 'isAccreditedInvestor', 'investmentAccount', 'investmentAmount'];
      if (formik.values.investmentAccount === 'equity_trust_ira') {
        currentStepFields.push('iraAccountNumber');
      }
    } else if (activeStep === 1) {
      currentStepFields = ['reitInvestmentDocument', 'equityTrustDirections'];
    } else if (activeStep === 2) {
      currentStepFields = ['iraAccountForFunding'];
    }
    
    // Check if current step has errors
    const currentStepHasErrors = currentStepFields.some(field => errors[field as keyof InvestmentFormData]);
    
    if (currentStepHasErrors) {
      // Mark fields as touched to show errors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const touchedFields: any = {};
      currentStepFields.forEach(field => {
        touchedFields[field] = true;
      });
      formik.setTouched({ ...formik.touched, ...touchedFields });
      return;
    }
    
    // If no errors, proceed to next step
    if (activeStep < 3) {
      if (activeStep === 0) {
        // Set values for step 3 based on step 1
        formik.setFieldValue('selectedInvestment', formik.values.investmentAccount);
        formik.setFieldValue('confirmationAmount', formik.values.investmentAmount);
      }
      setActiveStep(activeStep + 1);
    } else {
      // Final submission
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setConfirmationNumber('AP1450546');
        setActiveStep(activeStep + 1);
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Investment Request Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  required
                  inputProps={{ 'aria-label': 'First Name' }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  required
                  inputProps={{ 'aria-label': 'Last Name' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  required
                  inputProps={{ 'aria-label': 'Email Address' }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Are you an accredited investor?</InputLabel>
                  <Select
                    name="isAccreditedInvestor"
                    value={formik.values.isAccreditedInvestor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.isAccreditedInvestor && Boolean(formik.errors.isAccreditedInvestor)}
                    label="Are you an accredited investor?"
                    aria-label="Accredited Investor Status"
                  >
                    <MenuItem value="yes">Yes, I am an accredited investor</MenuItem>
                    <MenuItem value="no">No, I am not an accredited investor</MenuItem>
                    <MenuItem value="unsure">I'm not sure</MenuItem>
                  </Select>
                  {formik.touched.isAccreditedInvestor && formik.errors.isAccreditedInvestor && (
                    <FormHelperText error>{formik.errors.isAccreditedInvestor}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Choose your investment account.
                </Typography>
                
                <FormControl fullWidth required>
                  <InputLabel>Investment Account</InputLabel>
                  <Select
                    name="investmentAccount"
                    value={formik.values.investmentAccount}
                    onChange={(e) => handleInvestmentAccountChange(e.target.value)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.investmentAccount && Boolean(formik.errors.investmentAccount)}
                    label="Investment Account"
                    aria-label="Investment Account"
                  >
                    <MenuItem value="equity_trust_ira">Equity Trust IRA</MenuItem>
                    <MenuItem value="personal_investment">Personal Investment Account</MenuItem>
                    <MenuItem value="business_account">Business Investment Account</MenuItem>
                  </Select>
                  {formik.touched.investmentAccount && formik.errors.investmentAccount && (
                    <FormHelperText error>{formik.errors.investmentAccount}</FormHelperText>
                  )}
                </FormControl>

                {availableCash > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Available Cash: <strong>${availableCash.toLocaleString()}</strong>
                    </Typography>
                  </Box>
                )}
              </Grid>

              {formik.values.investmentAccount === 'equity_trust_ira' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="iraAccountNumber"
                    label="Input your Equity Trust IRA Account Number"
                    value={formik.values.iraAccountNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.iraAccountNumber && Boolean(formik.errors.iraAccountNumber)}
                    helperText={formik.touched.iraAccountNumber && formik.errors.iraAccountNumber}
                    required
                    placeholder="Enter your IRA account number"
                    inputProps={{ 'aria-label': 'IRA Account Number' }}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  How much will you be investing?
                </Typography>
                
                <FormControl fullWidth required>
                  <InputLabel>Investment Amount</InputLabel>
                  <Select
                    name="investmentAmount"
                    value={formik.values.investmentAmount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.investmentAmount && Boolean(formik.errors.investmentAmount)}
                    label="Investment Amount"
                    aria-label="Investment Amount"
                  >
                    <MenuItem value="1000">$1,000</MenuItem>
                    <MenuItem value="5000">$5,000</MenuItem>
                    <MenuItem value="10000">$10,000</MenuItem>
                    <MenuItem value="25000">$25,000</MenuItem>
                    <MenuItem value="50000">$50,000</MenuItem>
                    <MenuItem value="100000">$100,000</MenuItem>
                    <MenuItem value="custom">Custom Amount</MenuItem>
                  </Select>
                  {formik.touched.investmentAmount && formik.errors.investmentAmount && (
                    <FormHelperText error>{formik.errors.investmentAmount}</FormHelperText>
                  )}
                </FormControl>

                {formik.values.investmentAmount === 'custom' && (
                  <TextField
                    fullWidth
                    name="customAmount"
                    label="Custom Investment Amount"
                    type="number"
                    sx={{ mt: 2 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    inputProps={{ 'aria-label': 'Custom Investment Amount', min: 1000, max: 1000000 }}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Document Review and Signature
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3 }}>
              Choose an available document to view and sign.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1">
                        REIT Investment Document 1
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => window.open('/documents/reit-investment-doc.pdf', '_blank')}
                        aria-label="View REIT Investment Document"
                      >
                        View
                      </Button>
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="reitInvestmentDocument"
                          checked={formik.values.reitInvestmentDocument}
                          onChange={formik.handleChange}
                          color="primary"
                          aria-label="I have reviewed the REIT Investment Document"
                        />
                      }
                      label="I have reviewed and agree to the REIT Investment Document"
                    />
                    {formik.touched.reitInvestmentDocument && formik.errors.reitInvestmentDocument && (
                      <Typography color="error" variant="caption" display="block">
                        {formik.errors.reitInvestmentDocument}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1">
                        Equity Trust Direction of Investment Terms
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => window.open('/documents/equity-trust-terms.pdf', '_blank')}
                        aria-label="View Equity Trust Terms"
                      >
                        View
                      </Button>
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="equityTrustDirections"
                          checked={formik.values.equityTrustDirections}
                          onChange={formik.handleChange}
                          color="primary"
                          aria-label="I have reviewed the Equity Trust Direction Terms"
                        />
                      }
                      label="I have reviewed and agree to the Equity Trust Direction of Investment Terms"
                    />
                    {formik.touched.equityTrustDirections && formik.errors.equityTrustDirections && (
                      <Typography color="error" variant="caption" display="block">
                        {formik.errors.equityTrustDirections}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Electronic Signature:</strong> By checking the boxes above and proceeding, 
                    you are providing your electronic signature and consent to be legally bound by the terms 
                    and conditions of the investment documents.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Confirm Investment Details
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3 }}>
              Confirm investment details below and submit request.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Investment
                        </Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body1">
                          NOYACK Logistics Income REIT I
                        </Typography>
                      </Grid>

                      <Grid item xs={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Amount
                        </Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body1">
                          ${formik.values.investmentAmount ? Number(formik.values.investmentAmount).toLocaleString() : '0'}
                        </Typography>
                      </Grid>

                      <Grid item xs={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Funding
                        </Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant="body1">
                          Equity Trust IRA
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select IRA Account for Funding</InputLabel>
                  <Select
                    name="iraAccountForFunding"
                    value={formik.values.iraAccountForFunding}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.iraAccountForFunding && Boolean(formik.errors.iraAccountForFunding)}
                    label="Select IRA Account for Funding"
                    aria-label="Select IRA Account for Funding"
                  >
                    {iraAccounts.map((account) => (
                      <MenuItem key={account.value} value={account.value}>
                        <Box>
                          <Typography variant="body1">{account.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Available Balance: ${account.balance.toLocaleString()}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.iraAccountForFunding && formik.errors.iraAccountForFunding && (
                    <FormHelperText error>{formik.errors.iraAccountForFunding}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Important:</strong> Please review all investment details carefully. 
                    Once submitted, this investment request will be processed and funds will be 
                    allocated from your selected IRA account.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  // Success page after form submission
  if (activeStep === 4) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Congratulations!
          </Typography>
          <Typography variant="body1" paragraph>
            Your investment request has been submitted to Equity Trust Company. 
            Your confirmation number is <strong>{confirmationNumber}</strong>.
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<TrendingUp />}
              onClick={() => {
                // Navigate to investments dashboard
                console.log('Navigate to investments');
              }}
            >
              Review More Investments
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel 
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: completed ? 'primary.main' : active ? 'primary.light' : 'grey.300',
                      color: completed || active ? 'white' : 'grey.600',
                    }}
                  >
                    {completed ? <CheckCircle /> : 
                     index === 0 ? <TrendingUp /> :
                     index === 1 ? <Assignment /> :
                     index === 2 ? <MonetizationOn /> : 
                     <CheckCircle />}
                  </Box>
                )}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form Content */}
        <Box sx={{ minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
            size="large"
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Submitting...' : 
             activeStep === 0 ? 'Next' :
             activeStep === 1 ? 'Next' :
             activeStep === 2 ? 'Submit Investment' : 'Next'}
          </Button>
        </Box>

        {/* Form Validation Error Alert */}
        {formik.submitCount > 0 && Object.keys(formik.errors).length > 0 && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Please correct the errors above before proceeding.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default Invest;
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  CheckCircle,
  Download,
  Visibility,
  VisibilityOff,
  AccountBalance,
  TrendingUp,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Form data interface
interface FormData {
  // Step 1: Account Holder
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  legalAddress: string;
  city: string;
  state: string;
  zipCode: string;
  mailingAddress: string;
  mailingCity: string;
  mailingState: string;
  mailingZipCode: string;
  phoneNumber: string;
  employerName: string;
  employerAddress: string;
  ssn: string;
  citizenship: string;
  
  // Step 2: IRA Details
  iraType: string;
  accountPurpose: string;
  initialSourceOfFunds: string;
  ongoingSourceOfFunds: string;
  fundingMethod: string;
  estimatedFundingAmount: string;
  paymentMethod: string;
  
  // Step 3: Agreements
  custodialAgreement: boolean;
  feeSchedule: boolean;
  disclosureStatements: boolean;
  electronicSignature: boolean;
}

const steps = ['Account Holder', 'IRA', 'Sign'];

// Validation schemas for each step
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
  dateOfBirth: Yup.date()
    .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'Must be at least 18 years old')
    .required('Date of birth is required'),
  legalAddress: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .max(100, 'Address must be less than 100 characters')
    .required('Legal address is required'),
  city: Yup.string()
    .matches(/^[a-zA-Z\s-']+$/, 'Only letters, spaces, hyphens, and apostrophes allowed')
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    .required('ZIP code is required'),
  phoneNumber: Yup.string()
    .matches(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone number must be in format (XXX) XXX-XXXX')
    .required('Phone number is required'),
  ssn: Yup.string()
    .matches(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX')
    .required('Social Security Number is required'),
  citizenship: Yup.string().required('Citizenship status is required'),
});

const step2Schema = Yup.object({
  iraType: Yup.string().required('IRA type is required'),
  accountPurpose: Yup.string().required('Account purpose is required'),
  initialSourceOfFunds: Yup.string().required('Initial source of funds is required'),
  ongoingSourceOfFunds: Yup.string().required('Ongoing source of funds is required'),
  fundingMethod: Yup.string().required('Funding method is required'),
  estimatedFundingAmount: Yup.number()
    .min(1, 'Amount must be greater than 0')
    .max(1000000, 'Amount must be less than $1,000,000')
    .required('Estimated funding amount is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
});

const step3Schema = Yup.object({
  custodialAgreement: Yup.boolean().oneOf([true], 'You must accept the custodial agreement'),
  feeSchedule: Yup.boolean().oneOf([true], 'You must accept the fee schedule'),
  disclosureStatements: Yup.boolean().oneOf([true], 'You must accept the disclosure statements'),
  electronicSignature: Yup.boolean().oneOf([true], 'You must consent to electronic signature'),
});

const EAccount: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState<string>('');
  const [showSSN, setShowSSN] = useState(false);
  const [sameAsLegal, setSameAsLegal] = useState(true);

  const formik = useFormik<FormData>({
    initialValues: {
      // Step 1
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      legalAddress: '',
      city: '',
      state: '',
      zipCode: '',
      mailingAddress: '',
      mailingCity: '',
      mailingState: '',
      mailingZipCode: '',
      phoneNumber: '',
      employerName: '',
      employerAddress: '',
      ssn: '',
      citizenship: '',
      
      // Step 2
      iraType: '',
      accountPurpose: '',
      initialSourceOfFunds: '',
      ongoingSourceOfFunds: '',
      fundingMethod: '',
      estimatedFundingAmount: '',
      paymentMethod: '',
      
      // Step 3
      custodialAgreement: false,
      feeSchedule: false,
      disclosureStatements: false,
      electronicSignature: false,
    },
    validationSchema: activeStep === 0 ? step1Schema : activeStep === 1 ? step2Schema : step3Schema,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmit: async (_values) => {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
      } else {
        setIsSubmitting(true);
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          setApplicationNumber('20056731');
          setActiveStep(activeStep + 1);
        } catch (error) {
          console.error('Submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
  });

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  // Format SSN as user types
  const formatSSN = (value: string) => {
    const ssn = value.replace(/[^\d]/g, '');
    if (ssn.length <= 3) return ssn;
    if (ssn.length <= 5) return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  };

  // Copy legal address to mailing address
  const handleSameAsLegalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsLegal(event.target.checked);
    if (event.target.checked) {
      formik.setFieldValue('mailingAddress', formik.values.legalAddress);
      formik.setFieldValue('mailingCity', formik.values.city);
      formik.setFieldValue('mailingState', formik.values.state);
      formik.setFieldValue('mailingZipCode', formik.values.zipCode);
    } else {
      formik.setFieldValue('mailingAddress', '');
      formik.setFieldValue('mailingCity', '');
      formik.setFieldValue('mailingState', '');
      formik.setFieldValue('mailingZipCode', '');
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Personal Information
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                  helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ 'aria-label': 'Date of Birth' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Citizenship Status</InputLabel>
                  <Select
                    name="citizenship"
                    value={formik.values.citizenship}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.citizenship && Boolean(formik.errors.citizenship)}
                    label="Citizenship Status"
                    aria-label="Citizenship Status"
                  >
                    <MenuItem value="us_citizen">US Citizen</MenuItem>
                    <MenuItem value="permanent_resident">Permanent Resident</MenuItem>
                    <MenuItem value="non_resident">Non-Resident Alien</MenuItem>
                  </Select>
                  {formik.touched.citizenship && formik.errors.citizenship && (
                    <FormHelperText error>{formik.errors.citizenship}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="legalAddress"
                  label="Legal Address"
                  value={formik.values.legalAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.legalAddress && Boolean(formik.errors.legalAddress)}
                  helperText={formik.touched.legalAddress && formik.errors.legalAddress}
                  required
                  inputProps={{ 'aria-label': 'Legal Address' }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="city"
                  label="City"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                  required
                  inputProps={{ 'aria-label': 'City' }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    label="State"
                    aria-label="State"
                  >
                    {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'].map((state) => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </Select>
                  {formik.touched.state && formik.errors.state && (
                    <FormHelperText error>{formik.errors.state}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="zipCode"
                  label="ZIP Code"
                  value={formik.values.zipCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                  helperText={formik.touched.zipCode && formik.errors.zipCode}
                  required
                  inputProps={{ 'aria-label': 'ZIP Code', maxLength: 10 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsLegal}
                      onChange={handleSameAsLegalChange}
                      aria-label="Mailing address same as legal address"
                    />
                  }
                  label="Mailing address is the same as legal address"
                />
              </Grid>

              {!sameAsLegal && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="mailingAddress"
                      label="Mailing Address"
                      value={formik.values.mailingAddress}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      inputProps={{ 'aria-label': 'Mailing Address' }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      name="mailingCity"
                      label="Mailing City"
                      value={formik.values.mailingCity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      inputProps={{ 'aria-label': 'Mailing City' }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>Mailing State</InputLabel>
                      <Select
                        name="mailingState"
                        value={formik.values.mailingState}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Mailing State"
                        aria-label="Mailing State"
                      >
                        {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'].map((state) => (
                          <MenuItem key={state} value={state}>{state}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      name="mailingZipCode"
                      label="Mailing ZIP Code"
                      value={formik.values.mailingZipCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      inputProps={{ 'aria-label': 'Mailing ZIP Code', maxLength: 10 }}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  value={formik.values.phoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    formik.setFieldValue('phoneNumber', formatted);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  required
                  placeholder="(XXX) XXX-XXXX"
                  inputProps={{ 'aria-label': 'Phone Number' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="ssn"
                  label="Social Security Number"
                  type={showSSN ? 'text' : 'password'}
                  value={formik.values.ssn}
                  onChange={(e) => {
                    const formatted = formatSSN(e.target.value);
                    formik.setFieldValue('ssn', formatted);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.ssn && Boolean(formik.errors.ssn)}
                  helperText={formik.touched.ssn && formik.errors.ssn}
                  required
                  placeholder="XXX-XX-XXXX"
                  inputProps={{ 'aria-label': 'Social Security Number' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle SSN visibility"
                          onClick={() => setShowSSN(!showSSN)}
                          edge="end"
                        >
                          {showSSN ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="employerName"
                  label="Employer Name / Income Source"
                  value={formik.values.employerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  inputProps={{ 'aria-label': 'Employer Name or Income Source' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="employerAddress"
                  label="Employer Address"
                  value={formik.values.employerAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  inputProps={{ 'aria-label': 'Employer Address' }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom>
              IRA Account Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select Type of IRA</InputLabel>
                  <Select
                    name="iraType"
                    value={formik.values.iraType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.iraType && Boolean(formik.errors.iraType)}
                    label="Select Type of IRA"
                    aria-label="Select Type of IRA"
                  >
                    <MenuItem value="traditional">Traditional IRA</MenuItem>
                    <MenuItem value="roth">Roth IRA</MenuItem>
                    <MenuItem value="sep">SEP IRA</MenuItem>
                    <MenuItem value="simple">SIMPLE IRA</MenuItem>
                  </Select>
                  {formik.touched.iraType && formik.errors.iraType && (
                    <FormHelperText error>{formik.errors.iraType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select Account Purpose</InputLabel>
                  <Select
                    name="accountPurpose"
                    value={formik.values.accountPurpose}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.accountPurpose && Boolean(formik.errors.accountPurpose)}
                    label="Select Account Purpose"
                    aria-label="Select Account Purpose"
                  >
                    <MenuItem value="retirement">Retirement Savings</MenuItem>
                    <MenuItem value="rollover">401(k) Rollover</MenuItem>
                    <MenuItem value="transfer">IRA Transfer</MenuItem>
                    <MenuItem value="conversion">Roth Conversion</MenuItem>
                  </Select>
                  {formik.touched.accountPurpose && formik.errors.accountPurpose && (
                    <FormHelperText error>{formik.errors.accountPurpose}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select Initial Source of Funds</InputLabel>
                  <Select
                    name="initialSourceOfFunds"
                    value={formik.values.initialSourceOfFunds}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.initialSourceOfFunds && Boolean(formik.errors.initialSourceOfFunds)}
                    label="Select Initial Source of Funds"
                    aria-label="Select Initial Source of Funds"
                  >
                    <MenuItem value="employment_income">Employment Income</MenuItem>
                    <MenuItem value="self_employment">Self-Employment Income</MenuItem>
                    <MenuItem value="rollover_401k">401(k) Rollover</MenuItem>
                    <MenuItem value="ira_transfer">IRA Transfer</MenuItem>
                    <MenuItem value="savings">Personal Savings</MenuItem>
                    <MenuItem value="gift">Gift</MenuItem>
                    <MenuItem value="inheritance">Inheritance</MenuItem>
                  </Select>
                  {formik.touched.initialSourceOfFunds && formik.errors.initialSourceOfFunds && (
                    <FormHelperText error>{formik.errors.initialSourceOfFunds}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select Ongoing Source of Funds</InputLabel>
                  <Select
                    name="ongoingSourceOfFunds"
                    value={formik.values.ongoingSourceOfFunds}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.ongoingSourceOfFunds && Boolean(formik.errors.ongoingSourceOfFunds)}
                    label="Select Ongoing Source of Funds"
                    aria-label="Select Ongoing Source of Funds"
                  >
                    <MenuItem value="employment_income">Employment Income</MenuItem>
                    <MenuItem value="self_employment">Self-Employment Income</MenuItem>
                    <MenuItem value="periodic_contributions">Periodic Contributions</MenuItem>
                    <MenuItem value="automatic_rollover">Automatic Rollover</MenuItem>
                    <MenuItem value="none">No Ongoing Contributions</MenuItem>
                  </Select>
                  {formik.touched.ongoingSourceOfFunds && formik.errors.ongoingSourceOfFunds && (
                    <FormHelperText error>{formik.errors.ongoingSourceOfFunds}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select IRA Funding Method</InputLabel>
                  <Select
                    name="fundingMethod"
                    value={formik.values.fundingMethod}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fundingMethod && Boolean(formik.errors.fundingMethod)}
                    label="Select IRA Funding Method"
                    aria-label="Select IRA Funding Method"
                  >
                    <MenuItem value="ach_transfer">ACH Bank Transfer</MenuItem>
                    <MenuItem value="wire_transfer">Wire Transfer</MenuItem>
                    <MenuItem value="check">Check</MenuItem>
                    <MenuItem value="rollover">Direct Rollover</MenuItem>
                    <MenuItem value="trustee_transfer">Trustee-to-Trustee Transfer</MenuItem>
                  </Select>
                  {formik.touched.fundingMethod && formik.errors.fundingMethod && (
                    <FormHelperText error>{formik.errors.fundingMethod}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="estimatedFundingAmount"
                  label="Estimated Funding Amount"
                  type="number"
                  value={formik.values.estimatedFundingAmount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.estimatedFundingAmount && Boolean(formik.errors.estimatedFundingAmount)}
                  helperText={formik.touched.estimatedFundingAmount && formik.errors.estimatedFundingAmount}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  inputProps={{ 'aria-label': 'Estimated Funding Amount', min: 1, max: 1000000 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select IRA Payment Method</InputLabel>
                  <Select
                    name="paymentMethod"
                    value={formik.values.paymentMethod}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.paymentMethod && Boolean(formik.errors.paymentMethod)}
                    label="Select IRA Payment Method"
                    aria-label="Select IRA Payment Method"
                  >
                    <MenuItem value="one_time">One-time Payment</MenuItem>
                    <MenuItem value="monthly">Monthly Automatic</MenuItem>
                    <MenuItem value="quarterly">Quarterly Automatic</MenuItem>
                    <MenuItem value="annual">Annual Contribution</MenuItem>
                  </Select>
                  {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                    <FormHelperText error>{formik.errors.paymentMethod}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Review and Sign Documents
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3 }}>
              Choose an available document to view and/or sign.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1">
                        Equity Trust Custodial Account Agreement
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => window.open('/documents/custodial-agreement.pdf', '_blank')}
                        aria-label="View Custodial Account Agreement"
                      >
                        View
                      </Button>
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="custodialAgreement"
                          checked={formik.values.custodialAgreement}
                          onChange={formik.handleChange}
                          color="primary"
                          aria-label="I have read and agree to the Custodial Account Agreement"
                        />
                      }
                      label="I have read and agree to the Custodial Account Agreement"
                    />
                    {formik.touched.custodialAgreement && formik.errors.custodialAgreement && (
                      <Typography color="error" variant="caption" display="block">
                        {formik.errors.custodialAgreement}
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
                        IRA Fee Schedule
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => window.open('/documents/fee-schedule.pdf', '_blank')}
                        aria-label="View IRA Fee Schedule"
                      >
                        View
                      </Button>
                    </Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="feeSchedule"
                          checked={formik.values.feeSchedule}
                          onChange={formik.handleChange}
                          color="primary"
                          aria-label="I have read and agree to the IRA Fee Schedule"
                        />
                      }
                      label="I have read and agree to the IRA Fee Schedule"
                    />
                    {formik.touched.feeSchedule && formik.errors.feeSchedule && (
                      <Typography color="error" variant="caption" display="block">
                        {formik.errors.feeSchedule}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="disclosureStatements"
                          checked={formik.values.disclosureStatements}
                          onChange={formik.handleChange}
                          color="primary"
                          aria-label="I acknowledge receipt of disclosure statements"
                        />
                      }
                      label="I acknowledge receipt of Traditional, Roth, and SEP IRA Account Agreement Disclosure Statements"
                    />
                    {formik.touched.disclosureStatements && formik.errors.disclosureStatements && (
                      <Typography color="error" variant="caption" display="block">
                        {formik.errors.disclosureStatements}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="electronicSignature"
                          checked={formik.values.electronicSignature}
                          onChange={formik.handleChange}
                          color="primary"
                          aria-label="I consent to electronic signature and delivery"
                        />
                      }
                      label="I consent to electronic signature and electronic delivery of documents"
                    />
                    {formik.touched.electronicSignature && formik.errors.electronicSignature && (
                      <Typography color="error" variant="caption" display="block">
                        {formik.errors.electronicSignature}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Electronic Signature Consent:</strong> By checking the boxes above and clicking "Submit IRA Application", 
                    you are providing your electronic signature and consent to be legally bound by the terms and conditions 
                    of the agreements. This electronic signature has the same legal effect as a handwritten signature.
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
  if (activeStep === steps.length) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" color="primary" gutterBottom>
                Congratulations!
              </Typography>
              <Typography variant="body1" paragraph>
                Your IRA Application has been sent to Equity Trust Company. 
                Your new IRA Account Number is <strong>{applicationNumber}</strong>.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                You've opened your IRA retirement account
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Download color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Transfer funds in"
                    secondary="Transfer funds from your existing Traditional, Roth, SEP or SIMPLE IRA"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <TrendingUp color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Initiate a Rollover"
                    secondary="Rollover a rollover from an old 401k and 403b"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <AccountBalance color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Start by contributing"
                    secondary="Make your first IRA annual contribution with your bank account"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
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
            <Step key={label}>
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
                    {completed ? <CheckCircle /> : index + 1}
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
            type="submit"
            onClick={()=>formik.handleSubmit}
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Submitting...' : 
             activeStep === steps.length - 1 ? 'Submit IRA Application' : 'Next'}
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

export default EAccount;
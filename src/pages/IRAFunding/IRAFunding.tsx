import React, { useState, useCallback } from 'react';
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
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  InputAdornment,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Edit,
  CloudUpload,
  Delete,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Form data interface
interface TransferFormData {
  // Step 1: Transfer Information
  transferType: string;
  expressTransferService: boolean;
  originalAccountType: string;
  isInherited: string;
  estimatedAmount: string;
  
  // Step 2: Custodian Information
  custodialAccountNumber: string;
  currentAccountRegistrationName: string;
  selectedCustodian: string;
  custodianName: string;
  custodianAddress: string;
  custodianAddress2: string;
  custodianCity: string;
  custodianState: string;
  custodianZip: string;
  custodianPhone: string;
  custodianFax: string;
  
  // Step 3: Summary and Documents
  uploadedDocuments: File[];
}

const steps = ['Transfer Information', 'Custodian Information', 'Summary'];

// Mock custodian data (would come from API)
const custodianOptions = [
  {
    value: 'edward_jones',
    name: 'Edward D Jones & Co.',
    address: '12555 Manchester Road',
    address2: '',
    city: 'St. Louis',
    state: 'Missouri',
    zip: '63131',
    phone: '400-337-6892',
    fax: '400-337-2505 / 877-479-6325'
  },
  {
    value: 'fidelity',
    name: 'Fidelity Investments',
    address: '245 Summer Street',
    address2: '',
    city: 'Boston',
    state: 'Massachusetts', 
    zip: '02210',
    phone: '800-343-3548',
    fax: '617-476-6150'
  },
  {
    value: 'vanguard',
    name: 'Vanguard Group',
    address: '100 Vanguard Blvd',
    address2: '',
    city: 'Malvern',
    state: 'Pennsylvania',
    zip: '19355',
    phone: '877-662-7447',
    fax: '610-669-6000'
  }
];

// Validation schemas
const step1Schema = Yup.object({
  transferType: Yup.string().required('Transfer type is required'),
  originalAccountType: Yup.string().required('Original account type is required'),
  isInherited: Yup.string().required('Please specify if account was inherited'),
  estimatedAmount: Yup.number()
    .min(1, 'Amount must be greater than 0')
    .max(10000000, 'Amount must be less than $10,000,000')
    .required('Estimated amount is required'),
});

const step2Schema = Yup.object({
  custodialAccountNumber: Yup.string()
    .required('Custodial account number is required'),
  currentAccountRegistrationName: Yup.string()
    .required('Current account registration name is required'),
  selectedCustodian: Yup.string()
    .required('Please select a custodian'),
  custodianName: Yup.string()
    .required('Custodian name is required'),
  custodianAddress: Yup.string()
    .required('Custodian address is required'),
  custodianCity: Yup.string()
    .required('City is required'),
  custodianState: Yup.string()
    .required('State is required'),
  custodianZip: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format')
    .required('ZIP code is required'),
  custodianPhone: Yup.string()
    .required('Phone number is required'),
});

const step3Schema = Yup.object({});

const IRATransferForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const formik = useFormik<TransferFormData>({
    initialValues: {
      // Step 1
      transferType: '',
      expressTransferService: false,
      originalAccountType: '',
      isInherited: '',
      estimatedAmount: '',
      
      // Step 2
      custodialAccountNumber: '',
      currentAccountRegistrationName: '',
      selectedCustodian: '',
      custodianName: '',
      custodianAddress: '',
      custodianAddress2: '',
      custodianCity: '',
      custodianState: '',
      custodianZip: '',
      custodianPhone: '',
      custodianFax: '',
      
      // Step 3
      uploadedDocuments: [],
    },
    validationSchema: 
      activeStep === 0 ? step1Schema : 
      activeStep === 1 ? step2Schema : 
      step3Schema,
    validateOnChange: true,
    validateOnBlur: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSubmit: async (_values) => {
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setConfirmationNumber('AP1587689');
        setActiveStep(activeStep + 1);
      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle custodian selection
  const handleCustodianSelect = (custodianValue: string) => {
    const selectedCustodian = custodianOptions.find(c => c.value === custodianValue);
    
    if (selectedCustodian) {
      formik.setFieldValue('selectedCustodian', custodianValue);
      formik.setFieldValue('custodianName', selectedCustodian.name);
      formik.setFieldValue('custodianAddress', selectedCustodian.address);
      formik.setFieldValue('custodianAddress2', selectedCustodian.address2);
      formik.setFieldValue('custodianCity', selectedCustodian.city);
      formik.setFieldValue('custodianState', selectedCustodian.state);
      formik.setFieldValue('custodianZip', selectedCustodian.zip);
      formik.setFieldValue('custodianPhone', selectedCustodian.phone);
      formik.setFieldValue('custodianFax', selectedCustodian.fax);
    }
  };

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    formik.setFieldValue('uploadedDocuments', [...uploadedFiles, ...files]);
  }, [uploadedFiles, formik]);

  // Handle file removal
  const handleFileRemove = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    formik.setFieldValue('uploadedDocuments', newFiles);
  };

  // Handle next button
  const handleNext = async () => {
    const errors = await formik.validateForm();
    
    let currentStepFields: string[] = [];
    if (activeStep === 0) {
      currentStepFields = ['transferType', 'originalAccountType', 'isInherited', 'estimatedAmount'];
    } else if (activeStep === 1) {
      currentStepFields = ['custodialAccountNumber', 'currentAccountRegistrationName', 'selectedCustodian', 'custodianName', 'custodianAddress', 'custodianCity', 'custodianState', 'custodianZip', 'custodianPhone'];
    }
    
    const currentStepHasErrors = currentStepFields.some(field => errors[field as keyof TransferFormData]);
    
    if (currentStepHasErrors) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const touchedFields: any = {};
      currentStepFields.forEach(field => {
        touchedFields[field] = true;
      });
      formik.setTouched({ ...formik.touched, ...touchedFields });
      return;
    }
    
    if (activeStep < 2) {
      setActiveStep(activeStep + 1);
    } else {
      formik.handleSubmit();
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Transfer Information
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              When you are transferring from an existing account, please make sure you provide a statement or document that provides the following details:
              <List dense>
                <ListItem>• Name of your current custodian</ListItem>
                <ListItem>• Your name EXACTLY as it appears on your account registration (for example Mr. John Smith, Sr. versus Mr. John Smith, III)</ListItem>
                <ListItem>• List of current holdings in the account</ListItem>
                <ListItem>• Send forms that need to be filled out prior to submitting the transfer instructions to your new account</ListItem>
                <ListItem>• Please contact your current custodian to request that your transferring assets are liquidated (converted to cash positions)</ListItem>
              </List>
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Type of Transfer
                </Typography>
                <RadioGroup
                  name="transferType"
                  value={formik.values.transferType}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel 
                    value="full" 
                    control={<Radio />} 
                    label="Full - liquidate (sell) all asset holdings and transfer as cash to Equity" 
                  />
                  <FormControlLabel 
                    value="partial" 
                    control={<Radio />} 
                    label="Full - maintain all asset holdings and transfer to Equity" 
                  />
                  <FormControlLabel 
                    value="partial_cash" 
                    control={<Radio />} 
                    label="Partial" 
                  />
                </RadioGroup>
                {formik.touched.transferType && formik.errors.transferType && (
                  <Typography color="error" variant="caption">
                    {formik.errors.transferType}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Express Transfer Service provides priority processing of your transfer request, overnight mailing of transfer documents, and the ability to receive transfer funds via wire. The fee for this service is $75.00.
                </Alert>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="expressTransferService"
                      checked={formik.values.expressTransferService}
                      onChange={formik.handleChange}
                    />
                  }
                  label="Express Transfer Service"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Original Account Type</InputLabel>
                  <Select
                    name="originalAccountType"
                    value={formik.values.originalAccountType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.originalAccountType && Boolean(formik.errors.originalAccountType)}
                    label="Original Account Type"
                  >
                    <MenuItem value="traditional_ira">Traditional IRA</MenuItem>
                    <MenuItem value="roth_ira">Roth IRA</MenuItem>
                    <MenuItem value="sep_ira">SEP IRA</MenuItem>
                    <MenuItem value="simple_ira">SIMPLE IRA</MenuItem>
                    <MenuItem value="401k">401(k)</MenuItem>
                    <MenuItem value="403b">403(b)</MenuItem>
                    <MenuItem value="457">457 Plan</MenuItem>
                  </Select>
                  {formik.touched.originalAccountType && formik.errors.originalAccountType && (
                    <FormHelperText error>{formik.errors.originalAccountType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Transfer of a tax-deferred account (Traditional, SEP, SIMPLE, Qualified Plan) to a Roth IRA is a taxable event and cannot be completed online at this time. Please download the Conversion Form, complete, and submit to Equity Trust Company at help@trustetc.com.
                </Alert>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Was this account inherited?
                </Typography>
                <RadioGroup
                  name="isInherited"
                  value={formik.values.isInherited}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
                {formik.touched.isInherited && formik.errors.isInherited && (
                  <Typography color="error" variant="caption">
                    {formik.errors.isInherited}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="estimatedAmount"
                  label="Estimated Amount"
                  type="number"
                  value={formik.values.estimatedAmount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.estimatedAmount && Boolean(formik.errors.estimatedAmount)}
                  helperText={formik.touched.estimatedAmount && formik.errors.estimatedAmount}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Current Custodian Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="custodialAccountNumber"
                  label="Custodial Account Number"
                  value={formik.values.custodialAccountNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.custodialAccountNumber && Boolean(formik.errors.custodialAccountNumber)}
                  helperText={formik.touched.custodialAccountNumber && formik.errors.custodialAccountNumber}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="currentAccountRegistrationName"
                  label="Current Account Registration Name"
                  value={formik.values.currentAccountRegistrationName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.currentAccountRegistrationName && Boolean(formik.errors.currentAccountRegistrationName)}
                  helperText={formik.touched.currentAccountRegistrationName && formik.errors.currentAccountRegistrationName}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select Custodian</InputLabel>
                  <Select
                    name="selectedCustodian"
                    value={formik.values.selectedCustodian}
                    onChange={(e) => handleCustodianSelect(e.target.value)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.selectedCustodian && Boolean(formik.errors.selectedCustodian)}
                    label="Select Custodian"
                  >
                    {custodianOptions.map((custodian) => (
                      <MenuItem key={custodian.value} value={custodian.value}>
                        {custodian.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="other">Other (Manual Entry)</MenuItem>
                  </Select>
                  {formik.touched.selectedCustodian && formik.errors.selectedCustodian && (
                    <FormHelperText error>{formik.errors.selectedCustodian}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="custodianName"
                  label="Custodian Name"
                  value={formik.values.custodianName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.custodianName && Boolean(formik.errors.custodianName)}
                  helperText={formik.touched.custodianName && formik.errors.custodianName}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="custodianAddress"
                  label="Custodian Address"
                  value={formik.values.custodianAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.custodianAddress && Boolean(formik.errors.custodianAddress)}
                  helperText={formik.touched.custodianAddress && formik.errors.custodianAddress}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="custodianAddress2"
                  label="Custodian Address 2"
                  value={formik.values.custodianAddress2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="custodianCity"
                  label="City"
                  value={formik.values.custodianCity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.custodianCity && Boolean(formik.errors.custodianCity)}
                  helperText={formik.touched.custodianCity && formik.errors.custodianCity}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="custodianState"
                    value={formik.values.custodianState}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.custodianState && Boolean(formik.errors.custodianState)}
                    label="State"
                  >
                    {['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'].map((state) => (
                      <MenuItem key={state} value={state}>{state}</MenuItem>
                    ))}
                  </Select>
                  {formik.touched.custodianState && formik.errors.custodianState && (
                    <FormHelperText error>{formik.errors.custodianState}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="custodianZip"
                  label="Zip"
                  value={formik.values.custodianZip}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.custodianZip && Boolean(formik.errors.custodianZip)}
                  helperText={formik.touched.custodianZip && formik.errors.custodianZip}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="custodianPhone"
                  label="Custodian Phone"
                  value={formik.values.custodianPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.custodianPhone && Boolean(formik.errors.custodianPhone)}
                  helperText={formik.touched.custodianPhone && formik.errors.custodianPhone}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="custodianFax"
                  label="Custodian Fax"
                  value={formik.values.custodianFax}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Transfer Summary
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Transfer Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" color="text.secondary">Transfer Type</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>{formik.values.transferType === 'full' ? 'Full - Cash' : formik.values.transferType === 'partial' ? 'Full - Assets' : 'Partial'}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" color="text.secondary">Payment Delivery Method</Typography>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" color="text.secondary">IRA Account Type</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>{formik.values.originalAccountType.replace('_', ' ').toUpperCase()}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography>Wire</Typography>
                      </Grid>
                      
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" color="text.secondary">Estimated Amount</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography>${Number(formik.values.estimatedAmount || 0).toLocaleString()}</Typography>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button variant="outlined" size="small" startIcon={<Edit />}>
                        Edit Information
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Custodian Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Custodian Name</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>{formik.values.custodianName}</Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Custodian Account Number</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>{formik.values.custodialAccountNumber}</Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Custodian Fax</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>{formik.values.custodianFax}</Typography>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button variant="outlined" size="small" startIcon={<Edit />}>
                        Edit Information
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Upload Documents
                    </Typography>
                    
                    {uploadedFiles.length === 0 ? (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        No documents have been uploaded.
                      </Alert>
                    ) : (
                      <Box sx={{ mb: 2 }}>
                        {uploadedFiles.map((file, index) => (
                          <Chip
                            key={index}
                            label={file.name}
                            onDelete={() => handleFileRemove(index)}
                            deleteIcon={<Delete />}
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="outlined" size="small">
                        Skip Document Upload
                      </Button>
                      <Button
                        variant="contained"
                        component="label"
                        startIcon={<CloudUpload />}
                        size="small"
                      >
                        Upload Documents
                        <input
                          type="file"
                          hidden
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                        />
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  // Success page
  if (activeStep === 3) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Congratulations!
          </Typography>
          <Typography variant="body1" paragraph>
            Your transfer request has been submitted to Equity Trust Company. 
            Your confirmation number is <strong>{confirmationNumber}</strong>.
          </Typography>
          <Typography variant="body2" paragraph>
            Please check your inbox for an Equity Trust DocuSign email to complete this request.
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                // Navigate to investments dashboard
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
                      fontSize: '14px',
                      fontWeight: 'bold'
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
            onClick={handleNext}
            variant="contained"
            size="large"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Submitting...' : 
             activeStep === 0 ? 'Next' :
             activeStep === 1 ? 'Next' :
             'Submit Transfer Request'}
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

export default IRATransferForm;
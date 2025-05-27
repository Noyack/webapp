import { useContext, useState } from 'react'
import { Typography, Button, RadioGroup, FormControlLabel, Radio, Stepper, Step, StepLabel } from '@mui/material'
import Logo from '../assets/noyackLogo.png'
import { UserCreationData, LocationData, RiskTolerance } from '../types'
import {  authService } from '../services'
import { UserContext } from '../context/UserContext'

// Sample country list for dropdown
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' },
  // Add more countries as needed
].sort((a, b) => a.name.localeCompare(b.name));

// Sample US states for dropdown
const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
].sort((a, b) => a.name.localeCompare(b.name));

// Basic mapping for other popular countries - this would be expanded in a real application
const STATES_BY_COUNTRY: Record<string, Array<{code: string, name: string}>> = {
  'US': US_STATES,
  'CA': [
    { code: 'AB', name: 'Alberta' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'MB', name: 'Manitoba' },
    { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'NS', name: 'Nova Scotia' },
    { code: 'ON', name: 'Ontario' },
    { code: 'PE', name: 'Prince Edward Island' },
    { code: 'QC', name: 'Quebec' },
    { code: 'SK', name: 'Saskatchewan' },
    { code: 'NT', name: 'Northwest Territories' },
    { code: 'NU', name: 'Nunavut' },
    { code: 'YT', name: 'Yukon' },
  ],
  // Add other countries as needed
};

function Creation({isMobile}:{isMobile:boolean}) {

  const {userInfo} = useContext(UserContext)

  const desktopView= "grid grid-cols-[2fr_1fr] max-h-screen overflow-auto bg-[#F8F8F8]"
  const mobileView= "max-h-screen overflow-auto bg-[#F8F8F8]"
  
  // Form data states with proper typing
  const [userData, setUserData] = useState<UserCreationData>({
    age: undefined,
    location: {
      city: "",
      state: "",
      country: "",
      postalCode: ""
    },
    investmentAccreditation: false,
    investmentGoals: [],
    riskTolerance: "moderate"
  });
  
  // Multistep form state
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  
  // States management for location selection
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [availableStates, setAvailableStates] = useState<Array<{code: string, name: string}>>([]);
  
  // Steps in the onboarding process
  const steps: string[] = [
    'Personal Information',
    'Location Details',
    'Investor Profile'
  ];
  
  // Handle field changes
  const handleChange = <K extends keyof UserCreationData>(field: K, value: UserCreationData[K]) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle manual location input
  const handleLocationInput = (field: keyof LocationData, value: string) => {
    setUserData(prev => ({
      ...prev,
      location: {
        ...(prev.location as LocationData),
        [field]: value
      }
    }));
  };

  // Handle country selection and update available states
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const countryName = COUNTRIES.find(c => c.code === countryCode)?.name || "";
    
    setSelectedCountryCode(countryCode);
    handleLocationInput('country', countryName);
    
    // Reset state when country changes
    handleLocationInput('state', '');
    
    // Update available states based on country
    if (STATES_BY_COUNTRY[countryCode]) {
      setAvailableStates(STATES_BY_COUNTRY[countryCode]);
    } else {
      setAvailableStates([]);
    }
  };
  
  // Handle investment goals selection
  const handleGoalToggle = (goal: string) => {
    setUserData(prev => {
      const currentGoals = prev.investmentGoals || [];
      if (currentGoals.includes(goal)) {
        return {
          ...prev,
          investmentGoals: currentGoals.filter(g => g !== goal)
        };
      } else {
        return {
          ...prev,
          investmentGoals: [...currentGoals, goal]
        };
      }
    });
  };
  
  // Handle form navigation
  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Validate current step
  const validateStep = (): boolean => {
    setError(null);
    
    switch(activeStep) {
      case 0: // Personal Information
        if (!userData.age) {
          setError("Please fill all required fields");
          return false;
        }
        return true;
        
      case 1: { // Location
        const locData = userData.location as LocationData;
        if (!locData.city || !locData.country) {
          setError("Please provide at least your city and country");
          return false;
        }
        return true;
      }
        
      case 2: // Investor Profile
        // Make sure at least one investment goal is selected
        if (!userData.investmentGoals || userData.investmentGoals.length === 0) {
          setError("Please select at least one investment goal");
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };
  
  // Handle step transitions
  const handleStepAction = () => {
    if (validateStep()) {
      if (activeStep < steps.length - 1) {
        handleNext();
      } else {
        handleSubmit();
      }
    }
  };
  
  // Handle final submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      if(userInfo?.id)
      await authService.completeOnboarding(userInfo.id, userData) 
      // apiClient.patch<OnboardingProps>('/users/onboarding', userData)
      
      setCompleted(true);
      setLoading(false);
      window.location.reload()
    } catch (error) {
      console.error("Error creating user profile:", error);
      setError("Failed to create your profile. Please try again.");
      setLoading(false);
    }
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch(activeStep) {
      case 0:
        return (
          <div className='flex flex-col gap-[13px]'>
            <Typography variant="h6" className="text-[#011E5A] mb-4">Tell us about yourself</Typography>
            <input 
              value={userData.age || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  handleChange('age', undefined);
                } else {
                  handleChange('age', parseInt(val, 10));
                }
              }} 
              className='sign-input' 
              type="number" 
              placeholder='Age'
              required
            />
          </div>
        );
        
      case 1:
        return (
          <div className='flex flex-col gap-[13px]'>
            <Typography variant="h6" className="text-[#011E5A] mb-4">Where are you located?</Typography>
            
            <div className="flex flex-col gap-3">
              {/* Country Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  value={selectedCountryCode}
                  onChange={handleCountryChange}
                  className='sign-input w-full'
                  required
                >
                  <option value="">Select a country</option>
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* State/Province Selection (if available) */}
              {availableStates.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <select
                    value={availableStates.find(s => s.name === (userData.location as LocationData).state)?.code || ""}
                    onChange={(e) => {
                      const stateName = availableStates.find(s => s.code === e.target.value)?.name || "";
                      handleLocationInput('state', stateName);
                    }}
                    className='sign-input w-full'
                  >
                    <option value="">Select a state/province</option>
                    {availableStates.map(state => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {/* Manual state input if no predefined states */}
              {selectedCountryCode && availableStates.length === 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province/Region
                  </label>
                  <input 
                    value={(userData.location as LocationData).state}
                    onChange={(e) => handleLocationInput('state', e.target.value)} 
                    className='sign-input' 
                    type="text" 
                    placeholder='State/Province/Region (if applicable)'
                  />
                </div>
              )}
              
              {/* City input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input 
                  value={(userData.location as LocationData).city}
                  onChange={(e) => handleLocationInput('city', e.target.value)} 
                  className='sign-input' 
                  type="text" 
                  placeholder='City'
                  required 
                />
              </div>
              
              {/* Postal code input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal/ZIP Code
                </label>
                <input 
                  value={(userData.location as LocationData).postalCode}
                  onChange={(e) => handleLocationInput('postalCode', e.target.value)} 
                  className='sign-input' 
                  type="text" 
                  placeholder='Postal/ZIP Code'
                />
              </div>
            </div>
            
            {/* Show the selected location summary */}
            {(userData.location as LocationData).city && (userData.location as LocationData).country && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <Typography variant="subtitle2" className="font-medium text-green-800">Selected Location:</Typography>
                <Typography variant="body2" className="text-green-700">
                  {(userData.location as LocationData).city}
                  {(userData.location as LocationData).state && `, ${(userData.location as LocationData).state}`}
                  {(userData.location as LocationData).country && `, ${(userData.location as LocationData).country}`}
                </Typography>
                {(userData.location as LocationData).postalCode && (
                  <Typography variant="body2" className="text-green-700">
                    Postal Code: {(userData.location as LocationData).postalCode}
                  </Typography>
                )}
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className='flex flex-col gap-[16px]'>
            <Typography variant="h6" className="text-[#011E5A] mb-2">Investor Profile</Typography>
            
            <div className="mb-4">
              <Typography variant="body1" className="font-medium mb-2">Are you an accredited investor?</Typography>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <RadioGroup
                  value={userData.investmentAccreditation ? 'yes' : 'no'}
                  onChange={(e) => handleChange('investmentAccreditation', e.target.value === 'yes')}
                >
                  <FormControlLabel value="no" control={<Radio color="primary" />} label="No, I am not an accredited investor" />
                  <FormControlLabel 
                    value="yes" 
                    control={<Radio color="primary" />} 
                    label="Yes, I have made over $200,000 individually, or $300,000 as a household, over the last two years, and/or have a net worth over $1,000,000 excluding the value of my primary residence." 
                  />
                </RadioGroup>
              </div>
            </div>
            
            <div className="mb-4">
              <Typography variant="body1" className="font-medium mb-2">What are your investment goals? (Select all that apply)</Typography>
              <div className="flex flex-wrap gap-2">
                {['Wealth Growth', 'Passive Income', 'Retirement Planning', 'Tax Benefits', 'Portfolio Diversification'].map(goal => (
                  <div 
                    key={goal}
                    onClick={() => handleGoalToggle(goal)}
                    className={`cursor-pointer rounded-full py-2 px-4 ${
                      userData.investmentGoals?.includes(goal) 
                        ? 'bg-[#2E7D32] text-white' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {goal}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Typography variant="body1" className="font-medium mb-2">What is your risk tolerance?</Typography>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <RadioGroup
                  value={userData.riskTolerance}
                  onChange={(e) => handleChange('riskTolerance', e.target.value as RiskTolerance)}
                >
                  <FormControlLabel value="conservative" control={<Radio color="primary" />} label="Conservative - Prefer stability and lower risk" />
                  <FormControlLabel value="moderate" control={<Radio color="primary" />} label="Moderate - Balance between growth and stability" />
                  <FormControlLabel value="aggressive" control={<Radio color="primary" />} label="Aggressive - Willing to accept higher risk for higher potential returns" />
                </RadioGroup>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // If onboarding is completed, show success screen
  if (completed) {
    return (
      <div className={isMobile?`${mobileView}`:`${desktopView}`}>
        <div className='flex justify-center items-center'>
          <div className='flex flex-col items-center gap-8 max-w-md text-center'>
            <div className='w-24 h-24 bg-[#2E7D32] rounded-full flex items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <Typography variant="h4" className="text-[#011E5A] font-bold">
              Profile Created Successfully!
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Thank you for completing your profile. You're all set to explore Noyack's investment opportunities.
            </Typography>
            <Button 
              variant="contained"
              color="primary"
              size="large"
              onClick={() => window.location.href = '/'}
              className="mt-4 bg-[#011E5A] py-3 px-6"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
        {isMobile && <div className="creation-form-aside h-screen sticky top-0 flex justify-center items-center p-8">
          <div className="flex gap-[35px]">
            <img src={Logo} alt="Noyack Logo" className="w-50 creation-aside"/>
          </div>
        </div>}
      </div>
    );
  }

  return (
    <div className={isMobile?`${mobileView}`:`${desktopView}`}> 
      {/* Main Content - Flexible middle column */}
      <div className='flex justify-center overflow-auto p-5'>
        <main className=" py-6 px-5 flex flex-col gap-[30px] justify-center max-w-xl pb-6">
          <div className="mb-4">
            <img src={Logo} alt="Noyack Logo" className="w-40 mb-8"/>
            <Typography variant='h4' className='text-[30px] font-bold text-[#011E5A]'>
              Complete Your Profile
            </Typography>
            <Typography variant='subtitle1' className='text-gray-600'>
              Help us customize your investment experience.
            </Typography>
          </div>
          
          <Stepper activeStep={activeStep} className="mb-8">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            {renderStepContent()}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              color="primary"
              className="min-w-[100px]"
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleStepAction}
              className="min-w-[100px] bg-[#2E7D32]"
              disabled={loading}
            >
              {loading ? 'Processing...' : activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </main>
      </div>

      {/* Aside - Fixed width */}
     {!isMobile && <div className="creation-form-aside h-screen sticky top-0 flex justify-center items-center p-8">
        <div className="flex gap-[35px]">
          <img src={Logo} alt="Noyack Logo" className="w-50 creation-aside"/>
        </div>
      </div>}
    </div>
  )
}

export default Creation
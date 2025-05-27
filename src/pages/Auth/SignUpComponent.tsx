import { Typography, Button, Divider } from '@mui/material'
import { useState } from 'react'
import Logo from '../../assets/noyackLogo.png'
import AsideImage from '../../assets/sign-image.jpg'
import { useSignUp } from '@clerk/clerk-react'
import { ClerkError } from '../../types'
import { Google, Facebook } from '@mui/icons-material'

// Define the OAuth strategies as string literals to match Clerk's expected values
type OAuthStrategy = 'oauth_google' | 'oauth_facebook' | 'oauth_microsoft';


// Microsoft icon component
const MicrosoftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
  </svg>
)

function SignUpComponent({ isMobile, onSwitchToSignIn }: {isMobile:boolean, onSwitchToSignIn:()=>void}) {
  const { isLoaded, signUp, setActive } = useSignUp();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
    const desktopView="min-h-screen grid grid-cols-[2fr_1fr] bg-[#F8F8F8] "
  const MobileView="min-h-screen  bg-[#F8F8F8] "

  // Handle sign up form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    if (!isLoaded) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');

      // Start the sign-up process
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification();
      
      // Set pending verification to true to show the verification form
      setPendingVerification(true);
      setLoading(false);
    } catch (err:unknown) {
        const clerkError = err as ClerkError
        console.error('Error during sign up:', err);
        setError(clerkError.errors?.[0]?.message || 'Something went wrong. Please try again.');
        setLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    
    if (!isLoaded || !pendingVerification) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Attempt to verify the email
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      
      if (completeSignUp.status !== 'complete') {
        // Verification failed
        setError('Verification failed. Please try again.');
        setLoading(false);
        return;
      }

      // If we get here, verification was successful
      await setActive({ session: completeSignUp.createdSessionId });
      
      // Redirect to home page or dashboard
      window.location.replace('/');
    } catch (err) {
        const clerkError = err as ClerkError
        console.error('Error during verification:', err);
        setError(clerkError.errors?.[0]?.message || 'Verification failed. Please try again.');
        setLoading(false);
    }
  };

  // Handle SSO sign-up with providers
  const handleSSOSignUp = async (strategy: OAuthStrategy) => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/'
      });
      
      // Note: The redirect will happen automatically, so we don't need to set loading to false
    } catch (err) {
      console.error(`Error signing up with ${strategy}:`, err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'errors' in err) {
        const clerkError = err as ClerkError;
        setError(clerkError.errors?.[0]?.message || `Failed to sign up with ${strategy}. Please try again.`);
      } else {
        setError(`Failed to sign up with ${strategy}. Please try again.`);
      }
      setLoading(false);
    }
  };

  return (
    <div className={isMobile?MobileView:desktopView}> 
      {/* Main Content - Flexible middle column */}
      <div className='flex justify-center'>
        <main className={`h-screen py-6 px-5 flex flex-col ${isMobile?"gap-[10px]":"gap-[50px]"} justify-center content-center`}>
          <div className="flex flex-col gap-10">
            <div className={`flex ${isMobile?"flex-col w-full items-center":"gap-[35px]"} `}>
              <img src={Logo} className="w-50" alt="Noyack Logo"/>
              
              <div className='flex gap-[5px] items-center'>
                <Typography>Already have an account?</Typography>
                <div className='text-[#009FE3]'>
                  <button 
                    onClick={onSwitchToSignIn} 
                    className="text-[#009FE3] hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className=''>
            <Typography variant={isMobile?'h4':'h2'} className='font-bold'>Explore our funds today</Typography>
            <Typography variant='caption' className='text-[16px]'>Create your free account and view our funds in just a few steps.</Typography>
          </div>

          {!pendingVerification ? (
            // Sign up form
            <div className="sign-up-container">
              <form onSubmit={handleSubmit} className='sign-up-form'>
                <div className='flex flex-col gap-[13px]'>
                  <div className='flex gap-[8px]'>
                    <input 
                      className='sign-input max-w-[220px]' 
                      type="text" 
                      placeholder='First Name'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <input 
                      className='sign-input max-w-[220px]' 
                      type="text" 
                      placeholder='Last Name'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <input 
                    className='sign-input' 
                    type="email" 
                    placeholder='youremail@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input 
                    className='sign-input' 
                    type="password" 
                    placeholder='Create a password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                
                {error && (
                  <div className='text-red-500 mt-2 text-center'>
                    {error}
                  </div>
                )}
                
                <div className="text-center mt-3">
                  <button 
                    type="submit" 
                    className='text-lg py-2 w-full' 
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create An Account'}
                  </button>
                </div>
              </form>

              <div className="my-4 flex items-center">
                <Divider className="flex-grow" />
                <Typography className="px-3 text-gray-500">or</Typography>
                <Divider className="flex-grow" />
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  variant="outlined"
                  startIcon={<Google />}
                  onClick={() => handleSSOSignUp("oauth_google")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  fullWidth
                >
                  Sign up with Google
                </Button>
                
                <Button 
                  variant="outlined"
                  startIcon={<MicrosoftIcon />}
                  onClick={() => handleSSOSignUp("oauth_microsoft")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  fullWidth
                >
                  Sign up with Microsoft
                </Button>
                
                <Button 
                  variant="outlined"
                  startIcon={<Facebook />}
                  onClick={() => handleSSOSignUp("oauth_facebook")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  fullWidth
                >
                  Sign up with Facebook
                </Button>
              </div>
              
              <Typography variant='caption' className='mt-4 text-center text-gray-500 block'>
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </Typography>
            </div>
          ) : (
            // Verification form
            <form onSubmit={handleVerifyCode} className='sign-up-form'>
              <Typography className='text-center mb-4'>
                We've sent a verification code to your email. Please enter it below to complete your registration.
              </Typography>
              
              <input 
                className='sign-input' 
                type="text" 
                placeholder='Verification Code'
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              
              {error && (
                <div className='text-red-500 mt-2 text-center'>
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                className='text-lg py-2' 
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
              
              <button 
                type="button" 
                onClick={() => setPendingVerification(false)} 
                className='text-blue-500 underline'
              >
                Go back
              </button>
            </form>
          )}
        </main>
      </div>

      {/* Aside - Fixed width */}
      {!isMobile && <div className="form-aside h-screen sticky top-0 flex justify-center items-center p-8 ">
        <img src={AsideImage} className="aside-img rounded-[25px] object-cover" alt="Sign up imagery"/>
      </div>}
    </div>
  )
}

export default SignUpComponent
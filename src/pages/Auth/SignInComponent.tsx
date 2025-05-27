import { useState } from 'react'
import { Typography, Button, Divider } from '@mui/material'
import Logo from '../../assets/noyackLogo.png'
import AsideImage from '../../assets/sign-image.jpg'
import { useSignIn } from '@clerk/clerk-react'
import { Google, Facebook } from '@mui/icons-material'
import { ClerkError } from '../../types'

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

function SignInComponent({ isMobile, onSwitchToSignUp }: {isMobile:boolean, onSwitchToSignUp:()=>void}) {
  const { isLoaded, signIn, setActive } = useSignIn();
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const desktopView="min-h-screen grid grid-cols-[2fr_1fr] bg-[#F8F8F8] "
  const MobileView="min-h-screen  bg-[#F8F8F8] "

  // Handle email/password sign in form submission
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        // Sign in was successful
        await setActive({ session: result.createdSessionId });
        window.location.replace('/'); // Navigate to the dashboard or home page
      } else {
        // Sign in requires additional steps, such as 2FA
        // For now, just show an error, but you could handle this more gracefully
        setError('Additional verification required. Please contact support.');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error during sign in:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'errors' in err) {
        // This handles Clerk-specific errors
        const clerkError = err as ClerkError;
        setError(clerkError.errors?.[0]?.message || 'Invalid email or password. Please try again.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }
  };

  // Handle SSO sign-in with providers
  const handleSSOSignIn = async (strategy: OAuthStrategy) => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/'
      });
      
      // Note: The redirect will happen automatically, so we don't need to set loading to false
    } catch (err) {
      console.error(`Error signing in with ${strategy}:`, err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'errors' in err) {
        const clerkError = err as ClerkError;
        setError(clerkError.errors?.[0]?.message || `Failed to sign in with ${strategy}. Please try again.`);
      } else {
        setError(`Failed to sign in with ${strategy}. Please try again.`);
      }
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !resetEmail) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Start by creating a sign-in attempt with the email
      const signInAttempt = await signIn.create({
        identifier: resetEmail,
      });
      
      // Get the first email address from the sign-in attempt
      // This solves the emailAddressId requirement issue
      if (signInAttempt.supportedFirstFactors) {
        const emailFactor = signInAttempt.supportedFirstFactors.find(
          factor => factor.strategy === 'email_code' || factor.strategy === 'email_link'
        );
        
        if (emailFactor && 'emailAddressId' in emailFactor) {
          // Now we can prepare the reset with the correct emailAddressId
          await signIn.prepareFirstFactor({
            strategy: "reset_password_email_code",
            emailAddressId: emailFactor.emailAddressId
          });
          
          setResetSent(true);
        } else {
          setError('Could not find an email address for this account.');
        }
      } else {
        setError('This email is not registered or does not support password reset.');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error sending password reset:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'errors' in err) {
        const clerkError = err as ClerkError;
        setError(clerkError.errors?.[0]?.message || 'Failed to send reset email. Please try again.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className={isMobile?MobileView:desktopView}> 
      {/* Main Content - Flexible middle column */}
      <div className='flex justify-center'>
        <main className={`h-screen py-6 px-5 flex flex-col ${isMobile?'gap-[10px]':'gap-[50px]'} justify-center content-center`}>
          <div className="flex flex-col gap-10">
            <div className={isMobile?"flex flex-col w-full items-center":"flex gap-[35px]"}>
              <img src={Logo} className="w-50" alt="Noyack Logo"/>
              
              <div className='flex gap-[5px] items-center'>
                <Typography>Don't have an account?</Typography>
                <div className='text-[#009FE3]'>
                  <button 
                    onClick={onSwitchToSignUp} 
                    className="text-[#009FE3] hover:underline"
                    type="button"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={isMobile?"text-center":""}>
            <Typography variant='h2' className='text-[39px] font-bold'>Welcome back</Typography>
            <Typography variant='caption' className='text-[16px]'>Sign in to access your account.</Typography>
          </div>

          {!showForgotPassword ? (
            // Sign in form
            <div className='sign-in-form'>
              <form onSubmit={handleEmailSignIn} className='flex flex-col gap-[13px]'>
                <input 
                  className='sign-input' 
                  type="email" 
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input 
                  className='sign-input' 
                  type="password" 
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                
                {error && (
                  <div className='text-red-500 mt-2 text-center'>
                    {error}
                  </div>
                )}
                
                <div className="text-center">
                <button 
                  type="submit" 
                  className='text-lg py-2 sign-in-button' 
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                </div>
                <div className="text-right">
                  <Button
                    variant='text'
                    type="button"
                    color='success'
                    onClick={() => setShowForgotPassword(true)}
                    className=" hover:underline py-2 max-w-[20ch]"
                  >
                    Forgot password?
                  </Button>
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
                  onClick={() => handleSSOSignIn("oauth_google")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  fullWidth
                >
                  Sign in with Google
                </Button>
                
                <Button 
                  variant="outlined"
                  startIcon={<MicrosoftIcon />}
                  onClick={() => handleSSOSignIn("oauth_microsoft")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  fullWidth
                >
                  Sign in with Microsoft
                </Button>
                
                <Button 
                  variant="outlined"
                  startIcon={<Facebook />}
                  onClick={() => handleSSOSignIn("oauth_facebook")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  fullWidth
                >
                  Sign in with Facebook
                </Button>
              </div>
            </div>
          ) : (
            // Forgot password form
            <form onSubmit={handleForgotPassword} className='sign-up-form'>
              {!resetSent ? (
                <>
                  <Typography className='text-center mb-4'>
                    Enter your email address and we'll send you instructions to reset your password.
                  </Typography>
                  
                  <input 
                    className='sign-input' 
                    type="email" 
                    placeholder='Email'
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
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
                    {loading ? 'Sending...' : 'Reset Password'}
                  </button>
                </>
              ) : (
                <div className='text-center'>
                  <Typography className='mb-4 text-green-600'>
                    Check your email! We've sent instructions to reset your password.
                  </Typography>
                </div>
              )}
              
              <button 
                type="button" 
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetSent(false);
                }} 
                className='text-blue-500 underline'
              >
                Back to Sign In
              </button>
            </form>
          )}
        </main>
      </div>

      {/* Aside - Fixed width */}
      {!isMobile && <div className="form-aside h-screen sticky top-0 flex justify-center items-center p-8 ">
        <img src={AsideImage} className="aside-img rounded-[25px] object-cover" alt="Sign in imagery"/>
      </div>}
    </div>
  )
}

export default SignInComponent
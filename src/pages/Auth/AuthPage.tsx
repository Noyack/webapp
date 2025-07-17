import { useState } from 'react';
import SignInComponent from './SignInComponent';
import SignUpComponent from './SignUpComponent'; // Assuming you renamed the original SignInPage to SignUpComponent

function AuthPage({isMobile}:{isMobile:boolean}) {
  const [showSignIn, setShowSignIn] = useState(true);
  
  // Toggle between sign in and sign up
  const toggleAuthMode = () => {
    setShowSignIn(prev => !prev);
  };
  
  return (
    <>
      {showSignIn ? (
        <SignInComponent isMobile={isMobile} onSwitchToSignUp={toggleAuthMode} />
      ) : (
        <SignUpComponent isMobile={isMobile} onSwitchToSignIn={toggleAuthMode} />
      )}
    </>
  );
}

export default AuthPage;
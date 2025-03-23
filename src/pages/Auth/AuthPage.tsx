import { useState } from 'react';
import SignInComponent from './SignInComponent';
import SignUpComponent from './SignUpComponent'; // Assuming you renamed the original SignInPage to SignUpComponent

function AuthPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  
  // Toggle between sign in and sign up
  const toggleAuthMode = () => {
    setShowSignIn(prev => !prev);
  };
  
  return (
    <>
      {showSignIn ? (
        <SignInComponent onSwitchToSignUp={toggleAuthMode} />
      ) : (
        <SignUpComponent onSwitchToSignIn={toggleAuthMode} />
      )}
    </>
  );
}

export default AuthPage;
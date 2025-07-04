import { useCallback, useState, useEffect, useContext } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { UserContext } from '../../../context/UserContext';
import { Box, Button, Typography } from '@mui/material';
import wealthViewService from '../../../services/wealthView.service';
import { usePermissions } from '../../../hooks/usePermissions';




const PlaidLogo = () =>{
  return(
    <svg xmlns="http://www.w3.org/2000/svg" height="32" width="64" viewBox="-10.89985 -7.86825 150.7987 71.2095"><path d="M66.248 16.268c-1.057-.889-2.861-1.333-5.413-1.333h-5.756v17.788h4.304v-5.575h1.928c2.34 0 4.056-.515 5.148-1.546 1.23-1.155 1.849-2.693 1.849-4.613 0-1.991-.687-3.565-2.06-4.721m-5.044 6.855h-1.821V18.96h1.636c1.99 0 2.985.698 2.985 2.094 0 1.378-.934 2.068-2.8 2.068m14.469-8.188h-4.488v17.788h9.69v-4.026h-5.202zm13.995 0l-7.05 17.788h4.832l.924-2.586H94.5l.845 2.586h4.886l-7-17.788zm-.053 11.601l1.849-6.08 1.82 6.08h-3.67zm12.858 6.187h4.489V14.934h-4.489zm21.917-14.454a7.376 7.376 0 00-2.14-2.053c-1.355-.854-3.204-1.28-5.545-1.28h-5.914v17.787h6.918c2.5 0 4.506-.817 6.02-2.453 1.514-1.635 2.27-3.805 2.27-6.508 0-2.15-.537-3.981-1.61-5.493m-7.182 10.427h-1.927v-9.734h1.954c1.373 0 2.428.43 3.168 1.287.74.857 1.11 2.073 1.11 3.647 0 3.2-1.435 4.8-4.305 4.8M18.637 0L4.09 3.81.081 18.439l5.014 5.148L0 28.65l3.773 14.693 14.484 4.047 5.096-5.064 5.014 5.147 14.547-3.81 4.008-14.63-5.013-5.146 5.095-5.063L43.231 4.13 28.745.083l-5.094 5.063zM9.71 6.624l7.663-2.008 3.351 3.44-4.887 4.856zm16.822 1.478l3.405-3.383 7.63 2.132-6.227 6.187zm-21.86 9.136l2.111-7.705 6.125 6.288-4.886 4.856-3.35-3.44zm29.547-1.243l6.227-6.189 1.986 7.74-3.404 3.384zm-15.502-.127l4.887-4.856 4.807 4.936-4.886 4.856zm-7.814 7.765l4.886-4.856 4.81 4.936-4.888 4.856zm15.503.127l4.886-4.856L36.1 23.84l-4.887 4.856zM4.57 29.927l3.406-3.385 4.807 4.937-6.225 6.186zm14.021 1.598l4.887-4.856 4.808 4.936-4.886 4.856zm15.502.128l4.887-4.856 3.351 3.439-2.11 7.705zm-24.656 8.97l6.226-6.189 4.81 4.936-3.406 3.385-7.63-2.133zm16.843-1.206l4.886-4.856 6.126 6.289-7.662 2.007z" fill-rule="evenodd" fill="#FFF"/></svg>
  )
}

const PlaidLinkButton = () => {
  const { hasPermission, getUpgradeInfo } = usePermissions();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useContext(UserContext);
  const canUsePlaid = hasPermission("plaid", "connect");
  const upgradeInfo = getUpgradeInfo("plaid", "connect");

  // First get a user token (required for income verification)
  useEffect(() => {
    const fetchUserToken = async () => {
      if(userInfo?.id)
      try {
        setIsLoading(true);
        const response = await wealthViewService.FetchPlaidToken(userInfo?.id);
        setUserToken(response?.user_token);
      } catch (err) {
        console.error('Error fetching user token:', err);
        setError('Failed to initialize bank connection. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo?.id){
      if(!userInfo?.plaidUserToken){
        fetchUserToken();
      }else{
        setUserToken(userInfo?.plaidUserToken)
      }
    } 
  }, [userInfo]);

  // Then get a link token once we have the user token
  useEffect(() => {
    const fetchLinkToken = async () => {
      if(userInfo?.id && userToken)
      try {
        setIsLoading(true);
        const response = await wealthViewService.FetchPlaidLink(userInfo?.id, userToken);
        setLinkToken(response?.link_token);
      } catch (err) {
        console.error('Error fetching link token:', err);
        setError('Failed to initialize bank connection. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch the link token once we have the user token
    if (userInfo?.id && userToken) {
      fetchLinkToken();
    }
  }, [userInfo, userToken]);

  const onSuccess = useCallback(async (public_token:string) => {
    try {
      setIsLoading(true);
      // Exchange the public token for an access token
      const response = await wealthViewService.exchangeToken({
        publicToken: public_token, 
        userId: userInfo?.id,
        userToken: userToken, // Include user token here too
        // store institution data as well:
        // institution: metadata.institution,
        // accounts: metadata.accounts
      });
      
      // Handle the response
      if (response === 200) {
        // Display success message or redirect
        // You might want to trigger a refresh of account data here
      }
    } catch (err) {
      console.error('Error exchanging token:', err);
      setError('Failed to complete bank connection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userInfo?.id, userToken]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    // Optional - configure more Plaid Link options
    onExit: (err) => {
      if (err) setError(`Connection closed: ${err.display_message || 'Unknown error'}`);
    },
  });

  if (!canUsePlaid) {
    return (
      <Box className="text-center p-4">
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {upgradeInfo?.message}
        </Typography>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => {
            // Navigate to upgrade page
            window.location.href = '/upgrade';
          }}
        >
          Upgrade to Connect Banks
        </Button>
      </Box>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 mb-4 flex flex-col align-middle">
        An error occured please try again
        <Button
          variant='contained' 
          color='error'
          onClick={() => setError(null)} 
          className="ml-2 text-blue-500 underline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      Connect with 
    <Button 
      onClick={() => open()} 
      disabled={!ready || isLoading}
      className={`${isLoading || !ready ? 'opacity-50 cursor-not-allowed' : ''}`}
      sx={{background:"#000", borderRadius:"50px",color:"#fff", width:"15ch"}}
    >
      {isLoading ? 'Preparing...' : 

      <Typography fontSize={"14px"}>
        <PlaidLogo />
      </Typography>}
    </Button>
      </div>
  );
};

export default PlaidLinkButton;
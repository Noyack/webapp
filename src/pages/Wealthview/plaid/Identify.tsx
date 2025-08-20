import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../context/UserContext';
import { IdentityData } from '../../../types';
import wealthViewService from '../../../services/wealthView.service';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip
} from '@mui/material';
import { PlaidContext } from '../../../context/PlaidContext';


const UserIdentityInfo = () => {
  const {userInfo} = useContext(UserContext)
  const {plaidInfo} = useContext(PlaidContext)
  const [identityData, setIdentityData] = useState<IdentityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdentityData = async () => {
        if(userInfo?.id)
      try {
        setLoading(true);
        
        const response = await wealthViewService.getIdentity(userInfo?.id);
        
        setIdentityData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.id && !plaidInfo?.noAccount) {
      fetchIdentityData();
    }
  }, [userInfo]);

  if (loading) {
    return (
      <Box className="p-4 flex justify-center items-center h-64">
        <CircularProgress color="primary" size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <Typography variant="h6" className="text-xl font-semibold text-red-700">Error</Typography>
        <Typography className="text-red-600 mt-2">{error}</Typography>
      </Box>
    );
  }

  if (!identityData || identityData.accounts.length === 0) {
    return (
      <Box className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <Typography variant="h6" className="text-xl font-semibold text-yellow-700">
          No Identity Data Found
        </Typography>
        <Typography className="text-yellow-600 mt-2">
          We couldn't find any identity information for your linked accounts.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper className="bg-white shadow rounded-lg overflow-hidden">
      <Box className="p-4 border-b">
        <Typography variant="h5" className="text-2xl font-semibold text-gray-800">
          Your Profile Information
        </Typography>
        <Typography variant="body2" className="text-gray-600 text-sm mt-1">
          Information retrieved from {identityData.item.institution_name}
        </Typography>
      </Box>
      
      <Box className="p-4">
        {identityData.accounts.map((account) => (
          <Box key={account.account_id} className="mb-8">
            <Box className="mb-4 pb-2 border-b">
              <Typography variant="h6" className="font-medium text-gray-800">
                {account.name} (••••{account.mask})
              </Typography>
              <Typography variant="body2" className="text-sm text-gray-500">
                {account.type} • {account.subtype}
              </Typography>
            </Box>
            
            {account.owners.map((owner, ownerIndex) => (
              <Box key={ownerIndex} className="mb-6">
                <Typography variant="subtitle1" className="font-medium text-gray-700 mb-3">
                  Account Holder #{ownerIndex + 1}
                </Typography>
                
                {/* Names */}
                {owner.names.length > 0 && (
                  <Box className="mb-4">
                    <Typography variant="subtitle2" className="text-sm font-medium text-gray-600 mb-1">
                      Name
                    </Typography>
                    {owner.names.map((name, nameIndex) => (
                      <Typography key={nameIndex} className="text-gray-800">
                        {name}
                      </Typography>
                    ))}
                  </Box>
                )}
                
                {/* Email Addresses */}
                {owner.emails.length > 0 && (
                  <Box className="mb-4">
                    <Typography variant="subtitle2" className="text-sm font-medium text-gray-600 mb-1">
                      Email Addresses
                    </Typography>
                    {owner.emails.map((email, emailIndex) => (
                      <Box key={emailIndex} className="flex items-center mb-1">
                        <Typography className="text-gray-800">{email.data}</Typography>
                        {email.primary && (
                          <Chip
                            label="Primary"
                            size="small"
                            className="ml-2 bg-blue-100 text-blue-800 text-xs"
                          />
                        )}
                        <Typography variant="body2" className="ml-2 text-gray-500 text-sm">
                          ({email.type})
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                
                {/* Phone Numbers */}
                {owner.phone_numbers.length > 0 && (
                  <Box className="mb-4">
                    <Typography variant="subtitle2" className="text-sm font-medium text-gray-600 mb-1">
                      Phone Numbers
                    </Typography>
                    {owner.phone_numbers.map((phone, phoneIndex) => (
                      <Box key={phoneIndex} className="flex items-center mb-1">
                        <Typography className="text-gray-800">{phone.data}</Typography>
                        {phone.primary && (
                          <Chip
                            label="Primary"
                            size="small"
                            className="ml-2 bg-blue-100 text-blue-800 text-xs"
                          />
                        )}
                        <Typography variant="body2" className="ml-2 text-gray-500 text-sm">
                          ({phone.type})
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                
                {/* Addresses */}
                {owner.addresses.length > 0 && (
                  <Box className="mb-4">
                    <Typography variant="subtitle2" className="text-sm font-medium text-gray-600 mb-1">
                      Addresses
                    </Typography>
                    {owner.addresses.map((address, addressIndex) => (
                      <Box key={addressIndex} className="mb-2">
                        <Box className="text-gray-800">
                          <Typography>{address.data.street}</Typography>
                          <Typography>
                            {address.data.city}, {address.data.region} {address.data.postal_code}
                          </Typography>
                          <Typography>{address.data.country}</Typography>
                        </Box>
                        {address.primary && (
                          <Chip
                            label="Primary"
                            size="small"
                            className="mt-1 bg-blue-100 text-blue-800 text-xs"
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default UserIdentityInfo;
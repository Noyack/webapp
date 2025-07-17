import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { usePermissions } from '../hooks/usePermissions';

interface FeatureGateComponentProps {
  feature: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  onUpgrade?: () => void;
}

export const FeatureGateComponent: React.FC<FeatureGateComponentProps> = ({
  feature,
  action,
  children,
  fallback,
  showUpgradePrompt = true,
  onUpgrade
}) => {
  const { hasPermission, getUpgradeInfo } = usePermissions();
  
  const isAllowed = hasPermission(feature, action);
  
  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const upgradeInfo = getUpgradeInfo(feature, action);

  return (
        <>{children}</>
  );
};
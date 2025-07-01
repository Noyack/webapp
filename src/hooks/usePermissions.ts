import { useContext, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import { FeatureGate, SubscriptionPlan } from '../types';
import { PermissionService } from '../services/permissions.service';

export function usePermissions() {
  const { subs } = useContext(UserContext);
  
  const permissionService = useMemo(() => new PermissionService(), []);
  
  const userPlan: SubscriptionPlan = subs?.plan || "free";
  
  const checkPermission = (feature: string, action: string): FeatureGate => {
    return permissionService.hasPermission(userPlan, feature, action);
  };

  const hasPermission = (feature: string, action: string): boolean => {
    return checkPermission(feature, action).isAllowed;
  };

  const getUpgradeInfo = (feature: string, action: string) => {
    const gate = checkPermission(feature, action);
    if (gate.isAllowed) return null;
    
    return {
      requiredPlans: gate.requiredPlans,
      message: gate.upgradeMessage,
      currentPlan: gate.userPlan
    };
  };

  return {
    userPlan,
    hasPermission,
    checkPermission,
    getUpgradeInfo
  };
}
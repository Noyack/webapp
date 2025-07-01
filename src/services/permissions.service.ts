import { FeatureGate, Permission, PERMISSIONS, SubscriptionPlan } from "../types";

export class PermissionService {
  private permissions: Permission[] = PERMISSIONS;

  /**
   * Check if user has permission for a specific feature/action
   */
  hasPermission(
    userPlan: SubscriptionPlan, 
    feature: string, 
    action: string
  ): FeatureGate {
    const permission = this.permissions.find(
      p => p.feature === feature && p.action === action
    );

    if (!permission) {
      // If no specific permission found, allow for free users by default
      return {
        isAllowed: true,
        userPlan,
        requiredPlans: []
      };
    }

    const isAllowed = permission.plans.includes(userPlan);
    
    return {
      isAllowed,
      userPlan,
      requiredPlans: permission.plans,
      upgradeMessage: isAllowed 
        ? undefined 
        : this.getUpgradeMessage(userPlan, permission.plans)
    };
  }

  /**
   * Get minimum required plan for a feature
   */
  getMinimumPlan(feature: string, action: string): SubscriptionPlan | null {
    const permission = this.permissions.find(
      p => p.feature === feature && p.action === action
    );

    if (!permission || permission.plans.length === 0) {
      return null;
    }

    // Define plan hierarchy
    const planHierarchy: SubscriptionPlan[] = ["free", "community", "investor"];
    
    // Find the lowest plan in hierarchy that has permission
    for (const plan of planHierarchy) {
      if (permission.plans.includes(plan)) {
        return plan;
      }
    }
    
    return null;
  }

  private getUpgradeMessage(userPlan: SubscriptionPlan, requiredPlans: SubscriptionPlan[]): string {
    const minPlan = this.getMinimumPlan("", "");
    
    if (requiredPlans.includes("investor")) {
      return "Upgrade to Investor plan to access this feature";
    }
    if (requiredPlans.includes("community")) {
      return "Upgrade to Community plan or higher to access this feature";
    }
    
    return "Upgrade your plan to access this feature";
  }
}
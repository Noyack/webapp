import { FeatureGate, Permission, PERMISSIONS, SubscriptionPlan } from "../types";

const PLAN_HIERARCHY: readonly SubscriptionPlan[] = ["free", "community", "investor"] as const;

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
        : this.getUpgradeMessage(userPlan, permission.plans, feature, action)
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
    
    // Find the lowest plan in hierarchy that has permission
    for (const plan of PLAN_HIERARCHY) {
      if (permission.plans.includes(plan)) {
        return plan;
      }
    }
    
    return null;
  }

  /**
   * Get the hierarchy index of a plan (lower index = lower tier)
   */
  private getPlanHierarchyIndex(plan: SubscriptionPlan): number {
    return PLAN_HIERARCHY.indexOf(plan);
  }

  /**
   * Check if planA is higher tier than planB
   */
  isPlanHigherTier(planA: SubscriptionPlan, planB: SubscriptionPlan): boolean {
    return this.getPlanHierarchyIndex(planA) > this.getPlanHierarchyIndex(planB);
  }

  private getUpgradeMessage(
    userPlan: SubscriptionPlan, 
    requiredPlans: SubscriptionPlan[],
    feature: string,
    action: string
  ): string {
    // Get the minimum required plan for this specific feature/action
    const minPlan = this.getMinimumPlan(feature, action);
    
    if (!minPlan) {
      return "Upgrade your plan to access this feature";
    }

    // Create more specific upgrade messages based on the minimum required plan
    switch (minPlan) {
      case "investor":
        return "Upgrade to Investor plan to access this feature";
      case "community":
        return "Upgrade to Community plan or higher to access this feature";
      case "free":
        // This shouldn't happen if they don't have permission, but just in case
        return "This feature should be available on your current plan";
      default:
        return `Upgrade to ${minPlan} plan or higher to access this feature`;
    }
  }

  /**
   * Get all plans that are higher tier than the current plan
   */
  getHigherTierPlans(currentPlan: SubscriptionPlan): SubscriptionPlan[] {
    const currentIndex = this.getPlanHierarchyIndex(currentPlan);
    return PLAN_HIERARCHY.slice(currentIndex + 1);
  }

  /**
   * Get the next higher tier plan
   */
  getNextTierPlan(currentPlan: SubscriptionPlan): SubscriptionPlan | null {
    const currentIndex = this.getPlanHierarchyIndex(currentPlan);
    return PLAN_HIERARCHY[currentIndex + 1] || null;
  }
}
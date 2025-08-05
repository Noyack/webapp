/* eslint-disable @typescript-eslint/no-explicit-any */
// Main types file for the application
// Keep all shared types here to maintain consistency

import { ReactNode } from 'react';

// =====================
// USER TYPES
// =====================

export interface User {
  id: string;
  fullName: string | null;
  emailAddresses: Array<{
    id: string;
    emailAddress: string;
    verification: {
      status: string;
    };
  }>;
  hasCompletedOnboarding: boolean;
  onboarding: boolean;
  plaidUserToken?: string;
  imageUrl: string;
}
export interface UserInfo {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email?: string;
  emailAddresses: Array<{
    id: string;
    emailAddress: string;
    verification: {
      status: string;
    };
  }>;
  hasCompletedOnboarding: boolean;
  onboarding: boolean;
  plaidUserToken?: string;
  imageUrl: string;
}

export type SubscriptionPlan = "free" | "community" | "investor";

export interface Subscriptions{
  id: string,
  userId: string,
  stripeCustomerId: string | null,
  stripeSubscriptionId: string | null,
  status: boolean,
  plan: SubscriptionPlan,
  currentPeriodStart: any ,
  currentPeriodEnd: any,
  createdAt: any,
  updatedAt: any,
  cancelAtPeriodEnd: any
}

export type subArr = Subscriptions[]

export interface Permission {
  feature: string;
  action: string;
  plans: SubscriptionPlan[];
}

export interface FeatureGate {
  isAllowed: boolean;
  userPlan: SubscriptionPlan;
  requiredPlans: SubscriptionPlan[];
  upgradeMessage?: string;
}

  export const PERMISSIONS: Permission[] = [

  {
    feature: "investor",
    action: "access",
    plans: ["investor"]
  },

  // PLAID INTEGRATION - Bank connections
  {
    feature: "plaid",
    action: "connect",           // Connect bank accounts
    plans: ["community", "investor"]
  },
  {
    feature: "plaid",
    action: "view_transactions", // See transaction history
    plans: ["community", "investor"]
  },
  {
    feature: "plaid",
    action: "investment_data",   // Access investment/holdings data
    plans: ["investor"]
  },

  // CALCULATORS - Different complexity levels
  {
    feature: "calculators",
    action: "basic",            // Retirement & Debt calculators (dashboard)
    plans: ["free", "community", "investor"]
  },
  {
    feature: "calculators",
    action: "advanced",         // FIRE, Tax optimization, complex tools
    plans: ["community", "investor"]
  },
  {
    feature: "calculators",
    action: "unlimited",        // No usage limits
    plans: ["investor"]
  },

  // WEALTH DASHBOARD - Progressive access
  {
    feature: "wealth_dashboard",
    action: "view",             // Basic wealth overview
    plans: ["community", "investor"]
  },
  {
    feature: "wealth_dashboard",
    action: "detailed_analysis", // Full breakdowns, insights
    plans: ["investor"]
  },
  {
    feature: "wealth_dashboard",
    action: "export",           // Export reports/data
    plans: ["investor"]
  },

  // ACADEMY - Content tiers
  {
    feature: "academy",
    action: "access",    // Free courses
    plans: []
  },

  // PORTFOLIO ANALYSIS
  {
    feature: "portfolio",
    action: "view",             // See holdings
    plans: ["community", "investor"]
  },
  {
    feature: "portfolio",
    action: "analyze",          // Performance analysis, recommendations
    plans: ["investor"]
  },
  {
    feature: "portfolio",
    action: "rebalance",        // Auto-rebalancing suggestions
    plans: ["investor"]
  },

  // SUPPORT - Service levels
  {
    feature: "support",
    action: "basic",            // FAQ, standard tickets
    plans: ["free", "community", "investor"]
  },
  {
    feature: "support",
    action: "priority",         // Faster response times
    plans: ["community", "investor"]
  },
  {
    feature: "support",
    action: "phone",            // Phone support
    plans: ["investor"]
  },

  // REPORTS & EXPORTS
  {
    feature: "reports",
    action: "view",             // Basic reports
    plans: ["community", "investor"]
  },
  {
    feature: "reports",
    action: "download",         // Download PDFs
    plans: ["investor"]
  },
  {
    feature: "reports",
    action: "custom",           // Custom date ranges, filters
    plans: ["investor"]
  },
  {
    feature: "reports",
    action: "custom",           // Custom date ranges, filters
    plans: ["investor"]
  }
];

export interface ClerkEmailObject {
  id: string;
  emailAddress: string;
  verification: {
    status: string;
    strategy: string;
  };
  linkedTo: Array<{
    id: string;
    type: string;
  }>;
}

export interface LocationData {
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export type RiskTolerance = 'conservative' | 'moderate' | 'aggressive';

export interface UserCreationData {
  fname?: string;
  lname?: string;
  email?: ClerkEmailObject[] | undefined;
  age?: number;
  
  // Enhanced fields
  location: LocationData;
  investmentAccreditation?: boolean;
  investmentGoals?: string[];
  riskTolerance?: RiskTolerance;
  
  // Additional optional fields
  phone?: string;
  occupation?: string;
  referralSource?: string;
  interestedInFunds?: string[];

  selectedPlan?: SubscriptionPlan;

}

// Google Maps types
// These interfaces help interact with the Google Maps API
export interface GoogleMapsWindow extends Window {
  google?: {
    maps?: {
      places?: {
        Autocomplete: new (
          input: HTMLInputElement,
          options?: google.maps.places.AutocompleteOptions
        ) => google.maps.places.Autocomplete;
      };
    };
  };
}

// =====================
// LAYOUT & COMPONENT TYPES
// =====================

export interface LayoutProps {
  children: ReactNode;
}

export interface DesktopLayoutProps {
    children: ReactNode;
  }

export interface BoxCardProps {
  children: ReactNode;
  height: number;
  width?: number;
  className?: string;
}

export interface StepperTextProps {
  step: number;
  currentStep: number;
}

// =====================
// DASHBOARD TYPES
// =====================

export interface FundStatusElement {
  id: number;
  title: string;
  value: string;
  icon: ReactNode;
}

export interface FundStatusProps {
  statusElements: FundStatusElement[];
}

// =====================
// ONBOARDING TYPES
// =====================

export interface OnboardingState {
  step: number;
  data: {
    userType?: UserType;
    contactDetails?: ContactDetails;
    address?: Address;
    investment?: InvestmentDetails;
    identity?: IdentityDetails;
    accreditation?: AccreditationDetails;
  };
}

export interface UserTypeOption {
  id: number;
  title: string;
  caption: string;
  desc: string;
}

export type UserType = 'individual' | 'legal_entity' | 'ira' | 'custodial';

export interface ContactDetails {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
}

export interface Address {
  streetAddress: string;
  aptSuiteBuilding?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface InvestmentDetails {
  type: 'one_time' | 'recurring';
  amount: number;
  frequency?: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  startDate?: string;
}

export interface IdentityDetails {
  ssn: string;
  taxId?: string;
  documentType?: 'passport' | 'drivers_license' | 'state_id';
  documentNumber?: string;
}

export interface AccreditationDetails {
  isAccredited: boolean;
  accreditationType?: 'income' | 'net_worth' | 'professional' | 'entity';
  documentationProvided?: boolean;
}

export interface OnboardingProps {
  userId: string;
  initialStep?: number;
  onComplete?: (data: OnboardingState['data']) => void;
}

export interface OnboardStepProps {
  setStep: (step: number) => void;
  data?: OnboardingState['data'];
  updateData?: (data: Partial<OnboardingState['data']>) => void;
}

export interface InvestTypeCardProps {
  id: number;
  title: string;
  caption: string;
  desc: string;
  setChoice: (id: number) => void;
  isSelected?: boolean;
}

export interface SteppersProps {
  completed: number;
  steps?: string[];
}

// =====================
// CALCULATOR TYPES
// =====================

export interface ChartDataPoint {
  year: number;
  value: number;
}

export interface AgeNetWorthDataPoint {
  age: number;
  netWorth: number;
}

// Retirement Calculator Types
export interface RetirementCalcState {
  initialInvestment: number;
  monthlyInvestment: number;
  years: number;
  annualReturn?: number;
  
  result: number | null;
  chartData: ChartDataPoint[];
}

export interface RetirementCalcProps {
  defaultInitialInvestment?: number;
  defaultMonthlyInvestment?: number;
  defaultYears?: number;
  defaultAnnualReturn?: number;
  onCalculate?: (result: number, chartData: ChartDataPoint[]) => void;
}

// FIRE Calculator Types
export interface FireCalculatorState {
  // Age parameters
  currentAge: number;
  desiredRetirementAge: number;
  endAge: number;
  
  // Financial parameters
  currentNetWorth: number;
  preTaxSalary: number;
  postTaxSalary: number;
  currentAnnualSpending: number;
  desiredRetirementSpending: number;
  
  // Asset allocation
  stocksAllocation: number;
  bondsAllocation: number;
  cashAllocation: number;
  otherAllocation: number;
  
  // Expected returns
  stocksReturn: number;
  bondsReturn: number;
  cashReturn: number;
  otherReturn: number;
  
  // Other assumptions
  safeWithdrawalRate: number;
  inflationRate: number;
  company401kMatch: number;
  incomeGrowthRate: number;
  socialSecurity: number;
  
  // Calculation results
  fireNumber: number;
  fireAge: number | null;
  yearsUntilFire: number | null;
  chartData: AgeNetWorthDataPoint[];
}

export interface FireCalculatorProps {
  defaultValues?: Partial<FireCalculatorState>;
  onCalculate?: (results: {
    fireNumber: number;
    fireAge: number | null;
    yearsUntilFire: number | null;
    chartData: AgeNetWorthDataPoint[];
  }) => void;
}

// Chart props
export interface ProjectionChartProps {
  data: AgeNetWorthDataPoint[] | ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  tooltipFormatter?: (value: number) => string;
}

// =====================
// COMMUNITY TYPES
// =====================

export interface Article {
  id: string;
  image: string;
  title: string;
  desc: string;
  date?: string;
  author?: string;
  url?: string;
  readTime?: string;
  featured?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'webinar' | 'article';
  url?: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVote?: string;
  isActive: boolean;
  endDate?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CommunityUpdate {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'news' | 'announcement' | 'event';
  important?: boolean;
}

export interface Event {
  name: ReactNode;
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl?: string;
  url?: string;
  isVirtual?: boolean;
  registrationRequired?: boolean;
  attendees?: number;
}

export interface Referral {
  code: string;
  url: string;
  rewards: string;
  referralsCount?: number;
  referralsRequired?: number;
}

export interface CommunityProps {
  fetching?: boolean;
  userId?: string;
  referralCode?: string;
  articles?: Article[];
  resources?: Resource[];
  currentPoll?: Poll;
  events?: Event[];
  onPollVote?: (pollId: string, optionId: string) => Promise<void>;
  onShareReferral?: (method: 'email' | 'copy' | 'social') => void;
}

// =====================
// INVESTMENT TYPES
// =====================

export type BalanceType = 'wallet' | 'balance';

export interface RecurringInvestment {
  id: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  nextDate: string;
  fundId: string;
  fundName: string;
  status: 'active' | 'paused' | 'cancelled';
  createdAt: string;
}

export interface InvestmentTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'dividend' | 'fee';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  fundId?: string;
  fundName?: string;
  description?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'bank' | 'card';
  last4: string;
  nickname?: string;
  isDefault: boolean;
  expiryDate?: string;
}

export interface Fund {
  id: string;
  name: string;
  description: string;
  annualizedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  minimumInvestment: number;
  assetClass: string;
  manager: string;
  inceptionDate: string;
}

export interface InvestmentPosition {
  fundId: string;
  fundName: string;
  investedAmount: number;
  currentValue: number;
  units: number;
  percentageOfPortfolio: number;
  performance: {
    oneMonth: number;
    threeMonths: number;
    oneYear: number;
    sinceInception: number;
  };
}

export interface AccountBalance {
  walletBalance: number;
  totalInvestments: number;
  totalEarnings: number;
  availableToWithdraw: number;
}
export interface EquityAccounts {
  managerCode?: string;
  ownerContactName?: string;
  availableCash?: number;
  accountOpenDate?:string;
  accountType?: string
  accountNumber?:string
  ownerContactId?:string
  accountStatus?:string
}
export interface EquityActivities {
  acats?: boolean;
  accountNumber?: string;
  activityId?: string;
  amount?: number;
  contactName?: string;
  dateReceived?: string;
  deficiencies?: boolean;
  processSubType?: string;
  processType?: string;
  status?: string;
}

export interface ReferralInfo {
  code: string;
  url: string;
  referralCount: number;
  rewardsEarned: number;
  pendingRewards: number;
}

export interface DistributionPreferences {
  reinvestDividends: boolean;
  payoutMethod?: 'bank' | 'wallet';
  payoutFrequency?: 'monthly' | 'quarterly' | 'annually';
}

export interface OverviewProps {
  userId: string;
  balances?: AccountBalance;
  referralInfo?: ReferralInfo;
  distributionPreferences?: DistributionPreferences;
  paymentMethods?: PaymentMethod[];
  transactions?: InvestmentTransaction[];
  onCopyReferralCode?: () => void;
  onToggleReinvestment?: (enabled: boolean) => Promise<void>;
  onAddPaymentMethod?: () => void;
  onCashOut?: () => void;
}

export interface OverviewState {
  balanceType: BalanceType;
  reinvestEnabled: boolean;
  referralCode: string;
  referralCopied: boolean;
  isLoading: {
    balance: boolean;
    referral: boolean;
    transactions: boolean;
  };
  error: string | null;
}

export interface InvestProps {
  userId: string;
  funds?: Fund[];
  positions?: InvestmentPosition[];
  recurrings?: RecurringInvestment[];
}

export interface InvestState {
  activeTab: number;
  selectedFund: string | null;
  investmentAmount: number;
  isRecurring: boolean;
  frequency: RecurringInvestment['frequency'];
  isLoading: boolean;
  error: string | null;
}

// =====================
// API RESPONSE TYPES
// =====================

export interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
    success: boolean;
}

export interface ErrorResponse {
    error: string;
    code: number;
    details?: Record<string, string>;
}

// =====================
// UPCOMING EVENTS TYPES
// =====================

export interface EventItem {
  id: string; // Added for better key handling
  date: string;
  time: string;
  location: string;
  description: string;
}


// ======================
// CLERCK ERRORS
// ======================

export interface ClerkError {
  errors?: Array<{ message: string }>;
}

// ======================
// Types for our tax optimization calculator
// ======================


// Type for a single income source
export type IncomeSource = {
  id?: string;
  type: string;
  name: string;
  amount: number;
  frequency: string;
  duration: string;
  taxStatus: string;
  growthRate: number;
  notes: string;
  description?: string;
};

// Type for the income form data
export type IncomeInfoForm = {
  employmentStatus: string;
  primaryIncome: {
    salary: number;
    paymentFrequency: string;
    stabilityType: string;
    annualGrowthRate: number;
    futureChanges: string;
    futureChangeTimeframe: number;
    bonusStructure: string;
    averageBonus: number;
  };
  additionalIncomes: IncomeSource[];
};
export interface Deduction {
  id: string;
  type: string;
  // type: 'mortgage-interest' | 'property-tax' | 'charity' | 'medical' | 'student-loan' | 'education' | 'child-care' | 'other';
  amount: number;
  description: string;
}

export interface TaxAdvantaged {
  type: string;
  // type: '401k' | 'ira-traditional' | 'ira-roth' | 'hsa' | '529' | 'other';
  contribution: number;
  maxContribution: number;
}

export interface UserState {
  filingStatus: string;
  // filingStatus: 'single' | 'married-joint' | 'married-separate' | 'head-of-household';
  state: string;
  dependents: number;
  incomeSources: IncomeSource[];
  deductions: Deduction[];
  useItemizedDeductions: boolean;
  taxAdvantaged: {
    [key: string]: TaxAdvantaged;
  };
  monthlyExpenses: number;
  emergencyFund: number;
  hasInvestments: boolean;
  stocksValue: number;
  cryptoValue: number;
  realEstateValue: number;
}

export interface TaxBracket {
  rate: number;
  min: number;
  max: number | null;
}

export interface TaxResults {
  totalIncome: number;
  adjustedGrossIncome: number;
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  ficaTax: number;
  selfEmploymentTax: number;
  totalTax: number;
  effectiveTaxRate: number;
  afterTaxIncome: number;
  savingsRate: number;
  totalSavings: number;
  unusedTaxSpace: {
    [key: string]: number;
  };
  taxByBracket: {
    bracket: string;
    amount: number;
  }[];
  optimizationTips: string[];
  projectedSavings: {
    year: number;
    currentStrategy: number;
    optimizedStrategy: number;
  }[];
}

export interface Mode {
  label: string;
  value: string;
  description: string;
}


// ======================
// Types for Asset Form
// ======================

// Base Asset Type
export type BaseAsset = {
  id: string;
  name: string;
  institution: string;
  currentValue: number;
  notes: string;
};

// Liquid Assets
export type LiquidAsset = BaseAsset & {
  type: 'checking' | 'savings' | 'moneyMarket' | 'cd' | 'treasuryBill' | 'other';
  interestRate?: number;
  maturityDate?: string;
};

// Investment Assets
export type InvestmentAsset = BaseAsset & {
  type: 'stock' | 'bond' | 'mutualFund' | 'etf' | 'reit' | 'crypto' | 'options' | 'alternative' | 'fixedIncome' | 'commodities' | 'other';
  ticker?: string;
  shares?: number;
  purchasePrice?: number;
  expenseRatio?: number;
  yield?: number;
  maturityDate?: string;
};

// Retirement Accounts
export type RetirementAsset = BaseAsset & {
  type: '401k' | '403b' | 'traditionalIra' | 'rothIra' | 'sepIra' | 'simpleIra' | 'pension' | 'annuity' | 'other';
  contributionRate?: number;
  employerMatch?: number;
  estimatedMonthlyBenefit?: number;
  payoutTerms?: string;
};

// Real Estate
export type RealEstateAsset = BaseAsset & {
  type: 'primaryResidence' | 'secondHome' | 'investmentProperty' | 'land' | 'other';
  address: string;
  purchasePrice: number;
  remainingMortgage?: number;
  rentalIncome?: number;
  propertyTaxes?: number;
  insuranceCost?: number;
};

// Business Assets
export type BusinessAsset = BaseAsset & {
  type: 'businessOwnership' | 'partnership' | 'intellectualProperty' | 'other';
  ownershipPercentage?: number;
  annualRevenue?: number;
  annualProfit?: number;
};

// Personal Property
export type PersonalPropertyAsset = BaseAsset & {
  type: 'vehicle' | 'collectible' | 'jewelry' | 'art' | 'other';
  description: string;
  purchasePrice?: number;
  insuredValue?: number;
};

// Asset Allocation
export type AssetAllocation = {
  stocks: number;
  bonds: number;
  cash: number;
  realEstate?: number;
  alternatives: number;
  other?: number;
};

// Form Data
export type AssetsFormData = {
  liquidAssets: LiquidAsset[];
  investmentAssets: InvestmentAsset[];
  retirementAssets: RetirementAsset[];
  realEstateAssets: RealEstateAsset[];
  businessAssets: BusinessAsset[];
  personalPropertyAssets: PersonalPropertyAsset[];
  currentAllocation: AssetAllocation;
  targetAllocation: AssetAllocation;
  liquidityNeeds: number;
};

// Options for dropdown menus
export const liquidAssetTypes = [
  { value: 'checking', label: 'Checking Account' },
  { value: 'savings', label: 'Savings Account' },
  { value: 'moneyMarket', label: 'Money Market Account' },
  { value: 'cd', label: 'Certificate of Deposit (CD)' },
  { value: 'treasuryBill', label: 'Treasury Bill/Note' },
  { value: 'other', label: 'Other Liquid Asset' }
];

export const investmentAssetTypes = [
  { value: 'stock', label: 'Individual Stock' },
  { value: 'bond', label: 'Bond' },
  { value: 'mutualFund', label: 'Mutual Fund' },
  { value: 'etf', label: 'Exchange-Traded Fund (ETF)' },
  { value: 'reit', label: 'Real Estate Investment Trust (REIT)' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'options', label: 'Options/Derivatives' },
  { value: 'alternative', label: 'Alternative Investment' },
  { value: 'other', label: 'Other Investment' }
];

export const retirementAssetTypes = [
  { value: '401k', label: '401(k)' },
  { value: '403b', label: '403(b)' },
  { value: 'traditionalIra', label: 'Traditional IRA' },
  { value: 'rothIra', label: 'Roth IRA' },
  { value: 'sepIra', label: 'SEP IRA' },
  { value: 'simpleIra', label: 'SIMPLE IRA' },
  { value: 'pension', label: 'Pension Plan' },
  { value: 'annuity', label: 'Annuity' },
  { value: 'other', label: 'Other Retirement Asset' }
];

export const realEstateAssetTypes = [
  { value: 'primaryResidence', label: 'Primary Residence' },
  { value: 'secondHome', label: 'Second Home/Vacation Property' },
  { value: 'investmentProperty', label: 'Investment/Rental Property' },
  { value: 'land', label: 'Land' },
  { value: 'other', label: 'Other Real Estate' }
];

export const businessAssetTypes = [
  { value: 'businessOwnership', label: 'Business Ownership' },
  { value: 'partnership', label: 'Partnership Interest' },
  { value: 'intellectualProperty', label: 'Intellectual Property' },
  { value: 'other', label: 'Other Business Asset' }
];

export const personalPropertyAssetTypes = [
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'collectible', label: 'Collectible' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'art', label: 'Art' },
  { value: 'other', label: 'Other Personal Property' }
];


// ======================
// Types for Debt Profile Form
// ======================

export type DebtType = 'mortgage' | 'auto' | 'student' | 'creditCard' | 'personal' | 'other';

export interface BaseDebt {
  id: string;
  lender: string;
  accountLast4: string;
  originalAmount: number;
  currentBalance: number;
  interestRate: number;
  monthlyPayment: number;
  remainingTerm: number;
  originalTerm: number;
  isJoint: boolean;
  status: 'current' | 'past_due' | 'delinquent' | 'in_collection' | 'default' | 'paid_off' | 'in_grace_period';
  hasCollateral: boolean;
  collateralDescription?: string;
  hasCosigner: boolean;
  cosignerName?: string;
  notes: string;
  
  // Special properties for each debt type will be stored in the 'extra' JSON field in the database
  // The debt service will handle moving specialized fields in and out of this object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra?: Record<string, any>;
}

export interface CreditCard extends BaseDebt {
  // Credit card specific fields that will be stored in the 'extra' JSON field in the database
  // but are accessed directly on the object in the frontend
  creditLimit: number;
  minimumPayment: number;
  annualFee: number;
  rewardProgram: string;
  utilizationRatio: number;
  balanceTransferOffersAvailable: boolean;
}

// Mortgage interface with specific properties
export interface Mortgage extends BaseDebt {
  // Mortgage specific fields
  propertyValue: number;
  mortgageType: 'conventional' | 'fha' | 'va' | 'interestOnly' | 'adjustableRate' | 'other';
  propertyAddress: string;
  isVariableRate: boolean;
  rateAdjustmentDetails?: string;
  refinancePlans: string;
}

// AutoLoan interface with specific properties
export interface AutoLoan extends BaseDebt {
  // Auto loan specific fields
  vehicleValue: number;
  vehicleDescription: string;
  isLease: boolean;
  leaseEndDate?: string;
}

// StudentLoan interface with specific properties
export interface StudentLoan extends BaseDebt {
  // Student loan specific fields
  loanType: 'federal' | 'private' | 'mixed';
  repaymentPlan: 'standard' | 'incomeBased' | 'graduatedRepayment' | 'extendedRepayment' | 'other';
  forgivenessProgramEligible: boolean;
  forgivenessProgramDetails?: string;
  defermentStatus: 'active' | 'available' | 'used' | 'notAvailable';
  refinancingConsidered: boolean;
}

// PersonalLoan interface with specific properties
export interface PersonalLoan extends BaseDebt {
  // Personal loan specific fields
  purpose: string;
  isSecured: boolean;
}

// OtherDebt interface with specific properties
export interface OtherDebt extends BaseDebt {
  // Other debt specific fields
  debtType: 'homeEquity' | 'business' | 'family' | 'medical' | 'tax' | 'other';
  specificType?: string;
  paymentPlan?: string;
  specialTerms?: string;
}




export interface DebtProfileForm {
  // Collections of different debt types
  mortgages: Mortgage[];
  autoLoans: AutoLoan[];
  studentLoans: StudentLoan[];
  creditCards: CreditCard[];
  personalLoans: PersonalLoan[];
  otherDebts: OtherDebt[];
  
  // Debt strategy information
  debtStrategy: {
    currentStrategy: 'avalanche' | 'snowball' | 'highestInterestFirst' | 'lowestBalanceFirst' | 'none' | 'other';
    customStrategy?: string;
    consolidationPlans: string;
    priorityDebtId?: string; // ID of the debt with highest payoff priority
    bankruptcyHistory: boolean;
    bankruptcyDetails?: string;
    debtSettlementActivities: string;
  };
}

// ======================
// Types for Expenses Form
// ======================

export type ExpenseItem = {
  id: string;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  frequency: string;
  isVariable: boolean;
  variableRange?: {
    min: number;
    max: number;
  };
  isTaxDeductible: boolean;
  priority: string;
  notes: string;
};

export type ExpenseCategory = {
  totalMonthly: number;
  items: ExpenseItem[];
};

export type ExpenseInfoForm = {
  housing: ExpenseCategory;
  utilities: ExpenseCategory;
  food: ExpenseCategory;
  transportation: ExpenseCategory;
  insurance: ExpenseCategory;
  healthcare: ExpenseCategory;
  dependentCare: ExpenseCategory;
  debtPayments: ExpenseCategory;
  discretionary: ExpenseCategory;
  financialGoals: ExpenseCategory;
  periodicExpenses: ExpenseCategory;
  businessExpenses: ExpenseCategory;
};

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export const categoryOptions = [
  "Housing", 
  "Utilities", 
  "Food", 
  "Transportation", 
  "Insurance", 
  "Healthcare", 
  "Dependent Care", 
  "Debt Payments", 
  "Discretionary", 
  "Financial Goals", 
  "Periodic Expenses", 
  "Business Expenses"
];

export const subcategoryOptions: Record<string, string[]> = {
  "Housing": ["Mortgage/Rent", "Property Taxes", "Home Insurance", "HOA Fees", "Maintenance", "Other"],
  "Utilities": ["Electricity", "Water", "Gas", "Internet", "Phone", "Cable/Streaming", "Other"],
  "Food": ["Groceries", "Dining Out", "Meal Delivery", "Other"],
  "Transportation": ["Car Payment", "Gas", "Public Transit", "Ride Sharing", "Maintenance", "Parking", "Other"],
  "Insurance": ["Health", "Auto", "Life", "Disability", "Other"],
  "Healthcare": ["Doctor Visits", "Prescriptions", "Dental", "Vision", "Other"],
  "Dependent Care": ["Childcare", "Elder Care", "Pet Care", "Other"],
  "Debt Payments": ["Credit Card", "Student Loan", "Personal Loan", "Other"],
  "Discretionary": ["Entertainment", "Shopping", "Subscriptions", "Memberships", "Travel", "Hobbies", "Other"],
  "Financial Goals": ["Retirement", "Education Savings", "Emergency Fund", "Investments", "Other"],
  "Periodic Expenses": ["Annual Insurance", "Vehicle Registration", "Gifts", "Professional Services", "Taxes", "Seasonal", "Other"],
  "Business Expenses": ["Office Space", "Supplies", "Services", "Travel", "Other"]
};

export const frequencyOptions = ["Daily", "Weekly", "Bi-weekly", "Monthly", "Quarterly", "Semi-annually", "Annually"];
export const priorityOptions = ["Essential", "Important", "Nice to Have", "Optional"];

// ======================
// Types for Emergency Form
// ======================

// src/components/EmergencyFunds/types.ts

// Sub-component for emergency savings account
export type EmergencySavingsAccount = {
  id: string;
  accountType: string;
  institution: string;
  amount: number;
  interestRate: number;
  liquidityPeriod: string;
};

// Type for emergency fund usage history
export type EmergencyFundUsage = {
  id: string;
  date: string; // YYYY-MM format
  amount: number;
  purpose: string;
  replenishmentTime: number; // in months
};

// Type for additional safety nets
export type SafetyNet = {
  id: string;
  type: string;
  details: string;
  limit?: number;
  available?: number;
};

// Type for the emergency funds form data
export type EmergencyFundsForm = {
  // Current emergency savings
  totalEmergencySavings: number;
  savingsAccounts: EmergencySavingsAccount[];
  
  // Emergency fund coverage
  monthlyEssentialExpenses: number;
  targetCoverageMonths: number;
  
  // Emergency fund usage history
  hasUsedEmergencyFunds: boolean;
  usageHistory: EmergencyFundUsage[];
  
  // Additional safety nets
  hasLineOfCredit: boolean;
  creditLines: SafetyNet[];
  hasInsuranceCoverage: boolean;
  insuranceCoverage: SafetyNet[];
  hasFamilySupport: boolean;
  familySupportDetails: string;
  otherLiquidAssets: number;
  
  // Emergency fund strategy
  monthlyContribution: number;
  targetCompletionDate: string; // YYYY-MM format
  
  // Risk assessment
  jobSecurityLevel: number; // 1-5 scale
  healthConsiderations: string;
  majorUpcomingExpenses: string;
  dependentCount: number;
};

// Constants for dropdown menus
export const ACCOUNT_TYPE_OPTIONS = [
  "High-yield savings account", 
  "Money market account", 
  "Checking account", 
  "Cash", 
  "Certificate of deposit (CD)", 
  "Treasury bills", 
  "Other"
];

export const LIQUIDITY_PERIOD_OPTIONS = [
  "Same day",
  "1-2 business days",
  "3-5 business days",
  "1-2 weeks",
  "1+ month",
  "Early withdrawal penalty applies"
];

export const CREDIT_LINE_TYPE_OPTIONS = [
  "Credit card",
  "Personal line of credit",
  "Home equity line of credit (HELOC)",
  "Margin account",
  "Other"
];

export const INSURANCE_TYPE_OPTIONS = [
  "Health insurance",
  "Disability insurance",
  "Critical illness insurance",
  "Property insurance",
  "Car insurance",
  "Life insurance",
  "Umbrella policy",
  "Other"
];


// ======================
// Types for WealthView Form
// ======================

export type InfoProps = {
  label: string;
  value: string | number;
};

// Type for the form data
export type PersonalInfoForm = {
  id?: string;
  // Age and Retirement
  currentAge: number;
  expectedRetirementAge: number;

  // Marital Status and Family
  maritalStatus: string;
  spouseAge?: number |null;
  dependentsCount: number;
  dependentAges: string; // Comma-separated ages
  supportingParents: boolean;
  supportingAdultChildren: boolean;
  supportingOtherRelatives: boolean;

  // Employment
  employmentStatus: string;
  profession: string;
  yearsInPosition: number;
  expectedCareerChange: string;
  careerChangeYears?: number | null;
  hasPension: boolean;
  has401kMatch: boolean;
  hasStockOptions: boolean;

  // Health
  healthStatus: string;
  familyHealthConcerns: string[];
  medicalConditions: string[];
  otherMedicalConditions: string;
  futureCareNeeds: string[];
  longTermCare: number; // 1-5 scale

  // Risk Tolerance
  riskTolerance: number;
  investmentResponse: string;
  investmentExperience: string[];
  majorInvestmentTimeHorizon: number;
  lifestyleSacrifice: number;
};


// export type PlaidAccounts = {
//   accounts: never[];
//   account_id: string;
//   name: string;
//   official_name: string | null;
//   type: string;
//   subtype: string;
//   balances: {
//     available: number | null;
//     current: number | null;
//     limit: number | null;
//     iso_currency_code: string;
//   };
//   mask: string;
//   holder_category: string;
// }

export type PlaidAccount = {
  account_id: string;
  name: string;
  type: string;
  subtype: string;
  balances: {
    available: number | null;
    current: number | null;
    limit: number | null;
    iso_currency_code?: string;
  };
  mask: string;
}

export type PlaidAccountsData = {
  accounts: PlaidAccount[];
  item: {
    institution_id: string;
    name?: string;
    item_id?: string;
    institution_name?:string;
  };
}

export type Transactions = {
  transactions: TransactionItem[]
}
export type TransactionItem =  {
    transaction_id: string;
    date: string;
    name: string;
    amount: number;
    category: string[];
    pending: boolean;
  }

  export type IdentityOwner = {
    names: string[];
    phone_numbers: {
      data: string;
      primary: boolean;
      type: string;
    }[];
    emails: {
      data: string;
      primary: boolean;
      type: string;
    }[];
    addresses: {
      data: {
        street: string;
        city: string;
        region: string;
        postal_code: string;
        country: string;
      };
      primary: boolean;
    }[];
  }
  
  export type IdentityData = {
    accounts: {
      account_id: string;
      balances: {
        available: number;
        current: number;
        limit: number | null;
      };
      mask: string;
      name: string;
      official_name: string | null;
      subtype: string;
      type: string;
      owners: IdentityOwner[];
    }[];
    item: {
      institution_id: string;
      institution_name: string;
    };
  }

  export type PlaidInvestmentTransaction = {
    investment_transaction_id: string;
    account_id: string;
    security_id: string;
    date: string;
    name: string;
    quantity: number;
    amount: number;
    price: number;
    fees: number | null;
    type: string;
    subtype: string;
    iso_currency_code: string;
  }

  export type PlaidInvestmentTransactions = {
    total_investment_transactions: number;
    securities: Security[];
    investment_transactions: PlaidInvestmentTransaction[];
    accounts: PlaidAccount[]
  }

  export type Security = {
    security_id: string;
    name: string;
    ticker_symbol: string;
    type: string;
    close_price: number;
    close_price_as_of: string;
  }

  export type PlaidPortfolio = {
    holdings: Holding[];
    securities: Security[];
    accounts: PlaidAccount[]
  }
  
  export type Holding = {
    account_id: string;
    security_id: string;
    quantity: number;
    cost_basis: number | null;
    institution_value: number | null;
    institution_price: number | null;
    institution_price_as_of: string | null;
  }

  export type PlaidCreditCardLiability = {
    account_id: string;
    aprs: {
      apr_type: string;
      apr_percentage: number;
      balance_subject_to_apr: number;
      interest_charge_amount: number;
    }[];
    is_overdue: boolean;
    last_payment_amount: number;
    last_payment_date: string;
    last_statement_issue_date: string;
    last_statement_balance: number;
    minimum_payment_amount: number;
    next_payment_due_date: string;
  }
  
  export type PlaidStudentLoan = {
    account_id: string;
    account_number: string;
    disbursement_dates: string[];
    expected_payoff_date: string;
    guarantor: string;
    interest_rate_percentage: number;
    is_overdue: boolean;
    last_payment_amount: number;
    last_payment_date: string;
    last_statement_issue_date: string;
    loan_name: string;
    loan_status: {
      type: string;
      end_date: string;
    };
    minimum_payment_amount: number;
    next_payment_due_date: string;
    origination_date: string;
    origination_principal_amount: number;
    outstanding_interest_amount: number;
    payment_reference_number: string;
    pslf_status: {
      estimated_eligibility_date: string;
      payments_made: number;
      payments_remaining: number;
    };
    repayment_plan: {
      description: string;
      type: string;
    };
    sequence_number: string;
    servicer_address: {
      city: string;
      country: string;
      postal_code: string;
      region: string;
      street: string;
    };
    ytd_interest_paid: number;
    ytd_principal_paid: number;
  }
  
  export type PlaidMortgage = {
    account_id: string;
    account_number: string;
    current_late_fee: number;
    escrow_balance: number;
    has_pmi: boolean;
    has_prepayment_penalty: boolean;
    interest_rate: {
      percentage: number;
      type: string;
    };
    last_payment_amount: number;
    last_payment_date: string;
    loan_term: string;
    loan_type_description: string;
    maturity_date: string;
    next_monthly_payment: number;
    next_payment_due_date: string;
    origination_date: string;
    origination_principal_amount: number;
    past_due_amount: number;
    property_address: {
      city: string;
      country: string;
      postal_code: string;
      region: string;
      street: string;
    };
    ytd_interest_paid: number;
    ytd_principal_paid: number;
    ytd_taxes_insurance_fees_paid: number;
  }
  
  export type LiabilitiesData = {
    credit: PlaidCreditCardLiability[];
    mortgage: PlaidMortgage[];
    student: PlaidStudentLoan[];
  }
  
  export type PlaidLiabilities = {
    accounts: PlaidAccount[];
    item: [];
    liabilities: LiabilitiesData
  }

  export type p_u_token = {
    user_token: string;
  }
  
  export type p_u_link = {
    link_token: string;
  }
  
  export type tokenExchangeMetaData = {
    institution: string;
    accounts: string;
  }
  


// Windfall types
export interface Windfall {
  amount: number;
  source: string;
  taxable: boolean;
}

// Personal information types
export interface PersonalInfo {
  age: number;
  taxBracket: number;
  income: number;
  monthlyExpenses: number;
  timeHorizon: string; // 'short', 'medium', 'long'
}

// Debt types
export interface Debt {
  type: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

// Investment types
export interface Investment {
  vehicle: string;
  balance: number;
}

// Financial situation types
export interface FinancialSituation {
  emergencyFund: number;
  retirementSavings: number;
  hasEmergencyFund: boolean;
  monthsOfExpenses: number;
  debts: Debt[];
  existingInvestments: Investment[];
}

// Large purchase types
export interface LargePurchase {
  type: string;
  timeframe: number;
  estimatedAmount: number;
}

// Goals and priorities types
export interface Goals {
  primaryGoal: string;
  additionalGoals: string[];
  plannedLargePurchases: LargePurchase[];
  priorities: {
    debtReduction: number;
    emergencyFund: number;
    retirement: number;
    shortTermSavings: number;
    longTermGrowth: number;
  };
}


// Investment preferences types
export interface InvestmentPreferences {
  riskTolerance: string;
  customAllocation: AssetAllocation;
  preferredVehicles: string[];
  excludedSectors: string[];
  esgFocus: boolean;
  feeSensitivity: string;
  managementPreference: string;
}

// Recommendation type
export interface Recommendation {
  category: string;
  action: string;
  amount: number;
  rationale: string;
  vehicle: string;
  allocation?: AssetAllocation;
}

// Projection type
export interface Projection {
  year: number;
  value: number;
  conservativeValue: number;
  aggressiveValue: number;
}

// Debt payoff plan
export interface DebtPayoffPlan {
  [key: string]: {
    originalBalance: number;
    amountPaid: number;
    remainingBalance: number;
    interestSaved: number;
  };
}

// Tax strategy
export interface TaxStrategy {
  strategy: string;
  description: string;
  potentialSavings: number | string;
}

// Category allocation
export interface CategoryAllocation {
  debtPayoff: number;
  emergencyFund: number;
  retirement: number;
  shortTermGoals: number;
  longTermInvestment: number;
  education: number;
  charity: number;
  reserve: number;
}

// Optimization results types
export interface OptimizationResults {
  recommendations: Recommendation[];
  allocationByCategory: CategoryAllocation;
  projections: Projection[];
  debtPayoffPlan: DebtPayoffPlan;
}

// Tax implications types
export interface TaxImplications {
  estimatedTaxImpact: number;
  taxSavingStrategies: TaxStrategy[];
}

// Props for step components
export interface StepProps {
  windfall: Windfall;
  setWindfall: (windfall: Windfall) => void;
  personalInfo: PersonalInfo;
  setPersonalInfo: (personalInfo: PersonalInfo) => void;
  financialSituation: FinancialSituation;
  setFinancialSituation: (financialSituation: FinancialSituation) => void;
  goals: Goals;
  setGoals: (goals: Goals) => void;
  investmentPrefs: InvestmentPreferences;
  setInvestmentPrefs: (investmentPrefs: InvestmentPreferences) => void;
  optimizationResults: OptimizationResults;
  taxImplications: TaxImplications;
}
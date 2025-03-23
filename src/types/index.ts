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
  imageUrl: string;
}

export interface UserCreationData {
    fname: string;
    lname: string;
    email: unknown; // This should be refined based on the actual Clerk type
    age: number;
    location: string;
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

export interface StepProps {
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
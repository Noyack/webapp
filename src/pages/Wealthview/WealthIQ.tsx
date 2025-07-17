/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  LinearProgress,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  TrendingUp,
  AccountBalance,
  School,
  Security,
  Star,
  CheckCircle,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

// Question types and interfaces
type QuestionType = 'text' | 'email' | 'select' | 'radio' | 'checkbox';

interface QuestionOption {
  value: string;
  label: string;
  points: number;
}

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  placeholder?: string;
  options?: QuestionOption[];
  required?: boolean;
}

interface QuizPage {
  id: string;
  questions: Question[];
}

interface QuestionIndex {
  questionId: string;
  globalIndex: number;
  pageIndex: number;
  questionIndex: number;
}

interface ScoreResult {
  rawScore: number;
  iqScore: number;
  maxScore: number;
  percentile: number;
  category: string;
  recommendations: string[];
}

interface PeerComparison {
  category: string;
  percentage: number;
  description: string;
}

// Quiz data - structured as pages with scoring
const quizPages: QuizPage[] = [
  // Page 1 - Personal Information & Financial Goals
  {
    id: 'personal-financial-goals',
    questions: [
      {
        id: 'primaryFinancialGoal',
        type: 'radio',
        question: 'What is your primary financial goal at this stage of your life?',
        required: true,
        options: [
          { value: 'retire_comfortably', label: 'Retire comfortably', points: 5 },
          { value: 'eliminate_debt', label: 'Completely eliminate debt', points: 6 },
          { value: 'purchase_home', label: 'Purchase a home', points: 4 },
          { value: 'start_business', label: 'Start or grow a business', points: 5 },
          { value: 'build_wealth', label: 'Build lasting family wealth', points: 6 },
        ],
      },
      {
        id: 'raiseResponse',
        type: 'radio',
        question: 'If you received a significant raise at work, what would you most likely do first?',
        required: true,
        options: [
          { value: 'invest_save', label: 'Invest or save most of it', points: 5 },
          { value: 'spend_save', label: 'Spend a little and save the rest', points: 3 },
          { value: 'spend_all', label: 'Spend most or all of it immediately', points: 0 },
        ],
      },
      {
        id: 'goalReviewFrequency',
        type: 'radio',
        question: 'How frequently do you actively review and update your financial goals?',
        required: true,
        options: [
          { value: 'monthly', label: 'Monthly', points: 6 },
          { value: 'annually', label: 'Annually', points: 4 },
          { value: 'major_events', label: 'After major life events only', points: 2 },
          { value: 'rarely_never', label: 'Rarely or never', points: 0 },
        ],
      },
    ],
  },
  // Page 2 - Financial Priorities & Strategies
  {
    id: 'financial-priorities',
    questions: [
      {
        id: 'goalPrioritization',
        type: 'radio',
        question: 'How do you typically prioritize short-term versus long-term financial goals?',
        required: true,
        options: [
          { value: 'allocate_equally', label: 'Allocate funds equally', points: 5 },
          { value: 'focus_longterm', label: 'Focus primarily on long-term goals', points: 4 },
          { value: 'prioritize_immediate', label: 'Prioritize immediate needs', points: 2 },
        ],
      },
      {
        id: 'wealthBuildingApproach',
        type: 'radio',
        question: 'Which wealth-building approach aligns most closely with your philosophy?',
        required: true,
        options: [
          { value: 'multiple_streams', label: 'Creating multiple income streams and investing', points: 6 },
          { value: 'maximize_salary', label: 'Maximizing salary and employer benefits', points: 4 },
          { value: 'avoid_risks', label: 'Avoiding financial risks altogether', points: 1 },
        ],
      },
      {
        id: 'unexpectedExpense',
        type: 'radio',
        question: 'How would you handle an unexpected expense of $5,000 tomorrow?',
        required: true,
        options: [
          { value: 'emergency_savings', label: 'Use my emergency savings', points: 6 },
          { value: 'credit_cards', label: 'Use credit cards and repay gradually', points: 2 },
          { value: 'borrow_family', label: 'Borrow from friends or family', points: 1 },
        ],
      },
      {
        id: 'debtManagement',
        type: 'radio',
        question: 'How do you typically manage your debt?',
        required: true,
        options: [
          { value: 'aggressive_payoff', label: 'Aggressively pay off high-interest debt first', points: 6 },
          { value: 'balance_payments', label: 'Balance debt payments with investments', points: 5 },
          { value: 'minimum_only', label: 'Pay only minimum amounts', points: 2 },
        ],
      },
      {
        id: 'inflationResponse',
        type: 'radio',
        question: 'When inflation increases significantly, what is your typical response?',
        required: true,
        options: [
          { value: 'adjust_budget', label: 'Adjust my budget and investments', points: 6 },
          { value: 'cut_spending', label: 'Cut discretionary spending', points: 4 },
          { value: 'ignore_temporarily', label: 'Ignore temporarily', points: 1 },
        ],
      },
    ],
  },
  // Page 3 - Credit & Financial Barriers
  {
    id: 'credit-barriers',
    questions: [
      {
        id: 'creditScoreFactors',
        type: 'radio',
        question: 'Which factors most significantly impact your credit score?',
        required: true,
        options: [
          { value: 'payment_utilization', label: 'Payment history and credit utilization', points: 6 },
          { value: 'length_inquiries', label: 'Length of credit history and new credit inquiries', points: 4 },
          { value: 'types_accounts', label: 'Types of credit accounts used', points: 2 },
          { value: 'not_sure', label: 'I\'m not sure', points: 0 },
        ],
      },
      {
        id: 'financialBarrier',
        type: 'radio',
        question: 'What do you feel is the largest barrier preventing you from financial success today?',
        required: true,
        options: [
          { value: 'high_costs_debt', label: 'High cost of living and debt', points: 5 },
          { value: 'lack_education', label: 'Lack of financial education', points: 4 },
          { value: 'insufficient_income', label: 'Insufficient income', points: 3 },
          { value: 'unclear_priorities', label: 'Unclear financial priorities', points: 2 },
        ],
      },
    ],
  },
  // Page 4 - Risk Tolerance & Investment Behavior
  {
    id: 'risk-tolerance',
    questions: [
      {
        id: 'portfolioDropResponse',
        type: 'radio',
        question: 'How would you respond if your investment portfolio dropped 10% in one month?',
        required: true,
        options: [
          { value: 'sell_everything', label: 'Sell everything immediately', points: 1 },
          { value: 'shift_safer', label: 'Shift to safer assets', points: 3 },
          { value: 'stay_invested', label: 'Stay invested, no changes', points: 5 },
          { value: 'buy_more', label: 'Buy more investments at lower prices', points: 6 },
        ],
      },
      {
        id: 'investmentHorizon',
        type: 'radio',
        question: 'What is your preferred investment time horizon?',
        required: true,
        options: [
          { value: 'less_3_years', label: 'Less than 3 years', points: 1 },
          { value: '3_5_years', label: '3–5 years', points: 3 },
          { value: '5_10_years', label: '5–10 years', points: 5 },
          { value: 'more_10_years', label: 'More than 10 years', points: 6 },
        ],
      },
      {
        id: 'riskComfort',
        type: 'radio',
        question: 'How comfortable are you with high-risk investments?',
        required: true,
        options: [
          { value: 'very_comfortable', label: 'Very comfortable', points: 6 },
          { value: 'moderately_comfortable', label: 'Moderately comfortable', points: 4 },
          { value: 'not_comfortable', label: 'Not comfortable at all', points: 1 },
        ],
      },
      {
        id: 'portfolioDiversification',
        type: 'radio',
        question: 'If you had $10,000 to invest, how would you diversify it?',
        required: true,
        options: [
          { value: 'all_in_one', label: 'All in one investment', points: 0 },
          { value: 'stocks_bonds', label: 'Evenly split between stocks and bonds', points: 4 },
          { value: 'multiple_assets', label: 'Spread across multiple asset types', points: 6 },
          { value: 'safe_assets', label: 'Mostly cash or safe assets', points: 2 },
        ],
      },
      {
        id: 'speculativeInvestments',
        type: 'radio',
        question: 'How do you approach speculative investments like cryptocurrency?',
        required: true,
        options: [
          { value: 'frequently_invest', label: 'Frequently invest', points: 6 },
          { value: 'occasionally_small', label: 'Occasionally invest small amounts', points: 4 },
          { value: 'rarely_invest', label: 'Rarely invest', points: 2 },
          { value: 'never_invest', label: 'Never invest', points: 1 },
        ],
      },
    ],
  },
  // Page 5 - Investment Strategy & Financial Knowledge
  {
    id: 'investment-strategy',
    questions: [
      {
        id: 'recessionReaction',
        type: 'radio',
        question: 'How do you typically react to news predicting a recession?',
        required: true,
        options: [
          { value: 'shift_safer', label: 'Shift investments to safer assets', points: 2 },
          { value: 'maintain_strategy', label: 'Maintain current strategy', points: 4 },
          { value: 'increase_investments', label: 'Increase investments in discounted assets', points: 6 },
        ],
      },
      {
        id: 'portfolioRebalancing',
        type: 'radio',
        question: 'How often do you rebalance your investment portfolio?',
        required: true,
        options: [
          { value: 'annually', label: 'At least annually', points: 5 },
          { value: 'occasionally', label: 'Occasionally', points: 3 },
          { value: 'never', label: 'Never', points: 1 },
        ],
      },
      {
        id: 'shortTermLosses',
        type: 'radio',
        question: 'Are short-term losses acceptable if there\'s potential for long-term gains?',
        required: true,
        options: [
          { value: 'always_acceptable', label: 'Always acceptable', points: 6 },
          { value: 'sometimes_acceptable', label: 'Sometimes acceptable', points: 4 },
          { value: 'never_acceptable', label: 'Never acceptable', points: 1 },
        ],
      },
      {
        id: 'investmentEvaluation',
        type: 'radio',
        question: 'When evaluating a new investment opportunity, what factor is most important?',
        required: true,
        options: [
          { value: 'potential_return', label: 'Potential return on investment', points: 2 },
          { value: 'risk_tolerance', label: 'Risk relative to my tolerance', points: 6 },
          { value: 'recommendations', label: 'Recommendations from friends or social media', points: 0 },
          { value: 'popularity', label: 'Popularity of the investment', points: 0 },
        ],
      },
      {
        id: 'assetAllocation',
        type: 'radio',
        question: 'What does the term "asset allocation" mean?',
        required: true,
        options: [
          { value: 'buying_selling', label: 'Actively buying and selling assets', points: 0 },
          { value: 'distributing_investments', label: 'Distributing investments across different asset types to manage risk', points: 6 },
          { value: 'paying_debts', label: 'Allocating funds to pay debts', points: 0 },
          { value: 'emergency_savings', label: 'Saving money specifically for emergencies', points: 0 },
        ],
      },
    ],
  },
  // Page 6 - Financial Knowledge (Objective)
  {
    id: 'financial-knowledge',
    questions: [
      {
        id: 'inflationPurchasingPower',
        type: 'radio',
        question: 'If inflation exceeds your savings rate, your purchasing power:',
        required: true,
        options: [
          { value: 'increases', label: 'Increases', points: 0 },
          { value: 'unchanged', label: 'Remains unchanged', points: 0 },
          { value: 'decreases', label: 'Decreases', points: 6 },
          { value: 'not_sure', label: 'I\'m not sure', points: 0 },
        ],
      },
      {
        id: 'interestRatesBonds',
        type: 'radio',
        question: 'When interest rates rise, bond prices generally:',
        required: true,
        options: [
          { value: 'increase', label: 'Increase', points: 0 },
          { value: 'decrease', label: 'Decrease', points: 6 },
          { value: 'stay_same', label: 'Stay the same', points: 0 },
          { value: 'dont_know', label: 'I don\'t know', points: 0 },
        ],
      },
      {
        id: 'mostLiquidAsset',
        type: 'radio',
        question: 'Which asset is considered most liquid?',
        required: true,
        options: [
          { value: 'real_estate', label: 'Real estate', points: 0 },
          { value: 'savings_account', label: 'Savings account', points: 6 },
          { value: 'private_equity', label: 'Private equity investments', points: 0 },
          { value: 'collectibles', label: 'Fine art or collectibles', points: 0 },
        ],
      },
      {
        id: 'retirementAccount',
        type: 'radio',
        question: 'Which retirement account offers tax-free growth and withdrawals during retirement?',
        required: true,
        options: [
          { value: 'traditional_ira', label: 'Traditional IRA', points: 0 },
          { value: 'roth_ira', label: 'Roth IRA', points: 6 },
          { value: '401k', label: '401(k) account', points: 0 },
          { value: 'taxable_brokerage', label: 'Taxable brokerage account', points: 0 },
        ],
      },
      {
        id: 'properDiversification',
        type: 'radio',
        question: 'Proper diversification involves:',
        required: true,
        options: [
          { value: 'only_stocks', label: 'Investing only in stocks', points: 0 },
          { value: 'only_bonds', label: 'Investing only in bonds', points: 0 },
          { value: 'multiple_classes', label: 'Investing across multiple asset classes', points: 6 },
          { value: 'cash_only', label: 'Keeping investments in cash', points: 0 },
        ],
      },
    ],
  },
  // Page 7 - Emergency Fund & Budgeting
  {
    id: 'emergency-budgeting',
    questions: [
      {
        id: 'emergencyFund',
        type: 'radio',
        question: 'An ideal emergency fund should cover:',
        required: true,
        options: [
          { value: '3_6_months', label: '3–6 months of living expenses', points: 6 },
          { value: '1_2_months', label: '1–2 months of living expenses', points: 3 },
          { value: 'rely_credit', label: 'No savings; rely on credit', points: 0 },
        ],
      },
      {
        id: 'budgetingMethod',
        type: 'radio',
        question: 'The most effective way to budget monthly expenses is to:',
        required: true,
        options: [
          { value: 'track_monthly', label: 'Track every expense monthly', points: 6 },
          { value: 'review_annually', label: 'Review annually only', points: 2 },
          { value: 'spend_first', label: 'Spend first, save what\'s left', points: 0 },
        ],
      },
      {
        id: 'earlyWithdrawals',
        type: 'radio',
        question: 'Early withdrawals from retirement accounts generally result in:',
        required: true,
        options: [
          { value: 'bonus_interest', label: 'Bonus interest payments', points: 0 },
          { value: 'taxes_penalties', label: 'Taxes and penalties', points: 6 },
          { value: 'increased_returns', label: 'Increased investment returns', points: 0 },
          { value: 'no_effect', label: 'No financial effect', points: 0 },
        ],
      },
      {
        id: 'ruleOf72',
        type: 'radio',
        question: 'What does the Rule of 72 calculate?',
        required: true,
        options: [
          { value: 'years_double', label: 'Years to double investment at a given interest rate', points: 6 },
          { value: 'interest_rate', label: 'Interest rate needed to double investment in specific years', points: 4 },
          { value: 'loan_payments', label: 'Monthly loan payments', points: 0 },
          { value: 'tax_liability', label: 'Tax liability', points: 0 },
        ],
      },
      {
        id: 'debtRepaymentMethod',
        type: 'radio',
        question: 'Which debt repayment method minimizes total interest paid?',
        required: true,
        options: [
          { value: 'debt_snowball', label: 'Debt snowball', points: 2 },
          { value: 'debt_avalanche', label: 'Debt avalanche', points: 6 },
          { value: 'debt_consolidation', label: 'Debt consolidation', points: 4 },
          { value: 'minimum_only', label: 'Minimum payments only', points: 0 },
        ],
      },
    ],
  },
  // Page 8 - Alternative Investments & Business
  {
    id: 'alternative-investments',
    questions: [
      {
        id: 'alternativeInvestments',
        type: 'radio',
        question: 'Which type of alternative investment most appeals to you?',
        required: true,
        options: [
          { value: 'real_estate', label: 'Real estate', points: 6 },
          { value: 'private_equity', label: 'Private equity or venture capital', points: 6 },
          { value: 'digital_assets', label: 'Digital assets like crypto', points: 4 },
          { value: 'collectibles', label: 'Collectibles (art, wine, etc.)', points: 3 },
          { value: 'none', label: 'None of these', points: 0 },
        ],
      },
      {
        id: 'businessInterest',
        type: 'radio',
        question: 'How interested are you in starting or owning your own business or side hustle?',
        required: true,
        options: [
          { value: 'already_own', label: 'Already own a business', points: 6 },
          { value: 'actively_planning', label: 'Actively planning to start one soon', points: 5 },
          { value: 'open_to_idea', label: 'Open to the idea under the right conditions', points: 3 },
          { value: 'not_interested', label: 'Not interested at all', points: 1 },
        ],
      },
    ],
  },
  // Page 9 - Tax & Estate Planning
  {
    id: 'tax-estate-planning',
    questions: [
      {
        id: 'taxPlanningStrategy',
        type: 'radio',
        question: 'How would you describe your current tax planning strategy?',
        required: true,
        options: [
          { value: 'highly_strategic', label: 'Highly strategic and proactive', points: 6 },
          { value: 'somewhat_planned', label: 'Somewhat planned and strategic', points: 4 },
          { value: 'minimal_planning', label: 'Minimal planning', points: 2 },
          { value: 'no_planning', label: 'No planning', points: 1 },
        ],
      },
      {
        id: 'estatePlan',
        type: 'radio',
        question: 'Do you currently have an estate plan in place?',
        required: true,
        options: [
          { value: 'comprehensive', label: 'Yes, comprehensive plan', points: 6 },
          { value: 'basic_will', label: 'Just a basic will', points: 4 },
          { value: 'no_plan', label: 'No plan at all', points: 2 },
          { value: 'dont_need', label: 'I don\'t think I need one', points: 1 },
        ],
      },
      {
        id: 'debtStrategy',
        type: 'radio',
        question: 'Which debt repayment strategy effectively minimizes total interest payments?',
        required: true,
        options: [
          { value: 'snowball', label: 'Debt snowball', points: 2 },
          { value: 'avalanche', label: 'Debt avalanche', points: 6 },
          { value: 'consolidation', label: 'Debt consolidation loans', points: 4 },
          { value: 'minimum', label: 'Making only minimum payments', points: 0 },
        ],
      },
    ],
  },
  // Page 10 - Financial Independence & Investment Support
  {
    id: 'financial-independence',
    questions: [
      {
        id: 'financialIndependencePlan',
        type: 'radio',
        question: 'What\'s your plan to achieve financial independence?',
        required: true,
        options: [
          { value: 'multiple_income', label: 'Building multiple income streams and investing', points: 6 },
          { value: 'grow_salary', label: 'Growing my salary and advancing my career', points: 4 },
          { value: 'exploring_options', label: 'I\'m exploring options but unsure', points: 3 },
          { value: 'not_possible', label: 'I don\'t think financial independence is possible for me', points: 1 },
        ],
      },
      {
        id: 'professionalSupport',
        type: 'radio',
        question: 'Do you currently use any professional investment support?',
        required: true,
        options: [
          { value: 'financial_advisor', label: 'Yes, I work with a financial planner or advisor', points: 6 },
          { value: 'robo_advisor', label: 'I use a robo-advisor or automated platform', points: 4 },
          { value: 'manage_myself', label: 'I manage everything myself', points: 3 },
          { value: 'dont_trust', label: 'I don\'t use or trust financial advisors', points: 1 },
        ],
      },
      {
        id: 'passiveIncome',
        type: 'radio',
        question: 'Have you started earning any passive income?',
        required: true,
        options: [
          { value: 'existing_sources', label: 'Yes, I have existing sources of passive income', points: 6 },
          { value: 'researching', label: 'I\'m researching how to build some', points: 4 },
          { value: 'open_but_not_started', label: 'I\'m open to the idea but haven\'t started', points: 3 },
          { value: 'not_interested', label: 'I\'m not interested in passive income', points: 1 },
        ],
      },
      {
        id: 'assetAllocationStrategy',
        type: 'radio',
        question: 'How would you describe your current asset allocation strategy?',
        required: true,
        options: [
          { value: 'aggressive_growth', label: 'Aggressively focused on growth and alternatives', points: 6 },
          { value: 'balanced', label: 'Balanced across several types of investments', points: 4 },
          { value: 'conservative', label: 'Conservative and risk-averse', points: 3 },
          { value: 'dont_know', label: 'I don\'t know what asset allocation means', points: 1 },
        ],
      },
      {
        id: 'esgFactors',
        type: 'radio',
        question: 'How important are environmental, social, and governance (ESG) factors in your investment decisions?',
        required: true,
        options: [
          { value: 'very_important', label: 'Very important—I prioritize sustainable investments', points: 5 },
          { value: 'somewhat_important', label: 'Somewhat important—I consider ESG when possible', points: 3 },
          { value: 'not_important', label: 'Not important—I only focus on financial returns', points: 1 },
        ],
      },
    ],
  },
];

// Storage key for localStorage
const QUIZ_STORAGE_KEY = 'wealth_iq_quiz_progress';
const QUIZ_RESULTS_KEY = 'wealth_iq_quiz_results';

// Utility functions
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

// Performance optimization: Memoized calculations
const useQuizCalculations = () => {
  const allQuestions = useMemo(() => {
    const questions: Question[] = [];
    quizPages.forEach(page => {
      questions.push(...page.questions);
    });
    return questions;
  }, []);

  const questionIndexMap = useMemo(() => {
    const indexMap = new Map<string, QuestionIndex>();
    let globalIndex = 0;
    
    quizPages.forEach((page, pageIndex) => {
      page.questions.forEach((question, questionIndex) => {
        indexMap.set(question.id, {
          questionId: question.id,
          globalIndex: globalIndex + 1,
          pageIndex,
          questionIndex,
        });
        globalIndex++;
      });
    });
    
    return indexMap;
  }, []);

  const validationSchema = useMemo(() => {
    const schemaFields: any = {};
    
    allQuestions.forEach(question => {
      if (question.required) {
        switch (question.type) {
          case 'email':
            schemaFields[question.id] = Yup.string()
              .email('Invalid email format')
              .required('This field is required');
            break;
          case 'checkbox':
            schemaFields[question.id] = Yup.array()
              .min(1, 'Please select at least one option')
              .required('This field is required');
            break;
          default:
            schemaFields[question.id] = Yup.string()
              .required('This field is required');
        }
      }
    });
    
    return Yup.object(schemaFields);
  }, [allQuestions]);

  const initialValues = useMemo(() => {
    const values: Record<string, any> = {};
    allQuestions.forEach(question => {
      values[question.id] = question.type === 'checkbox' ? [] : '';
    });
    return values;
  }, [allQuestions]);

  return {
    allQuestions,
    questionIndexMap,
    validationSchema,
    initialValues,
  };
};

// Enhanced scoring with peer comparison
const calculateEnhancedScore = (values: Record<string, any>, allQuestions: Question[]): ScoreResult => {
  let totalScore = 0;
  
  allQuestions.forEach(question => {
    if (question.options && values[question.id]) {
      const selectedOption = question.options.find(option => option.value === values[question.id]);
      if (selectedOption) {
        totalScore += selectedOption.points;
      }
    }
  });
  
  const maxScore = 240; // 40 questions x 6 points max
  const iqScore = Math.round(((totalScore / maxScore) * 120) + 60);
  const percentile = Math.round((totalScore / maxScore) * 100);
  
  let category = '';
  let recommendations: string[] = [];
  
  if (iqScore >= 140) {
    category = 'Financial Genius';
    recommendations = [
      'Consider advanced investment strategies like private equity',
      'Explore tax optimization and estate planning',
      'Look into wealth preservation techniques',
    ];
  } else if (iqScore >= 130) {
    category = 'Advanced Investor';
    recommendations = [
      'Diversify into alternative investments',
      'Consider real estate investment trusts (REITs)',
      'Explore international market opportunities',
    ];
  } else if (iqScore >= 120) {
    category = 'Skilled Manager';
    recommendations = [
      'Optimize your asset allocation strategy',
      'Increase emergency fund to 6-12 months',
      'Consider working with a financial advisor',
    ];
  } else if (iqScore >= 110) {
    category = 'Growing Learner';
    recommendations = [
      'Focus on building a solid emergency fund',
      'Start with index fund investing',
      'Learn about dollar-cost averaging',
    ];
  } else if (iqScore >= 90) {
    category = 'Foundation Builder';
    recommendations = [
      'Create and stick to a monthly budget',
      'Build an emergency fund of 3-6 months expenses',
      'Learn basic investment principles',
    ];
  } else {
    category = 'Getting Started';
    recommendations = [
      'Focus on eliminating high-interest debt',
      'Start with basic budgeting and saving',
      'Consider financial literacy courses',
    ];
  }
  
  return {
    rawScore: totalScore,
    iqScore,
    maxScore,
    percentile,
    category,
    recommendations,
  };
};

// Peer comparison data
const getPeerComparisons = (iqScore: number): PeerComparison[] => {
  return [
    {
      category: 'Investment Knowledge',
      percentage: Math.min(95, Math.max(5, (iqScore - 60) * 1.5)),
      description: 'compared to other quiz takers',
    },
    {
      category: 'Risk Management',
      percentage: Math.min(90, Math.max(10, (iqScore - 65) * 1.4)),
      description: 'in understanding financial risks',
    },
    {
      category: 'Financial Planning',
      percentage: Math.min(95, Math.max(5, (iqScore - 55) * 1.6)),
      description: 'in long-term planning skills',
    },
  ];
};

// Data persistence functions
const saveQuizProgress = (data: any) => {
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save quiz progress:', error);
  }
};

const loadQuizProgress = () => {
  try {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load quiz progress:', error);
    return null;
  }
};

const saveQuizResults = (results: ScoreResult) => {
  try {
    localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(results));
  } catch (error) {
    console.warn('Failed to save quiz results:', error);
  }
};

const WealthIQQuiz: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState<ScoreResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { allQuestions, questionIndexMap, validationSchema, initialValues } = useQuizCalculations();
  const totalPages = quizPages.length;
  const progress = (currentPage / totalPages) * 100;

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = loadQuizProgress();
    if (savedProgress) {
      setCurrentPage(savedProgress.currentPage || 0);
      // Formik will handle restoring form values
    }
  }, []);

  const formik = useFormik({
    initialValues: loadQuizProgress()?.values || initialValues,
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      
      // Sanitize text inputs
      const sanitizedValues = { ...values };
      Object.keys(sanitizedValues).forEach(key => {
        if (typeof sanitizedValues[key] === 'string') {
          sanitizedValues[key] = sanitizeInput(sanitizedValues[key]);
        }
      });

      // Calculate final score with enhanced features
      const score = calculateEnhancedScore(sanitizedValues, allQuestions);
      setFinalScore(score);
      
      // Save results
      saveQuizResults(score);
      
      // Clear progress data
      localStorage.removeItem(QUIZ_STORAGE_KEY);
      
      setIsCompleted(true);
      setIsLoading(false);
      
      console.log('Complete quiz data:', sanitizedValues);
      console.log('Score:', score);
    },
  });

  // Save progress when form values change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveQuizProgress({
        currentPage,
        values: formik.values,
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [currentPage, formik.values]);

  const handleNext = useCallback(async () => {
    const currentPageQuestionIds = quizPages[currentPage]?.questions.map(q => q.id) || [];
    
    // Validate only current page questions
    const currentPageErrors: any = {};
    for (const questionId of currentPageQuestionIds) {
      try {
        const question = allQuestions.find(q => q.id === questionId);
        if (question?.required) {
          if (question.type === 'checkbox') {
            await Yup.array().min(1, 'Please select at least one option').validate(formik.values[questionId]);
          } else if (question.type === 'email') {
            await Yup.string().email('Invalid email format').required('This field is required').validate(formik.values[questionId]);
          } else {
            await Yup.string().required('This field is required').validate(formik.values[questionId]);
          }
        }
      } catch (error: any) {
        currentPageErrors[questionId] = error.message;
      }
    }

    // Set errors for current page
    const touchedFields: any = {};
    currentPageQuestionIds.forEach(id => {
      touchedFields[id] = true;
    });
    formik.setTouched({ ...formik.touched, ...touchedFields });

    // If there are errors on current page, don't proceed
    if (Object.keys(currentPageErrors).length > 0) {
      formik.setErrors({ ...formik.errors, ...currentPageErrors });
      
      // Focus management - focus on first error field
      const firstErrorField = document.querySelector(`[name="${Object.keys(currentPageErrors)[0]}"]`) as HTMLElement;
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    // Proceed to next page or submit
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      // Focus management - focus on first question of next page
      setTimeout(() => {
        const nextPageFirstField = document.querySelector(`[name="${quizPages[currentPage + 1]?.questions[0]?.id}"]`) as HTMLElement;
        if (nextPageFirstField) {
          nextPageFirstField.focus();
        }
      }, 100);
    } else {
      // Submit the complete form
      formik.handleSubmit();
    }
  }, [currentPage, totalPages, formik, allQuestions]);

  const handleBack = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      // Focus management
      setTimeout(() => {
        const prevPageFirstField = document.querySelector(`[name="${quizPages[currentPage - 1]?.questions[0]?.id}"]`) as HTMLElement;
        if (prevPageFirstField) {
          prevPageFirstField.focus();
        }
      }, 100);
    }
  }, [currentPage]);

  const renderQuestion = (question: Question, pageIndex: number, questionIndex: number) => {
    const questionData = questionIndexMap.get(question.id);
    const questionNumber = questionData?.globalIndex || 1;
    const fieldId = `field-${question.id}`;
    const labelId = `label-${question.id}`;

    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <Box key={question.id} sx={{ mb: 4 }}>
            <Typography 
              id={labelId}
              variant="h6" 
              component="label"
              htmlFor={fieldId}
              sx={{ 
                color: '#011E5A',
                mb: 2,
                fontSize: '18px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box component="span" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                {questionNumber}
              </Box>
              <Box component="span" sx={{ color: '#00bcd4' }}>
                →
              </Box>
              {question.question}
            </Typography>
            <TextField
              id={fieldId}
              name={question.id}
              placeholder={question.placeholder}
              value={formik.values[question.id] || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched[question.id] && Boolean(formik.errors[question.id])}
              helperText={formik.touched[question.id] && formik.errors[question.id] ? String(formik.errors[question.id]) : ''}
              fullWidth
              variant="outlined"
              aria-labelledby={labelId}
              aria-required={question.required}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#757575',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                    borderWidth: '2px',
                  }
                }
              }}
            />
          </Box>
        );

      case 'radio':
        return (
          <Box key={question.id} sx={{ mb: 4 }}>
            <Typography 
              id={labelId}
              variant="h6" 
              component="legend"
              sx={{ 
                color: '#011E5A',
                mb: 2,
                fontSize: '18px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box component="span" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                {questionNumber}
              </Box>
              <Box component="span" sx={{ color: '#00bcd4' }}>
                →
              </Box>
              {question.question}
            </Typography>
            <RadioGroup
              name={question.id}
              value={formik.values[question.id] || ''}
              onChange={formik.handleChange}
              aria-labelledby={labelId}
              aria-required={question.required}
            >
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={
                    <Radio 
                      sx={{ 
                        color: '#1976d2',
                        '&.Mui-checked': {
                          color: '#1976d2',
                        }
                      }} 
                    />
                  }
                  label={option.label}
                  sx={{ 
                    mb: 1,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '16px',
                      color: '#333',
                      lineHeight: 1.5,
                    }
                  }}
                />
              ))}
            </RadioGroup>
            {formik.touched[question.id] && formik.errors[question.id] && (
              <Typography color="error" variant="caption" role="alert">
                {String(formik.errors[question.id])}
              </Typography>
            )}
          </Box>
        );

      case 'select':
        return (
          <Box key={question.id} sx={{ mb: 4 }}>
            <Typography 
              id={labelId}
              variant="h6" 
              component="label"
              sx={{ 
                color: '#011E5A',
                mb: 2,
                fontSize: '18px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box component="span" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                {questionNumber}
              </Box>
              <Box component="span" sx={{ color: '#00bcd4' }}>
                →
              </Box>
              {question.question}
            </Typography>
            <FormControl fullWidth>
              <Select
                id={fieldId}
                name={question.id}
                value={formik.values[question.id] || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                displayEmpty
                aria-labelledby={labelId}
                aria-required={question.required}
                sx={{
                  backgroundColor: '#f8f9fa',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#757575',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    borderWidth: '2px',
                  }
                }}
              >
                <MenuItem value="" disabled>
                  {question.placeholder}
                </MenuItem>
                {question.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {formik.touched[question.id] && formik.errors[question.id] && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }} role="alert">
                {String(formik.errors[question.id])}
              </Typography>
            )}
          </Box>
        );

      case 'checkbox':
        return (
          <Box key={question.id} sx={{ mb: 4 }}>
            <Typography 
              id={labelId}
              variant="h6" 
              component="legend"
              sx={{ 
                color: '#011E5A',
                mb: 2,
                fontSize: '18px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box component="span" sx={{ color: '#00bcd4', fontWeight: 'bold' }}>
                {questionNumber}
              </Box>
              <Box component="span" sx={{ color: '#00bcd4' }}>
                →
              </Box>
              {question.question}
            </Typography>
            <FormGroup role="group" aria-labelledby={labelId} aria-required={question.required}>
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={(formik.values[question.id] || []).includes(option.value)}
                      onChange={(e) => {
                        const currentValues = formik.values[question.id] || [];
                        let newValues;
                        
                        if (e.target.checked) {
                          newValues = [...currentValues, option.value];
                        } else {
                          newValues = currentValues.filter((v: string) => v !== option.value);
                        }
                        
                        formik.setFieldValue(question.id, newValues);
                      }}
                      sx={{ 
                        color: '#1976d2',
                        '&.Mui-checked': {
                          color: '#1976d2',
                        }
                      }}
                    />
                  }
                  label={option.label}
                  sx={{ 
                    mb: 1,
                    '& .MuiFormControlLabel-label': {
                      fontSize: '16px',
                      color: '#333',
                      lineHeight: 1.5,
                    }
                  }}
                />
              ))}
            </FormGroup>
            {formik.touched[question.id] && formik.errors[question.id] && (
              <Typography color="error" variant="caption" role="alert">
                {String(formik.errors[question.id])}
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  // Enhanced Results Page
  if (isCompleted && finalScore) {
    const peerComparisons = getPeerComparisons(finalScore.iqScore);
    
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          <Typography variant="h4" sx={{ color: '#1976d2', mb: 2, fontWeight: 'bold' }}>
            Your Wealth IQ
          </Typography>
          
          {/* Circular Progress Visualization */}
          <Box sx={{ position: 'relative', display: 'flex', mb: 4, flexDirection:"column", justifyContent:"center", alignItems:"center" }}>
            <CircularProgress
              variant="determinate"
              value={finalScore.percentile}
              size={100}
              thickness={5}
              sx={{
                color: '#4caf50',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                {finalScore.iqScore}
              </Typography>
            </Box>
          </Box>
              <Typography variant="h6" sx={{ color: '#666' }}>
                Level: {finalScore.category}
              </Typography>
          
          {/* <Typography variant="h5" sx={{ color: '#4caf50', mb: 1 }}>
            {finalScore.percentile}th Percentile
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
            You scored higher than {finalScore.percentile}% of quiz takers
          </Typography> */}
        </Box>

        {/* Peer Comparisons */}
        {/* <Grid container spacing={3} sx={{ mb: 6 }}>
          {peerComparisons.map((comparison, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {index === 0 && <TrendingUp sx={{ fontSize: 40, color: '#4caf50' }} />}
                    {index === 1 && <Security sx={{ fontSize: 40, color: '#ff9800' }} />}
                    {index === 2 && <AccountBalance sx={{ fontSize: 40, color: '#2196f3' }} />}
                  </Box>
                  <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 1 }}>
                    {comparison.percentage}%
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {comparison.category}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {comparison.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid> */}

        {/* Personalized Recommendations */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Star sx={{ color: '#ffc107', mr: 1 }} />
              <Typography variant="h5" sx={{ color: '#1976d2' }}>
                Personalized Recommendations
              </Typography>
            </Box>
            <Grid container spacing={2}>
              {finalScore.recommendations.map((recommendation, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <CheckCircle sx={{ color: '#4caf50', mr: 2, mt: 0.5 }} />
                    <Typography variant="body1" sx={{ flex: 1 }}>
                      {recommendation}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#1976d2', mb: 3 }}>
              Score Breakdown
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Raw Score:</Typography>
                <Typography fontWeight="bold">{finalScore.rawScore} / {finalScore.maxScore}</Typography>
              </Box>
                <Typography variant='caption'>This is used to calculate your Wealth IQ</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Questions Answered:</Typography>
              <Typography fontWeight="bold">{allQuestions.length - 3} financial questions</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Completion Rate:</Typography>
              <Typography fontWeight="bold">100%</Typography>
            </Box>
          </CardContent>
        </Card>
        
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/wealthview')}
          >
            View Your Wealth Profile
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#011E5A',
              fontWeight: 600,
              mb: 1
            }}
          >
            NOYACK Wealth IQ Quiz
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#666',
              fontSize: '16px',
              mb: 2
            }}
          >
            Gain financial literacy today!
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#888',
              fontSize: '14px'
            }}
          >
            Page {currentPage + 1} of {totalPages}
          </Typography>
        </Box>

        {/* Questions */}
        <Box component="form" role="form" aria-label="Wealth IQ Quiz">
          {quizPages[currentPage]?.questions.map((question, index) => 
            renderQuestion(question, currentPage, index)
          )}

          {/* Navigation */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 6 
          }}>
            <IconButton
              onClick={handleBack}
              disabled={currentPage === 0}
              aria-label="Go to previous page"
              sx={{
                backgroundColor: currentPage === 0 ? '#f5f5f5' : 'transparent',
                color: currentPage === 0 ? '#bdbdbd' : '#1976d2',
                '&:hover': {
                  backgroundColor: currentPage === 0 ? '#f5f5f5' : '#e3f2fd',
                },
                '&:focus': {
                  outline: '2px solid #1976d2',
                  outlineOffset: '2px',
                }
              }}
            >
              <ArrowBack />
            </IconButton>

            <Button
              onClick={handleNext}
              disabled={isLoading}
              variant="contained"
              aria-label={currentPage === totalPages - 1 ? 'Complete quiz' : 'Go to next page'}
              sx={{
                backgroundColor: '#1a237e',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '4px',
                textTransform: 'none',
                minWidth: '120px',
                '&:hover': {
                  backgroundColor: '#0d47a1',
                },
                '&:focus': {
                  outline: '2px solid #fff',
                  outlineOffset: '2px',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                }
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                currentPage === totalPages - 1 ? 'Complete Quiz' : 'Next'
              )}
            </Button>
          </Box>
        </Box>
      </Container>
      
      {/* Enhanced Progress Bar */}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}>
        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{ 
            height: 8,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4caf50',
              transition: 'transform 0.4s ease-in-out',
            }
          }}
        />
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute',
            right: 16,
            top: -24,
            color: '#666',
            fontSize: '12px'
          }}
        >
          {Math.round(progress)}% Complete
        </Typography>
      </Box>
    </Box>
  );
};

export default WealthIQQuiz;  
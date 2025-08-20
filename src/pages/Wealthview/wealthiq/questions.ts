import { QuizPage } from "../../../types/wealthIq";

export const quizPages: QuizPage[] = [
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
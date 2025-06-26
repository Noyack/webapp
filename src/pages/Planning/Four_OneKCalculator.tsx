import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  Button,
  ButtonGroup,
  Tooltip,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  ExpandMore as ExpandMoreIcon,
  MonetizationOn as MoneyIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Savings as SavingsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { debounce } from 'lodash';
import ExportButtons from '../../components/ExportButtons';
import { GenericExportData } from '../../utils/exportUtils';
import { 
  FourOhOneKData, 
  PRESET_SCENARIOS, 
  CONTRIBUTION_LIMITS,
  validateAndFormat,
  formatCurrency
} from '../../utils/fourOhOneK';
import { useEnhanced401kCalculations } from '../../hooks/useEnhanced401kCalculations';
import InvestmentDetailsTab from './components/401k/InvestmentDetailsTab';
import AnalysisTab from './components/401k/AnalysisTab';
import TaxStrategyTab from './components/401k/TaxStrategyTab';
import OptimizationTab from './components/401k/OptimizationTab';

const Enhanced401kCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState<FourOhOneKData>({
    currentAge: 30,
    retirementAge: 65,
    annualIncome: 75000,
    currentBalance: 25000,
    monthlyContribution: 500,
    contributionPercent: 8,
    employerMatch: 50,
    employerMatchLimit: 6,
    estimatedReturn: 7,
    totalFees: 1,
    includeInflation: true,
    inflationRate: 3,
    incomeGrowthRate: 3,
    includeCatchUp: false,
    accountType: 'traditional',
    rothPercentage: 0,
    socialSecurityEstimate: 2000,
    riskProfile: 'moderate'
  });

  // Get all calculations from custom hook
  const {
    calculations,
    retirementIncome,
    savingsAssessment,
    chartData,
    feeImpact,
    recommendations
  } = useEnhanced401kCalculations(data);

  // Performance optimization: debounce updates
  const debouncedUpdateRef = useRef(
    debounce((field: keyof FourOhOneKData, value: any) => {
      updateData(field, value);
    }, 300)
  );

  // Update data function with validation
  const updateData = useCallback((field: keyof FourOhOneKData, value: any) => {
    setData(prev => {
      const newData = { ...prev };
      
      // Validate and format based on field type
      if (typeof value === 'number') {
        switch (field) {
          case 'currentAge':
          case 'retirementAge':
            newData[field] = validateAndFormat(value, field === 'retirementAge' ? 'years' : 'age');
            break;
          case 'employerMatch':
          case 'employerMatchLimit':
          case 'estimatedReturn':
          case 'totalFees':
          case 'inflationRate':
          case 'incomeGrowthRate':
          case 'contributionPercent':
          case 'rothPercentage':
            newData[field] = validateAndFormat(value, 'percentage');
            break;
          case 'annualIncome':
          case 'currentBalance':
          case 'monthlyContribution':
          case 'socialSecurityEstimate':
            newData[field] = validateAndFormat(value, 'currency');
            break;
          default:
            newData[field] = value;
        }
      } else {
        newData[field] = value;
      }
      
      // Auto-calculate dependent values
      if (field === 'monthlyContribution' || field === 'annualIncome') {
        newData.contributionPercent = (newData.monthlyContribution * 12) / newData.annualIncome * 100;
      } else if (field === 'contributionPercent') {
        newData.monthlyContribution = (newData.annualIncome * newData.contributionPercent / 100) / 12;
      }
      
      // Auto-enable catch-up for 50+
      if (field === 'currentAge' && newData.currentAge >= 50) {
        newData.includeCatchUp = true;
      }
      
      return newData;
    });
  }, []);

  // Debounced update for better performance
  const handleInputChange = useCallback((field: keyof FourOhOneKData, value: any) => {
    debouncedUpdateRef.current(field, value);
  }, []);

  // Preset scenario handlers
  const applyPreset = useCallback((scenario: keyof typeof PRESET_SCENARIOS) => {
    const preset = PRESET_SCENARIOS[scenario];
    Object.entries(preset).forEach(([key, value]) => {
      updateData(key as keyof FourOhOneKData, value);
    });
  }, [updateData]);

  // Accessibility: Announce important changes
  const [announcement, setAnnouncement] = useState('');
  
  useEffect(() => {
    const { finalBalance, contributionPercent } = calculations;
    setAnnouncement(
      `Updated projection: Final balance ${formatCurrency(finalBalance)} at ${contributionPercent.toFixed(1)}% contribution rate.`
    );
  }, [calculations.finalBalance, calculations.contributionPercent]);

  // Prepare enhanced export data
  const prepareExportData = useCallback((): GenericExportData => {
    const { finalBalance, totalContributions, totalEmployerMatch, totalGrowth, projections } = calculations;
    
    return {
      calculatorName: 'Enhanced 401(k) Calculator',
      inputs: {
        ...data,
        catchUpEligible: data.currentAge >= 50,
        totalAnnualContribution: calculations.totalAnnualContribution
      },
      keyMetrics: [
        { label: 'Final 401(k) Balance', value: formatCurrency(finalBalance) },
        { label: 'Monthly Retirement Income', value: formatCurrency(retirementIncome.totalMonthlyIncome) },
        { label: 'Income Replacement Ratio', value: `${retirementIncome.replacementRatio.toFixed(1)}%` },
        { label: 'Contribution Rate', value: `${calculations.contributionPercent.toFixed(1)}%` },
        { label: 'Employer Match Efficiency', value: `${((calculations.currentEmployerMatch / calculations.maxEmployerMatch) * 100).toFixed(0)}%` },
        { label: 'National Comparison (Balance)', value: `${calculations.nationalComparison.balancePercentile.toFixed(0)}th percentile` },
        { label: 'Tax Benefits (Traditional)', value: formatCurrency(calculations.taxBenefits.traditionalSavings) },
        { label: 'Catch-up Contribution', value: data.includeCatchUp ? formatCurrency(calculations.catchUpContribution) : 'Not eligible' }
      ],
      summary: {
        finalBalance,
        totalContributions,
        totalEmployerMatch,
        totalGrowth,
        retirementIncome: retirementIncome.totalMonthlyIncome,
        replacementRatio: retirementIncome.replacementRatio,
        savingsAssessment: savingsAssessment.level,
        taxStrategy: data.accountType
      },
      tableData: projections.filter((_, index) => index % 5 === 4 || index === projections.length - 1),
      recommendations
    };
  }, [data, calculations, savingsAssessment, retirementIncome, recommendations]);

  return (
    <Box className="enhanced-401k-calculator">
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>
      
      <Typography variant="h4" className="mb-6 text-center text-[#1976D2] font-bold">
        Enhanced 401(k) Calculator
      </Typography>
      
      <Typography variant="body1" className="mb-6 text-center text-gray-600 max-w-3xl mx-auto">
        Advanced 401(k) planning with catch-up contributions, tax strategies, Social Security integration, and national benchmarks.
      </Typography>

      {/* Quick Preset Scenarios */}
      <Card sx={{ mb: 3, bgcolor: '#f8fafc' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon color="primary" />
            Quick Start Scenarios
          </Typography>
          <ButtonGroup variant="outlined" size="small" sx={{ mb: 2 }}>
            <Button 
              onClick={() => applyPreset('conservative')}
              startIcon={<SecurityIcon />}
            >
              Conservative
            </Button>
            <Button 
              onClick={() => applyPreset('moderate')}
              startIcon={<TrendingUpIcon />}
            >
              Moderate
            </Button>
            <Button 
              onClick={() => applyPreset('aggressive')}
              startIcon={<SavingsIcon />}
            >
              Aggressive
            </Button>
          </ButtonGroup>
          <Typography variant="body2" color="textSecondary">
            Choose a preset to get started, then customize your specific situation below.
          </Typography>
        </CardContent>
      </Card>

      {/* Enhanced Savings Overview */}
      <Card sx={{ mb: 3, bgcolor: `${savingsAssessment.color}.50`, border: '1px solid', borderColor: `${savingsAssessment.color}.main` }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h3" color={`${savingsAssessment.color}.main`} fontWeight="bold">
                {calculations.contributionPercent.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">Contribution Rate</Typography>
              <Chip 
                label={`${calculations.nationalComparison.contributionPercentile.toFixed(0)}th percentile`}
                size="small"
                color={calculations.nationalComparison.contributionPercentile > 50 ? 'success' : 'warning'}
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>{savingsAssessment.level} Savings Rate</Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((calculations.contributionPercent / (data.currentAge >= 50 ? 20 : 15)) * 100, 100)}
                color={savingsAssessment.color as 'success' | 'warning' | 'error'}
                sx={{ height: 12, borderRadius: 6, mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">{savingsAssessment.message}</Typography>
            </Grid>
            <Grid item xs={12} md={3} textAlign="center">
              <Typography variant="h5" fontWeight="bold">{formatCurrency(calculations.finalBalance)}</Typography>
              <Typography variant="body2" color="text.secondary">Projected Balance</Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                + {formatCurrency(data.socialSecurityEstimate)}/mo Social Security
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Enhanced Tabs */}
      <Card>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)} 
          variant="fullWidth"
          aria-label="401k calculator sections"
        >
          <Tab 
            label="Investment Details" 
            icon={<AccountBalanceIcon />} 
            iconPosition="start"
            id="tab-investment"
            aria-controls="tabpanel-investment"
          />
          <Tab 
            label="Advanced Analysis" 
            icon={<TrendingUpIcon />} 
            iconPosition="start"
            id="tab-analysis"
            aria-controls="tabpanel-analysis"
          />
          <Tab 
            label="Tax Strategy" 
            icon={<AssessmentIcon />} 
            iconPosition="start"
            id="tab-tax"
            aria-controls="tabpanel-tax"
          />
          <Tab 
            label="Optimization" 
            icon={<SavingsIcon />} 
            iconPosition="start"
            id="tab-optimization"
            aria-controls="tabpanel-optimization"
          />
        </Tabs>

        <CardContent>
          {/* Investment Details Tab */}
          <div
            role="tabpanel"
            hidden={activeTab !== 0}
            id="tabpanel-investment"
            aria-labelledby="tab-investment"
          >
            {activeTab === 0 && (
              <InvestmentDetailsTab 
                data={data}
                calculations={calculations}
                updateData={updateData}
                handleInputChange={handleInputChange}
              />
            )}
          </div>

          {/* Analysis Tab */}
          <div
            role="tabpanel"
            hidden={activeTab !== 1}
            id="tabpanel-analysis"
            aria-labelledby="tab-analysis"
          >
            {activeTab === 1 && (
              <AnalysisTab 
                data={data}
                calculations={calculations}
                retirementIncome={retirementIncome}
                chartData={chartData}
                feeImpact={feeImpact}
              />
            )}
          </div>

          {/* Tax Strategy Tab */}
          <div
            role="tabpanel"
            hidden={activeTab !== 2}
            id="tabpanel-tax"
            aria-labelledby="tab-tax"
          >
            {activeTab === 2 && (
              <TaxStrategyTab 
                data={data}
                calculations={calculations}
                chartData={chartData}
                updateData={updateData}
              />
            )}
          </div>

          {/* Optimization Tab */}
          <div
            role="tabpanel"
            hidden={activeTab !== 3}
            id="tabpanel-optimization"
            aria-labelledby="tab-optimization"
          >
            {activeTab === 3 && (
              <OptimizationTab 
                data={data}
                calculations={calculations}
                retirementIncome={retirementIncome}
                recommendations={recommendations}
              />
            )}
          </div>
        </CardContent>

        {/* Enhanced Export Section */}
        <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom textAlign="center">
            📊 Export Your Enhanced 401(k) Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
            Download comprehensive projections, tax strategies, optimization recommendations, and national comparisons
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <ExportButtons data={prepareExportData()} />
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setData({
                  currentAge: 30,
                  retirementAge: 65,
                  annualIncome: 75000,
                  currentBalance: 25000,
                  monthlyContribution: 500,
                  contributionPercent: 8,
                  employerMatch: 50,
                  employerMatchLimit: 6,
                  estimatedReturn: 7,
                  totalFees: 1,
                  includeInflation: true,
                  inflationRate: 3,
                  incomeGrowthRate: 3,
                  includeCatchUp: false,
                  accountType: 'traditional',
                  rothPercentage: 0,
                  socialSecurityEstimate: 2000,
                  riskProfile: 'moderate'
                });
              }}
            >
              Reset to Defaults
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Enhanced401kCalculator;
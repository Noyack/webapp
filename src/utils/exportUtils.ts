// @ts-nocheck
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RentVsBuyInputs, ResultData, SummaryData } from '../types/rentVsBuy';
import { formatCurrency, calculateTaxBenefits, calculatePMI } from './rentVsBuyCalculations';

// Types for jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface ExportData {
  inputs: RentVsBuyInputs;
  results: ResultData[];
  summary: SummaryData;
  breakEvenYear: number | null;
}

// Generic export interfaces for other calculators
export interface GenericExportData {
  calculatorName: string;
  inputs: Record<string, any>;
  results?: Record<string, any>;
  summary?: Record<string, any>;
  tableData?: Array<Record<string, any>>;
  recommendations?: string[];
  keyMetrics?: Array<{ label: string; value: string | number; }>;
  additionalData?: Record<string, any>;
}

// Generic PDF Export
export const exportGenericToPDF = (data: GenericExportData) => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Helper function to add title
  const addTitle = (title: string, fontSize: number = 16) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, yPosition);
    yPosition += 10;
  };

  // Helper function to add section
  const addSection = (title: string, content: string[]) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, yPosition);
    yPosition += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    content.forEach(line => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 25, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  };

  // Main title
  addTitle(`${data.calculatorName} Report`, 18);
  yPosition += 5;

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 15;

  // Key Metrics Summary
  if (data.keyMetrics && data.keyMetrics.length > 0) {
    addSection('Key Metrics', 
      data.keyMetrics.map(metric => `${metric.label}: ${metric.value}`)
    );
  }

  // Input Parameters
  const inputLines = Object.entries(data.inputs)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      const formattedValue = typeof value === 'number' && value > 1000 ? 
        (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percent') ? 
          `${value}%` : formatCurrency(value)) : 
        String(value);
      return `${formattedKey}: ${formattedValue}`;
    });

  if (inputLines.length > 0) {
    addSection('Input Parameters', inputLines);
  }

  // Results Summary
  if (data.summary) {
    const summaryLines = Object.entries(data.summary)
      .filter(([key, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        const formattedValue = typeof value === 'number' && value > 1000 ? formatCurrency(value) : String(value);
        return `${formattedKey}: ${formattedValue}`;
      });

    if (summaryLines.length > 0) {
      addSection('Results Summary', summaryLines);
    }
  }

  // Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    addSection('Recommendations', data.recommendations);
  }

  // Table Data
  if (data.tableData && data.tableData.length > 0) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    addTitle('Monthly Payment Distribution', 14);
    yPosition += 5;

    try {
      const headers = Object.keys(data.tableData[0]);
      const tableRows = data.tableData.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'number' && value > 1000 ? formatCurrency(value) : String(value);
        })
      );

      autoTable(doc, {
        head: [headers.map(h => h.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))],
        body: tableRows,
        startY: yPosition,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 8 },
        columnStyles: headers.reduce((acc, header, index) => {
          acc[index] = { halign: typeof data.tableData![0][header] === 'number' ? 'right' : 'left' };
          return acc;
        }, {} as any)
      });
    } catch (error) {
      console.error('Error creating table:', error);
    }
  }

  // Additional Data - Detailed Payment Schedule
  if (data.additionalData?.detailedPaymentSchedule) {
    doc.addPage();
    yPosition = 20;
    
    addTitle('Detailed Payment Schedule', 14);
    yPosition += 5;

    try {
      const schedule = data.additionalData.detailedPaymentSchedule;
      const scheduleRows = schedule.map((month: any) => [
        month.month.toString(),
        month.date,
        formatCurrency(month.totalPayment),
        formatCurrency(month.principalPayment),
        formatCurrency(month.interestPayment),
        formatCurrency(month.remainingBalance)
      ]);

      autoTable(doc, {
        head: [['Month', 'Date', 'Total Payment', 'Principal', 'Interest', 'Remaining Balance']],
        body: scheduleRows,
        startY: yPosition,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 7 },
        columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'center' },
          2: { halign: 'right' },
          3: { halign: 'right' },
          4: { halign: 'right' },
          5: { halign: 'right' }
        }
      });
    } catch (error) {
      console.error('Error creating detailed schedule table:', error);
    }
  }

  // Additional Data - Debt-Specific Schedules
  if (data.additionalData?.debtSpecificSchedules) {
    const debtSchedules = data.additionalData.debtSpecificSchedules;
    
    debtSchedules.forEach((debt: any, index: number) => {
      doc.addPage();
      yPosition = 20;
      
      addTitle(`${debt.debtName} Payment Schedule`, 14);
      yPosition += 5;

      // Debt summary
      addSection('Debt Summary', [
        `Debt Type: ${debt.debtType}`,
        `Starting Balance: ${formatCurrency(debt.startingBalance)}`,
        `Interest Rate: ${debt.interestRate}%`,
        `Minimum Payment: ${formatCurrency(debt.minimumPayment)}`,
        `Payoff Date: ${debt.payoffDate}`,
        `Months to Payoff: ${debt.monthsToPayoff}`,
        `Total Interest Paid: ${formatCurrency(debt.totalInterestPaid)}`
      ]);

      try {
        const scheduleRows = debt.schedule.map((payment: any) => [
          payment.month.toString(),
          payment.date,
          formatCurrency(payment.payment),
          formatCurrency(payment.principal),
          formatCurrency(payment.interest),
          formatCurrency(payment.remainingBalance)
        ]);

        autoTable(doc, {
          head: [['Month', 'Date', 'Payment', 'Principal', 'Interest', 'Balance']],
          body: scheduleRows,
          startY: yPosition,
          theme: 'striped',
          headStyles: { fillColor: [220, 53, 69] },
          styles: { fontSize: 7 },
          columnStyles: {
            0: { halign: 'center' },
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' }
          }
        });
      } catch (error) {
        console.error(`Error creating debt schedule table for ${debt.debtName}:`, error);
      }
    });
  }

  // Additional Data - Payoff Order
  if (data.additionalData?.payoffOrder) {
    doc.addPage();
    yPosition = 20;
    
    addTitle('Debt Payoff Order & Summary', 14);
    yPosition += 5;

    try {
      const payoffRows = data.additionalData.payoffOrder.map((debt: any) => [
        debt.order.toString(),
        debt.debtName,
        debt.debtType,
        formatCurrency(debt.startingBalance),
        `${debt.interestRate}%`,
        debt.payoffDate,
        debt.monthsToPayoff.toString(),
        formatCurrency(debt.totalInterestPaid)
      ]);

      autoTable(doc, {
        head: [['Order', 'Debt Name', 'Type', 'Balance', 'Rate', 'Payoff Date', 'Months', 'Interest Paid']],
        body: payoffRows,
        startY: yPosition,
        theme: 'striped',
        headStyles: { fillColor: [40, 167, 69] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { halign: 'center' },
          1: { halign: 'left' },
          2: { halign: 'center' },
          3: { halign: 'right' },
          4: { halign: 'center' },
          5: { halign: 'center' },
          6: { halign: 'center' },
          7: { halign: 'right' }
        }
      });
    } catch (error) {
      console.error('Error creating payoff order table:', error);
    }
  }

  // Save the PDF
  const fileName = `${data.calculatorName.toLowerCase().replace(/\s+/g, '-')}-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Generic CSV Export
export const exportGenericToCSV = (data: GenericExportData) => {
  let csv = `${data.calculatorName} Report\n`;
  csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

  // Key Metrics
  if (data.keyMetrics && data.keyMetrics.length > 0) {
    csv += 'KEY METRICS\n';
    data.keyMetrics.forEach(metric => {
      csv += `${metric.label},${metric.value}\n`;
    });
    csv += '\n';
  }

  // Input Parameters
  csv += 'INPUT PARAMETERS\n';
  Object.entries(data.inputs)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
    .forEach(([key, value]) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      csv += `${formattedKey},${value}\n`;
    });
  csv += '\n';

  // Results Summary
  if (data.summary) {
    csv += 'RESULTS SUMMARY\n';
    Object.entries(data.summary)
      .filter(([key, value]) => value !== undefined && value !== null)
      .forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        csv += `${formattedKey},${value}\n`;
      });
    csv += '\n';
  }

  // Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    csv += 'RECOMMENDATIONS\n';
    data.recommendations.forEach((rec, index) => {
      csv += `${index + 1},${rec}\n`;
    });
    csv += '\n';
  }

  // Table Data
  if (data.tableData && data.tableData.length > 0) {
    csv += 'MONTHLY PAYMENT DISTRIBUTION\n';
    const headers = Object.keys(data.tableData[0]);
    csv += headers.join(',') + '\n';
    
    data.tableData.forEach(row => {
      csv += headers.map(header => row[header]).join(',') + '\n';
    });
    csv += '\n';
  }

  // Additional Data - Detailed Payment Schedule
  if (data.additionalData?.detailedPaymentSchedule) {
    csv += 'DETAILED PAYMENT SCHEDULE\n';
    csv += 'Month,Date,Total Payment,Principal Payment,Interest Payment,Remaining Balance,Total Paid,Total Interest Paid\n';
    
    data.additionalData.detailedPaymentSchedule.forEach((month: any) => {
      csv += `${month.month},${month.date},${month.totalPayment},${month.principalPayment},${month.interestPayment},${month.remainingBalance},${month.totalPaid},${month.totalInterestPaid}\n`;
    });
    csv += '\n';
  }

  // Additional Data - Debt-Specific Schedules
  if (data.additionalData?.debtSpecificSchedules) {
    data.additionalData.debtSpecificSchedules.forEach((debt: any) => {
      csv += `DEBT-SPECIFIC SCHEDULE: ${debt.debtName}\n`;
      csv += `Debt Type,${debt.debtType}\n`;
      csv += `Starting Balance,${debt.startingBalance}\n`;
      csv += `Interest Rate,${debt.interestRate}%\n`;
      csv += `Minimum Payment,${debt.minimumPayment}\n`;
      csv += `Payoff Date,${debt.payoffDate}\n`;
      csv += `Months to Payoff,${debt.monthsToPayoff}\n`;
      csv += `Total Interest Paid,${debt.totalInterestPaid}\n`;
      csv += '\n';
      
      csv += 'Month,Date,Payment,Principal,Interest,Remaining Balance,Total Paid,Total Interest Paid\n';
      debt.schedule.forEach((payment: any) => {
        csv += `${payment.month},${payment.date},${payment.payment},${payment.principal},${payment.interest},${payment.remainingBalance},${payment.totalPaid},${payment.totalInterestPaid}\n`;
      });
      csv += '\n';
    });
  }

  // Additional Data - Payoff Order
  if (data.additionalData?.payoffOrder) {
    csv += 'DEBT PAYOFF ORDER & SUMMARY\n';
    csv += 'Order,Debt Name,Debt Type,Starting Balance,Interest Rate,Payoff Date,Months to Payoff,Total Interest Paid\n';
    
    data.additionalData.payoffOrder.forEach((debt: any) => {
      csv += `${debt.order},${debt.debtName},${debt.debtType},${debt.startingBalance},${debt.interestRate}%,${debt.payoffDate},${debt.monthsToPayoff},${debt.totalInterestPaid}\n`;
    });
    csv += '\n';
  }

  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${data.calculatorName.toLowerCase().replace(/\s+/g, '-')}-analysis-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to PDF (Rent vs Buy specific - keeping for compatibility)
export const exportToPDF = (data: ExportData) => {
  const { inputs, results, summary, breakEvenYear } = data;
  
  const doc = new jsPDF();
  let yPosition = 20;

  // Helper function to add title
  const addTitle = (title: string, fontSize: number = 16) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, yPosition);
    yPosition += 10;
  };

  // Helper function to add section
  const addSection = (title: string, content: string[]) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, yPosition);
    yPosition += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    content.forEach(line => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 25, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  };

  // Main title
  addTitle('Rent vs. Buy Analysis Report', 18);
  yPosition += 5;

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 15;

  // Executive Summary
  const isBuyingBetter = summary.netBuyingCost < summary.totalRentingCost;
  const netAdvantage = Math.abs(summary.netBuyingCost - summary.totalRentingCost);
  
  addSection('Executive Summary', [
    `Recommendation: ${isBuyingBetter ? 'BUYING' : 'RENTING'} is better`,
    `Net advantage: ${formatCurrency(netAdvantage)}`,
    `Break-even point: ${breakEvenYear ? `Year ${breakEvenYear}` : 'Beyond time horizon'}`,
    `Total buying cost: ${formatCurrency(summary.totalBuyingCost)}`,
    `Total renting cost: ${formatCurrency(summary.totalRentingCost)}`,
    `Final home equity: ${formatCurrency(summary.finalEquity)}`
  ]);

  // Input Parameters
  addSection('Input Parameters', [
    `Home Price: ${formatCurrency(inputs.homePrice)}`,
    `Down Payment: ${inputs.downPaymentPercent}% (${formatCurrency(inputs.homePrice * inputs.downPaymentPercent / 100)})`,
    `Monthly Rent: ${formatCurrency(inputs.monthlyRent)}`,
    `Annual Income: ${formatCurrency(inputs.annualIncome)}`,
    `Mortgage Rate: ${inputs.interestRate}%`,
    `Time Horizon: ${inputs.timeHorizon} years`,
    `Location: ${inputs.location.city}${inputs.location.state ? `, ${inputs.location.state}` : ''}`,
    `Property Tax Rate: ${inputs.location.propertyTaxRate || 1.1}%`,
    `Home Insurance: ${inputs.homeInsuranceRate}%`,
    `Annual Rent Increase: ${inputs.annualRentIncrease}%`,
    `Annual Home Value Increase: ${inputs.annualHomeValueIncrease}%`
  ]);

  // Tax Benefits
  const taxBenefits = calculateTaxBenefits(
    inputs.homePrice,
    inputs.downPaymentPercent,
    inputs.interestRate,
    inputs.location.propertyTaxRate || 1.1,
    inputs.annualIncome,
    inputs.maritalStatus
  );

  addSection('Tax Benefits Analysis', [
    `Annual Tax Savings: ${formatCurrency(taxBenefits.annualTaxSavings)}`,
    `Mortgage Interest Deduction: ${formatCurrency(taxBenefits.mortgageInterestDeduction)}`,
    `Property Tax Deduction: ${formatCurrency(taxBenefits.propertyTaxDeduction)}`,
    `Effective Tax Rate: ${taxBenefits.effectiveTaxRate}%`
  ]);

  // PMI Information
  const pmiInfo = calculatePMI(inputs.homePrice, inputs.downPaymentPercent);
  if (pmiInfo.monthlyPMI > 0) {
    addSection('PMI Information', [
      `Monthly PMI: ${formatCurrency(pmiInfo.monthlyPMI)}`,
      `Annual PMI: ${formatCurrency(pmiInfo.annualPMI)}`,
      `PMI removal year: Year ${pmiInfo.pmiRemovalYear}`
    ]);
  }

  // Add new page for detailed results table
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }

  addTitle('Year-by-Year Analysis', 14);
  yPosition += 5;

  // Year-by-year table
  const tableData = results.map(result => [
    result.year.toString(),
    formatCurrency(result.buyingCost),
    formatCurrency(result.rentingCost),
    formatCurrency(result.buyingNetCost),
    formatCurrency(result.buyingEquity)
  ]);

  try {
    autoTable(doc, {
      head: [['Year', 'Buying Cost', 'Renting Cost', 'Net Buying Cost', 'Home Equity']],
      body: tableData,
      startY: yPosition,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      }
    });
  } catch (error) {
    console.error('Error creating table, falling back to simple text table:', error);
    
    // Fallback to simple text table if autoTable fails
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Year    Buying Cost    Renting Cost    Net Buying    Home Equity', 20, yPosition);
    yPosition += 7;
    
    doc.setFont('helvetica', 'normal');
    tableData.forEach(row => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      const rowText = `${row[0].padEnd(8)}${row[1].padEnd(15)}${row[2].padEnd(16)}${row[3].padEnd(14)}${row[4]}`;
      doc.text(rowText, 20, yPosition);
      yPosition += 5;
    });
  }

  // Save the PDF
  const fileName = `rent-vs-buy-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Export to CSV (Rent vs Buy specific - keeping for compatibility)
export const exportToCSV = (data: ExportData) => {
  const { inputs, results, summary, breakEvenYear } = data;
  
  let csv = 'Rent vs. Buy Analysis Report\n';
  csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

  // Executive Summary
  csv += 'EXECUTIVE SUMMARY\n';
  const isBuyingBetter = summary.netBuyingCost < summary.totalRentingCost;
  const netAdvantage = Math.abs(summary.netBuyingCost - summary.totalRentingCost);
  
  csv += `Recommendation,${isBuyingBetter ? 'BUYING' : 'RENTING'}\n`;
  csv += `Net Advantage,${netAdvantage}\n`;
  csv += `Break-even Point,${breakEvenYear ? `Year ${breakEvenYear}` : 'Beyond time horizon'}\n`;
  csv += `Total Buying Cost,${summary.totalBuyingCost}\n`;
  csv += `Total Renting Cost,${summary.totalRentingCost}\n`;
  csv += `Final Home Equity,${summary.finalEquity}\n\n`;

  // Input Parameters
  csv += 'INPUT PARAMETERS\n';
  csv += `Home Price,${inputs.homePrice}\n`;
  csv += `Down Payment Percent,${inputs.downPaymentPercent}\n`;
  csv += `Down Payment Amount,${inputs.homePrice * inputs.downPaymentPercent / 100}\n`;
  csv += `Monthly Rent,${inputs.monthlyRent}\n`;
  csv += `Annual Income,${inputs.annualIncome}\n`;
  csv += `Mortgage Rate,${inputs.interestRate}\n`;
  csv += `Time Horizon,${inputs.timeHorizon}\n`;
  csv += `Location,"${inputs.location.city}${inputs.location.state ? `, ${inputs.location.state}` : ''}"\n`;
  csv += `Property Tax Rate,${inputs.location.propertyTaxRate || 1.1}\n`;
  csv += `Home Insurance Rate,${inputs.homeInsuranceRate}\n`;
  csv += `Annual Rent Increase,${inputs.annualRentIncrease}\n`;
  csv += `Annual Home Value Increase,${inputs.annualHomeValueIncrease}\n`;
  csv += `Monthly HOA Fees,${inputs.monthlyHOAFees}\n`;
  csv += `Annual Maintenance Percent,${inputs.annualMaintenancePercent}\n\n`;

  // Tax Benefits
  const taxBenefits = calculateTaxBenefits(
    inputs.homePrice,
    inputs.downPaymentPercent,
    inputs.interestRate,
    inputs.location.propertyTaxRate || 1.1,
    inputs.annualIncome,
    inputs.maritalStatus
  );

  csv += 'TAX BENEFITS ANALYSIS\n';
  csv += `Annual Tax Savings,${taxBenefits.annualTaxSavings}\n`;
  csv += `Mortgage Interest Deduction,${taxBenefits.mortgageInterestDeduction}\n`;
  csv += `Property Tax Deduction,${taxBenefits.propertyTaxDeduction}\n`;
  csv += `Effective Tax Rate,${taxBenefits.effectiveTaxRate}\n\n`;

  // PMI Information
  const pmiInfo = calculatePMI(inputs.homePrice, inputs.downPaymentPercent);
  if (pmiInfo.monthlyPMI > 0) {
    csv += 'PMI INFORMATION\n';
    csv += `Monthly PMI,${pmiInfo.monthlyPMI}\n`;
    csv += `Annual PMI,${pmiInfo.annualPMI}\n`;
    csv += `PMI Removal Year,${pmiInfo.pmiRemovalYear}\n\n`;
  }

  // Year-by-Year Analysis
  csv += 'YEAR-BY-YEAR ANALYSIS\n';
  csv += 'Year,Buying Cost,Renting Cost,Net Buying Cost,Home Equity\n';
  
  results.forEach(result => {
    csv += `${result.year},${result.buyingCost},${result.rentingCost},${result.buyingNetCost},${result.buyingEquity}\n`;
  });

  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `rent-vs-buy-analysis-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 
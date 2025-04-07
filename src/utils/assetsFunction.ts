

  export const generateId = () => `debt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
// Mock data for Creditcoin dashboard

export const mockCreditcoinData = {
  defiInsights: {
    lendingRate: 5.2,
    borrowingRate: 7.8,
    totalValueLocked: 45000000,
    activeLoans: 1247,
    liquidityPool: 12500000,
    dailyVolume: 850000
  },
  
  creditProfile: {
    creditScore: 742,
    borrowingHistory: [
      { date: '2024-01', amount: 5000, status: 'repaid', rate: 6.5 },
      { date: '2024-02', amount: 8000, status: 'repaid', rate: 6.2 },
      { date: '2024-03', amount: 12000, status: 'active', rate: 5.8 },
    ],
    availableCredit: 25000,
    utilizedCredit: 12000
  },
  
  depinFinance: {
    solarCredits: { funded: 145, totalValue: 2800000 },
    wifiCredits: { funded: 89, totalValue: 1200000 },
    mobilityCredits: { funded: 67, totalValue: 950000 },
    totalFinanced: 4950000,
    activeProjects: 301,
    averageROI: 8.4
  }
};

export const mockChartData = {
  priceHistory: [
    { date: '2024-01-01', price: 0.45 },
    { date: '2024-01-02', price: 0.48 },
    { date: '2024-01-03', price: 0.52 },
    { date: '2024-01-04', price: 0.49 },
    { date: '2024-01-05', price: 0.55 },
    { date: '2024-01-06', price: 0.58 },
    { date: '2024-01-07', price: 0.62 }
  ],
  
  creditScoreHistory: [
    { month: 'Jan', score: 680 },
    { month: 'Feb', score: 695 },
    { month: 'Mar', score: 710 },
    { month: 'Apr', score: 725 },
    { month: 'May', score: 742 }
  ],
  
  depinGrowth: [
    { category: 'Solar', value: 2800000 },
    { category: 'WiFi', value: 1200000 },
    { category: 'Mobility', value: 950000 },
    { category: 'Other', value: 500000 }
  ]
};
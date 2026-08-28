import { BusinessRecord, Department, Region, RiskLevel, RegionSummary, DepartmentSummary, TimePeriodSummary } from '../types';

export const RAW_CSV_DATA = `Date,Department,Region,Monthly_Spend_USD,Monthly_Revenue_USD,Customer_Satisfaction_Score,Churn_Rate_Pct,Risk_Level
2025-01-31,Engineering,North America,185000,0,8.2,0.0,Low
2025-01-31,Sales,North America,120000,450000,7.9,2.1,Medium
2025-01-31,Marketing,North America,95000,280000,7.4,3.5,Medium
2025-01-31,Customer Support,North America,45000,0,9.1,1.2,Low
2025-01-31,Product & Ops,North America,110000,0,8.0,0.0,High
2025-02-28,Engineering,Europe,190000,0,8.1,0.0,Low
2025-02-28,Sales,Europe,130000,380000,7.6,4.2,Medium
2025-02-28,Marketing,Europe,105000,210000,7.0,5.1,High
2025-02-28,Customer Support,Europe,48000,0,8.7,2.0,Low
2025-02-28,Product & Ops,Europe,115000,0,7.8,0.0,Medium
2025-03-31,Engineering,Asia Pacific,205000,0,8.3,0.0,Low
2025-03-31,Sales,Asia Pacific,110000,290000,7.2,6.0,High
2025-03-31,Marketing,Asia Pacific,115000,180000,6.5,7.8,High
2025-03-31,Customer Support,Asia Pacific,42000,0,8.4,3.1,Medium
2025-03-31,Product & Ops,Asia Pacific,100000,0,7.7,0.0,Low
2025-04-30,Engineering,North America,190000,0,8.4,0.0,Low
2025-04-30,Sales,North America,135000,520000,8.1,1.8,Low
2025-04-30,Marketing,North America,110000,310000,7.1,4.0,High
2025-04-30,Customer Support,North America,48000,0,8.8,1.5,Low
2025-04-30,Product & Ops,North America,105000,0,8.3,0.0,Medium
2025-05-31,Engineering,Europe,195000,0,8.0,0.0,Medium
2025-05-31,Sales,Europe,140000,410000,7.8,3.9,Medium
2025-05-31,Marketing,Europe,120000,230000,6.9,5.5,High
2025-05-31,Customer Support,Europe,50000,0,8.6,2.2,Low
2025-05-31,Product & Ops,Europe,110000,0,7.9,0.0,Medium
2025-06-30,Engineering,Asia Pacific,210000,0,8.0,0.0,Medium
2025-06-30,Sales,Asia Pacific,125000,340000,7.5,4.8,Medium
2025-06-30,Marketing,Asia Pacific,125000,260000,6.8,6.9,High
2025-06-30,Customer Support,Asia Pacific,52000,0,8.5,2.8,Low
2025-06-30,Product & Ops,Asia Pacific,115000,0,7.9,0.0,Medium
2025-09-30,Engineering,North America,205000,0,8.5,0.0,Low
2025-09-30,Sales,North America,150000,610000,8.3,1.2,Low
2025-09-30,Marketing,North America,100000,340000,7.5,3.1,Low
2025-09-30,Customer Support,North America,50000,0,9.0,1.0,Low
2025-09-30,Product & Ops,North America,120000,0,8.1,0.0,Medium
2025-12-31,Engineering,Europe,215000,0,8.6,0.0,Low
2025-12-31,Sales,Europe,160000,580000,8.2,2.5,Low
2025-12-31,Marketing,Europe,105000,360000,7.8,3.0,Low
2025-12-31,Customer Support,Europe,53000,0,9.1,1.1,Low
2025-12-31,Product & Ops,Europe,125000,0,8.4,0.0,Low`;

export const BUSINESS_RECORDS: BusinessRecord[] = [
  { id: '1', date: '2025-01-31', department: 'Engineering', region: 'North America', monthlySpendUSD: 185000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.2, churnRatePct: 0.0, riskLevel: 'Low', netProfitUSD: -185000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '2', date: '2025-01-31', department: 'Sales', region: 'North America', monthlySpendUSD: 120000, monthlyRevenueUSD: 450000, customerSatisfactionScore: 7.9, churnRatePct: 2.1, riskLevel: 'Medium', netProfitUSD: 330000, profitMarginPct: 73.33, roiMultiple: 3.75 },
  { id: '3', date: '2025-01-31', department: 'Marketing', region: 'North America', monthlySpendUSD: 95000, monthlyRevenueUSD: 280000, customerSatisfactionScore: 7.4, churnRatePct: 3.5, riskLevel: 'Medium', netProfitUSD: 185000, profitMarginPct: 66.07, roiMultiple: 2.95 },
  { id: '4', date: '2025-01-31', department: 'Customer Support', region: 'North America', monthlySpendUSD: 45000, monthlyRevenueUSD: 0, customerSatisfactionScore: 9.1, churnRatePct: 1.2, riskLevel: 'Low', netProfitUSD: -45000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '5', date: '2025-01-31', department: 'Product & Ops', region: 'North America', monthlySpendUSD: 110000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.0, churnRatePct: 0.0, riskLevel: 'High', netProfitUSD: -110000, profitMarginPct: 0, roiMultiple: 0 },

  { id: '6', date: '2025-02-28', department: 'Engineering', region: 'Europe', monthlySpendUSD: 190000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.1, churnRatePct: 0.0, riskLevel: 'Low', netProfitUSD: -190000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '7', date: '2025-02-28', department: 'Sales', region: 'Europe', monthlySpendUSD: 130000, monthlyRevenueUSD: 380000, customerSatisfactionScore: 7.6, churnRatePct: 4.2, riskLevel: 'Medium', netProfitUSD: 250000, profitMarginPct: 65.79, roiMultiple: 2.92 },
  { id: '8', date: '2025-02-28', department: 'Marketing', region: 'Europe', monthlySpendUSD: 105000, monthlyRevenueUSD: 210000, customerSatisfactionScore: 7.0, churnRatePct: 5.1, riskLevel: 'High', netProfitUSD: 105000, profitMarginPct: 50.00, roiMultiple: 2.00 },
  { id: '9', date: '2025-02-28', department: 'Customer Support', region: 'Europe', monthlySpendUSD: 48000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.7, churnRatePct: 2.0, riskLevel: 'Low', netProfitUSD: -48000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '10', date: '2025-02-28', department: 'Product & Ops', region: 'Europe', monthlySpendUSD: 115000, monthlyRevenueUSD: 0, customerSatisfactionScore: 7.8, churnRatePct: 0.0, riskLevel: 'Medium', netProfitUSD: -115000, profitMarginPct: 0, roiMultiple: 0 },

  { id: '11', date: '2025-03-31', department: 'Engineering', region: 'Asia Pacific', monthlySpendUSD: 205000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.3, churnRatePct: 0.0, riskLevel: 'Low', netProfitUSD: -205000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '12', date: '2025-03-31', department: 'Sales', region: 'Asia Pacific', monthlySpendUSD: 110000, monthlyRevenueUSD: 290000, customerSatisfactionScore: 7.2, churnRatePct: 6.0, riskLevel: 'High', netProfitUSD: 180000, profitMarginPct: 62.07, roiMultiple: 2.64 },
  { id: '13', date: '2025-03-31', department: 'Marketing', region: 'Asia Pacific', monthlySpendUSD: 115000, monthlyRevenueUSD: 180000, customerSatisfactionScore: 6.5, churnRatePct: 7.8, riskLevel: 'High', netProfitUSD: 65000, profitMarginPct: 36.11, roiMultiple: 1.57 },
  { id: '14', date: '2025-03-31', department: 'Customer Support', region: 'Asia Pacific', monthlySpendUSD: 42000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.4, churnRatePct: 3.1, riskLevel: 'Medium', netProfitUSD: -42000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '15', date: '2025-03-31', department: 'Product & Ops', region: 'Asia Pacific', monthlySpendUSD: 100000, monthlyRevenueUSD: 0, customerSatisfactionScore: 7.7, churnRatePct: 0.0, riskLevel: 'Low', netProfitUSD: -100000, profitMarginPct: 0, roiMultiple: 0 },

  { id: '16', date: '2025-04-30', department: 'Engineering', region: 'North America', monthlySpendUSD: 190000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.4, churnRatePct: 0.0, riskLevel: 'Low', netProfitUSD: -190000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '17', date: '2025-04-30', department: 'Sales', region: 'North America', monthlySpendUSD: 135000, monthlyRevenueUSD: 520000, customerSatisfactionScore: 8.1, churnRatePct: 1.8, riskLevel: 'Low', netProfitUSD: 385000, profitMarginPct: 74.04, roiMultiple: 3.85 },
  { id: '18', date: '2025-04-30', department: 'Marketing', region: 'North America', monthlySpendUSD: 110000, monthlyRevenueUSD: 310000, customerSatisfactionScore: 7.1, churnRatePct: 4.0, riskLevel: 'High', netProfitUSD: 200000, profitMarginPct: 64.52, roiMultiple: 2.82 },
  { id: '19', date: '2025-04-30', department: 'Customer Support', region: 'North America', monthlySpendUSD: 48000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.8, churnRatePct: 1.5, riskLevel: 'Low', netProfitUSD: -48000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '20', date: '2025-04-30', department: 'Product & Ops', region: 'North America', monthlySpendUSD: 105000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.3, churnRatePct: 0.0, riskLevel: 'Medium', netProfitUSD: -105000, profitMarginPct: 0, roiMultiple: 0 },

  { id: '21', date: '2025-05-31', department: 'Engineering', region: 'Europe', monthlySpendUSD: 195000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.0, churnRatePct: 0.0, riskLevel: 'Medium', netProfitUSD: -195000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '22', date: '2025-05-31', department: 'Sales', region: 'Europe', monthlySpendUSD: 140000, monthlyRevenueUSD: 410000, customerSatisfactionScore: 7.8, churnRatePct: 3.9, riskLevel: 'Medium', netProfitUSD: 270000, profitMarginPct: 65.85, roiMultiple: 2.93 },
  { id: '23', date: '2025-05-31', department: 'Marketing', region: 'Europe', monthlySpendUSD: 120000, monthlyRevenueUSD: 230000, customerSatisfactionScore: 6.9, churnRatePct: 5.5, riskLevel: 'High', netProfitUSD: 110000, profitMarginPct: 47.83, roiMultiple: 1.92 },
  { id: '24', date: '2025-05-31', department: 'Customer Support', region: 'Europe', monthlySpendUSD: 50000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.6, churnRatePct: 2.2, riskLevel: 'Low', netProfitUSD: -50000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '25', date: '2025-05-31', department: 'Product & Ops', region: 'Europe', monthlySpendUSD: 110000, monthlyRevenueUSD: 0, customerSatisfactionScore: 7.9, churnRatePct: 0.0, riskLevel: 'Medium', netProfitUSD: -110000, profitMarginPct: 0, roiMultiple: 0 },

  { id: '26', date: '2025-06-30', department: 'Engineering', region: 'Asia Pacific', monthlySpendUSD: 210000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.0, churnRatePct: 0.0, riskLevel: 'Medium', netProfitUSD: -210000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '27', date: '2025-06-30', department: 'Sales', region: 'Asia Pacific', monthlySpendUSD: 125000, monthlyRevenueUSD: 340000, customerSatisfactionScore: 7.5, churnRatePct: 4.8, riskLevel: 'Medium', netProfitUSD: 215000, profitMarginPct: 63.24, roiMultiple: 2.72 },
  { id: '28', date: '2025-06-30', department: 'Marketing', region: 'Asia Pacific', monthlySpendUSD: 125000, monthlyRevenueUSD: 260000, customerSatisfactionScore: 6.8, churnRatePct: 6.9, riskLevel: 'High', netProfitUSD: 135000, profitMarginPct: 51.92, roiMultiple: 2.08 },
  { id: '29', date: '2025-06-30', department: 'Customer Support', region: 'Asia Pacific', monthlySpendUSD: 52000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.5, churnRatePct: 2.8, riskLevel: 'Low', netProfitUSD: -52000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '30', date: '2025-06-30', department: 'Product & Ops', region: 'Asia Pacific', monthlySpendUSD: 115000, monthlyRevenueUSD: 0, customerSatisfactionScore: 7.9, churnRatePct: 0.0, riskLevel: 'Medium', netProfitUSD: -115000, profitMarginPct: 0, roiMultiple: 0 },

  { id: '31', date: '2025-09-30', department: 'Engineering', region: 'North America', monthlySpendUSD: 205000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.5, churnRatePct: 0.0, riskLevel: 'Low', netProfitUSD: -205000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '32', date: '2025-09-30', department: 'Sales', region: 'North America', monthlySpendUSD: 150000, monthlyRevenueUSD: 610000, customerSatisfactionScore: 8.3, churnRatePct: 1.2, riskLevel: 'Low', netProfitUSD: 460000, profitMarginPct: 75.41, roiMultiple: 4.07 },
  { id: '33', date: '2025-09-30', department: 'Marketing', region: 'North America', monthlySpendUSD: 100000, monthlyRevenueUSD: 340000, customerSatisfactionScore: 7.5, churnRatePct: 3.1, riskLevel: 'Low', netProfitUSD: 240000, profitMarginPct: 70.59, roiMultiple: 3.40 },
  { id: '34', date: '2025-09-30', department: 'Customer Support', region: 'North America', monthlySpendUSD: 50000, monthlyRevenueUSD: 0, customerSatisfactionScore: 9.0, churnRatePct: 1.0, riskLevel: 'Low', netProfitUSD: -50000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '35', date: '2025-09-30', department: 'Product & Ops', region: 'North America', monthlySpendUSD: 120000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.1, churnRatePct: 0.0, riskLevel: 'Medium', netProfitUSD: -120000, profitMarginPct: 0, roiMultiple: 0 },

  { id: '36', date: '2025-12-31', department: 'Engineering', region: 'Europe', monthlySpendUSD: 215000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.6, churnRatePct: 0.0, riskLevel: 'Low', netProfitUSD: -215000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '37', date: '2025-12-31', department: 'Sales', region: 'Europe', monthlySpendUSD: 160000, monthlyRevenueUSD: 580000, customerSatisfactionScore: 8.2, churnRatePct: 2.5, riskLevel: 'Low', netProfitUSD: 420000, profitMarginPct: 72.41, roiMultiple: 3.63 },
  { id: '38', date: '2025-12-31', department: 'Marketing', region: 'Europe', monthlySpendUSD: 105000, monthlyRevenueUSD: 360000, customerSatisfactionScore: 7.8, churnRatePct: 3.0, riskLevel: 'Low', netProfitUSD: 255000, profitMarginPct: 70.83, roiMultiple: 3.43 },
  { id: '39', date: '2025-12-31', department: 'Customer Support', region: 'Europe', monthlySpendUSD: 53000, monthlyRevenueUSD: 0, customerSatisfactionScore: 9.1, churnRatePct: 1.1, riskLevel: 'Low', netProfitUSD: -53000, profitMarginPct: 0, roiMultiple: 0 },
  { id: '40', date: '2025-12-31', department: 'Product & Ops', region: 'Europe', monthlySpendUSD: 125000, monthlyRevenueUSD: 0, customerSatisfactionScore: 8.4, churnRatePct: 0.0, riskLevel: 'Low', netProfitUSD: -125000, profitMarginPct: 0, roiMultiple: 0 },
];

export const TOTAL_METRICS = {
  totalRevenue: 5750000, // $5.75M
  totalSpend: 4823000,   // $4.823M
  netProfit: 927000,     // $927k
  profitMarginPct: 16.12, // 16.12%
  avgCSAT: 8.01,
  avgChurnPctCustomerFacing: 3.16, // across Sales, Mktg, CS
  overallAvgChurnPct: 1.89, // all rows including 0% departments
  riskDistribution: {
    low: 18,
    medium: 15,
    high: 7,
  }
};

export const REGIONS: Region[] = ['North America', 'Europe', 'Asia Pacific'];
export const DEPARTMENTS: Department[] = ['Engineering', 'Sales', 'Marketing', 'Customer Support', 'Product & Ops'];

export const REGIONAL_SUMMARIES: Record<Region, RegionSummary> = {
  'North America': {
    region: 'North America',
    totalSpend: 1768000, // $1.768M (36.7% of spend)
    totalRevenue: 2510000, // $2.51M (43.7% of rev)
    netProfit: 742000, // +$742,000 (80.0% of total company profit)
    profitMarginPct: 29.56,
    avgCSAT: 8.19,
    avgChurnPct: 1.48,
    highRiskCount: 2, // Jan Prod & Apr Mktg
    mediumRiskCount: 4,
    lowRiskCount: 9,
    recordCount: 15,
  },
  'Europe': {
    region: 'Europe',
    totalSpend: 1861000, // $1.861M (38.6% of spend)
    totalRevenue: 2170000, // $2.17M (37.7% of rev)
    netProfit: 309000, // +$309,000 (33.3% of total company profit)
    profitMarginPct: 14.24,
    avgCSAT: 8.07,
    avgChurnPct: 1.99,
    highRiskCount: 2, // Feb Mktg & May Mktg
    mediumRiskCount: 6,
    lowRiskCount: 7,
    recordCount: 15,
  },
  'Asia Pacific': {
    region: 'Asia Pacific',
    totalSpend: 1194000, // $1.194M (24.8% of spend)
    totalRevenue: 1070000, // $1.07M (18.6% of rev)
    netProfit: -124000, // -$124,000 LOSS
    profitMarginPct: -11.59,
    avgCSAT: 7.63,
    avgChurnPct: 2.46, // peak in customer-facing rows (Sales 6.0%, Mktg 7.8% in Mar; Sales 4.8%, Mktg 6.9% in Jun)
    highRiskCount: 3, // Mar Sales, Mar Mktg, Jun Mktg
    mediumRiskCount: 5,
    lowRiskCount: 2,
    recordCount: 10,
  }
};

export const DEPARTMENT_SUMMARIES: Record<Department, DepartmentSummary> = {
  'Engineering': {
    department: 'Engineering',
    totalSpend: 1600000, // $1.60M (33.17% of total spend)
    totalRevenue: 0,
    netProfit: -1600000,
    profitMarginPct: 0,
    roiMultiple: 0,
    avgCSAT: 8.26,
    avgChurnPct: 0.0,
    highRiskCount: 0,
    mediumRiskCount: 2,
    lowRiskCount: 6,
    spendSharePct: 33.17,
    revenueSharePct: 0,
  },
  'Sales': {
    department: 'Sales',
    totalSpend: 1070000, // $1.07M (22.18% of spend)
    totalRevenue: 3580000, // $3.58M (62.26% of total revenue)
    netProfit: 2510000, // +$2.51M
    profitMarginPct: 70.11,
    roiMultiple: 3.35, // $3.35 rev per $1 spend
    avgCSAT: 7.83,
    avgChurnPct: 3.31,
    highRiskCount: 1, // Mar APAC
    mediumRiskCount: 4,
    lowRiskCount: 3,
    spendSharePct: 22.18,
    revenueSharePct: 62.26,
  },
  'Marketing': {
    department: 'Marketing',
    totalSpend: 860000, // $860k (17.83% of spend)
    totalRevenue: 2170000, // $2.17M (37.74% of total revenue)
    netProfit: 1310000, // +$1.31M
    profitMarginPct: 60.37,
    roiMultiple: 2.52, // $2.52 rev per $1 spend
    avgCSAT: 7.13,
    avgChurnPct: 4.98,
    highRiskCount: 5, // Feb EU, Mar APAC, Apr NA, May EU, Jun APAC
    mediumRiskCount: 1,
    lowRiskCount: 2,
    spendSharePct: 17.83,
    revenueSharePct: 37.74,
  },
  'Customer Support': {
    department: 'Customer Support',
    totalSpend: 388000, // $388k (8.04% of spend)
    totalRevenue: 0,
    netProfit: -388000,
    profitMarginPct: 0,
    roiMultiple: 0,
    avgCSAT: 8.78, // Highest CSAT in company
    avgChurnPct: 1.86,
    highRiskCount: 0,
    mediumRiskCount: 1,
    lowRiskCount: 7,
    spendSharePct: 8.04,
    revenueSharePct: 0,
  },
  'Product & Ops': {
    department: 'Product & Ops',
    totalSpend: 895000, // $895k (18.56% of spend)
    totalRevenue: 0,
    netProfit: -895000,
    profitMarginPct: 0,
    roiMultiple: 0,
    avgCSAT: 8.01,
    avgChurnPct: 0.0,
    highRiskCount: 1, // Jan NA
    mediumRiskCount: 5,
    lowRiskCount: 2,
    spendSharePct: 18.56,
    revenueSharePct: 0,
  }
};

export const TIME_PERIOD_SUMMARIES: TimePeriodSummary[] = [
  {
    date: '2025-01-31',
    formattedDate: 'Jan 2025 (NA)',
    region: 'North America',
    totalSpend: 555000,
    totalRevenue: 730000,
    netProfit: 175000,
    profitMarginPct: 23.97,
    avgCSAT: 8.12,
    avgChurnPct: 1.36,
    highRiskCount: 1,
  },
  {
    date: '2025-02-28',
    formattedDate: 'Feb 2025 (EU)',
    region: 'Europe',
    totalSpend: 588000,
    totalRevenue: 590000,
    netProfit: 2000,
    profitMarginPct: 0.34,
    avgCSAT: 7.84,
    avgChurnPct: 2.26,
    highRiskCount: 1,
  },
  {
    date: '2025-03-31',
    formattedDate: 'Mar 2025 (APAC)',
    region: 'Asia Pacific',
    totalSpend: 572000,
    totalRevenue: 470000,
    netProfit: -102000,
    profitMarginPct: -21.70,
    avgCSAT: 7.62,
    avgChurnPct: 3.38,
    highRiskCount: 2,
  },
  {
    date: '2025-04-30',
    formattedDate: 'Apr 2025 (NA)',
    region: 'North America',
    totalSpend: 588000,
    totalRevenue: 830000,
    netProfit: 242000,
    profitMarginPct: 29.16,
    avgCSAT: 8.14,
    avgChurnPct: 1.46,
    highRiskCount: 1,
  },
  {
    date: '2025-05-31',
    formattedDate: 'May 2025 (EU)',
    region: 'Europe',
    totalSpend: 615000,
    totalRevenue: 640000,
    netProfit: 250000 - 225000, // 25,000
    profitMarginPct: 3.91,
    avgCSAT: 7.84,
    avgChurnPct: 2.32,
    highRiskCount: 1,
  },
  {
    date: '2025-06-30',
    formattedDate: 'Jun 2025 (APAC)',
    region: 'Asia Pacific',
    totalSpend: 622000,
    totalRevenue: 600000,
    netProfit: -22000,
    profitMarginPct: -3.67,
    avgCSAT: 7.74,
    avgChurnPct: 2.90,
    highRiskCount: 1,
  },
  {
    date: '2025-09-30',
    formattedDate: 'Sep 2025 (NA)',
    region: 'North America',
    totalSpend: 625000,
    totalRevenue: 950000,
    netProfit: 325000,
    profitMarginPct: 34.21,
    avgCSAT: 8.28,
    avgChurnPct: 1.06,
    highRiskCount: 0,
  },
  {
    date: '2025-12-31',
    formattedDate: 'Dec 2025 (EU)',
    region: 'Europe',
    totalSpend: 658000,
    totalRevenue: 940000,
    netProfit: 282000,
    profitMarginPct: 30.00,
    avgCSAT: 8.42,
    avgChurnPct: 1.32,
    highRiskCount: 0,
  }
];

export const OPERATIONAL_RISKS = [
  {
    id: 'risk-1',
    title: 'Severe APAC Churn & Profit Drainage',
    severity: 'High' as RiskLevel,
    category: 'Regional Market Failure',
    department: 'Sales & Marketing',
    region: 'Asia Pacific',
    metricsImpacted: 'Churn 6.0%–7.8%, CSAT 6.5–7.2, Net Loss -$124,000',
    description: 'Asia-Pacific is the sole unprofitable theater across the company. In March 2025, APAC Marketing registered peak churn of 7.8% (with CSAT falling to a company-wide low of 6.5), while Sales experienced 6.0% churn. APAC posted consecutive net losses (-$102,000 in March, -$22,000 in June) with spend ($1.194M) outpacing revenue ($1.070M).',
    rootCause: 'Lack of local product-market fit, aggressive misaligned marketing acquisition, and inadequate localized sales onboarding.',
    trend: 'Critical Deficit',
  },
  {
    id: 'risk-2',
    title: 'Marketing Department Volatility & Acquisition Leakage',
    severity: 'High' as RiskLevel,
    category: 'GTM Efficiency',
    department: 'Marketing',
    region: 'All Regions (APAC & Europe Heaviest)',
    metricsImpacted: '5 out of 8 periods flagged High Risk; Avg Churn 4.98%',
    description: 'Marketing represents 71.4% (5 of 7) of all High-Risk occurrences company-wide. While producing $2.17M in top-line revenue, marketing customer cohorts experienced excessive churn throughout H1 2025 (Europe: 5.1% in Feb, 5.5% in May; APAC: 7.8% in Mar, 6.9% in Jun; NA: 4.0% in Apr).',
    rootCause: 'Ad spend was directed toward low-intent cohorts with inadequate qualification, creating a "leaky bucket" prior to stabilization in late 2025.',
    trend: 'Stabilized in Q3/Q4 but high historical vulnerability',
  },
  {
    id: 'risk-3',
    title: 'Heavy Fixed Cost Burden in Engineering and Product & Ops',
    severity: 'Medium' as RiskLevel,
    category: 'Cost Structure & Overhead',
    department: 'Engineering, Product & Ops',
    region: 'Global',
    metricsImpacted: '$2,495,000 combined spend (51.7% of total company budget)',
    description: 'Engineering ($1,600,000 total spend) and Product & Ops ($895,000 total spend) consume more than half of the organization’s total capital expenditure without direct revenue attribution. In NA Jan 2025, Product & Ops was flagged High Risk ($110,000 spend with high operational overhead).',
    rootCause: 'Rapid team expansion and infrastructure overhead without direct billing mechanisms or value-stream attribution.',
    trend: 'Steady escalation (+16.2% Engineering spend growth between Jan and Dec)',
  },
  {
    id: 'risk-4',
    title: 'Customer Support Underfunding vs. Exceptional Value Creation',
    severity: 'Low' as RiskLevel,
    category: 'Resource Allocation Asymmetry',
    department: 'Customer Support',
    region: 'Global',
    metricsImpacted: 'CSAT 8.78 Avg (peak 9.1), Spend only 8.04% of total budget',
    description: 'Customer Support delivers the highest satisfaction scores across the business (average 8.78, reaching 9.1 in NA and Europe) and consistently drives churn down to 1.0%–1.2%. Despite being the linchpin of retention, it receives only 8.04% ($388,000) of total organizational spend.',
    rootCause: 'Support treated historically as a back-office cost center rather than a proactive customer success driver.',
    trend: 'High leverage opportunity for expansion',
  }
];

export const STRATEGIC_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    number: 1,
    title: 'Restructure & Localize Asia-Pacific Go-To-Market Engine',
    priority: 'Immediate (0-90 Days)',
    targetDepartment: 'Sales, Marketing & Regional Leadership',
    expectedFinancialImpact: '+$250,000 to +$350,000 Annual Operating Margin Improvement',
    kpiTarget: 'Reduce APAC Churn to < 2.5% | Lift APAC CSAT from 7.63 to > 8.20',
    summary: 'Halt uncalibrated broad-brush ad spend in APAC. Pivot the regional strategy toward targeted enterprise accounts, localized onboarding, and dedicated customer success pods.',
    actionPlan: [
      'Audit APAC marketing channels and immediately cut low-intent acquisition campaigns responsible for the 7.8% churn spike.',
      'Reallocate $30k/month from generic APAC top-of-funnel marketing into localized technical sales enablement and bilingual solution engineering.',
      'Deploy a dedicated Customer Success pod in APAC modeled after the high-performing North American support framework.'
    ]
  },
  {
    id: 'rec-2',
    number: 2,
    title: 'Aggressively Scale High-ROI Sales & Expansion Engines in NA & Europe',
    priority: 'Near-Term (30-180 Days)',
    targetDepartment: 'Sales & Executive Leadership',
    expectedFinancialImpact: '+$800,000 to +$1.2M Additional Annual Gross Revenue',
    kpiTarget: 'Maintain Sales ROI > 3.8x | Keep NA/EU Customer Churn < 1.5%',
    summary: 'Capitalize on proven market leadership in North America (generating $610k revenue at 1.2% churn in Sept) and European Q4 momentum ($580k revenue at 2.5% churn in Dec).',
    actionPlan: [
      'Increase Sales hiring and quota capacity by 25% in North America and Western Europe where deal velocity and retention are highest.',
      'Package high-tier enterprise expansion packages with dedicated Support SLA guarantees (leveraging the 9.1 CSAT benchmark).',
      'Create an account-based marketing (ABM) bridge between Marketing and Sales to sustain the 3.4x+ marketing ROI achieved in Q3/Q4.'
    ]
  },
  {
    id: 'rec-3',
    number: 3,
    title: 'Implement Value-Stream Accountability & Monetization for Product & Engineering',
    priority: 'Medium-Term (60-360 Days)',
    targetDepartment: 'Engineering, Product & Ops, Finance',
    expectedFinancialImpact: '12-18% Overhead Efficiency (~$300,000 Annual Savings/Reinvestment)',
    kpiTarget: 'Link 70%+ of R&D backlog to revenue-generating features or churn mitigation',
    summary: 'Align the $2.495M R&D investment directly with commercial outcomes. Establish product telemetry to measure how engineering sprint outputs impact customer satisfaction and retention.',
    actionPlan: [
      'Establish quarterly Product ROI scorecards measuring retention impact, feature adoption, and server/infrastructure unit economics.',
      'Transition Product & Ops from operational overhead into a monetization driver by launching premium add-on workflow modules and SLA tiers.',
      'Standardize cross-departmental risk reviews (eliminating high-risk operational delays like NA Jan 2025).'
    ]
  }
];

export type ThemeMode = 'light' | 'editorial' | 'midnight';

export type Department = string;
export type Region = string;
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface BusinessRecord {
  id: string;
  date: string;
  department: Department;
  region: Region;
  monthlySpendUSD: number;
  monthlyRevenueUSD: number;
  customerSatisfactionScore: number;
  churnRatePct: number;
  riskLevel: RiskLevel;
  netProfitUSD: number;
  profitMarginPct: number;
  roiMultiple: number;
}

export interface RegionSummary {
  region: Region;
  totalSpend: number;
  totalRevenue: number;
  netProfit: number;
  profitMarginPct: number;
  avgCSAT: number;
  avgChurnPct: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  recordCount: number;
}

export interface DepartmentSummary {
  department: Department;
  totalSpend: number;
  totalRevenue: number;
  netProfit: number;
  profitMarginPct: number;
  roiMultiple: number;
  avgCSAT: number;
  avgChurnPct: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  spendSharePct: number;
  revenueSharePct: number;
}

export interface TimePeriodSummary {
  date: string;
  formattedDate: string;
  region: Region;
  totalSpend: number;
  totalRevenue: number;
  netProfit: number;
  profitMarginPct: number;
  avgCSAT: number;
  avgChurnPct: number;
  highRiskCount: number;
}

export interface TotalMetrics {
  totalRevenue: number;
  totalSpend: number;
  netProfit: number;
  profitMarginPct: number;
  avgCSAT: number;
  avgChurnPctCustomerFacing: number;
  overallAvgChurnPct: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface OperationalRisk {
  id: string;
  title: string;
  severity: RiskLevel;
  category: string;
  department: string;
  region: string;
  metricsImpacted: string;
  description: string;
  rootCause: string;
  trend: string;
}

export interface StrategicRecommendation {
  id: string;
  number: number;
  title: string;
  priority: string;
  targetDepartment: string;
  expectedFinancialImpact: string;
  kpiTarget: string;
  summary: string;
  actionPlan: string[];
}

export interface DatasetInfo {
  fileName: string;
  fileType: 'csv' | 'xlsx' | 'xls' | 'sample';
  uploadedAt: string;
  recordCount: number;
  isCustom: boolean;
}

export interface FilterState {
  region: string;
  department: string;
  riskLevel: string;
  date: string;
  searchQuery?: string;
  searchTerm?: string;
}

export interface ProcessedAuditData {
  datasetInfo: DatasetInfo;
  records: BusinessRecord[];
  totalMetrics: TotalMetrics;
  regions: Region[];
  departments: Department[];
  regionalSummaries: Record<string, RegionSummary>;
  departmentSummaries: Record<string, DepartmentSummary>;
  timePeriodSummaries: TimePeriodSummary[];
  operationalRisks: OperationalRisk[];
  strategicRecommendations: StrategicRecommendation[];
  rawCSV: string;
}

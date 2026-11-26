export const SUBSCRIPTION_PRICE_KOPECKS = 2_900;

export interface BenefitUsage {
  shipments: number;
  parcels: number;
  additionalServices: number;
}

export interface SavingsEstimate {
  grossSavingsKopecks: number;
  confirmedSavingsKopecks: number;
  subscriptionCostKopecks: number;
  netMonthlyKopecks: number;
  netAnnualKopecks: number;
  breakEvenActions: number | null;
  actionsUsed: number;
}

export interface ConditionalSavingsAssumptions {
  shipmentKopecks: number;
  parcelKopecks: number;
  additionalServiceKopecks: number;
}

export const DEFAULT_CONDITIONAL_SAVINGS: ConditionalSavingsAssumptions = {
  shipmentKopecks: 0,
  parcelKopecks: 0,
  additionalServiceKopecks: 0,
};

export interface BusinessMetrics {
  registeredUsers: number;
  payingUsers: number;
  monthlyRevenueKopecks: number;
  revenuePerRegisteredUserKopecks: number;
  conversionRate: number;
}

export function calculateSavings(
  usage: BenefitUsage,
  assumptions: ConditionalSavingsAssumptions = DEFAULT_CONDITIONAL_SAVINGS,
): SavingsEstimate {
  const normalizeCount = (value: number) =>
    Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const normalizeKopecks = (value: number) =>
    Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
  const shipments = normalizeCount(usage.shipments);
  const parcels = normalizeCount(usage.parcels);
  const additionalServices = normalizeCount(usage.additionalServices);
  const actionsUsed = shipments + parcels + additionalServices;
  const grossSavingsKopecks =
    shipments * normalizeKopecks(assumptions.shipmentKopecks) +
    parcels * normalizeKopecks(assumptions.parcelKopecks) +
    additionalServices * normalizeKopecks(assumptions.additionalServiceKopecks);

  const averageSavingsPerAction =
    actionsUsed > 0 ? grossSavingsKopecks / actionsUsed : 0;
  const breakEvenActions =
    averageSavingsPerAction > 0
      ? Math.ceil(SUBSCRIPTION_PRICE_KOPECKS / averageSavingsPerAction)
      : null;

  const netMonthlyKopecks = grossSavingsKopecks - SUBSCRIPTION_PRICE_KOPECKS;

  return {
    grossSavingsKopecks,
    confirmedSavingsKopecks: 0,
    subscriptionCostKopecks: SUBSCRIPTION_PRICE_KOPECKS,
    netMonthlyKopecks,
    netAnnualKopecks: netMonthlyKopecks * 12,
    breakEvenActions,
    actionsUsed,
  };
}

export function calculateBusinessMetrics(
  registeredUsers: number,
  payingUsers: number,
): BusinessMetrics {
  const safeRegisteredUsers = Math.max(0, Math.floor(registeredUsers));
  const safePayingUsers = Math.min(
    safeRegisteredUsers,
    Math.max(0, Math.floor(payingUsers)),
  );
  const monthlyRevenueKopecks =
    safePayingUsers * SUBSCRIPTION_PRICE_KOPECKS;

  return {
    registeredUsers: safeRegisteredUsers,
    payingUsers: safePayingUsers,
    monthlyRevenueKopecks,
    revenuePerRegisteredUserKopecks:
      safeRegisteredUsers > 0
        ? Math.round(monthlyRevenueKopecks / safeRegisteredUsers)
        : 0,
    conversionRate:
      safeRegisteredUsers > 0 ? safePayingUsers / safeRegisteredUsers : 0,
  };
}

export function formatMoney(kopecks: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  }).format(kopecks / 100);
}

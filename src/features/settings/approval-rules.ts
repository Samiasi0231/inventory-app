import type { ApprovalRule } from "./types";

const amountFormatter = new Intl.NumberFormat("en-NG");

export function describeCondition(rule: ApprovalRule): string {
  const amount = Number(rule.threshold);
  if (!rule.threshold || Number.isNaN(amount)) return rule.condition;

  switch (rule.thresholdUnit) {
    case "currency":
      return `Order total exceeds ₦${amountFormatter.format(amount)}`;
    case "percent":
      return `Discount over ${amount}% of sale value`;
    default:
      return `Quantity over ${amountFormatter.format(amount)} units`;
  }
}

export function thresholdLabel(rule: ApprovalRule): string {
  switch (rule.thresholdUnit) {
    case "currency":
      return "Threshold (₦)";
    case "percent":
      return "Threshold (%)";
    default:
      return "Threshold (units)";
  }
}

"use client";

import { use } from "react";
import ApprovalRuleEditPage from "@/screens/settings/approval-rule-edit-page";

export default function Page({ params }: { params: Promise<{ ruleId: string }> }) {
  const { ruleId } = use(params);
  return <ApprovalRuleEditPage ruleId={ruleId} />;
}

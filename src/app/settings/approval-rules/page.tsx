"use client";

import { use } from "react";
import ApprovalRule from "@/screens/settings/approval-rules-page";

export default function ApprovalRulesPage({ params }: { params: Promise<{ ruleId: string }> }) {
  const { ruleId } = use(params);
  return <ApprovalRule />;
}

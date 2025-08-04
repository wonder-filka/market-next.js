'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/locales/client";

export function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {

  const t = useI18n()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(label as keyof typeof t)}</CardTitle>
      </CardHeader>
      <CardContent>
        <span>{value}</span>
      </CardContent>
    </Card>
  );
}
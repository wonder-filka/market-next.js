import { Badge } from "@/components/ui/badge"

type StatusType = "Completed" | "Pending" | "Cancelled" | string;

export function StatusBadge({ status }: { status: StatusType }) {
  let badgeClass = "";
  let variant: "default" | "outline" | "secondary" | "destructive" = "default";

  if (status === "Completed") {
    badgeClass = "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600";
    variant = "secondary";
  } else if (status === "Pending") {
    variant = "secondary";
  } else if (status === "Cancelled") {
    variant = "destructive";
  }

  return (
    <Badge variant={variant} className={`capitalize ${badgeClass}`}>
      {status}
    </Badge>
  );
}
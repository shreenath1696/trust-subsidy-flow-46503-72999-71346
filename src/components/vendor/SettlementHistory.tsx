import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

const settlements = [
  { date: "Jan 15, 2025", transactions: 24, amount: 36400, status: "completed" },
  { date: "Jan 14, 2025", transactions: 31, amount: 45200, status: "completed" },
  { date: "Jan 13, 2025", transactions: 18, amount: 28900, status: "completed" },
  { date: "Jan 12, 2025", transactions: 27, amount: 41300, status: "completed" },
];

export const SettlementHistory = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-semibold">Settlement History</h3>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settlements.map((settlement, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{settlement.date}</TableCell>
                <TableCell>{settlement.transactions} payments</TableCell>
                <TableCell className="text-lg font-bold">₹{settlement.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    ✓ {settlement.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💰 All settlements are processed instantly to your registered bank account
        </p>
      </div>
    </Card>
  );
};

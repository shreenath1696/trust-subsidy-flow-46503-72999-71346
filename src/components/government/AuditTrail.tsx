import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const auditRecords = [
  { 
    id: "AUD-2024-001234", 
    timestamp: "2025-01-15 14:23:45", 
    action: "Subsidy Issued", 
    officer: "Officer #4521", 
    details: "Fertilizer Subsidy - ₹75L to 5000 beneficiaries",
    hash: "0x7f9a...3d2e"
  },
  { 
    id: "AUD-2024-001233", 
    timestamp: "2025-01-15 13:15:22", 
    action: "Payment Settled", 
    officer: "System Auto", 
    details: "Vendor Settlement - Agro Supplies ₹2.3L",
    hash: "0x4b2c...8f1a"
  },
  { 
    id: "AUD-2024-001232", 
    timestamp: "2025-01-15 12:04:18", 
    action: "Beneficiary Added", 
    officer: "Officer #3241", 
    details: "New beneficiary registration - 234 citizens",
    hash: "0x9e5d...7c4b"
  },
  { 
    id: "AUD-2024-001231", 
    timestamp: "2025-01-15 10:45:33", 
    action: "Policy Updated", 
    officer: "Admin #1001", 
    details: "Education voucher limit increased to ₹2500",
    hash: "0x1a3f...6b9e"
  },
];

export const AuditTrail = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Immutable Audit Trail</h3>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Audit ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Officer</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Block Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-mono text-xs">{record.id}</TableCell>
                <TableCell className="text-sm">{record.timestamp}</TableCell>
                <TableCell>
                  <Badge variant="outline">{record.action}</Badge>
                </TableCell>
                <TableCell className="text-sm">{record.officer}</TableCell>
                <TableCell className="text-sm">{record.details}</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{record.hash}</code>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 p-3 bg-muted/30 rounded-lg border-l-4 border-primary">
        <p className="text-sm text-muted-foreground">
          🔒 All records are cryptographically signed and stored on a distributed ledger for permanent accountability
        </p>
      </div>
    </Card>
  );
};

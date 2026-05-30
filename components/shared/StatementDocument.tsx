"use client"

import { formatCurrency, formatDate } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface LedgerRow {
  date: string
  description: string
  debit?: number
  credit?: number
  balance: number
}

interface StatementDocumentProps {
  tenantName: string
  propertyAddress: string
  roomLabel?: string
  periodStart?: string
  periodEnd?: string
  moveInDate?: string
  dailyRate?: number
  rentAmount: number
  rentFrequency: string
  ledgerRows: LedgerRow[]
  openingBalance: number
  closingBalance: number
  rentArrears: number
  invoiceArrears: number
  paidToDate?: string
}

export function StatementDocument({
  tenantName,
  propertyAddress,
  roomLabel,
  periodStart,
  periodEnd,
  moveInDate,
  dailyRate,
  rentAmount,
  rentFrequency,
  ledgerRows,
  openingBalance,
  closingBalance,
  rentArrears,
  invoiceArrears,
  paidToDate,
}: StatementDocumentProps) {
  const location = roomLabel
    ? `${roomLabel}, ${propertyAddress}`
    : propertyAddress

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 print:p-0">
      {/* Header */}
      <div className="border-b-2 border-primary pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Renlio</h1>
            <p className="text-sm text-muted-foreground">Property Management System</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-primary text-white px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">TENANCY STATEMENT</span>
            </div>
            {periodStart && periodEnd && (
              <p className="text-sm text-muted-foreground mt-2">
                Period: {formatDate(periodStart)} — {formatDate(periodEnd)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tenant & Property Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Tenant</h2>
          <p className="text-xl font-semibold text-foreground">{tenantName}</p>
          {moveInDate && (
            <p className="text-sm text-muted-foreground mt-1">
              Move-in: {formatDate(moveInDate)}
            </p>
          )}
        </div>
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Property</h2>
          <p className="text-lg font-medium text-foreground">{location}</p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-surface rounded-lg">
          <p className="text-sm text-muted-foreground">Paid To Date</p>
          <p className="text-lg font-semibold text-foreground">{paidToDate ? formatDate(paidToDate) : "—"}</p>
        </div>
        <div className="p-4 bg-surface rounded-lg">
          <p className="text-sm text-muted-foreground">Rent Arrears</p>
          <p className={`text-lg font-semibold ${rentArrears > 0 ? "text-destructive" : "text-success"}`}>
            {formatCurrency(rentArrears)}
          </p>
        </div>
        <div className="p-4 bg-surface rounded-lg">
          <p className="text-sm text-muted-foreground">Invoice Arrears</p>
          <p className={`text-lg font-semibold ${invoiceArrears > 0 ? "text-destructive" : "text-success"}`}>
            {formatCurrency(invoiceArrears)}
          </p>
        </div>
        <div className="p-4 bg-surface rounded-lg">
          <p className="text-sm text-muted-foreground">Daily Rate</p>
          <p className="text-lg font-semibold text-foreground">{dailyRate ? formatCurrency(dailyRate) : "—"}</p>
        </div>
      </div>

      {/* Rent Info */}
      <div className="mb-8 p-4 bg-surface rounded-lg">
        <p className="text-sm text-muted-foreground">Rent</p>
        <p className="text-lg font-semibold text-foreground">
          {formatCurrency(rentAmount)} / {rentFrequency.toLowerCase()}
        </p>
      </div>

      {/* Ledger Table */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Transaction History</h2>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-alt">
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Debit (DR)</TableHead>
                <TableHead className="text-right">Credit (CR)</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Opening Balance */}
              <TableRow>
                <TableCell className="text-muted-foreground">—</TableCell>
                <TableCell className="text-muted-foreground italic">Opening Balance</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right font-medium">
                  {openingBalance >= 0 ? formatCurrency(openingBalance) : `(${formatCurrency(Math.abs(openingBalance))})`}
                </TableCell>
              </TableRow>
              
              {ledgerRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(row.date)}</TableCell>
                  <TableCell className="font-medium">{row.description}</TableCell>
                  <TableCell className="text-right">
                    {row.debit ? formatCurrency(row.debit) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.credit ? (
                      <span className="text-success">{formatCurrency(row.credit)}</span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {row.balance >= 0 ? formatCurrency(row.balance) : `(${formatCurrency(Math.abs(row.balance))})`}
                  </TableCell>
                </TableRow>
              ))}

              {/* Closing Balance */}
              <TableRow className="bg-surface-alt font-semibold">
                <TableCell className="text-muted-foreground">—</TableCell>
                <TableCell className="text-muted-foreground italic">Closing Balance</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right">—</TableCell>
                <TableCell className="text-right">
                  {closingBalance >= 0 ? formatCurrency(closingBalance) : `(${formatCurrency(Math.abs(closingBalance))})`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-6 mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          This is an official tenancy statement generated by Renlio
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Statement generated on {formatDate(new Date().toISOString())}
        </p>
      </div>
    </div>
  )
}

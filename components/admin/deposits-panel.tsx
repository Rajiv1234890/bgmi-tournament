"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Check, X, Copy } from "lucide-react"

// Mock data for pending deposits
const mockPendingDeposits = [
  {
    id: 1,
    username: "Player123",
    bgmiId: "5678901234",
    amount: 100,
    transactionId: "UPI123456789",
    timestamp: "2023-03-05 14:30:45",
    screenshot: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    username: "Gamer456",
    bgmiId: "1234567890",
    amount: 200,
    transactionId: "UPI987654321",
    timestamp: "2023-03-05 15:45:30",
    screenshot: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    username: "ProGamer789",
    bgmiId: "9876543210",
    amount: 500,
    transactionId: "UPI456789123",
    timestamp: "2023-03-05 16:20:15",
    screenshot: "/placeholder.svg?height=100&width=100",
  },
]

export default function DepositsPanel() {
  const [upiId, setUpiId] = useState("example@upi")
  const [pendingDeposits, setPendingDeposits] = useState(mockPendingDeposits)
  const [isEditing, setIsEditing] = useState(false)
  const [newUpiId, setNewUpiId] = useState(upiId)

  const handleUpdateUpi = () => {
    setUpiId(newUpiId)
    setIsEditing(false)
    toast({
      title: "UPI ID Updated",
      description: "The deposit UPI ID has been updated successfully.",
    })
  }

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId)
    toast({
      title: "UPI ID Copied",
      description: "The UPI ID has been copied to clipboard.",
    })
  }

  const handleApproveDeposit = (id: number) => {
    setPendingDeposits(pendingDeposits.filter((deposit) => deposit.id !== id))
    toast({
      title: "Deposit Approved",
      description: "The deposit has been approved and user's wallet has been updated.",
    })
  }

  const handleRejectDeposit = (id: number) => {
    setPendingDeposits(pendingDeposits.filter((deposit) => deposit.id !== id))
    toast({
      title: "Deposit Rejected",
      description: "The deposit has been rejected.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Deposit UPI Settings</CardTitle>
          <CardDescription>Manage the UPI ID that players will use to deposit funds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="upi-id">New UPI ID</Label>
                <div className="flex space-x-2">
                  <Input
                    id="upi-id"
                    value={newUpiId}
                    onChange={(e) => setNewUpiId(e.target.value)}
                    placeholder="Enter new UPI ID"
                  />
                  <Button onClick={handleUpdateUpi}>Save</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="current-upi">Current UPI ID</Label>
                <div className="flex space-x-2">
                  <Input id="current-upi" value={upiId} readOnly />
                  <Button variant="outline" onClick={handleCopyUpi}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>Change UPI ID</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Deposits</CardTitle>
          <CardDescription>Review and approve player deposit requests</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingDeposits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>BGMI ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Screenshot</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDeposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>{deposit.username}</TableCell>
                    <TableCell>{deposit.bgmiId}</TableCell>
                    <TableCell>₹{deposit.amount}</TableCell>
                    <TableCell>{deposit.transactionId}</TableCell>
                    <TableCell>{deposit.timestamp}</TableCell>
                    <TableCell>
                      <img
                        src={deposit.screenshot || "/placeholder.svg"}
                        alt="Payment Screenshot"
                        className="h-10 w-10 cursor-pointer object-cover"
                        onClick={() => window.open(deposit.screenshot, "_blank")}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleApproveDeposit(deposit.id)}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleRejectDeposit(deposit.id)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No pending deposits</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


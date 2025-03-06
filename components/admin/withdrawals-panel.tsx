"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Check, X, ExternalLink } from "lucide-react"

// Mock data for pending withdrawals
const mockPendingWithdrawals = [
  {
    id: 1,
    username: "Player123",
    bgmiId: "5678901234",
    amount: 500,
    upiId: "player123@upi",
    timestamp: "2023-03-05 14:30:45",
  },
  {
    id: 2,
    username: "Gamer456",
    bgmiId: "1234567890",
    amount: 1200,
    upiId: "gamer456@upi",
    timestamp: "2023-03-05 15:45:30",
  },
  {
    id: 3,
    username: "ProGamer789",
    bgmiId: "9876543210",
    amount: 2500,
    upiId: "progamer789@upi",
    timestamp: "2023-03-05 16:20:15",
  },
]

// Mock data for completed withdrawals
const mockCompletedWithdrawals = [
  {
    id: 4,
    username: "Ninja456",
    bgmiId: "5566778899",
    amount: 800,
    upiId: "ninja456@upi",
    timestamp: "2023-03-04 12:15:30",
    status: "Completed",
  },
  {
    id: 5,
    username: "Sniper123",
    bgmiId: "1122334455",
    amount: 1500,
    upiId: "sniper123@upi",
    timestamp: "2023-03-03 10:45:20",
    status: "Completed",
  },
  {
    id: 6,
    username: "Warrior789",
    bgmiId: "9988776655",
    amount: 300,
    upiId: "warrior789@upi",
    timestamp: "2023-03-02 16:30:10",
    status: "Rejected",
  },
]

export default function WithdrawalsPanel() {
  const [pendingWithdrawals, setPendingWithdrawals] = useState(mockPendingWithdrawals)
  const [completedWithdrawals, setCompletedWithdrawals] = useState(mockCompletedWithdrawals)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null)

  const handleApproveWithdrawal = (id: number) => {
    const withdrawal = pendingWithdrawals.find((w) => w.id === id)
    if (withdrawal) {
      setPendingWithdrawals(pendingWithdrawals.filter((w) => w.id !== id))
      setCompletedWithdrawals([...completedWithdrawals, { ...withdrawal, status: "Completed" }])

      toast({
        title: "Withdrawal Approved",
        description: `₹${withdrawal.amount} has been sent to ${withdrawal.username}'s UPI ID.`,
      })
    }
  }

  const handleRejectWithdrawal = (id: number) => {
    const withdrawal = pendingWithdrawals.find((w) => w.id === id)
    if (withdrawal) {
      setPendingWithdrawals(pendingWithdrawals.filter((w) => w.id !== id))
      setCompletedWithdrawals([...completedWithdrawals, { ...withdrawal, status: "Rejected" }])

      toast({
        title: "Withdrawal Rejected",
        description: `The withdrawal request from ${withdrawal.username} has been rejected.`,
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Withdrawals</CardTitle>
          <CardDescription>Review and process player withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingWithdrawals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>BGMI ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>UPI ID</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingWithdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>{withdrawal.username}</TableCell>
                    <TableCell>{withdrawal.bgmiId}</TableCell>
                    <TableCell>₹{withdrawal.amount}</TableCell>
                    <TableCell>{withdrawal.upiId}</TableCell>
                    <TableCell>{withdrawal.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => setSelectedWithdrawal(withdrawal)}
                            >
                              <Check className="h-4 w-4 text-green-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Withdrawal</DialogTitle>
                              <DialogDescription>
                                Please confirm that you have sent the payment manually via UPI
                              </DialogDescription>
                            </DialogHeader>
                            {selectedWithdrawal && (
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <p className="text-sm font-medium">Username:</p>
                                    <p className="text-sm">{selectedWithdrawal.username}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">BGMI ID:</p>
                                    <p className="text-sm">{selectedWithdrawal.bgmiId}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Amount:</p>
                                    <p className="text-sm font-bold">₹{selectedWithdrawal.amount}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">UPI ID:</p>
                                    <p className="text-sm">{selectedWithdrawal.upiId}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      window.open(
                                        `upi://pay?pa=${selectedWithdrawal.upiId}&am=${selectedWithdrawal.amount}&cu=INR`,
                                        "_blank",
                                      )
                                    }
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open UPI App
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleApproveWithdrawal(selectedWithdrawal.id)
                                      setSelectedWithdrawal(null)
                                    }}
                                  >
                                    Confirm Payment Sent
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => handleRejectWithdrawal(withdrawal.id)}
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
              <p className="text-muted-foreground">No pending withdrawals</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Record of all processed withdrawal requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>BGMI ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>UPI ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>{withdrawal.username}</TableCell>
                  <TableCell>{withdrawal.bgmiId}</TableCell>
                  <TableCell>₹{withdrawal.amount}</TableCell>
                  <TableCell>{withdrawal.upiId}</TableCell>
                  <TableCell>{withdrawal.timestamp}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        withdrawal.status === "Completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}


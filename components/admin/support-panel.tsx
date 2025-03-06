"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Copy, MessageSquare } from "lucide-react"

// Mock data for support queries
const mockSupportQueries = [
  {
    id: 1,
    username: "Player123",
    bgmiId: "5678901234",
    message: "I didn't receive my tournament rewards",
    timestamp: "2023-03-05 14:30:45",
    status: "Pending",
  },
  {
    id: 2,
    username: "Gamer456",
    bgmiId: "1234567890",
    message: "My deposit is not showing in my wallet",
    timestamp: "2023-03-05 15:45:30",
    status: "Resolved",
  },
  {
    id: 3,
    username: "ProGamer789",
    bgmiId: "9876543210",
    message: "How do I change my UPI ID?",
    timestamp: "2023-03-05 16:20:15",
    status: "Pending",
  },
]

export default function SupportPanel() {
  const [supportTelegramId, setSupportTelegramId] = useState("@support_bgmi")
  const [isEditing, setIsEditing] = useState(false)
  const [newSupportTelegramId, setNewSupportTelegramId] = useState(supportTelegramId)
  const [supportQueries, setSupportQueries] = useState(mockSupportQueries)

  const handleUpdateSupportId = () => {
    setSupportTelegramId(newSupportTelegramId)
    setIsEditing(false)
    toast({
      title: "Support ID Updated",
      description: "The support Telegram ID has been updated successfully.",
    })
  }

  const handleCopySupportId = () => {
    navigator.clipboard.writeText(supportTelegramId)
    toast({
      title: "Support ID Copied",
      description: "The support Telegram ID has been copied to clipboard.",
    })
  }

  const handleMarkAsResolved = (id: number) => {
    setSupportQueries(supportQueries.map((query) => (query.id === id ? { ...query, status: "Resolved" } : query)))

    toast({
      title: "Query Resolved",
      description: "The support query has been marked as resolved.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Support Contact Settings</CardTitle>
          <CardDescription>Manage the Telegram ID that players will use for support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="support-id">New Support Telegram ID</Label>
                <div className="flex space-x-2">
                  <Input
                    id="support-id"
                    value={newSupportTelegramId}
                    onChange={(e) => setNewSupportTelegramId(e.target.value)}
                    placeholder="Enter new Telegram ID"
                  />
                  <Button onClick={handleUpdateSupportId}>Save</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="current-support-id">Current Support Telegram ID</Label>
                <div className="flex space-x-2">
                  <Input id="current-support-id" value={supportTelegramId} readOnly />
                  <Button variant="outline" onClick={handleCopySupportId}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={() => setIsEditing(true)}>Change ID</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support Queries</CardTitle>
          <CardDescription>Manage player support requests</CardDescription>
        </CardHeader>
        <CardContent>
          {supportQueries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>BGMI ID</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supportQueries.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell>{query.username}</TableCell>
                    <TableCell>{query.bgmiId}</TableCell>
                    <TableCell className="max-w-xs truncate">{query.message}</TableCell>
                    <TableCell>{query.timestamp}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          query.status === "Resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {query.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={query.status === "Resolved"}
                          onClick={() => handleMarkAsResolved(query.id)}
                        >
                          Mark Resolved
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(`https://t.me/${query.username}`, "_blank")}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No support queries</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


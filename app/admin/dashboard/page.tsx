"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

import DepositsPanel from "@/components/admin/deposits-panel"
import TournamentsPanel from "@/components/admin/tournaments-panel"
import ResultsPanel from "@/components/admin/results-panel"
import WithdrawalsPanel from "@/components/admin/withdrawals-panel"
import SupportPanel from "@/components/admin/support-panel"
import DashboardStats from "@/components/admin/dashboard-stats"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem("adminAuthenticated")
    if (adminAuth !== "true") {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
    router.push("/admin/login")
  }

  if (!isAuthenticated) {
    return null // Don't render anything until authentication check is complete
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">BGMI Tournament Admin</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 container py-6 px-4 sm:px-6 lg:px-8">
        <DashboardStats />

        <Tabs defaultValue="deposits" className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>
          <TabsContent value="deposits">
            <DepositsPanel />
          </TabsContent>
          <TabsContent value="tournaments">
            <TournamentsPanel />
          </TabsContent>
          <TabsContent value="results">
            <ResultsPanel />
          </TabsContent>
          <TabsContent value="withdrawals">
            <WithdrawalsPanel />
          </TabsContent>
          <TabsContent value="support">
            <SupportPanel />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t py-4">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BGMI Tournament Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}


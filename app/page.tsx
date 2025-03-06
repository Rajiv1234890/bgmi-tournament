import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">BGMI Tournament Manager</h1>
        </div>
      </header>
      <main className="flex-1 container py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>Access the admin dashboard to manage tournaments</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <img src="/placeholder.svg?height=100&width=100" alt="Admin" className="h-24 w-24 rounded-full" />
            </CardContent>
            <CardFooter>
              <Link href="/admin/login" className="w-full">
                <Button className="w-full">Login to Admin Panel</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bot Integration</CardTitle>
              <CardDescription>Connect with our Telegram bot</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <img src="/placeholder.svg?height=100&width=100" alt="Telegram Bot" className="h-24 w-24 rounded-full" />
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                <Link href="https://t.me/your_bot_username" className="w-full">
                  Open Telegram Bot
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Learn how to use the system</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <img src="/placeholder.svg?height=100&width=100" alt="Documentation" className="h-24 w-24 rounded-full" />
            </CardContent>
            <CardFooter>
              <Link href="/docs" className="w-full">
                <Button className="w-full" variant="secondary">
                  View Documentation
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BGMI Tournament Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}


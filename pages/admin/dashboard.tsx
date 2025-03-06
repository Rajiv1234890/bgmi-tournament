import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    activeTournaments: 0,
    totalPlayers: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
      } else {
        fetchStats()
      }
    }

    checkAuth()
  }, [])

  const fetchStats = async () => {
    // Fetch stats from Supabase
    // This is a simplified example, you'll need to adjust based on your actual data structure
    const { data: deposits } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'deposit')
      .eq('status', 'approved')

    const { data: withdrawals } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'withdrawal')
      .eq('status', 'approved')

    const { count: activeTournaments } = await supabase
      .from('tournaments')
      .select('id', { count: 'exact' })
      .eq('status', 'Ongoing')

    const { count: totalPlayers } = await supabase
      .from('players')
      .select('id', { count: 'exact' })

    setStats({
      totalDeposits: deposits?.reduce((sum, d) => sum + d.amount, 0) || 0,
      totalWithdrawals: withdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0,
      activeTournaments: activeTournaments || 0,
      totalPlayers: totalPlayers || 0,
    })

    setIsLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">BGMI Admin Panel</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Deposits</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">₹{stats.totalDeposits}</dd>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Withdrawals</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">₹{stats.totalWithdrawals}</dd>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Tournaments</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.activeTournaments}</dd>
                  </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Players</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalPlayers}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
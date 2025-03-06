"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Trophy, Medal } from "lucide-react"

// Mock data for completed tournaments
const mockCompletedTournaments = [
  { id: 1, name: "BGMI Solo Showdown", date: "2023-03-01", players: 100, prizePool: "₹5,000", winner: "ProGamer789" },
  {
    id: 2,
    name: "Squad Battle Royale",
    date: "2023-03-02",
    players: 100,
    prizePool: "₹5,000",
    winner: "TeamDestroyers",
  },
  { id: 3, name: "Duo Championship", date: "2023-03-03", players: 100, prizePool: "₹5,000", winner: "DynamicDuo" },
]

// Mock data for active tournaments
const mockActiveTournaments = [
  { id: 4, name: "BGMI Solo Challenge", date: "2023-03-06", players: 100, prizePool: "₹5,000" },
  { id: 5, name: "Squad Warfare", date: "2023-03-07", players: 100, prizePool: "₹5,000" },
]

// Mock data for players in a tournament
const mockTournamentPlayers = [
  { id: 1, username: "Player123", bgmiId: "5678901234", kills: 0, position: null },
  { id: 2, username: "Gamer456", bgmiId: "1234567890", kills: 0, position: null },
  { id: 3, username: "ProGamer789", bgmiId: "9876543210", kills: 0, position: null },
  { id: 4, username: "Sniper123", bgmiId: "1122334455", kills: 0, position: null },
  { id: 5, username: "Ninja456", bgmiId: "5566778899", kills: 0, position: null },
]

export default function ResultsPanel() {
  const [completedTournaments, setCompletedTournaments] = useState(mockCompletedTournaments)
  const [activeTournaments, setActiveTournaments] = useState(mockActiveTournaments)
  const [tournamentPlayers, setTournamentPlayers] = useState(mockTournamentPlayers)
  const [selectedTournament, setSelectedTournament] = useState<number | null>(null)
  const [selectedTournamentName, setSelectedTournamentName] = useState("")

  const handleSelectTournament = (id: number, name: string) => {
    setSelectedTournament(id)
    setSelectedTournamentName(name)
    // Reset player stats when selecting a new tournament
    setTournamentPlayers(
      mockTournamentPlayers.map((player) => ({
        ...player,
        kills: 0,
        position: null,
      })),
    )
  }

  const handleUpdateKills = (playerId: number, kills: number) => {
    setTournamentPlayers(tournamentPlayers.map((player) => (player.id === playerId ? { ...player, kills } : player)))
  }

  const handleUpdatePosition = (playerId: number, position: number) => {
    // Remove this position from any other player
    const updatedPlayers = tournamentPlayers.map((player) =>
      player.position === position ? { ...player, position: null } : player,
    )

    // Assign the position to the selected player
    setTournamentPlayers(updatedPlayers.map((player) => (player.id === playerId ? { ...player, position } : player)))
  }

  const handleSubmitResults = () => {
    // Move tournament from active to completed
    if (selectedTournament) {
      const tournament = activeTournaments.find((t) => t.id === selectedTournament)
      if (tournament) {
        // Find the winner (position 1)
        const winner = tournamentPlayers.find((p) => p.position === 1)

        setCompletedTournaments([
          ...completedTournaments,
          {
            ...tournament,
            winner: winner ? winner.username : "Unknown",
          },
        ])

        setActiveTournaments(activeTournaments.filter((t) => t.id !== selectedTournament))

        // Calculate rewards
        const rewards = tournamentPlayers.map((player) => {
          let reward = 0
          // ₹20 per kill
          reward += player.kills * 20

          // ₹1000 to the winner
          if (player.position === 1) {
            reward += 1000
          }

          return {
            username: player.username,
            bgmiId: player.bgmiId,
            kills: player.kills,
            position: player.position,
            reward,
          }
        })

        toast({
          title: "Results Submitted",
          description: "Tournament results have been processed and rewards distributed.",
        })

        setSelectedTournament(null)
        setSelectedTournamentName("")
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enter Tournament Results</CardTitle>
          <CardDescription>Record kills and positions to calculate rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="select-tournament">Select Tournament</Label>
              <Select
                onValueChange={(value) => {
                  const id = Number.parseInt(value)
                  const tournament = activeTournaments.find((t) => t.id === id)
                  if (tournament) {
                    handleSelectTournament(id, tournament.name)
                  }
                }}
              >
                <SelectTrigger id="select-tournament">
                  <SelectValue placeholder="Select a tournament" />
                </SelectTrigger>
                <SelectContent>
                  {activeTournaments.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id.toString()}>
                      {tournament.name} ({tournament.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTournament && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recording results for: {selectedTournamentName}</h3>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>BGMI ID</TableHead>
                      <TableHead>Kills</TableHead>
                      <TableHead>Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tournamentPlayers.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.username}</TableCell>
                        <TableCell>{player.bgmiId}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            value={player.kills}
                            onChange={(e) => handleUpdateKills(player.id, Number.parseInt(e.target.value) || 0)}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={player.position?.toString() || ""}
                            onValueChange={(value) => handleUpdatePosition(player.id, Number.parseInt(value))}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Rank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">None</SelectItem>
                              <SelectItem value="1">1st</SelectItem>
                              <SelectItem value="2">2nd</SelectItem>
                              <SelectItem value="3">3rd</SelectItem>
                              {Array.from({ length: 97 }, (_, i) => i + 4).map((pos) => (
                                <SelectItem key={pos} value={pos.toString()}>
                                  {pos}th
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button
                  onClick={handleSubmitResults}
                  className="w-full"
                  disabled={!tournamentPlayers.some((p) => p.position === 1)}
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Submit Results & Distribute Rewards
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed Tournaments</CardTitle>
          <CardDescription>History of past tournaments and their results</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tournament Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Prize Pool</TableHead>
                <TableHead>Winner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedTournaments.map((tournament) => (
                <TableRow key={tournament.id}>
                  <TableCell>{tournament.name}</TableCell>
                  <TableCell>{tournament.date}</TableCell>
                  <TableCell>{tournament.players}</TableCell>
                  <TableCell>{tournament.prizePool}</TableCell>
                  <TableCell className="flex items-center">
                    <Medal className="h-4 w-4 mr-2 text-yellow-500" />
                    {tournament.winner}
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


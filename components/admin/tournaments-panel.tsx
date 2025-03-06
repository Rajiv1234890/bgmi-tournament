"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Users, Send } from "lucide-react"

// Mock data for tournaments
const mockTournaments = [
  {
    id: 1,
    name: "BGMI Solo Showdown",
    entryFee: 50,
    registeredPlayers: 45,
    maxPlayers: 100,
    status: "Open",
    scheduledTime: "2023-03-06 18:00:00",
  },
  {
    id: 2,
    name: "Squad Battle Royale",
    entryFee: 50,
    registeredPlayers: 96,
    maxPlayers: 100,
    status: "Almost Full",
    scheduledTime: "2023-03-07 20:00:00",
  },
  {
    id: 3,
    name: "Duo Championship",
    entryFee: 50,
    registeredPlayers: 100,
    maxPlayers: 100,
    status: "Closed",
    scheduledTime: "2023-03-08 19:00:00",
  },
]

// Mock data for registered players
const mockRegisteredPlayers = [
  { id: 1, username: "Player123", bgmiId: "5678901234", registrationTime: "2023-03-05 14:30:45" },
  { id: 2, username: "Gamer456", bgmiId: "1234567890", registrationTime: "2023-03-05 15:45:30" },
  { id: 3, username: "ProGamer789", bgmiId: "9876543210", registrationTime: "2023-03-05 16:20:15" },
  { id: 4, username: "Sniper123", bgmiId: "1122334455", registrationTime: "2023-03-05 16:25:10" },
  { id: 5, username: "Ninja456", bgmiId: "5566778899", registrationTime: "2023-03-05 16:30:22" },
]

export default function TournamentsPanel() {
  const [tournaments, setTournaments] = useState(mockTournaments)
  const [selectedTournament, setSelectedTournament] = useState<number | null>(null)
  const [registeredPlayers, setRegisteredPlayers] = useState(mockRegisteredPlayers)
  const [roomId, setRoomId] = useState("")
  const [roomPassword, setRoomPassword] = useState("")
  const [newTournament, setNewTournament] = useState({
    name: "",
    entryFee: 50,
    maxPlayers: 100,
    scheduledTime: "",
  })

  const handleCreateTournament = () => {
    const id = tournaments.length + 1
    setTournaments([
      ...tournaments,
      {
        id,
        name: newTournament.name,
        entryFee: newTournament.entryFee,
        maxPlayers: newTournament.maxPlayers,
        registeredPlayers: 0,
        status: "Open",
        scheduledTime: newTournament.scheduledTime,
      },
    ])

    setNewTournament({
      name: "",
      entryFee: 50,
      maxPlayers: 100,
      scheduledTime: "",
    })

    toast({
      title: "Tournament Created",
      description: "The new tournament has been created successfully.",
    })
  }

  const handleCloseTournament = (id: number) => {
    setTournaments(
      tournaments.map((tournament) => (tournament.id === id ? { ...tournament, status: "Closed" } : tournament)),
    )

    toast({
      title: "Tournament Closed",
      description: "The tournament registration has been closed.",
    })
  }

  const handleSendRoomDetails = () => {
    toast({
      title: "Room Details Sent",
      description: "Room ID and password have been sent to all registered players.",
    })

    setRoomId("")
    setRoomPassword("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Tournament</CardTitle>
          <CardDescription>Set up a new BGMI tournament</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tournament-name">Tournament Name</Label>
              <Input
                id="tournament-name"
                value={newTournament.name}
                onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
                placeholder="Enter tournament name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entry-fee">Entry Fee (₹)</Label>
              <Input
                id="entry-fee"
                type="number"
                value={newTournament.entryFee}
                onChange={(e) => setNewTournament({ ...newTournament, entryFee: Number.parseInt(e.target.value) })}
                min={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-players">Max Players</Label>
              <Input
                id="max-players"
                type="number"
                value={newTournament.maxPlayers}
                onChange={(e) => setNewTournament({ ...newTournament, maxPlayers: Number.parseInt(e.target.value) })}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled-time">Scheduled Time</Label>
              <Input
                id="scheduled-time"
                type="datetime-local"
                value={newTournament.scheduledTime}
                onChange={(e) => setNewTournament({ ...newTournament, scheduledTime: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateTournament} disabled={!newTournament.name || !newTournament.scheduledTime}>
            <Plus className="h-4 w-4 mr-2" />
            Create Tournament
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Tournaments</CardTitle>
          <CardDescription>Manage your ongoing tournaments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Entry Fee</TableHead>
                <TableHead>Players</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments.map((tournament) => (
                <TableRow key={tournament.id}>
                  <TableCell>{tournament.name}</TableCell>
                  <TableCell>₹{tournament.entryFee}</TableCell>
                  <TableCell>
                    {tournament.registeredPlayers}/{tournament.maxPlayers}
                  </TableCell>
                  <TableCell>{tournament.status}</TableCell>
                  <TableCell>{tournament.scheduledTime}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedTournament(tournament.id)}>
                            <Users className="h-4 w-4 mr-2" />
                            Players
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Registered Players - {tournament.name}</DialogTitle>
                            <DialogDescription>Total: {registeredPlayers.length} players</DialogDescription>
                          </DialogHeader>
                          <div className="max-h-[400px] overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Username</TableHead>
                                  <TableHead>BGMI ID</TableHead>
                                  <TableHead>Registration Time</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {registeredPlayers.map((player) => (
                                  <TableRow key={player.id}>
                                    <TableCell>{player.username}</TableCell>
                                    <TableCell>{player.bgmiId}</TableCell>
                                    <TableCell>{player.registrationTime}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="space-y-4 mt-4">
                            <div className="grid gap-4 grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="room-id">Room ID</Label>
                                <Input
                                  id="room-id"
                                  value={roomId}
                                  onChange={(e) => setRoomId(e.target.value)}
                                  placeholder="Enter BGMI room ID"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="room-password">Room Password</Label>
                                <Input
                                  id="room-password"
                                  value={roomPassword}
                                  onChange={(e) => setRoomPassword(e.target.value)}
                                  placeholder="Enter room password"
                                />
                              </div>
                            </div>
                            <Button
                              onClick={handleSendRoomDetails}
                              disabled={!roomId || !roomPassword}
                              className="w-full"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Room Details to All Players
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {tournament.status !== "Closed" && (
                        <Button size="sm" variant="secondary" onClick={() => handleCloseTournament(tournament.id)}>
                          Close Registration
                        </Button>
                      )}
                    </div>
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


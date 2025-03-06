export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          bgmi_username: string
          bgmi_id: string
          upi_id: string
          wallet_balance: number
          created_at: string
        }
        Insert: {
          id?: string
          bgmi_username: string
          bgmi_id: string
          upi_id: string
          wallet_balance?: number
          created_at?: string
        }
        Update: {
          id?: string
          bgmi_username?: string
          bgmi_id?: string
          upi_id?: string
          wallet_balance?: number
          created_at?: string
        }
      }
      tournaments: {
        Row: {
          id: string
          name: string
          entry_fee: number
          max_players: number
          status: "Open" | "Almost Full" | "Closed" | "Completed"
          scheduled_time: string
          room_id: string | null
          room_password: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          entry_fee: number
          max_players: number
          status?: "Open" | "Almost Full" | "Closed" | "Completed"
          scheduled_time: string
          room_id?: string | null
          room_password?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          entry_fee?: number
          max_players?: number
          status?: "Open" | "Almost Full" | "Closed" | "Completed"
          scheduled_time?: string
          room_id?: string | null
          room_password?: string | null
          created_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          user_id: string
          tournament_id: string
          kills: number | null
          position: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tournament_id: string
          kills?: number | null
          position?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tournament_id?: string
          kills?: number | null
          position?: number | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: "deposit" | "withdrawal" | "tournament_fee" | "reward"
          amount: number
          status: "pending" | "completed" | "rejected"
          reference_id: string | null
          upi_id: string | null
          transaction_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "deposit" | "withdrawal" | "tournament_fee" | "reward"
          amount: number
          status?: "pending" | "completed" | "rejected"
          reference_id?: string | null
          upi_id?: string | null
          transaction_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: "deposit" | "withdrawal" | "tournament_fee" | "reward"
          amount?: number
          status?: "pending" | "completed" | "rejected"
          reference_id?: string | null
          upi_id?: string | null
          transaction_id?: string | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          created_at?: string
        }
      }
      support_queries: {
        Row: {
          id: string
          user_id: string
          message: string
          status: "pending" | "resolved"
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          status?: "pending" | "resolved"
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          status?: "pending" | "resolved"
          created_at?: string
        }
      }
    }
  }
}


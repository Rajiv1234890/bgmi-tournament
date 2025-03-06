import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

// This is a simplified example of a Telegram bot webhook handler
export async function POST(request: Request) {
  try {
    const update = await request.json()

    // Process the Telegram update
    if (update.message) {
      const { message } = update
      const chatId = message.chat.id
      const text = message.text

      // Simple command handling
      if (text === "/start") {
        return sendTelegramMessage(chatId, "Welcome to BGMI Tournament Bot! Please register to continue.")
      }

      if (text === "/register") {
        return sendTelegramMessage(
          chatId,
          "Please provide your BGMI Username, BGMI ID, and UPI ID in the following format:\n\n" +
            "/register_details YourBGMIUsername 1234567890 your@upi",
        )
      }

      if (text.startsWith("/register_details")) {
        const parts = text.split(" ")
        if (parts.length !== 4) {
          return sendTelegramMessage(
            chatId,
            "Invalid format. Please use: /register_details YourBGMIUsername 1234567890 your@upi",
          )
        }

        const bgmiUsername = parts[1]
        const bgmiId = parts[2]
        const upiId = parts[3]

        // Register the user in the database
        const { data, error } = await supabase
          .from("users")
          .insert({
            bgmi_username: bgmiUsername,
            bgmi_id: bgmiId,
            upi_id: upiId,
            wallet_balance: 0,
          })
          .select()

        if (error) {
          console.error("Error registering user:", error)
          return sendTelegramMessage(chatId, "Registration failed. Please try again later.")
        }

        return sendTelegramMessage(chatId, "Registration successful! You can now deposit funds and join tournaments.")
      }

      if (text === "/deposit") {
        // Get the deposit UPI ID from settings
        const { data: settings } = await supabase.from("settings").select("value").eq("key", "deposit_upi_id").single()

        const upiId = settings?.value || "default@upi"

        return sendTelegramMessage(
          chatId,
          `To deposit funds, please send money to the following UPI ID:\n\n` +
            `${upiId}\n\n` +
            `After sending, please provide the transaction details using:\n` +
            `/deposit_details [Amount] [Transaction ID]`,
        )
      }

      // Handle other commands and interactions...
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to send messages back to Telegram
async function sendTelegramMessage(chatId: number, text: string) {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN

  if (!telegramToken) {
    console.error("Telegram bot token not configured")
    return NextResponse.json({ success: false, error: "Bot token not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    })

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error sending Telegram message:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}


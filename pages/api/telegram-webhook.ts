import { NextApiRequest, NextApiResponse } from 'next'
import bot from '../../lib/telegram'
import { supabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message } = req.body

    if (message) {
      const chatId = message.chat.id
      const text = message.text

      if (text === '/start') {
        bot.sendMessage(chatId, 'Welcome to the BGMI Tournament Bot! Use /help to see available commands.')
      } else if (text === '/help') {
        bot.sendMessage(chatId, 'Available commands:\n/balance - Check your balance\n/deposit - Get deposit instructions\n/withdraw - Request a withdrawal')
      } else if (text === '/balance') {
        // Fetch user balance from Supabase
        const { data: player } = await supabase
          .from('players')
          .select('balance')
          .eq('telegram_id', chatId)
          .single()

        if (player) {
          bot.sendMessage(chatId, `Your current balance is: ₹${player.balance}`)
        } else {
          bot.sendMessage(chatId, 'You are not registered. Please contact support.')
        }
      } else if (text === '/deposit') {
        // Fetch deposit UPI ID from settings
        const { data: setting } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'deposit_upi_id')
          .single()

        if (setting) {
          bot.sendMessage(chatId, `To deposit, please send money to this UPI ID: ${setting.value}\n\nAfter sending, please upload a screenshot of the transaction.`)
        } else {
          bot.sendMessage(chatId, 'Deposit information is not available. Please contact support.')
        }
      } else if (text === '/withdraw') {
        bot.sendMessage(chatId, 'To request a withdrawal, please use the format:\n/withdraw [amount] [UPI ID]\n\nExample: /withdraw 100 your-upi-id@upi')
      } else if (text.startsWith('/withdraw ')) {
        const parts = text.split(' ')
        if (parts.length === 3) {
          const amount = parseFloat(parts[1])
          const upiId = parts[2]

          if (isNaN(amount) || amount <= 0) {
            bot.sendMessage(chatId, 'Invalid amount. Please enter a valid number greater than 0.')
          } else {
            // Create withdrawal request in Supabase
            const { data, error } = await supabase
              .from('transactions')
              .insert({
                player_id: chatId,
                type: 'withdrawal',
                amount: amount,
                status: 'Pending',
                upi_id: upiId
              })

            if (error) {
              bot.sendMessage(chatId, 'An error occurred while processing your withdrawal request. Please try again later.')
            } else {
              bot.sendMessage(chatId, `Your withdrawal request for ₹${amount} to ${upiId} has been submitted. It will be processed manually by an admin.`)
            }
          }
        } else {
          bot.sendMessage(chatId, 'Invalid format. Please use: /withdraw [amount] [UPI ID]')
        }
      } else {
        bot.sendMessage(chatId, 'Unknown command. Use /help to see available commands.')
      }
    }

    res.status(200).json({ message: 'OK' })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
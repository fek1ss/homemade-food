"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WhatsAppButtonProps {
  message: string
  className?: string
  children?: React.ReactNode
  disabled?: boolean
}

// TODO: Configure WhatsApp phone number
// This should be stored in environment variables or Supabase settings
const WHATSAPP_PHONE = "79001234567" // Replace with actual phone number

export function WhatsAppButton({ message, className, children, disabled }: WhatsAppButtonProps) {
  const handleClick = () => {
    if (disabled) return
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      className={`bg-[#25D366] text-white hover:bg-[#128C7E] disabled:opacity-50 ${className}`}
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      {children || "Заказать через WhatsApp"}
    </Button>
  )
}

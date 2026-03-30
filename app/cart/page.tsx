import { getSlots } from "@/actions/slots"
import { getAcceptOrders } from "@/actions/settings"
import { CartPageClient } from "@/components/cart-page-client"

// можно кешировать, но лучше мало (часто меняется)
export const revalidate = 60

export default async function CartPage() {
  const [slots, acceptOrders] = await Promise.all([
    getSlots(),
    getAcceptOrders(),
  ])

  return (
    <CartPageClient
      initialSlots={slots}
      initialAcceptOrders={acceptOrders}
    />
  )
}
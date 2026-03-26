export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

const CART_KEY = "cart"

export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]")
}

export const addToCart = (item: CartItem) => {
  const stored = localStorage.getItem(CART_KEY)
  let cart: CartItem[] = stored ? JSON.parse(stored) : []

  const existing = cart.find((i) => i.id === item.id)
  if (existing) existing.quantity += item.quantity
  else cart.push(item)

  localStorage.setItem(CART_KEY, JSON.stringify(cart))

  // 🔥 событие для обновления счётчика
  window.dispatchEvent(new CustomEvent("cart-update", { detail: cart }))
}

export const removeFromCart = (id: number) => {
  const cart = getCart().filter((i) => i.id !== id)
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export const clearCart = () => {
  localStorage.removeItem(CART_KEY)
}
"use client"

import { useCallback } from "react"

export function useFlyToCart() {
  const flyToCart = useCallback((sourceElement: HTMLElement, imageSrc: string) => {
    // Find the cart icon in the header
    const cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement
    if (!cartIcon) return

    // Get positions
    const sourceRect = sourceElement.getBoundingClientRect()
    const cartRect = cartIcon.getBoundingClientRect()

    // Create flying element
    const flyingEl = document.createElement('div')
    flyingEl.className = 'fixed z-[9999] pointer-events-none rounded-lg overflow-hidden shadow-xl'
    flyingEl.style.cssText = `
      width: 80px;
      height: 60px;
      left: ${sourceRect.left + sourceRect.width / 2 - 40}px;
      top: ${sourceRect.top + sourceRect.height / 2 - 30}px;
      transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `

    // Create image inside
    const img = document.createElement('img')
    img.src = imageSrc
    img.className = 'w-full h-full object-cover'
    img.crossOrigin = 'anonymous'
    flyingEl.appendChild(img)

    document.body.appendChild(flyingEl)

    // Trigger animation after a small delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flyingEl.style.left = `${cartRect.left + cartRect.width / 2 - 20}px`
        flyingEl.style.top = `${cartRect.top + cartRect.height / 2 - 15}px`
        flyingEl.style.width = '40px'
        flyingEl.style.height = '30px'
        flyingEl.style.opacity = '0.5'
        flyingEl.style.transform = 'scale(0.3)'
      })
    })

    // Remove element after animation
    setTimeout(() => {
      flyingEl.remove()
    }, 700)
  }, [])

  return { flyToCart }
}

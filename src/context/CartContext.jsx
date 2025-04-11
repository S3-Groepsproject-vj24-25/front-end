/* eslint-disable react/prop-types */


import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex((cartItem) => {
      if (cartItem.id !== item.id) return false

      if (cartItem.instructions !== item.instructions) return false

      const cartItemModIds = cartItem.modifications.map((mod) => mod.id).sort()
      const itemModIds = item.modifications.map((mod) => mod.id).sort()

      if (cartItemModIds.length !== itemModIds.length) return false

      for (let i = 0; i < cartItemModIds.length; i++) {
        if (cartItemModIds[i] !== itemModIds[i]) return false
      }

      return true
    })

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems]
      updatedCartItems[existingItemIndex].quantity += item.quantity
      updatedCartItems[existingItemIndex].totalPrice += item.totalPrice
      setCartItems(updatedCartItems)
    } else {
      setCartItems([...cartItems, { ...item, cartId: Date.now() }])
    }
  }

  const removeFromCart = (cartId) => {
    setCartItems(cartItems.filter((item) => item.cartId !== cartId))
  }

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartId)
      return
    }

    setCartItems(
      cartItems.map((item) => {
        if (item.cartId === cartId) {
          const unitPrice = item.totalPrice / item.quantity
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: unitPrice * newQuantity,
          }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}


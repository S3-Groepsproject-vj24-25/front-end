import { useState } from "react"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useNavigate } from "react-router-dom"

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const navigate = useNavigate()

  const subtotal = cartItems
    .reduce((total, item) => {
      const basePrice = item.price * item.quantity
      return total + basePrice
    }, 0)
    .toFixed(2)

  const additions = cartItems
    .reduce((total, item) => {
      const modsPrice = item.modifications.reduce((modTotal, mod) => modTotal + mod.price, 0) * item.quantity
      return total + modsPrice
    }, 0)
    .toFixed(2)

  const total = getTotalPrice()

  const handleCheckout = async () => {
    setIsCheckingOut(true)
  
    const formattedOrder = {
      orderId: "8",
      tableID: "1",
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        modifications: item.modifications.map((mod) => ({
          id: mod.id,
          name: mod.name,
          price: mod.price,
        })),
        instructions: item.instructions || "",
        totalPrice: item.totalPrice,
        type: item.category === "Drinks" ? "Drink" : "Food",
      })),
      isCompleted: false,
      status: "Pending",
      timestamp: new Date().toISOString(),
    }
  
    console.log("Sending order to backend:", formattedOrder)
  
    try {
      const response = await fetch("https://localhost:7260/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedOrder),
      })
  
      console.log("Raw response object:", response)
  
      const contentType = response.headers.get("content-type")
      let result = null
  
      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
        console.log("Parsed JSON response:", result)
      } else {
        const text = await response.text()
        console.log("Response text (non-JSON):", text)
      }
  
      if (!response.ok) {
        console.error("Server returned an error status:", response.status)
        alert("Error: " + response.status)
        return
      }
  
      alert(`Order #${result?.id || "New"} placed successfully!`)
      clearCart()
      navigate("/")
    } catch (error) {
      console.error("Error caught in catch block:", error)
      alert("Something went wrong while submitting the order.")
    } finally {
      setIsCheckingOut(false)
    }
  }
  

  const goBack = () => {
    navigate("/")
  }


  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex-1 flex flex-col w-full mx-auto">
        <header className="w-full bg-secondary text-white p-4 flex items-center">
          <button onClick={goBack} className="text-white mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-medium flex-1 text-center">Willem</h1>
          <div className="w-6"></div> 
        </header>

     
        <main className="flex-1 flex flex-col p-4">
          <h2 className="text-xl font-bold mb-4">Order</h2>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <p className="mb-4">Your cart is empty</p>
              <button onClick={goBack} className="bg-primary text-white py-2 px-4 rounded-lg">
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex border rounded-lg overflow-hidden bg-white">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-20 h-20 object-cover" />
                    <div className="flex-1 p-3">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {item.modifications.length > 0
                          ? item.modifications.map((mod) => mod.name).join(", ")
                          : item.description || "No modifications"}
                        {item.instructions && `, ${item.instructions}`}
                      </p>

                      <div className="flex justify-between items-center mt-2">
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="bg-primary text-white rounded-l-full w-6 h-6 flex items-center justify-center"
                            data-testid="decrease-quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <div 
                            className="bg-primary bg-opacity-10 h-6 w-8 flex items-center justify-center text-primary text-sm font-medium"
                            data-testid="quantity-display"
                          >
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="bg-primary text-white rounded-r-full w-6 h-6 flex items-center justify-center"
                            data-testid="increase-quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-100 rounded-lg p-4 space-y-2 mt-auto">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Additions</span>
                  <span>${additions}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-gray-300">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-primary text-white py-3 rounded-lg mt-4 font-medium disabled:opacity-70"
              >
                {isCheckingOut ? "Processing..." : "Checkout"}
              </button>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default CartPage
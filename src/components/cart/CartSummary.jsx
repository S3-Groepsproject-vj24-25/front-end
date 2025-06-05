import { ShoppingBag } from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router-dom"

const CartSummary = () => {
  const { getTotalPrice, getTotalItems } = useCart()
  const navigate = useNavigate()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const handleClick = () => {
    navigate("/cart")
  }

  return (
    <button
      onClick={handleClick}
      className="w-full bg-primary text-white py-3 px-4 rounded-lg flex justify-between items-center hover:bg-opacity-90 transition-colors"
      data-testid="cart-summary-button"
      aria-label={`Go to cart with ${totalItems} items`}
    >
      <div className="flex items-center">
        <ShoppingBag className="mr-2 h-5 w-5" />
        <span className="font-medium" data-testid="order-details-text">Order Details</span>
        {totalItems > 0 && (
          <div 
            className="ml-2 bg-white text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold"
            data-testid="cart-item-count"
          >
            {totalItems}
          </div>
        )}
      </div>
      <span data-testid="cart-total-price">${totalPrice}</span>
    </button>
  )
}

export default CartSummary
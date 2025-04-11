/* eslint-disable react/prop-types */

import { useState } from "react"
import { X, Minus, Plus } from "lucide-react"

const ProductModal = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedModifications, setSelectedModifications] = useState([])
  const [instructions, setInstructions] = useState("")

  // Sample modifications - in a real app, these would come from your backend
  const availableModifications = [
    { id: 1, name: "Extra Cheese", price: 0.5 },
    { id: 2, name: "Spicy Sauce", price: 0.5 },
    { id: 3, name: "Gluten-Free Option", price: 0.5 },
  ]

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  // Handle modification selection
  const toggleModification = (modId) => {
    if (selectedModifications.includes(modId)) {
      setSelectedModifications(selectedModifications.filter((id) => id !== modId))
    } else {
      setSelectedModifications([...selectedModifications, modId])
    }
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = item.price * quantity
    const modificationsPrice =
      selectedModifications.reduce((total, modId) => {
        const mod = availableModifications.find((m) => m.id === modId)
        return total + (mod ? mod.price : 0)
      }, 0) * quantity

    return (basePrice + modificationsPrice).toFixed(2)
  }

  // Handle add to cart
  const handleAddToCart = () => {
    const selectedMods = availableModifications.filter((mod) => selectedModifications.includes(mod.id))

    const cartItem = {
      ...item,
      quantity,
      modifications: selectedMods,
      instructions,
      totalPrice: Number.parseFloat(calculateTotalPrice()),
    }

    onAddToCart(cartItem)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header with image */}
        <div className="relative">
          <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
          <button onClick={onClose} className="absolute top-2 right-2 bg-white rounded-full p-1" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h2 className="text-white text-xl font-bold">{item.name}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Quantity selector */}
          <div>
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={decreaseQuantity}
                className="bg-primary text-white rounded-l-full w-8 h-8 flex items-center justify-center"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="bg-primary bg-opacity-10 h-8 px-4 flex items-center justify-center text-primary font-medium">
                {quantity}
              </div>
              <button
                onClick={increaseQuantity}
                className="bg-primary text-white rounded-r-full w-8 h-8 flex items-center justify-center"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Modifications */}
          <div>
            <h3 className="font-medium mb-2">Modifications</h3>
            <div className="space-y-2">
              {availableModifications.map((mod) => (
                <label key={mod.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedModifications.includes(mod.id)}
                    onChange={() => toggleModification(mod.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span>{mod.name}</span>
                  <span className="text-gray-500 ml-auto">+${mod.price.toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-medium mb-2">Instructions</h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Extra instructions..."
              className="w-full border rounded-md p-2 h-24 resize-none"
            />
          </div>

          {/* Price and add button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-primary font-medium text-lg">${calculateTotalPrice()}</div>
            <button onClick={handleAddToCart} className="bg-primary text-white py-2 px-6 rounded-full font-medium">
              Add To Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductModal


/* eslint-disable react/prop-types */
import { useState } from "react"
import { useCart } from "../../context/CartContext"
import ProductModal from "../ProductModal"

const MenuItems = ({ items }) => {
  const { addToCart } = useCart()
  const [selectedItem, setSelectedItem] = useState(null)

  const openProductModal = (item) => {
    setSelectedItem(item)
  }

  const closeProductModal = () => {
    setSelectedItem(null)
  }

  return (
    <>
      <div className="w-full flex flex-wrap -mx-2">
        {items.map((item) => (
          <div key={item.id} className="w-1/2 px-2 mb-4 md:w-1/3 lg:w-1/4">
            <div className="h-full rounded-lg overflow-hidden shadow-sm border flex flex-col">
              <div className="relative w-full cursor-pointer" onClick={() => openProductModal(item)}>
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-32 object-cover" />
              </div>
              <div className="p-2 flex-1 flex flex-col justify-between">
                <h3 className="font-medium text-sm cursor-pointer" onClick={() => openProductModal(item)}>
                  {item.name}
                </h3>
                <div className="flex flex-row justify-between items-center mt-1">
                  <p className="text-sm">${item.price.toFixed(2)}</p>
                  <button
                    className="bg-primary rounded-full h-6 w-6 text-white text-md flex items-center justify-center"
                    onClick={() => openProductModal(item)}
                    aria-label={`Add ${item.name} to order`}
                  >
                    <span className="text-lg font-bold">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedItem && <ProductModal item={selectedItem} onClose={closeProductModal} onAddToCart={addToCart} />}
    </>
  )
}

export default MenuItems


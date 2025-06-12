import { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { useTable } from "../context/TableContext"
import { SearchBar } from "../components/homepage/SearchBar"
import CategoryFilter from "../components/homepage/CategoryFilter"
import MenuItems from "../components/homepage/MenuItems"
import CartSummary from "../components/cart/CartSummary"
import menuItems from "../data/menuItems"
import categories from "../data/categories"

export default function Homepage() {
  const { tableId: urlTableId } = useParams()
  const location = useLocation()
  const { tableId, setTableId, hasTableId, clearTableId } = useTable()

  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (urlTableId && urlTableId !== tableId) {
      setTableId(urlTableId)
    }
  }, [urlTableId, tableId, setTableId])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const currentTableId = urlTableId || tableId
  const hasTable = !!currentTableId

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex-1 flex flex-col w-full mx-auto">
        <header className="w-full bg-secondary text-white p-4 flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-xl font-medium">Willem</h1>
            {hasTable && (
              <p className="text-sm opacity-90 mt-1">Table {currentTableId}</p>
            )}
          </div>
        </header>

        <main className="flex-1 flex flex-col p-4">
          {!hasTable && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> No table selected. Orders will be placed without a table number.
                <br />
                Scan a QR code at your table to automatically set the table number.
              </p>
            </div>
          )}

          <h2 className="text-xl font-bold mb-4">Menu</h2>

          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {isLoading ? (
            <div className="flex-1 flex justify-center items-center">
              <div className="animate-pulse text-gray-400">Loading menu items...</div>
            </div>
          ) : filteredItems.length > 0 ? (
            <MenuItems items={filteredItems} />
          ) : (
            <div className="flex-1 flex justify-center items-center">
              <div className="text-gray-500">No menu items found. Try a different search or category.</div>
            </div>
          )}
        </main>

        <footer className="w-full p-4 bg-white">
          <CartSummary />
        </footer>
      </div>
    </div>
  )
}
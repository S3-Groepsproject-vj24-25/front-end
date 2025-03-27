import { useState, useEffect } from "react"
import { SearchBar } from "../components/homepage/SearchBar"
import CategoryFilter from "../components/homepage/CategoryFilter"
import MenuItems from "../components/homepage/MenuItems"
import menuItems from "../data/menuItems"
import categories from "../data/categories"

export default function Homepage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading state for better UX
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



  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="flex-1 flex flex-col w-full mx-auto">
        <header className="w-full bg-secondary text-white p-4 flex justify-center items-center">
          <h1 className="text-xl font-medium">Willem</h1>
        </header>

        <main className="flex-1 flex flex-col p-4">
          <h2 className="text-xl font-bold mb-4">Menu</h2>

          {/* Search Component */}
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* Categories Component */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Menu Items Component */}
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

        {/* Footer */}
        <footer className="w-full p-4 bg-white">
          <button className="w-full bg-primary text-white py-3 px-4 rounded-lg flex justify-between items-center hover:bg-[#7a1a1a] transition-colors">
            <span className="font-medium">Order Details</span>
            <span>$00.00</span>
          </button>
        </footer>
      </div>
    </div>
  )
}


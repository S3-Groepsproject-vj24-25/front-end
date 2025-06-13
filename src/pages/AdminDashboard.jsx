/* eslint-disable react/prop-types */
"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ImageIcon,
  Save,
  X,
  MenuIcon,
  LogOut,
  BarChart,
  Settings,
  ShoppingBag,
} from "lucide-react"
import menuItems from "../data/menuItems"
import categories from "../data/categories"

const AdminDashboard = () => {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Load menu items
  useEffect(() => {
    setItems(menuItems)
    setFilteredItems(menuItems)
  }, [])

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      if (isMobileView) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Filter items based on category and search query
  useEffect(() => {
    let result = [...items]

    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query),
      )
    }

    setFilteredItems(result)
  }, [items, selectedCategory, searchQuery])

  // Handle adding a new item
  const handleAddItem = (newItem) => {
    // Generate a new ID (in a real app, this would be handled by the backend)
    const newId = Math.max(...items.map((item) => item.id)) + 1
    const itemToAdd = {
      ...newItem,
      id: newId,
      inCart: false,
    }

    const updatedItems = [...items, itemToAdd]
    setItems(updatedItems)
    setIsAddModalOpen(false)
  }

  // Handle editing an item
  const handleEditItem = (updatedItem) => {
    const updatedItems = items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    setItems(updatedItems)
    setIsEditModalOpen(false)
    setCurrentItem(null)
  }

  // Handle deleting an item
  const handleDeleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedItems = items.filter((item) => item.id !== id)
      setItems(updatedItems)
    }
  }

  // Open edit modal for an item
  const openEditModal = (item) => {
    setCurrentItem(item)
    setIsEditModalOpen(true)
  }

  // Toggle item availability
  const toggleAvailability = (id) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, available: !item.available }
      }
      return item
    })
    setItems(updatedItems)
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary bg-opacity-90 text-white p-4 flex justify-between items-center">
        <button onClick={toggleSidebar} className="p-1">
          <MenuIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">Menu Management</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white shadow-md z-20 md:relative absolute inset-0 md:inset-auto ${
          isMobile ? "h-screen" : ""
        }`}
      >
        <div className="p-6 bg-primary bg-opacity-90 text-white">
          <h2 className="text-xl font-bold">Willem</h2>
          <p className="text-sm opacity-75">Restaurant Manager</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center p-3 bg-primary bg-opacity-10 text-primary rounded-lg">
                <ShoppingBag className="mr-3 h-5 w-5" />
                <span className="font-medium">Menu Items</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <BarChart className="mr-3 h-5 w-5" />
                <span>Analytics</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="mr-3 h-5 w-5" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg w-full">
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile close button */}
        {isMobile && (
          <button onClick={toggleSidebar} className="absolute top-4 right-4 text-white md:hidden">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold hidden md:block">Menu Management</h1>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-3 md:ml-auto w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search menu items..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="w-full md:w-40 pl-4 pr-10 py-2 border rounded-lg appearance-none text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center justify-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </button>
          </div>
        </div>

        {/* Menu Items Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Item
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.available !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.available !== false ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        {item.available !== false ? "Disable" : "Enable"}
                      </button>
                      <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit className="h-4 w-4 inline" />
                      </button>
                      <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No menu items found. Try adjusting your filters or add a new item.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <ItemFormModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddItem}
          categories={categories}
          isNew={true}
        />
      )}

      {/* Edit Item Modal */}
      {isEditModalOpen && currentItem && (
        <ItemFormModal
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditItem}
          categories={categories}
          item={currentItem}
          isNew={false}
        />
      )}
    </div>
  )
}

// Item Form Modal Component
const ItemFormModal = ({ onClose, onSave, categories, item = null, isNew = true }) => {
  const [formData, setFormData] = useState({
    id: item?.id || 0,
    name: item?.name || "",
    price: item?.price || 0,
    description: item?.description || "",
    category: item?.category || categories[0]?.name || "Main",
    image: item?.image || "",
    popular: item?.popular || false,
    available: item?.available !== false, // Default to true if not specified
    modifications: item?.modifications || [],
  })

  const [imagePreview, setImagePreview] = useState(item?.image || "")
  const [newModification, setNewModification] = useState({ name: "", price: 0 })
  const [activeTab, setActiveTab] = useState("basic")

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Handle price input (ensure it's a valid number)
  const handlePriceChange = (e) => {
    const value = Number.parseFloat(e.target.value)
    setFormData({
      ...formData,
      price: isNaN(value) ? 0 : value,
    })
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setFormData({
          ...formData,
          image: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle adding a modification
  const handleAddModification = () => {
    if (newModification.name.trim() === "") return

    setFormData({
      ...formData,
      modifications: [...formData.modifications, { ...newModification, id: Date.now() }],
    })
    setNewModification({ name: "", price: 0 })
  }

  // Handle removing a modification
  const handleRemoveModification = (id) => {
    setFormData({
      ...formData,
      modifications: formData.modifications.filter((mod) => mod.id !== id),
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      price: Number.parseFloat(formData.price),
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{isNew ? "Add New Menu Item" : "Edit Menu Item"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "basic" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "modifications" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("modifications")}
          >
            Modifications
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "image" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("image")}
          >
            Image
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handlePriceChange}
                      step="0.01"
                      min="0"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md h-24"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="popular"
                      name="popular"
                      checked={formData.popular}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="popular" className="ml-2 block text-sm text-gray-700">
                      Mark as Popular
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="available"
                      name="available"
                      checked={formData.available}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                      Available
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Modifications Tab */}
            {activeTab === "modifications" && (
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Current Modifications</h3>

                  {formData.modifications.length === 0 ? (
                    <p className="text-gray-500 text-sm">No modifications added yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {formData.modifications.map((mod) => (
                        <li key={mod.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>
                            {mod.name} (+${mod.price.toFixed(2)})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveModification(mod.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Add New Modification</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Modification name"
                        value={newModification.name}
                        onChange={(e) => setNewModification({ ...newModification, name: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div className="flex">
                      <input
                        type="number"
                        placeholder="Price"
                        value={newModification.price}
                        onChange={(e) =>
                          setNewModification({ ...newModification, price: Number.parseFloat(e.target.value) || 0 })
                        }
                        step="0.01"
                        min="0"
                        className="w-full p-2 border rounded-l-md"
                      />

                      <button
                        type="button"
                        onClick={handleAddModification}
                        className="bg-primary text-white px-4 rounded-r-md"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Image Tab */}
            {activeTab === "image" && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="max-h-48 rounded-md" />
                    </div>
                  ) : (
                    <div className="text-center mb-4">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">No image selected</p>
                    </div>
                  )}

                  <label className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                    <span>Upload Image</span>
                    <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                  </label>

                  <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2 border rounded-md"
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter a URL if you don&apos;t want to upload an image</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              {isNew ? "Add Item" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard

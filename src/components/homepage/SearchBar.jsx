/* eslint-disable react/prop-types */
import { Search } from "lucide-react"

export const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="w-full mb-4 flex items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border rounded-full text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  )
}


/* eslint-disable react/prop-types */
"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
  const scrollContainerRef = useRef(null)
  const [showLeftChevron, setShowLeftChevron] = useState(false)
  const [showRightChevron, setShowRightChevron] = useState(false)

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setShowLeftChevron(container.scrollLeft > 20)

    setShowRightChevron(
      container.scrollWidth > container.clientWidth &&
        container.scrollLeft < container.scrollWidth - container.clientWidth - 20,
    )
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    checkScrollPosition()

    container.addEventListener("scroll", checkScrollPosition)

    window.addEventListener("resize", checkScrollPosition)

    return () => {
      container.removeEventListener("scroll", checkScrollPosition)
      window.removeEventListener("resize", checkScrollPosition)
    }
  }, [])

  const scrollLeft = () => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const selectedElement = container.querySelector(`[data-category="${selectedCategory}"]`)
    if (selectedElement) {
      const containerWidth = container.offsetWidth
      const elementLeft = selectedElement.offsetLeft
      const elementWidth = selectedElement.offsetWidth

      const scrollPosition = elementLeft - containerWidth / 2 + elementWidth / 2

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }, [selectedCategory])

  const shouldShowFilter = categories.length > 1
  const needsScrolling = categories.length > 4

  return (
    <div className={`relative w-full mb-6 ${!shouldShowFilter ? "hidden" : ""}`}>
      {needsScrolling && showLeftChevron && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 rounded-full p-1 shadow-sm"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-500" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className={`
          flex space-x-4 overflow-x-auto py-2 px-1 m-2 no-scrollbar
         
        `}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            data-category={category.name}
            className="flex flex-col items-center space-y-1 min-w-[60px] cursor-pointer"
            onClick={() => setSelectedCategory(category.name)}
          >
            <div
              className={`
                w-14 h-14 rounded-full flex items-center justify-center
                transition-all duration-200 ease-in-out
                ${selectedCategory === category.name ? "ring-2 ring-red-600 scale-110" : "hover:scale-105"}
              `}
            >
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-center">{category.name}</span>
          </div>
        ))}
      </div>

      {/* Right Chevron */}
      {needsScrolling && showRightChevron && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-70 rounded-full p-1 shadow-sm"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </button>
      )}
    </div>
  )
}

export default CategoryFilter


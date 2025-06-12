/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react"

const TableContext = createContext()

export const useTable = () => {
  const context = useContext(TableContext)
  if (!context) {
    throw new Error("useTable must be used within a TableProvider")
  }
  return context
}

const getStoredTableId = () => {
  try {
    return localStorage.getItem("currentTableId")
  } catch (error) {
    console.warn("localStorage not available:", error)
    return null
  }
}

const setStoredTableId = (tableId) => {
  try {
    if (tableId) {
      localStorage.setItem("currentTableId", tableId)
    } else {
      localStorage.removeItem("currentTableId")
    }
  } catch (error) {
    console.warn("localStorage not available:", error)
  }
}

export const TableProvider = ({ children }) => {
  const [currentTableId, setCurrentTableId] = useState(() => {
    return getStoredTableId()
  })

  const setTableId = (newTableId) => {
    if (newTableId !== currentTableId) {
      setCurrentTableId(newTableId)
      setStoredTableId(newTableId)
    }
  }

  const clearTableId = () => {
    setCurrentTableId(null)
    setStoredTableId(null)
  }

  const value = {
    tableId: currentTableId,
    setTableId,
    clearTableId,
    hasTableId: !!currentTableId
  }

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>
}
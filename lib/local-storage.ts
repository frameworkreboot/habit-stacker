export function getLocalData(key: string) {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error("Error getting data from localStorage:", error)
    return null
  }
}

export function saveLocalData(key: string, data: any) {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving data to localStorage:", error)
  }
}


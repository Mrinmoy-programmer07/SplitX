import { useState, useEffect } from 'react'

export interface Contact {
  address: string
  alias?: string
}

const CACHE_KEY = 'splitx_recent_contacts'

export function useRecentContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])

  // Load from cache on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CACHE_KEY)
      if (stored) {
        setContacts(JSON.parse(stored))
      }
    } catch (err) {
      console.warn('Failed to load recent contacts from cache:', err)
    }
  }, [])

  // Save to cache
  const addContact = (address: string, alias?: string) => {
    setContacts((prev) => {
      // Remove if exists to push to front
      const filtered = prev.filter((c) => c.address !== address)
      const newContacts = [{ address, alias }, ...filtered].slice(0, 5) // Keep top 5 latest
      
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(newContacts))
      } catch (err) {
        console.warn('Failed to save recent contacts to cache:', err)
      }
      return newContacts
    })
  }

  return { contacts, addContact }
}

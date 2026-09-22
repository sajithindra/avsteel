import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, query, onSnapshot, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../firebase'
import type { ClientOrganization } from '../../../types/portal'

export const useCustomerStore = defineStore('customer', () => {
  const clients = ref<ClientOrganization[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string>('')
  let unsubscribe: (() => void) | null = null

  function initCustomerListener() {
    if (unsubscribe) return
    loading.value = true
    try {
      const clientsRef = collection(db, 'clients')
      const q = query(clientsRef)
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: ClientOrganization[] = []
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ClientOrganization)
          })
          clients.value = list
          loading.value = false
        },
        (err) => {
          console.error('Error fetching clients collection:', err)
          error.value = err.message || 'Failed to load client organizations.'
          loading.value = false
        }
      )
    } catch (err: any) {
      console.error('Failed to initialize customer listener:', err)
      error.value = err.message || 'Failed to initialize customer store.'
      loading.value = false
    }
  }

  function stopCustomerListener() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  async function createClient(clientData: {
    name: string
    contactEmail: string
    contactPhone: string
    address: string
  }) {
    error.value = ''
    try {
      const newDocRef = doc(collection(db, 'clients'))
      const payload: ClientOrganization = {
        id: newDocRef.id,
        name: clientData.name.trim(),
        contactEmail: clientData.contactEmail.trim(),
        contactPhone: clientData.contactPhone.trim(),
        address: clientData.address.trim(),
        activeProjectCount: 0,
        createdAt: serverTimestamp()
      }
      await setDoc(newDocRef, payload)
      return payload
    } catch (err: any) {
      console.error('Failed to create client:', err)
      error.value = err.message || 'Failed to register client.'
      throw err
    }
  }

  return {
    clients,
    loading,
    error,
    initCustomerListener,
    stopCustomerListener,
    createClient
  }
})

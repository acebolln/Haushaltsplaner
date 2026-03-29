/**
 * IndexedDB-based image storage for receipt images.
 *
 * LocalStorage has a ~5 MB limit which is easily exceeded by
 * multi-page PDFs encoded as Base64 data URIs (often 5-10+ MB).
 * IndexedDB supports hundreds of MB and handles binary blobs natively.
 *
 * Receipt metadata stays in LocalStorage (small, fast, synchronous).
 * Receipt images live here in IndexedDB (large, async, no size issues).
 */

const DB_NAME = 'haushaltsplaner_images'
const DB_VERSION = 1
const STORE_NAME = 'receipt_images'

/** Open (or create) the IndexedDB database */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'receiptId' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(new Error(`IndexedDB open failed: ${request.error?.message}`))
  })
}

/** Save a receipt image (Base64 data URI) to IndexedDB */
export async function saveImage(receiptId: string, dataUri: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put({ receiptId, dataUri, savedAt: new Date().toISOString() })
    tx.oncomplete = () => {
      db.close()
      resolve()
    }
    tx.onerror = () => {
      db.close()
      reject(new Error(`Failed to save image for receipt ${receiptId}`))
    }
  })
}

/** Load a receipt image from IndexedDB. Returns null if not found. */
export async function loadImage(receiptId: string): Promise<string | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(receiptId)
    request.onsuccess = () => {
      db.close()
      resolve(request.result?.dataUri ?? null)
    }
    request.onerror = () => {
      db.close()
      reject(new Error(`Failed to load image for receipt ${receiptId}`))
    }
  })
}

/** Delete a single receipt image from IndexedDB */
export async function deleteImage(receiptId: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.delete(receiptId)
    tx.oncomplete = () => {
      db.close()
      resolve()
    }
    tx.onerror = () => {
      db.close()
      reject(new Error(`Failed to delete image for receipt ${receiptId}`))
    }
  })
}

/** Clear all stored images from IndexedDB */
export async function clearAllImages(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.clear()
    tx.oncomplete = () => {
      db.close()
      resolve()
    }
    tx.onerror = () => {
      db.close()
      reject(new Error('Failed to clear all images'))
    }
  })
}

/** Check if an image exists in IndexedDB without loading it */
export async function hasImage(receiptId: string): Promise<boolean> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.count(IDBKeyRange.only(receiptId))
    request.onsuccess = () => {
      db.close()
      resolve(request.result > 0)
    }
    request.onerror = () => {
      db.close()
      reject(new Error(`Failed to check image for receipt ${receiptId}`))
    }
  })
}

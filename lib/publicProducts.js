'use client'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

const missingEnv = [
  ['NEXT_PUBLIC_FIREBASE_API_KEY', firebaseConfig.apiKey],
  ['NEXT_PUBLIC_FIREBASE_PROJECT_ID', firebaseConfig.projectId],
].filter(([, value]) => !value)

if (missingEnv.length > 0) {
  const missingNames = missingEnv.map(([name]) => name).join(', ')
  throw new Error(`Missing required env var(s): ${missingNames}`)
}

const firestoreRestBase = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`
const firestoreRestKey = firebaseConfig.apiKey ? `key=${encodeURIComponent(firebaseConfig.apiKey)}` : ''

export async function getProducts() {
  const documents = []
  let pageToken = ''

  do {
    const params = new URLSearchParams({
      pageSize: '300',
      ...(pageToken ? { pageToken } : {}),
    })

    const data = await fetchFirestoreRest(`products?${params.toString()}`)
    documents.push(...(data.documents || []))
    pageToken = data.nextPageToken || ''
  } while (pageToken)

  return documents.map(firestoreRestDocumentToProduct)
}

export async function getProductById(id) {
  try {
    const data = await fetchFirestoreRest(`products/${encodeURIComponent(id)}`)
    return firestoreRestDocumentToProduct(data)
  } catch (error) {
    if (error?.status !== 404) {
      throw error
    }
  }

  const matches = await queryProductsByField('slug', id, 1)
  return matches[0] || null
}

export async function getFeaturedProducts(limit = 10) {
  return queryProductsByField('featured', true, limit)
}

function sanitizeFirestoreData(value) {
  if (value === null || value === undefined) return value

  if (Array.isArray(value)) {
    return value.map(item => sanitizeFirestoreData(item))
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'object') {
    if (typeof value.toMillis === 'function') {
      return value.toMillis()
    }

    const output = {}
    for (const [key, val] of Object.entries(value)) {
      output[key] = sanitizeFirestoreData(val)
    }
    return output
  }

  return value
}

async function fetchFirestoreRest(path, options = {}) {
  const separator = path.includes('?') ? '&' : '?'
  const pathPrefix = path.startsWith(':') ? '' : '/'
  const url = `${firestoreRestBase}${pathPrefix}${path}${firestoreRestKey ? `${separator}${firestoreRestKey}` : ''}`
  const response = await fetch(url, options)

  if (!response.ok) {
    const error = new Error(`Firestore REST request failed with status ${response.status}`)
    error.status = response.status
    throw error
  }

  return response.json()
}

async function queryProductsByField(field, value, resultLimit) {
  const body = {
    structuredQuery: {
      from: [{ collectionId: 'products' }],
      where: {
        fieldFilter: {
          field: { fieldPath: field },
          op: 'EQUAL',
          value: jsToFirestoreRestValue(value),
        },
      },
      limit: resultLimit,
    },
  }

  const data = await fetchFirestoreRest(':runQuery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  return data
    .map(result => result.document)
    .filter(Boolean)
    .map(firestoreRestDocumentToProduct)
}

function firestoreRestDocumentToProduct(documentData) {
  const id = decodeURIComponent(documentData.name.split('/').pop())
  return sanitizeFirestoreData({
    id,
    ...firestoreRestFieldsToJs(documentData.fields || {}),
  })
}

function firestoreRestFieldsToJs(fields) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, firestoreRestValueToJs(value)])
  )
}

function firestoreRestValueToJs(value) {
  if ('nullValue' in value) return null
  if ('booleanValue' in value) return value.booleanValue
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return value.doubleValue
  if ('timestampValue' in value) return value.timestampValue
  if ('stringValue' in value) return value.stringValue
  if ('bytesValue' in value) return value.bytesValue
  if ('referenceValue' in value) return value.referenceValue
  if ('geoPointValue' in value) return value.geoPointValue
  if ('arrayValue' in value) {
    return (value.arrayValue.values || []).map(item => firestoreRestValueToJs(item))
  }
  if ('mapValue' in value) {
    return firestoreRestFieldsToJs(value.mapValue.fields || {})
  }
  return undefined
}

function jsToFirestoreRestValue(value) {
  if (value === null) return { nullValue: null }
  if (typeof value === 'boolean') return { booleanValue: value }
  if (Number.isInteger(value)) return { integerValue: value }
  if (typeof value === 'number') return { doubleValue: value }
  return { stringValue: String(value) }
}

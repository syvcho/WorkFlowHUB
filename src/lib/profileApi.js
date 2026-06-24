const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

async function request(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = payload.message || 'The WorkFlow Hub profile request failed.'
    const error = new Error(message)
    error.status = response.status
    error.errors = payload.errors || {}
    throw error
  }

  return payload.data
}

export const profileApi = {
  get(token) {
    return request('/profile', { token })
  },
  update(token, profile) {
    return request('/profile', {
      method: 'PATCH',
      token,
      body: profile,
    })
  },
}

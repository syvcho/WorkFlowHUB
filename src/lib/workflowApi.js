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

  if (response.status === 204) {
    return null
  }

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = payload.message || 'The WorkFlow Hub API request failed.'
    const error = new Error(message)
    error.status = response.status
    error.errors = payload.errors || {}
    throw error
  }

  return payload.data
}

export const workflowApi = {
  list(token) {
    return request('/workflows', { token })
  },
  create(token, workflow) {
    return request('/workflows', {
      method: 'POST',
      token,
      body: workflow,
    })
  },
  update(token, id, workflow) {
    return request(`/workflows/${id}`, {
      method: 'PATCH',
      token,
      body: workflow,
    })
  },
  remove(token, id) {
    return request(`/workflows/${id}`, {
      method: 'DELETE',
      token,
    })
  },
}

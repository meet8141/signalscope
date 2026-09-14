const BASE_URL = import.meta.env.VITE_API_URL || 'https://signalscope-fw9u.onrender.com';

async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  checkHealth: () => fetchAPI('/health'),
  authenticate: (credentials) => fetchAPI('/api/auth/', { method: 'POST', body: JSON.stringify(credentials) }),
  verify: (data) => fetchAPI('/api/verify/', { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }),
  verifyC2Pa: (data) => fetchAPI('/api/verify/c2pa/', { method: 'POST', body: JSON.stringify(data) }),
  verifyMetadata: (data) => fetchAPI('/api/verify/metadata/', { method: 'POST', body: JSON.stringify(data) }),
  verifyForensic: (data) => fetchAPI('/api/verify/forensic/', { method: 'POST', body: JSON.stringify(data) }),
  verifyModel: (data) => fetchAPI('/api/verify/model/', { method: 'POST', body: JSON.stringify(data) }),
};

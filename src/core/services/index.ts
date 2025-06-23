interface MakeHttpRequest {
    host: string
    path: string
    token?: string
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: any
  }
  
  export async function makeHttpRequest({
    host,
    path,
    token,
    method = 'GET',
    body,
  }: MakeHttpRequest) {
    const request = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }
  
    return fetch(`${host}${path}`, request)
      .then(async res => {
        if (!res.ok) {
          const errorStatus = res.status
          throw new Error(String(errorStatus))
        }
  
        return res.json()
      })
      .then(res => res)
      .catch(err => {
        throw new Error(`Error: ${err.message}`)
      })
  }
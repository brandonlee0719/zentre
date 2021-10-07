import axios from 'axios'

const client = axios.create({
  baseURL: 'https://contacts.ichild.com.sg/api/v1.0/SchoolManagement',
  headers: { 'content-type': 'application/json' },
})

export function generateUrl(url: string, params: any): string {
  if (params === undefined || params === null)
    return ''

  let ret = url + '?'

  for (const [key, value] of Object.entries(params)) {
    ret += `${key}=${value}&`
  }

  return ret.substring(0, ret.length - 1)
}

export function handleResponse(response: any): any {
  if (response.data.message === 'Successful' && response.data.statusCode === 200) {
    return response.data.data
  }
}

export default client

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER || 'http://localhost:8080/';


export async function request(path:String, init?:RequestInit){

    const response = await fetch(`${API_BASE_URL}${path}`, {headers: { 'Content-Type': 'application/json' }, ...init});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      // Check if response is empty or 204 No Content
      if (response.status === 204) return null;
      
      // Check content type to determine if we should parse as JSON or text
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
}

export const getAllMessages = async (clarkId:String) => await request(`messages?id=${clarkId}`, { method: 'GET' });

export const postMessage = async (message: string, clarkId: string) => {
  return await request('messages', {
    method: 'POST',
    body: JSON.stringify({ message, clarkId })
  });
};

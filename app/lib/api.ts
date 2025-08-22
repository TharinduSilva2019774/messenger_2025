const API_BASE_URL = 'http://localhost:8080/';


export async function request(path:String, init?:RequestInit){

    const response = await fetch(`${API_BASE_URL}${path}`, {headers: { 'Content-Type': 'application/json' }, ...init});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.status !== 204 ? await response.json() : null;
}


export const getAllMessages = () => request("messages",{method: 'GET'});
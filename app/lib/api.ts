"use server";

import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER || "http://localhost:8080";

export async function request(path: String, init?: RequestInit) {
  const { getToken } = await auth();
  const token = await getToken();
  console.log("API Token:", token);
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...init,
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  // Check if response is empty or 204 No Content
  if (response.status === 204) return null;

  // Check content type to determine if we should parse as JSON or text
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    return await response.text();
  }
}

export const getAllMessages = async (clarkId: String, chatId: String) =>
  await request(`/messages?userId=${clarkId}&chatId=${chatId}`, {
    method: "GET",
  });

export const postMessage = async (message: string, clarkId: string) => {
  return await request("/messages", {
    method: "POST",
    body: JSON.stringify({ message, clarkId }),
  });
};

export const getAllChats = async (clarkId: String) =>
  await request(`/chat?id=${clarkId}`, { method: "GET" });

export const postUser = async (
  firstName: string,
  lastName: string,
  clarkId: string
) => {
  return await request("/user", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, clarkId }),
  });
};

export const postKey = async (
  key: string,
  deviceUID: string,
  clarkId: string
) => {
  return await request("/key", {
    method: "POST",
    body: JSON.stringify({ key, deviceUID, clarkId }),
  });
};

export const getPublickey = async (clarkId: String) =>
  await request(`/key?clarkId=${clarkId}`, { method: "GET" });

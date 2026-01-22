"use client";

import { postKey } from "./api";

import { openDB, IDBPDatabase } from "idb";

let dbPromise: Promise<IDBPDatabase> | null = null;

export async function getDB() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is browser-only");
  }

  if (!dbPromise) {
    dbPromise = openDB("e2ee-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta");
        }
        if (!db.objectStoreNames.contains("keys")) {
          db.createObjectStore("keys");
        }
      },
    });
  }

  return dbPromise;
}

const db = getDB();

export async function generateKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true, // extractable
    ["encrypt", "decrypt"]
  );
}

export async function exportPublicKey(publicKey: CryptoKey) {
  const spki = await crypto.subtle.exportKey("spki", publicKey);
  return btoa(String.fromCharCode(...new Uint8Array(spki)));
}

export async function savePrivateKey(privateKey: CryptoKey) {
  const jwk = await crypto.subtle.exportKey("jwk", privateKey);
  const database = await db;
  await database.put("keys", jwk, "private");
}

export async function loadPrivateKey() {
  const database = await db;
  const jwk = await database.get("keys", "private");

  if (!jwk) return null;

  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );
}

export function generateDeviceId() {
  return crypto.randomUUID();
}

async function cryptoDBExistsst() {
  console.log("Checking if crypto DB exists");
  const database = await db;
  let deviceId = await database.get("meta", "deviceId");

  if (!deviceId) {
    console.log("Crypto DB does not exsist");
    return false;
  }
  console.log("Crypto DB exists");
  return true;
}

export async function getDeviceId() {
  console.log("Getting device ID");
  const database = await db;
  let deviceId = await database.get("meta", "deviceId");

  if (!deviceId) {
    console.log("Generating new device ID");
    deviceId = generateDeviceId();
    await database.put("meta", deviceId, "deviceId");
  }
  return deviceId;
}

export async function initCrypto(clarkId: string) {
  const exists = await cryptoDBExistsst();

  if (!exists) {
    console.log("Initializing crypto database");
    const keyPair = await generateKeyPair();
    await savePrivateKey(keyPair.privateKey);
    const publicKey = await exportPublicKey(keyPair.publicKey);
    console.log("Generated public key:", publicKey);
    const deviceId = await getDeviceId();
    postKey(publicKey, deviceId, clarkId);
  }
}

export async function encryptMessage(publicKey: CryptoKey, message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    data
  );

  return encrypted; // ArrayBuffer
}

async function decryptMessage(
  privateKey: CryptoKey,
  encryptedData: ArrayBuffer
) {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedData
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

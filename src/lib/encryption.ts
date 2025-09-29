const encryptWithAES = async (text: string, password: string) => {
  const passphrase = new TextEncoder().encode(password);
  const encodedText = new TextEncoder().encode(text);
  // Derive a 256-bit key from the password using a key derivation function (KDF)
  const key = await crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest("SHA-256", passphrase),
    "AES-CBC",
    false,
    ["encrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    key,
    encodedText,
  );
  // Combine IV and encrypted data into a single Uint8Array
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.length);
  return result;
};

const decryptWithAES = async (ciphertext: Uint8Array, password: string) => {
  const passphrase = new TextEncoder().encode(password);
  // Extract IV from the ciphertext
  const iv = ciphertext.slice(0, 16);
  // Extract encrypted data from the ciphertext
  const encryptedData = ciphertext.slice(16);
  // Derive a 256-bit key from the password using a key derivation function (KDF)
  const key = await crypto.subtle.importKey(
    "raw",
    await crypto.subtle.digest("SHA-256", passphrase),
    "AES-CBC",
    false,
    ["decrypt"],
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    encryptedData,
  );
  return new TextDecoder().decode(decrypted);
};

export { decryptWithAES, encryptWithAES };

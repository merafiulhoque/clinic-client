import Hashids from "hashids";

// The salt makes your hashes unique to your app. 
// Move this to your .env file in production (e.g., process.env.HASHID_SALT)
const HASHID_SALT = "clinic-management-secret-salt-2026"; 
const MIN_LENGTH = 6; // Outputs strings like "jR8xKp"

const hashids = new Hashids(HASHID_SALT, MIN_LENGTH);

export const encodeId = (id: number): string => {
  return hashids.encode(id);
};

export const decodeId = (hash: string): number | null => {
  const decoded = hashids.decode(hash);
  if (decoded.length === 0) return null;
  return Number(decoded[0]);
};
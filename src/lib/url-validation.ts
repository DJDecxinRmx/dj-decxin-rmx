/**
 * Validates that a string is a safe HTTP(S) URL.
 * Rejects javascript:, data:, vbscript: and other dangerous schemes.
 */
export const isValidHttpUrl = (value: string): boolean => {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

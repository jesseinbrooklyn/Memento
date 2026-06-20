/**
 * Shared date utilities.
 * All functions use local device time — never UTC — to match the spec's
 * "pin content to the timezone at first app open of the day" requirement.
 */

/** Returns today's date as a YYYY-MM-DD string for use as a DB key. */
export function todayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Parses a user-entered birthdate string in MM/DD/YYYY format.
 * Returns null if the string is missing, too short, or produces an invalid date.
 */
export function parseBirthDate(birthDate: string | null | undefined): Date | null {
  if (!birthDate || birthDate.length !== 10) return null;
  const parts = birthDate.split('/');
  if (parts.length !== 3) return null;
  const [mm, dd, yyyy] = parts;
  const parsed = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Formats a raw numeric string as MM/DD/YYYY, inserting slashes as the user types.
 * Intended as the onChangeText handler for birthdate TextInput fields.
 */
export function formatBirthInput(raw: string): string {
  let cleaned = raw.replace(/[^\d]/g, '');
  if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  if (cleaned.length > 5) cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5);
  return cleaned.slice(0, 10);
}

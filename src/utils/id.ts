/**
 * Generates a short, collision-resistant ID for SQLite primary keys.
 * Combines a time-based prefix (base36) with a random suffix so that
 * IDs are loosely sortable and unique within a single device.
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

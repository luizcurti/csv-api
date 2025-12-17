export function sanitizeForCSV(value: string): string {
  if (!value) return '';

  let sanitized = value.trim();

  const dangerousChars = ['=', '+', '-', '@', '\t', '\r'];

  if (dangerousChars.includes(sanitized[0])) {
    sanitized = "'" + sanitized;
  }
  sanitized = sanitized.replace(/[\r\n]+/g, ' ');

  sanitized = sanitized.substring(0, 100);

  return sanitized;
}

import { sanitizeForCSV } from '@shared/utils/csvSanitizer';

describe('sanitizeForCSV', () => {
  it('returns an empty string for falsy input', () => {
    expect(sanitizeForCSV('')).toBe('');
  });

  it.each(['=', '+', '-', '@'])(
    'prefixes a leading %s with a single quote to defuse CSV formula injection',
    (dangerousChar) => {
      const input = `${dangerousChar}cmd|calc`;

      expect(sanitizeForCSV(input)).toBe(`'${dangerousChar}cmd|calc`);
    }
  );

  it('does not prefix a value that does not start with a dangerous character', () => {
    expect(sanitizeForCSV('A1')).toBe('A1');
  });

  it('trims a leading tab/carriage return before the dangerous-char check runs', () => {
    // trim() strips leading whitespace (including \t and \r) first, so a
    // dangerous prefix is only detected once the underlying content is exposed.
    expect(sanitizeForCSV('\tcmd')).toBe('cmd');
    expect(sanitizeForCSV('\r=cmd')).toBe("'=cmd");
  });

  it('collapses newlines and carriage returns into a single space', () => {
    expect(sanitizeForCSV('line1\nline2\r\nline3')).toBe('line1 line2 line3');
  });

  it('trims surrounding whitespace', () => {
    expect(sanitizeForCSV('  A1  ')).toBe('A1');
  });

  it('truncates values longer than 100 characters', () => {
    const longValue = 'a'.repeat(150);

    const result = sanitizeForCSV(longValue);

    expect(result).toHaveLength(100);
    expect(result).toBe('a'.repeat(100));
  });
});

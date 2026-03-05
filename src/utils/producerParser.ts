const PRODUCER_SEPARATOR_REGEX = /,|;|\band\b|&/gi;

export function splitProducers(raw: string): string[] {
  const normalized = raw
    .replace(/\s+/g, " ")
    .trim()
    .replace(PRODUCER_SEPARATOR_REGEX, "|")
    .replace(/\|+/g, "|");

  return normalized
    .split("|")
    .map((producer) => producer.trim())
    .filter(Boolean);
}

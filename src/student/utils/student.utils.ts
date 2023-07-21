export function aplicateFormatName(name: string) {
  let cleanedString = name.trim();

  cleanedString = cleanedString.replace(/\s{2,}/g, ' ');

  return cleanedString.toUpperCase();
}

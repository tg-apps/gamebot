export function escapeMarkdown(text: string | number): string {
  return text.toString().replaceAll(".", "\\.");
}

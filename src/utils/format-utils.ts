/**
 * Cleans and formats AI responses for better readability
 * - Removes source indicators like [6:0*extracted_pdf_text.txt]
 * - Fixes bullet points and spacing
 * - Ensures consistent formatting
 */
export function cleanResponse(text: string): string {
  if (!text) return "";

  // Remove source indicators like [6:0*extracted_pdf_text.txt] or 【6: 0†extracted_pdf_tables. txt】
  let cleaned = text.replace(/\[\d+:\d+\*[^\]]+\]/g, "");
  cleaned = cleaned.replace(/【\d+:\s*\d+†[^】]+】/g, "");
  cleaned = cleaned.replace(/\(\d+:\s*\d+[†\*][^)]+\)/g, "");

  // Remove any remaining source references with different formats
  cleaned = cleaned.replace(/\[\d+:[^\]]+\]/g, "");
  cleaned = cleaned.replace(/【[^】]+】/g, "");

  // Fix bullet points that might be malformed
  cleaned = cleaned.replace(/^\s*[-*]\s*/gm, "• ");

  // Fix numbered lists
  cleaned = cleaned.replace(/^\s*(\d+)\.\s*/gm, "$1. ");

  // Ensure proper spacing after periods, commas, etc.
  cleaned = cleaned.replace(/([.,:;!?])(?=[^\s])/g, "$1 ");

  // Fix multiple consecutive line breaks (more than 2)
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

  // Fix spacing around headings (lines with ** or #)
  cleaned = cleaned.replace(
    /(^|\n)(#+|\*\*)[^\n]+(\*\*|$)(\n|$)/g,
    "$1$2$3$4\n",
  );

  // Remove trailing periods after source references
  cleaned = cleaned.replace(/\s*\.\s*$/gm, "");

  // Clean up any double spaces that might have been created
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  // Trim extra whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

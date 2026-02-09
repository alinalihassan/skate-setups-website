// Markdown rendering utility that works in both Bun and Node.js

// Simple markdown to HTML converter for Node.js fallback
function simpleMarkdownToHtml(markdown: string): string {
  if (!markdown) return ''
  
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Line breaks and paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    // Wrap in paragraph if not already wrapped
    .replace(/^(.+)$/gim, (match) => {
      if (match.startsWith('<')) return match
      return `<p>${match}</p>`
    })
}

export function renderMarkdown(markdown: string): string {
  // Check if Bun.markdown is available
  if (typeof Bun !== 'undefined' && Bun.markdown) {
    return Bun.markdown.html(markdown)
  }
  
  // Fallback to simple converter
  return simpleMarkdownToHtml(markdown)
}

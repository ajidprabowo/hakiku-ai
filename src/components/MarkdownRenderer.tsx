'use client';

// ══════════════════════════════════════════════════════════════
// HAKIKU — Markdown Renderer
// src/components/MarkdownRenderer.tsx
//
// Render teks dari AI (Gemini) dengan format yang rapi
// Mendukung: bold, italic, heading, list, code, blockquote
// ══════════════════════════════════════════════════════════════

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: Props) {
  // Proses setiap baris teks
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Heading H2 (## text) ──────────────────────────────────
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-sm font-bold text-blue-800 mt-3 mb-1.5 first:mt-0">
          {renderInline(line.slice(3))}
        </h2>
      );
    }

    // ── Heading H3 (### text) ─────────────────────────────────
    else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-xs font-bold text-slate-700 mt-2 mb-1">
          {renderInline(line.slice(4))}
        </h3>
      );
    }

    // ── Blockquote (> text) ───────────────────────────────────
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-orange-400 pl-3 my-1.5 italic text-xs text-slate-600">
          {renderInline(line.slice(2))}
        </blockquote>
      );
    }

    // ── Unordered list (- text or * text) ────────────────────
    else if (line.match(/^[-*]\s/)) {
      // Kumpulkan semua bullet points berturutan
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*]\s/)) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="my-1.5 space-y-1 pl-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
              <span className="text-blue-500 flex-shrink-0 mt-0.5">•</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue; // sudah increment i dalam loop di atas
    }

    // ── Horizontal rule (---) ─────────────────────────────────
    else if (line.trim() === '---') {
      elements.push(
        <hr key={i} className="border-slate-200 my-2" />
      );
    }

    // ── Baris kosong ──────────────────────────────────────────
    else if (line.trim() === '') {
      elements.push(<div key={i} className="h-1" />);
    }

    // ── Paragraf biasa ────────────────────────────────────────
    else {
      elements.push(
        <p key={i} className="text-xs text-slate-600 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }

    i++;
  }

  return (
    <div className={`space-y-0.5 ${className}`}>
      {elements}
    </div>
  );
}

// ── Render inline formatting: **bold**, *italic*, `code` ─────
function renderInline(text: string): React.ReactNode {
  if (!text) return null;

  // Split berdasarkan pattern **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return parts.map((part, idx) => {
    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-slate-800">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={idx} className="italic text-slate-700">
          {part.slice(1, -1)}
        </em>
      );
    }
    // Code: `text`
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded text-[11px] font-mono"
              style={{ background: '#EFF6FF', color: '#1B4FD8' }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    // Plain text
    return <span key={idx}>{part}</span>;
  });
}

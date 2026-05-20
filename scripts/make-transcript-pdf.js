const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'conversation-transcript.md');
const out = path.join(root, 'Jankovic-Connect-Conversation.pdf');

const raw = fs.readFileSync(src, 'utf8');

// Split into tagged blocks. Each block starts with a $TAG$ marker.
const tokens = raw.split(/\n(?=\$[A-Z]+\$)/g).map(s => s.trim()).filter(Boolean);

const colors = {
  bg: '#0B0F14',
  user: '#10B981',
  assistant: '#D4AF37',
  text: '#F9FAFB',
  muted: '#9CA3AF',
  rule: '#374151',
};

const doc = new PDFDocument({size: 'A4', margin: 54, bufferPages: true});
const stream = fs.createWriteStream(out);
doc.pipe(stream);

// Embed a Unicode TrueType font so Slovak diacritics (č ž ť ľ š ň á í é ...)
// render correctly and the text remains selectable/extractable for an AI.
doc.registerFont('body', 'C:/Windows/Fonts/arial.ttf');
doc.registerFont('bold', 'C:/Windows/Fonts/arialbd.ttf');
const FONT = 'body';
const FONT_BOLD = 'bold';

const pageW = doc.page.width - doc.page.margins.left - doc.page.margins.right;

function label(tag) {
  switch (tag) {
    case 'USER': return 'JAKUB (USER)';
    case 'ASSISTANT': return 'CLAUDE (ASSISTANT)';
    case 'TITLE': return null;
    case 'SUBTITLE': return null;
    case 'NOTE': return 'NOTE';
    case 'ENDNOTE': return 'FOR THE NEXT AI';
    default: return tag;
  }
}

tokens.forEach(block => {
  const m = block.match(/^\$([A-Z]+)\$\s*([\s\S]*)$/);
  if (!m) return;
  const tag = m[1];
  const body = m[2].trim();

  if (tag === 'TITLE') {
    doc.moveDown(0.5);
    doc.fillColor('#10B981').font(FONT_BOLD).fontSize(22).text(body, {width: pageW});
    doc.moveDown(0.4);
    return;
  }
  if (tag === 'SUBTITLE') {
    doc.fillColor(colors.muted).font(FONT).fontSize(10).text(body, {width: pageW});
    doc.moveDown(0.3);
    doc.strokeColor(colors.rule).lineWidth(1)
      .moveTo(doc.x, doc.y).lineTo(doc.x + pageW, doc.y).stroke();
    doc.moveDown(0.6);
    return;
  }

  // Speaker / section header
  const lab = label(tag);
  const headColor = tag === 'USER' ? colors.user
    : tag === 'ASSISTANT' ? colors.assistant
    : colors.muted;

  if (doc.y > doc.page.height - 120) doc.addPage();

  doc.moveDown(0.5);
  doc.fillColor(headColor).font(FONT_BOLD).fontSize(10.5)
    .text(lab, {width: pageW, characterSpacing: 0.5});
  doc.moveDown(0.2);
  doc.fillColor(colors.text).font(FONT).fontSize(10.5)
    .text(body, {width: pageW, align: 'left', lineGap: 2});
});

// Footer page numbers
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(range.start + i);
  doc.fillColor(colors.muted).font(FONT).fontSize(8);
  doc.text(
    `Jankovič Connect — build session transcript   ·   page ${i + 1} of ${range.count}`,
    doc.page.margins.left,
    doc.page.height - 38,
    {width: pageW, align: 'center'},
  );
}

doc.end();

stream.on('finish', () => {
  const bytes = fs.statSync(out).size;
  console.log(`PDF written: ${out} (${bytes} bytes, ${range.count} pages)`);
});

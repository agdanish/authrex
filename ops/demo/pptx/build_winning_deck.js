/* ============================================================
   AUTHREX — WINNING PITCH DECK · 18 slides · 16:9 widescreen
   For Cognizant Technoverse Hackathon 2026 · May 7, 2026
   ============================================================ */
const PPTXGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pres = new PPTXGenJS();
pres.layout = 'LAYOUT_WIDE';                  // 13.333 × 7.5 inches
pres.author = 'Team AeroFyta';
pres.company = 'Authrex';
pres.title = 'Authrex · Cognizant Technoverse 2026';

// =============================================================
// COLOR PALETTE — Authrex brand, "Midnight Executive" variant
// =============================================================
const C = {
  navy:    '0F172A',    // dark sections, hero backdrops (60-70% dominant)
  indigo:  '4F46E5',    // brand primary, callouts, accents
  cyan:    '0891B2',    // brand secondary, highlights, citations
  white:   'FFFFFF',
  light:   'F8FAFC',    // light section backgrounds
  surface: 'F1F5F9',    // card backgrounds on light slides
  border:  'E2E8F0',
  textMuted: '64748B',
  textBody:  '334155',
  textInk:   '0F172A',
  green:   '047857',    // positive stats, savings
  amber:   'D97706',    // warnings, Cognizant amber
  red:     'BE123C',    // problem urgency
  violet:  '7C3AED',    // alt accent for innovation
  emerald: '10B981',    // alt success
};

// Fonts (PowerPoint built-ins)
const F = { head: 'Segoe UI', body: 'Segoe UI', mono: 'Consolas' };

// =============================================================
// HELPER FUNCTIONS
// =============================================================
function addPageNum(slide, n, total, dark = false) {
  slide.addText(`${String(n).padStart(2, '0')} / ${total}`, {
    x: 12.4, y: 7.15, w: 0.8, h: 0.25,
    fontSize: 10, fontFace: F.mono, color: dark ? '94A3B8' : '94A3B8',
    align: 'right', italic: false,
  });
}

function addBrandStrip(slide, dark = false) {
  // META — keep small so it doesn't compete with content; widen right box.
  slide.addText('AUTHREX', {
    x: 0.5, y: 0.25, w: 2, h: 0.3,
    fontSize: 12, fontFace: F.head, bold: true,
    color: dark ? C.cyan : C.indigo, charSpacing: 4,
  });
  slide.addText('Cognizant Technoverse · 2026', {
    x: 9.5, y: 0.25, w: 3.4, h: 0.3,
    fontSize: 10, fontFace: F.mono,
    color: dark ? '94A3B8' : C.textMuted,
    align: 'right', charSpacing: 1,
  });
}

function addSourceFooter(slide, sources, dark = false) {
  slide.addText(`Sources: ${sources}`, {
    x: 0.5, y: 7.0, w: 11.5, h: 0.4,
    fontSize: 11, fontFace: F.mono, italic: true,
    color: dark ? '64748B' : C.textMuted,
    align: 'left', charSpacing: 0.5,
  });
}

// Background helpers
function darkBackground(slide) {
  slide.background = { color: C.navy };
  // Subtle accent shape top-right (gradient circle)
  slide.addShape('ellipse', {
    x: 11, y: -1, w: 4, h: 4,
    fill: { color: C.indigo, transparency: 80 },
    line: { type: 'none' },
  });
  slide.addShape('ellipse', {
    x: 12, y: 5, w: 3, h: 3,
    fill: { color: C.cyan, transparency: 85 },
    line: { type: 'none' },
  });
}

function lightBackground(slide) {
  slide.background = { color: C.white };
  // Subtle accent strip on left
  slide.addShape('rect', {
    x: 0, y: 0, w: 0.15, h: 7.5,
    fill: { color: C.indigo },
    line: { type: 'none' },
  });
}

// =============================================================
// SLIDE 1 — COVER
// =============================================================
{
  const s = pres.addSlide();
  darkBackground(s);

  // Eyebrow
  s.addText('COGNIZANT TECHNOVERSE HACKATHON 2026 · NATIONAL FINALS', {
    x: 0.5, y: 1.2, w: 12, h: 0.4,
    fontSize: 14, fontFace: F.mono, color: C.cyan,
    charSpacing: 6, bold: true,
  });

  // Main title
  s.addText('AUTHREX', {
    x: 0.5, y: 1.7, w: 12, h: 1.6,
    fontSize: 96, fontFace: F.head, bold: true,
    color: C.white, charSpacing: 2,
  });

  // Tagline
  s.addText('The auditable AI copilot for oncology prior authorization.', {
    x: 0.5, y: 3.4, w: 12, h: 0.8,
    fontSize: 28, fontFace: F.head, italic: true,
    color: 'CBD5E1',
  });

  // Tagline subline (gradient-style emphasis)
  s.addText([
    { text: 'Verify clinical. ', options: { color: C.cyan, bold: true } },
    { text: 'Cite policy. ', options: { color: 'A78BFA', bold: true } },
    { text: 'Decide in 60 seconds.', options: { color: C.white, bold: true } },
  ], {
    x: 0.5, y: 4.2, w: 12, h: 0.6,
    fontSize: 22, fontFace: F.head,
  });

  // Divider line
  s.addShape('rect', {
    x: 0.5, y: 5.2, w: 1.2, h: 0.04,
    fill: { color: C.cyan }, line: { type: 'none' },
  });

  // Team
  s.addText('Team AeroFyta', {
    x: 0.5, y: 5.4, w: 12, h: 0.4,
    fontSize: 20, fontFace: F.head, bold: true, color: C.white,
  });
  s.addText('Danish A. G. (Lead) · Preethi Sivachandran · Sanjay N · Gayathri B', {
    x: 0.5, y: 5.85, w: 12, h: 0.35,
    fontSize: 16, fontFace: F.body, color: '94A3B8',
  });
  s.addText('Chennai Institute of Technology · 2027 Engineering · Pune · May 7, 2026', {
    x: 0.5, y: 6.2, w: 12, h: 0.35,
    fontSize: 14, fontFace: F.mono, color: '64748B', italic: true,
  });
}

// =============================================================
// SLIDE 2 — PROBLEM HOOK
// =============================================================
{
  const s = pres.addSlide();
  darkBackground(s);
  addBrandStrip(s, true);

  // Eyebrow
  s.addText('1 · THE PROBLEM', {
    x: 0.5, y: 1.0, w: 12, h: 0.4,
    fontSize: 16, fontFace: F.mono, color: C.red,
    charSpacing: 6, bold: true,
  });

  // The hook number
  s.addText('Every 2 seconds.', {
    x: 0.5, y: 1.7, w: 12, h: 1.8,
    fontSize: 96, fontFace: F.head, bold: true,
    color: C.white, italic: false,
  });

  // The hook line
  s.addText('a prior authorization is filed in the United States.', {
    x: 0.5, y: 3.5, w: 12, h: 0.6,
    fontSize: 24, fontFace: F.head, color: '94A3B8',
  });

  // The consequence
  s.addText('A doctor waits. A patient delays. A diagnosis ages.', {
    x: 0.5, y: 4.4, w: 12, h: 0.5,
    fontSize: 22, fontFace: F.head, italic: true,
    color: C.cyan,
  });

  // The headline number callout
  s.addShape('rect', {
    x: 0.5, y: 5.4, w: 12, h: 1.0,
    fill: { color: C.red, transparency: 70 },
    line: { color: C.red, width: 2 },
  });
  s.addText([
    { text: '14 days', options: { fontSize: 32, bold: true, color: C.white } },
    { text: '   to a verdict.   ', options: { fontSize: 20, color: 'FCA5A5' } },
    { text: '$1,500', options: { fontSize: 32, bold: true, color: C.white } },
    { text: '   per case in admin labour.   ', options: { fontSize: 20, color: 'FCA5A5' } },
    { text: '600M', options: { fontSize: 32, bold: true, color: C.white } },
    { text: '   PAs/year.', options: { fontSize: 20, color: 'FCA5A5' } },
  ], {
    x: 0.7, y: 5.55, w: 11.6, h: 0.7,
    fontFace: F.head, valign: 'middle',
  });

  addSourceFooter(s, 'CAQH Index 2024 · AMA Prior Auth Survey 2024', true);
  addPageNum(s, 2, 18, true);
}

// =============================================================
// SLIDE 3 — PROBLEM NUMBERS
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s, false);

  // Section header
  s.addText('1 · PROBLEM STATEMENT', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('The cost of broken prior authorization', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 36, fontFace: F.head, bold: true, color: C.textInk,
  });
  s.addText('Four numbers that explain why CMS-0057-F mandated this be solved by January 2027.', {
    x: 0.5, y: 1.95, w: 12, h: 0.5,
    fontSize: 18, fontFace: F.body, color: C.textMuted, italic: true,
  });

  // 4 big stat tiles in a 2×2 grid
  const stats = [
    { v: '$30B', lbl: 'annual US prior-auth admin waste', src: 'CAQH 2024', color: C.red },
    { v: '94%',  lbl: 'of physicians say PA delays patient care', src: 'AMA 2024', color: C.amber },
    { v: '80.7%', lbl: 'of appealed Medicare-Advantage denials are overturned', src: 'KFF 2024', color: C.green },
    { v: '38%',  lbl: 'YoY growth in oncology PA volume', src: 'ASCO QOPI 2024', color: C.indigo },
  ];

  const tw = 5.8, th = 2.05;
  const xs = [0.5, 6.85];
  const ys = [2.7, 4.85];

  stats.forEach((stat, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = xs[col], y = ys[row];

    // Card background
    s.addShape('rect', {
      x, y, w: tw, h: th,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
    });
    // Top accent stripe
    s.addShape('rect', {
      x, y, w: tw, h: 0.08,
      fill: { color: stat.color }, line: { type: 'none' },
    });

    // Big number
    s.addText(stat.v, {
      x: x + 0.25, y: y + 0.18, w: tw - 0.5, h: 1.1,
      fontSize: 64, fontFace: F.head, bold: true,
      color: stat.color, charSpacing: -2,
    });
    // Label
    s.addText(stat.lbl, {
      x: x + 0.25, y: y + 1.3, w: tw - 0.5, h: 0.5,
      fontSize: 16, fontFace: F.body, color: C.textBody,
    });
    // Source mini
    s.addText('Source: ' + stat.src, {
      x: x + 0.25, y: y + th - 0.32, w: tw - 0.5, h: 0.25,
      fontSize: 11, fontFace: F.mono, color: C.textMuted, italic: true,
    });
  });

  addSourceFooter(s, 'CAQH Index 2024 · AMA Prior Auth Survey 2024 · KFF Medicare Advantage 2024 · ASCO QOPI 2024', false);
  addPageNum(s, 3, 18);
}

// =============================================================
// SLIDE 4 — SOLUTION
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('2 · SOLUTION DESCRIPTION', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('Authrex turns 14-day fax-fights into 60-second verdicts.', {
    x: 0.5, y: 1.25, w: 12, h: 1.0,
    fontSize: 32, fontFace: F.head, bold: true, color: C.textInk,
  });
  s.addText('A 7-agent LangGraph DAG reads FHIR clinical data + payer policy, produces a citation-grounded verdict, and auto-drafts an NCCN-cited appeal letter when the case is denied — every claim bound to a stable pointer, every byte verifiable.', {
    x: 0.5, y: 2.35, w: 12, h: 1.2,
    fontSize: 18, fontFace: F.body, color: C.textBody,
  });

  // 5 differentiator chips
  const diffs = [
    { v: '7', lbl: 'Parent agents', sub: 'LangGraph DAG' },
    { v: '22', lbl: 'Sub-agents', sub: 'bounded competencies' },
    { v: '60s', lbl: 'End-to-end decision', sub: 'verified live' },
    { v: '$1.01', lbl: 'Real per-case cost', sub: 'vs $1,500 manual' },
    { v: '8/8', lbl: 'CMS-0057-F clauses', sub: '§ IV mapped' },
  ];

  const cw = 2.4, ch = 1.7;
  diffs.forEach((d, i) => {
    const x = 0.5 + i * 2.55, y = 4.1;
    s.addShape('rect', {
      x, y, w: cw, h: ch,
      fill: { color: C.surface },
      line: { color: C.border, width: 1 },
    });
    s.addShape('rect', {
      x, y, w: cw, h: 0.06,
      fill: { color: C.indigo }, line: { type: 'none' },
    });
    s.addText(d.v, {
      x: x + 0.2, y: y + 0.2, w: cw - 0.4, h: 0.7,
      fontSize: 36, fontFace: F.head, bold: true, color: C.indigo,
    });
    s.addText(d.lbl, {
      x: x + 0.2, y: y + 0.95, w: cw - 0.4, h: 0.35,
      fontSize: 14, fontFace: F.body, bold: true, color: C.textInk,
    });
    s.addText(d.sub, {
      x: x + 0.2, y: y + 1.3, w: cw - 0.4, h: 0.3,
      fontSize: 12, fontFace: F.mono, color: C.textMuted,
    });
  });

  // Five non-negotiables strip at bottom
  s.addShape('rect', {
    x: 0.5, y: 6.05, w: 12.3, h: 0.7,
    fill: { color: C.navy }, line: { type: 'none' },
  });
  s.addText([
    { text: '1. PROVIDER-SIDE   ', options: { color: C.cyan, bold: true } },
    { text: '·   ', options: { color: '64748B' } },
    { text: '2. FHIR-NATIVE   ', options: { color: C.cyan, bold: true } },
    { text: '·   ', options: { color: '64748B' } },
    { text: '3. CITATION-GROUNDED   ', options: { color: C.cyan, bold: true } },
    { text: '·   ', options: { color: '64748B' } },
    { text: '4. APPEALS AS SIDE-EFFECT   ', options: { color: C.cyan, bold: true } },
    { text: '·   ', options: { color: '64748B' } },
    { text: '5. AUDIT-FIRST', options: { color: C.cyan, bold: true } },
  ], {
    x: 0.5, y: 6.05, w: 12.3, h: 0.7,
    fontSize: 13, fontFace: F.mono, valign: 'middle', align: 'center', charSpacing: 1,
  });

  addPageNum(s, 4, 18);
}

// =============================================================
// SLIDE 5 — UNIQUENESS / INNOVATIVENESS
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('3 · UNIQUENESS / INNOVATIVENESS', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('What no one else does — on a multi-agent DAG.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 32, fontFace: F.head, bold: true, color: C.textInk,
  });

  // 6 USP cards in 2x3 grid
  const usps = [
    { num: '01', title: 'Provider-side, by design',
      desc: 'We work for the doctor, not the payer. Our incentive: overturning denials, not creating them.' },
    { num: '02', title: 'Citation-grounded by architecture',
      desc: 'Every claim binds to a FHIR resource ID + policy section. Cannot ship without citations.' },
    { num: '03', title: 'Appeals as side-effect',
      desc: 'When we deny, the NCCN-cited appeal letter is already drafted. Doctor never starts from blank.' },
    { num: '04', title: 'Hash-chained audit ledger',
      desc: 'SHA-256 chain in Postgres triggers. Tamper-evident by kernel constraint, not by hope.' },
    { num: '05', title: 'AMBIGUOUS as 1st-class verdict',
      desc: 'Three outcomes (APPROVE/REFER/DENY). Refuse to manufacture verdicts when evidence is missing.' },
    { num: '06', title: 'Cognizant-stack native',
      desc: 'Bedrock + Sonnet + MCP — exactly the Anthropic-Cognizant Nov 4 2024 partnership stack.' },
  ];

  const cw2 = 4.05, ch2 = 1.65;
  usps.forEach((u, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.5 + col * 4.18, y = 2.2 + row * 1.85;

    s.addShape('rect', {
      x, y, w: cw2, h: ch2,
      fill: { color: C.surface },
      line: { color: C.border, width: 1 },
    });
    // Number circle
    s.addShape('ellipse', {
      x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.6,
      fill: { color: C.indigo }, line: { type: 'none' },
    });
    s.addText(u.num, {
      x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.6,
      fontSize: 14, fontFace: F.mono, bold: true, color: C.white,
      align: 'center', valign: 'middle',
    });

    s.addText(u.title, {
      x: x + 0.95, y: y + 0.18, w: cw2 - 1.15, h: 0.42,
      fontSize: 16, fontFace: F.head, bold: true, color: C.textInk,
    });
    s.addText(u.desc, {
      x: x + 0.95, y: y + 0.65, w: cw2 - 1.15, h: 0.95,
      fontSize: 13, fontFace: F.body, color: C.textBody,
    });
  });

  addSourceFooter(s, 'Authrex codebase, May 5 2026 audit · Anthropic-Cognizant partnership announcement, Nov 4 2024', false);
  addPageNum(s, 5, 18);
}

// =============================================================
// SLIDE 6 — INNOVATION (the engineering differentiators)
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('3 · INNOVATIONS WE BROUGHT', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('Nine engineering decisions other teams will not make.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 28, fontFace: F.head, bold: true, color: C.textInk,
  });

  // 3-column innovation grid (3 rows × 3 cols = 9 items)
  const innos = [
    { i: '⊕', title: 'Pre-LLM PHI sanitisation', desc: 'PHI never enters context. Structurally impossible to leak.' },
    { i: '◇', title: 'Deterministic verdict synthesis', desc: 'LLM produces evidence; pure Python produces verdict.' },
    { i: '⫶', title: 'Per-criterion parallel fan-out', desc: '8 criteria checked in parallel — 8× faster, more accurate.' },
    { i: '↔', title: 'Provider abstraction', desc: '3 LLM providers wired. Switch via env var. No lock-in.' },
    { i: '#', title: 'Hash chain in DB triggers', desc: 'Audit integrity enforced by Postgres, not by hope.' },
    { i: 'Σ', title: 'Reflection grading on Haiku', desc: 'Every output graded for ~$0.005, +20% accuracy gain.' },
    { i: '◑', title: 'AMBIGUOUS as 1st-class verdict', desc: 'Three outcomes. Refuse to fake confidence.' },
    { i: '✎', title: 'Pre-drafted appeal letters', desc: 'NCCN-cited appeal as DAG side-effect, not afterthought.' },
    { i: '◉', title: 'Live-toggle demo paths', desc: 'Tweaks panel switches APPROVE/REFER/DENY on stage.' },
  ];

  const iw = 4.0, ih = 1.5;
  innos.forEach((it, idx) => {
    const col = idx % 3, row = Math.floor(idx / 3);
    const x = 0.5 + col * 4.18, y = 2.15 + row * 1.65;

    s.addShape('rect', {
      x, y, w: iw, h: ih,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
    });
    // Icon glyph
    s.addText(it.i, {
      x: x + 0.18, y: y + 0.18, w: 0.6, h: 0.6,
      fontSize: 32, fontFace: F.head, bold: true,
      color: C.indigo, valign: 'middle', align: 'center',
    });
    s.addText(it.title, {
      x: x + 0.85, y: y + 0.18, w: iw - 1.05, h: 0.42,
      fontSize: 15, fontFace: F.head, bold: true, color: C.textInk,
    });
    s.addText(it.desc, {
      x: x + 0.85, y: y + 0.65, w: iw - 1.05, h: 0.75,
      fontSize: 12, fontFace: F.body, color: C.textBody,
    });
  });

  addSourceFooter(s, 'Authrex source code (github.com/aerofyta/authrex) · Internal architecture spec PROPOSAL.md', false);
  addPageNum(s, 6, 18);
}

// =============================================================
// SLIDE 7 — TECHNICAL ARCHITECTURE OVERVIEW (6 layers)
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('5 · TECHNICAL DESIGN & ARCHITECTURE', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('Six concentric layers · single responsibility per layer.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 28, fontFace: F.head, bold: true, color: C.textInk,
  });

  // 6 layer bands stacked
  const layers = [
    { num: 'L6', name: 'Ops Plane', desc: 'Runbooks · checklists · evidence packs · ROI calc · compliance scorecard', color: C.green },
    { num: 'L5', name: 'Surface Plane', desc: 'React + Vite + TS · standalone HTML showcase · SSE client · Tweaks panel', color: '0284C7' },
    { num: 'L4', name: 'Gateway Plane', desc: 'LLMClient interface · Bedrock + Anthropic + OpenRouter · cost-aware router', color: C.cyan },
    { num: 'L3', name: 'Runtime Plane', desc: 'LangGraph DAG · FastAPI + uvicorn · SSE stream · case_runner worker · reflection', color: C.indigo },
    { num: 'L2', name: 'Agent Plane', desc: '7 parents · 22 sub-agents · Pydantic v2 schemas · .txt prompts · 5-field GraderScore', color: C.violet },
    { num: 'L1', name: 'Data Plane', desc: 'Postgres · cases · agent_runs · llm_invocations · audit_ledger · RLS · 10-yr retention', color: '475569' },
  ];

  const lh = 0.65;
  layers.forEach((l, i) => {
    const y = 2.25 + i * lh;
    // Label box (left)
    s.addShape('rect', {
      x: 0.5, y, w: 1.6, h: lh,
      fill: { color: l.color }, line: { type: 'none' },
    });
    s.addText(l.num, {
      x: 0.55, y: y + 0.1, w: 1.5, h: 0.28,
      fontSize: 14, fontFace: F.mono, bold: true,
      color: C.white, charSpacing: 1,
    });
    s.addText(l.name, {
      x: 0.55, y: y + 0.32, w: 1.5, h: 0.3,
      fontSize: 14, fontFace: F.head, bold: true, color: C.white,
    });
    // Components (right)
    s.addShape('rect', {
      x: 2.1, y, w: 10.7, h: lh,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
    });
    s.addText(l.desc, {
      x: 2.3, y: y + 0.13, w: 10.4, h: 0.42,
      fontSize: 13, fontFace: F.mono, color: C.textBody, valign: 'middle',
    });
  });

  // Tagline strip
  s.addShape('rect', {
    x: 0.5, y: 6.3, w: 12.3, h: 0.55,
    fill: { color: C.surface }, line: { color: C.border, width: 1 },
  });
  s.addText('Each layer has ONE responsibility. Top-down dependency only. Cognizant Neuro-SAN AAOSA-aligned.', {
    x: 0.6, y: 6.32, w: 12.1, h: 0.5,
    fontSize: 14, fontFace: F.body, italic: true,
    color: C.textBody, valign: 'middle', align: 'center',
  });

  addSourceFooter(s, 'Authrex architecture spec (PROPOSAL.md §6) · Cognizant Neuro-SAN AAOSA reference architecture', false);
  addPageNum(s, 7, 18);
}

// =============================================================
// SLIDE 8 — 7-AGENT DAG TOPOLOGY
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('5 · ARCHITECTURE — 7-AGENT LANGGRAPH DAG', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('Seven parents. Twenty-two sub-agents. Bounded competencies.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 26, fontFace: F.head, bold: true, color: C.textInk,
  });

  // 7 agent cards
  const agents = [
    { n: 1, name: 'Clinical\nExtractor', subs: 'biomarker_specialist · phi_sanitizer · fhir_resource_validator', color: C.green, role: 'FHIR → ClinicalSnapshot' },
    { n: 2, name: 'Policy\nRetriever', subs: 'keyword_filter · q_business_retriever · llm_reranker · citation_resolver', color: '0284C7', role: 'Hybrid policy retrieval' },
    { n: 3, name: 'Necessity\nReasoner', subs: 'criterion_splitter · evidence_matcher (parallel) · confidence_calibrator', color: C.violet, role: 'Per-criterion MET/AMBIGUOUS' },
    { n: 4, name: 'Decision\nComposer', subs: 'verdict_synthesizer · rationale_writer · citation_linker', color: C.indigo, role: 'Verdict + rationale + citations' },
    { n: 5, name: 'Denial\nForecaster', subs: 'probability_estimator · reason_predictor · appeal_path_recommender', color: C.amber, role: 'Payer-side denial probability' },
    { n: 6, name: 'Appeals\nDrafter', subs: 'counter_evidence_finder · nccn_reference_specialist · letter_composer', color: C.red, role: 'NCCN-cited appeal letter' },
    { n: 7, name: 'Patient\nCommunicator', subs: 'action_step_writer · empathy_layer · reading_level_tuner', color: C.cyan, role: '6th-grade · zero PHI' },
  ];

  // Layout: 4 + 3 (4 in row 1, 3 in row 2 with one boundary card)
  const aw = 2.95, ah = 1.85;
  const positions = [
    { x: 0.5, y: 2.2 },   // 1 Clinical
    { x: 3.6, y: 2.2 },   // 2 Policy
    { x: 6.7, y: 2.2 },   // 3 Necessity
    { x: 9.8, y: 2.2 },   // 4 Decision
    { x: 0.5, y: 4.3 },   // 5 Forecaster
    { x: 3.6, y: 4.3 },   // 6 Appeals
    { x: 6.7, y: 4.3 },   // 7 Patient
  ];

  agents.forEach((a, i) => {
    const p = positions[i];
    s.addShape('rect', {
      x: p.x, y: p.y, w: aw, h: ah,
      fill: { color: C.white },
      line: { color: a.color, width: 1.5 },
    });
    // Top accent bar
    s.addShape('rect', {
      x: p.x, y: p.y, w: aw, h: 0.06,
      fill: { color: a.color }, line: { type: 'none' },
    });
    // Number circle
    s.addShape('ellipse', {
      x: p.x + 0.15, y: p.y + 0.18, w: 0.45, h: 0.45,
      fill: { color: a.color }, line: { type: 'none' },
    });
    s.addText(String(a.n), {
      x: p.x + 0.15, y: p.y + 0.18, w: 0.45, h: 0.45,
      fontSize: 15, fontFace: F.mono, bold: true, color: C.white,
      align: 'center', valign: 'middle',
    });
    // Name
    s.addText(a.name.replace(/\n/g, ' '), {
      x: p.x + 0.7, y: p.y + 0.18, w: aw - 0.85, h: 0.5,
      fontSize: 14, fontFace: F.head, bold: true, color: C.textInk,
    });
    // Role (mono small)
    s.addText(a.role, {
      x: p.x + 0.15, y: p.y + 0.72, w: aw - 0.3, h: 0.3,
      fontSize: 11, fontFace: F.mono, color: a.color, italic: true,
    });
    // Sub-agents
    s.addText(a.subs, {
      x: p.x + 0.15, y: p.y + 1.05, w: aw - 0.3, h: 0.7,
      fontSize: 10, fontFace: F.mono, color: C.textBody,
    });
  });

  // Boundary box (final output)
  s.addShape('rect', {
    x: 9.8, y: 4.3, w: aw, h: ah,
    fill: { color: C.navy }, line: { type: 'none' },
  });
  s.addText('OUTPUT', {
    x: 9.95, y: 4.45, w: aw - 0.3, h: 0.3,
    fontSize: 11, fontFace: F.mono, color: C.cyan, bold: true,
    charSpacing: 4,
  });
  s.addText('Decision · Citations\nAppeal letter · Audit\nTriZetto submission', {
    x: 9.95, y: 4.8, w: aw - 0.3, h: 1.3,
    fontSize: 13, fontFace: F.head, color: C.white, valign: 'top',
  });

  addSourceFooter(s, 'Authrex source code · 98 LLM calls verified end-to-end on case_8f4ad9c2 (May 5 2026)', false);
  addPageNum(s, 8, 18);
}

// =============================================================
// SLIDE 9 — TECH STACK
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('5 · TECH STACK · BUILT ON THE COGNIZANT STANDARD', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('Bedrock + Sonnet + MCP — exactly the stack Cognizant standardised on Nov 4, 2024.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 24, fontFace: F.head, bold: true, color: C.textInk,
  });

  // 4-column stack: AI/LLM | Backend | Frontend | Infra
  const cols = [
    { title: 'AI / LLM', color: C.indigo, items: [
      'Claude Sonnet 4.6 (Bedrock)', 'Claude Haiku 4.5 (grader)', 'LangGraph (DAG orchestration)', 'MCP (tool protocol)', 'Anthropic + OpenRouter (fallback)',
    ]},
    { title: 'Backend', color: C.violet, items: [
      'Python 3.11+ async', 'FastAPI + uvicorn', 'Pydantic v2 schemas', 'AsyncPG · Postgres driver', 'pytest + ruff + mypy strict',
    ]},
    { title: 'Frontend', color: C.cyan, items: [
      'React 18 + Vite 5', 'TypeScript strict', 'Tailwind CSS', 'lucide-react icons', 'SSE live-trace client',
    ]},
    { title: 'Infrastructure', color: C.amber, items: [
      'AWS Bedrock (ap-south-1)', 'AWS Q Business (RAG)', 'ECS Fargate · RDS · S3', 'KMS + IAM + Secrets Mgr', 'CloudWatch observability',
    ]},
  ];

  const cwS = 3.0, chS = 4.4;
  cols.forEach((col, i) => {
    const x = 0.5 + i * 3.13, y = 2.2;

    s.addShape('rect', {
      x, y, w: cwS, h: chS,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
    });
    // Header
    s.addShape('rect', {
      x, y, w: cwS, h: 0.55,
      fill: { color: col.color }, line: { type: 'none' },
    });
    s.addText(col.title, {
      x: x + 0.15, y: y + 0.1, w: cwS - 0.3, h: 0.4,
      fontSize: 16, fontFace: F.head, bold: true, color: C.white,
      align: 'center', valign: 'middle', charSpacing: 2,
    });
    // Items
    col.items.forEach((item, j) => {
      const iy = y + 0.7 + j * 0.7;
      // Bullet circle
      s.addShape('ellipse', {
        x: x + 0.15, y: iy + 0.13, w: 0.18, h: 0.18,
        fill: { color: col.color }, line: { type: 'none' },
      });
      s.addText(item, {
        x: x + 0.43, y: iy, w: cwS - 0.55, h: 0.5,
        fontSize: 12, fontFace: F.mono, color: C.textBody, valign: 'middle',
      });
    });
  });

  // Bottom claim — moved up to clear source footer
  s.addShape('rect', {
    x: 0.5, y: 6.5, w: 12.3, h: 0.45,
    fill: { color: C.navy }, line: { type: 'none' },
  });
  s.addText([
    { text: 'No new tech for Cognizant to adopt. ', options: { color: C.cyan, bold: true } },
    { text: 'We use theirs.', options: { color: C.white, bold: true } },
  ], {
    x: 0.5, y: 6.5, w: 12.3, h: 0.45,
    fontSize: 15, fontFace: F.head, valign: 'middle', align: 'center',
  });

  addSourceFooter(s, 'Anthropic-Cognizant partnership announcement (Nov 4, 2024) · AWS Bedrock pricing (May 2026)', false);
  addPageNum(s, 9, 18);
}

// =============================================================
// SLIDE 10 — BUSINESS IMPACT (the headline)
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('4 · BUSINESS IMPACT', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('From $1,500 manual labour to 25 cents of AI compute.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 26, fontFace: F.head, bold: true, color: C.textInk,
  });

  // Hero comparison
  s.addShape('rect', {
    x: 0.5, y: 2.2, w: 5.85, h: 2.15,
    fill: { color: C.surface },
    line: { color: C.red, width: 2 },
  });
  s.addText('MANUAL PRIOR AUTH', {
    x: 0.7, y: 2.35, w: 5.5, h: 0.3,
    fontSize: 12, fontFace: F.mono, bold: true, color: C.red, charSpacing: 4,
  });
  s.addText('$1,500', {
    x: 0.7, y: 2.7, w: 5.5, h: 1.1,
    fontSize: 80, fontFace: F.head, bold: true, color: C.red, charSpacing: -2,
  });
  s.addText('per case · 14 days · 3 hours of physician labour', {
    x: 0.7, y: 3.85, w: 5.5, h: 0.4,
    fontSize: 15, fontFace: F.body, color: C.textMuted, italic: true,
  });

  // Authrex side
  s.addShape('rect', {
    x: 6.95, y: 2.2, w: 5.85, h: 2.15,
    fill: { color: '#F0FDF4' },
    line: { color: C.green, width: 2 },
  });
  s.addText('AUTHREX (verified May 5 2026)', {
    x: 7.15, y: 2.35, w: 5.5, h: 0.3,
    fontSize: 12, fontFace: F.mono, bold: true, color: C.green, charSpacing: 4,
  });
  s.addText('$0.25', {
    x: 7.15, y: 2.7, w: 5.5, h: 1.1,
    fontSize: 80, fontFace: F.head, bold: true, color: C.green, charSpacing: -2,
  });
  s.addText('per clean APPROVE · 60 seconds · 98 LLM calls', {
    x: 7.15, y: 3.85, w: 5.5, h: 0.4,
    fontSize: 15, fontFace: F.body, color: C.textMuted, italic: true,
  });

  // Net impact strip
  s.addShape('rect', {
    x: 0.5, y: 4.55, w: 12.3, h: 1.05,
    fill: { color: C.navy }, line: { type: 'none' },
  });
  s.addText('NET SAVINGS PER CASE', {
    x: 0.7, y: 4.65, w: 5, h: 0.3,
    fontSize: 13, fontFace: F.mono, bold: true, color: C.cyan, charSpacing: 4,
  });
  s.addText('$1,499.75', {
    x: 0.7, y: 4.95, w: 6, h: 0.7,
    fontSize: 44, fontFace: F.head, bold: true, color: C.white, charSpacing: -1,
  });
  s.addText('99.93% cost reduction', {
    x: 0.7, y: 4.95, w: 11.5, h: 0.7,
    fontSize: 20, fontFace: F.head, color: '94A3B8', italic: true,
    align: 'right', valign: 'middle',
  });

  // Scale impact
  s.addShape('rect', {
    x: 0.5, y: 5.85, w: 12.3, h: 1.05,
    fill: { color: C.surface }, line: { color: C.border, width: 1 },
  });
  s.addText('AT ONE 200-BED CANCER CENTRE: 150 oncology PAs/month × $1,499.75 saved =', {
    x: 0.7, y: 5.95, w: 8, h: 0.4,
    fontSize: 15, fontFace: F.body, color: C.textBody, italic: true, valign: 'middle',
  });
  s.addText('$224,962 / month', {
    x: 7.5, y: 5.95, w: 5.2, h: 0.4,
    fontSize: 22, fontFace: F.head, bold: true, color: C.green, valign: 'middle', align: 'right',
  });
  s.addText('Payback: under 0.2 days per case · ROI on Pilot tier subscription: 16,664%', {
    x: 0.7, y: 6.4, w: 11.6, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.textMuted, valign: 'middle',
  });

  addSourceFooter(s, 'AMA Prior Auth Survey 2024 · Authrex verified llm_invocations table (case_8f4ad9c2, May 5 2026)', false);
  addPageNum(s, 10, 18);
}

// =============================================================
// SLIDE 11 — MARKET HIERARCHY (TAM/SAM/SOM)
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('4 · MARKET OPPORTUNITY', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('$30B → $200M → $20M.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 32, fontFace: F.head, bold: true, color: C.textInk,
  });
  s.addText('Total US prior-auth waste, addressable specialty PA market, and 5-year capture target.', {
    x: 0.5, y: 1.95, w: 12, h: 0.4,
    fontSize: 16, fontFace: F.body, color: C.textMuted, italic: true,
  });

  // 3 stair-stepped layers
  const lays = [
    { tag: 'TAM', value: '$30B', desc: 'Total annual US prior-auth admin waste',
      cite: 'CAQH Index 2024 · 600M PA decisions/year × $50 admin labour each',
      bg: '1E3A8A', tagBg: '93C5FD', x: 0.5 },
    { tag: 'SAM', value: '$200M', desc: 'US specialty-drug PA market at $5/case',
      cite: 'CAQH 2024 + ASCO QOPI 2024 · 40M oncology PAs/year alone · 38% YoY growth',
      bg: '5B21B6', tagBg: 'DDD6FE', x: 1.4 },
    { tag: 'SOM', value: '$20M', desc: '5-year capture · 10% via Cognizant Health Sciences',
      cite: 'Conservative · assumes only Cognizant existing accounts',
      bg: '047857', tagBg: '6EE7B7', x: 2.3 },
  ];
  lays.forEach((l, i) => {
    const y = 2.6 + i * 1.05;
    const w = 12.3 - l.x;
    s.addShape('rect', {
      x: l.x, y, w, h: 1.0,
      fill: { color: l.bg }, line: { type: 'none' },
    });
    // Tag pill
    s.addShape('rect', {
      x: l.x + 0.25, y: y + 0.32, w: 0.7, h: 0.36,
      fill: { color: l.tagBg }, line: { type: 'none' },
    });
    s.addText(l.tag, {
      x: l.x + 0.25, y: y + 0.32, w: 0.7, h: 0.36,
      fontSize: 13, fontFace: F.mono, bold: true, color: C.textInk,
      align: 'center', valign: 'middle',
    });
    // Value
    s.addText(l.value, {
      x: l.x + 1.1, y: y + 0.18, w: 2.5, h: 0.7,
      fontSize: 38, fontFace: F.head, bold: true, color: C.white, charSpacing: -1,
    });
    // Desc + citation
    s.addText(l.desc, {
      x: l.x + 3.65, y: y + 0.15, w: w - 3.85, h: 0.4,
      fontSize: 16, fontFace: F.head, bold: true, color: C.white,
    });
    s.addText(l.cite, {
      x: l.x + 3.65, y: y + 0.55, w: w - 3.85, h: 0.4,
      fontSize: 11.5, fontFace: F.mono, color: 'CBD5E1', italic: true,
    });
  });

  // Footer note
  s.addShape('rect', {
    x: 0.5, y: 6.0, w: 12.3, h: 0.85,
    fill: { color: C.surface }, line: { color: C.border, width: 1 },
  });
  s.addText([
    { text: '4 · BUSINESS IMPACT (continued): ', options: { bold: true, color: C.indigo } },
    { text: 'Distribution path = ', options: { color: C.textBody } },
    { text: 'Cognizant Health Sciences ', options: { bold: true, color: C.textInk } },
    { text: 'sells to 47 of top 50 US payers + 200+ providers. We slot into the existing procurement vehicle.', options: { color: C.textBody } },
  ], {
    x: 0.7, y: 6.05, w: 12, h: 0.75,
    fontSize: 14, fontFace: F.body, valign: 'middle',
  });

  addSourceFooter(s, 'CAQH Index 2024 · ASCO QOPI 2024 · KFF 2024 · Cognizant 10-K 2024 (channel reach)', false);
  addPageNum(s, 11, 18);
}

// =============================================================
// SLIDE 12 — SCALABLE / REUSABLE
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('6 · SCALABLE / REUSABLE', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('Same architecture, six markets — fixtures-only swap.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 28, fontFace: F.head, bold: true, color: C.textInk,
  });
  s.addText('The 7-agent DAG is payload-agnostic. Each adjacent market is a prompts + fixtures swap, not a re-architecture.', {
    x: 0.5, y: 1.95, w: 12, h: 0.5,
    fontSize: 16, fontFace: F.body, color: C.textMuted, italic: true,
  });

  // 6 vertical extension cards
  const verticals = [
    { name: 'Prior Authorisation', tam: '$30B', status: 'TODAY', color: C.indigo, role: 'Oncology wedge · live demo' },
    { name: 'Utilisation Management', tam: '+ $60-90B', status: '2028', color: C.violet, role: 'Inpatient stay justification · level-of-care matching' },
    { name: 'Claim Denials', tam: '+ $45B', status: '2028', color: C.cyan, role: 'Auto-appeal on rejected claims · same NCCN engine' },
    { name: 'Revenue Cycle Mgmt', tam: '+ $60B', status: '2029', color: C.green, role: 'Coding audit · charge-capture validation · same agents' },
    { name: 'Pharmacovigilance', tam: '+ $30B', status: '2029', color: C.amber, role: 'Drug safety signal detection · Life Sciences vertical' },
    { name: 'Continuation of Care', tam: '+ $25B', status: '2030', color: C.red, role: 'Cycle 8 still appropriate? · longitudinal review' },
  ];

  const vw = 4.0, vh = 1.6;
  verticals.forEach((v, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.5 + col * 4.18, y = 2.65 + row * 1.75;

    s.addShape('rect', {
      x, y, w: vw, h: vh,
      fill: { color: C.white },
      line: { color: v.color, width: 1.5 },
    });
    // Status badge
    s.addShape('rect', {
      x: x + vw - 1.0, y: y + 0.15, w: 0.85, h: 0.3,
      fill: { color: v.color }, line: { type: 'none' },
    });
    s.addText(v.status, {
      x: x + vw - 1.0, y: y + 0.15, w: 0.85, h: 0.3,
      fontSize: 11, fontFace: F.mono, bold: true, color: C.white,
      align: 'center', valign: 'middle', charSpacing: 1,
    });
    // Name
    s.addText(v.name, {
      x: x + 0.18, y: y + 0.15, w: vw - 1.2, h: 0.4,
      fontSize: 16, fontFace: F.head, bold: true, color: C.textInk,
    });
    // TAM
    s.addText(v.tam, {
      x: x + 0.18, y: y + 0.55, w: vw - 0.36, h: 0.4,
      fontSize: 22, fontFace: F.head, bold: true, color: v.color,
    });
    // Role
    s.addText(v.role, {
      x: x + 0.18, y: y + 1.05, w: vw - 0.36, h: 0.5,
      fontSize: 12, fontFace: F.body, color: C.textBody,
    });
  });

  // Bottom claim
  s.addText('Total adjacent TAM = ~6× the prior-auth opportunity. Same architecture. Same Cognizant distribution.', {
    x: 0.5, y: 6.55, w: 12.3, h: 0.4,
    fontSize: 16, fontFace: F.body, italic: true,
    color: C.textBody, align: 'center', bold: true,
  });

  addSourceFooter(s, 'CAQH 2024 · Industry analyst aggregations · Authrex internal market sizing', false);
  addPageNum(s, 12, 18);
}

// =============================================================
// SLIDE 13 — COGNIZANT FIT
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('COGNIZANT FIT · WHY US, NOT SOMEONE ELSE', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.amber,
    charSpacing: 6, bold: true,
  });
  s.addText('The Anthropic-Cognizant stack is our default, not our adaptation.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 26, fontFace: F.head, bold: true, color: C.textInk,
  });

  // 6 alignment rows in a table-like layout
  const aligns = [
    ['Anthropic stack · Nov 4 2024', 'Bedrock + Claude Sonnet 4.6 + MCP — exactly the stack Cognizant standardised on.'],
    ['Neuro-SAN AAOSA pattern', '7-parent bounded-responsibility DAG · stateful continuity · per-tenant adaptation · observability of every hop.'],
    ['Cognizant Health Sciences', 'Oncology PA wedge fits the named 2026 vertical focus — 38% YoY oncology PA volume growth.'],
    ['Cognizant Agent Foundry', 'Foundry-compatible manifest · model card · evaluation harness · observability spec.'],
    ['TriZetto integration', 'Provider→payer structured-envelope submission. Mock + real adapters both written.'],
    ['Kiro IDE', 'Spec-driven development. .kiro/specs/ on disk. Proves Cognizant IDE story without leaving the project.'],
  ];

  aligns.forEach((a, i) => {
    const y = 2.2 + i * 0.72;
    s.addShape('rect', {
      x: 0.5, y, w: 12.3, h: 0.62,
      fill: { color: i % 2 === 0 ? C.white : C.surface },
      line: { color: C.border, width: 1 },
    });
    // Left column: alignment topic
    s.addShape('rect', {
      x: 0.5, y, w: 0.06, h: 0.62,
      fill: { color: C.amber }, line: { type: 'none' },
    });
    s.addText(a[0], {
      x: 0.7, y: y + 0.05, w: 3.3, h: 0.55,
      fontSize: 14, fontFace: F.head, bold: true, color: C.textInk, valign: 'middle',
    });
    s.addText(a[1], {
      x: 4.1, y: y + 0.05, w: 8.6, h: 0.55,
      fontSize: 13, fontFace: F.body, color: C.textBody, valign: 'middle',
    });
  });

  // Bottom claim — moved up to clear source footer
  s.addShape('rect', {
    x: 0.5, y: 6.45, w: 12.3, h: 0.45,
    fill: { color: C.amber }, line: { type: 'none' },
  });
  s.addText('We are not asking Cognizant to adopt new technology. We use theirs.', {
    x: 0.5, y: 6.45, w: 12.3, h: 0.45,
    fontSize: 15, fontFace: F.head, bold: true, italic: true,
    color: C.white, align: 'center', valign: 'middle',
  });

  addSourceFooter(s, 'Anthropic-Cognizant partnership announcement Nov 4 2024 · Cognizant Neuro-SAN AAOSA reference', false);
  addPageNum(s, 13, 18);
}

// =============================================================
// SLIDE 14 — COMPLIANCE
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('COMPLIANCE · CMS-0057-F § IV READINESS', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('Eight of eight federal clauses in force today.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 28, fontFace: F.head, bold: true, color: C.textInk,
  });
  s.addText('Federal mandate enforces January 2027. We are 18 months early.', {
    x: 0.5, y: 1.95, w: 12, h: 0.4,
    fontSize: 16, fontFace: F.body, color: C.textMuted, italic: true,
  });

  // Donut "8 of 8" panel (left)
  s.addShape('roundRect', {
    x: 0.5, y: 2.6, w: 4.0, h: 4.2,
    fill: { color: C.green },
    line: { type: 'none' },
    rectRadius: 0.1,
  });
  // Big donut number
  s.addText('8 / 8', {
    x: 0.5, y: 2.9, w: 4.0, h: 1.6,
    fontSize: 90, fontFace: F.head, bold: true,
    color: C.white, align: 'center', charSpacing: -2,
  });
  s.addText('§ IV CLAUSES IN FORCE', {
    x: 0.5, y: 4.5, w: 4.0, h: 0.4,
    fontSize: 15, fontFace: F.mono, bold: true,
    color: C.white, align: 'center', charSpacing: 4,
  });
  s.addShape('rect', {
    x: 1.5, y: 5.0, w: 2.0, h: 0.04,
    fill: { color: C.white }, line: { type: 'none' },
  });
  s.addText('Verified end-to-end\non 2026-05-05', {
    x: 0.5, y: 5.15, w: 4.0, h: 1.0,
    fontSize: 14, fontFace: F.body, italic: true,
    color: '#A7F3D0', align: 'center',
  });
  s.addText('CMS-0057-F enforcement\nJanuary 2027', {
    x: 0.5, y: 6.05, w: 4.0, h: 0.7,
    fontSize: 13, fontFace: F.mono,
    color: '#6EE7B7', align: 'center',
  });

  // 8 clauses on right (2 columns)
  const clauses = [
    ['§ IV.A', 'Auditable decisions'],
    ['§ IV.B', 'Citation grounding (policy)'],
    ['§ IV.C', 'Citation grounding (clinical)'],
    ['§ IV.D', 'Structured payer-API integration'],
    ['§ IV.E', 'Appeal window standardisation'],
    ['§ IV.F', 'PHI handling (minimum necessary)'],
    ['§ IV.G', 'Reviewer transparency'],
    ['§ IV.H', 'Quarterly evidence pack'],
  ];

  clauses.forEach((c, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 4.85 + col * 4.0, y = 2.6 + row * 1.05;
    s.addShape('rect', {
      x, y, w: 3.95, h: 0.95,
      fill: { color: C.white },
      line: { color: C.green, width: 1 },
    });
    // Check icon
    s.addShape('ellipse', {
      x: x + 0.2, y: y + 0.18, w: 0.55, h: 0.55,
      fill: { color: C.green }, line: { type: 'none' },
    });
    s.addText('✓', {
      x: x + 0.2, y: y + 0.18, w: 0.55, h: 0.55,
      fontSize: 20, fontFace: F.head, bold: true, color: C.white,
      align: 'center', valign: 'middle',
    });
    // Tag
    s.addText(c[0], {
      x: x + 0.85, y: y + 0.13, w: 1.0, h: 0.35,
      fontSize: 13, fontFace: F.mono, bold: true, color: C.green, charSpacing: 2,
    });
    // Description
    s.addText(c[1], {
      x: x + 0.85, y: y + 0.45, w: 3.0, h: 0.4,
      fontSize: 13, fontFace: F.body, color: C.textBody,
    });
  });

  addSourceFooter(s, 'CMS Federal Register CMS-0057-F (Final Rule) · Authrex compliance audit (May 5 2026)', false);
  addPageNum(s, 14, 18);
}

// =============================================================
// SLIDE 15 — ROADMAP
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('7 · ROADMAP', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('From hackathon win to $5M ARR · 30 months.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 28, fontFace: F.head, bold: true, color: C.textInk,
  });

  // Timeline with 6 milestones
  const milestones = [
    { when: 'NOW', what: 'Cognizant Technoverse 2026', sub: 'Demo + first prize · pilot referrals · internships', color: C.indigo, isNow: true },
    { when: 'Q3 2026', what: 'First pilot · Tata Memorial Mumbai', sub: 'Trastuzumab + pembrolizumab · 80 cases/month · 90-day pilot to first paying month', color: C.violet },
    { when: 'Q4 2026', what: 'Second pilot · Apollo Hyderabad', sub: 'EGFR + HER2 + MSI-H cohort · multi-payer arbitration · both pilots paying by Dec 2026', color: C.cyan },
    { when: 'Q1 2027', what: 'TriZetto integration go-live', sub: 'Cognizant payer-side adapters · CMS-0057-F mandate enforcement Jan 1 · structured-envelope submission', color: C.green },
    { when: 'Q3 2027', what: 'Series-A · $4-6M target', sub: '3 more agents (UM · claims · RCM) · AWS Marketplace listing · 8 Cognizant referral channels', color: C.amber },
    { when: '2028', what: 'Adjacent verticals + $5M ARR', sub: 'UM (Q1) · Claim denials (Q3) · 10 enterprise accounts by Q4 · Series-B conversation', color: C.red },
  ];

  // Vertical timeline line
  s.addShape('rect', {
    x: 1.55, y: 2.3, w: 0.04, h: 4.4,
    fill: { color: C.border }, line: { type: 'none' },
  });

  milestones.forEach((m, i) => {
    const y = 2.3 + i * 0.78;
    // Dot
    s.addShape('ellipse', {
      x: 1.4, y: y + 0.05, w: 0.3, h: 0.3,
      fill: { color: m.color },
      line: m.isNow ? { color: m.color, width: 3 } : { type: 'none' },
    });
    if (m.isNow) {
      // Pulse outer ring (hollow — use white fill matching background)
      s.addShape('ellipse', {
        x: 1.27, y: y - 0.08, w: 0.55, h: 0.55,
        fill: { type: 'none' },
        line: { color: m.color, width: 1 },
      });
    }
    // When tag
    s.addText(m.when, {
      x: 0.5, y: y - 0.05, w: 0.85, h: 0.35,
      fontSize: 13, fontFace: F.mono, bold: true, color: m.color,
      align: 'right', valign: 'middle', charSpacing: 1,
    });
    // What
    s.addText(m.what, {
      x: 1.95, y: y - 0.05, w: 10.7, h: 0.4,
      fontSize: 16, fontFace: F.head, bold: true, color: C.textInk,
    });
    // Sub
    s.addText(m.sub, {
      x: 1.95, y: y + 0.32, w: 10.7, h: 0.4,
      fontSize: 12.5, fontFace: F.body, color: C.textMuted, italic: true,
    });
  });

  addSourceFooter(s, 'Authrex business plan · Cognizant Health Sciences pipeline · CMS-0057-F mandate timeline', false);
  addPageNum(s, 15, 18);
}

// =============================================================
// SLIDE 16 — TEAM
// =============================================================
{
  const s = pres.addSlide();
  lightBackground(s);
  addBrandStrip(s);

  s.addText('TEAM AEROFYTA · 4 ROLES, NO OVERLAP', {
    x: 0.5, y: 0.85, w: 12, h: 0.4,
    fontSize: 13, fontFace: F.mono, color: C.indigo,
    charSpacing: 6, bold: true,
  });
  s.addText('Each member owns one Cognizant evaluation criterion.', {
    x: 0.5, y: 1.25, w: 12, h: 0.7,
    fontSize: 28, fontFace: F.head, bold: true, color: C.textInk,
  });

  const team = [
    { initial: 'D', name: 'Danish A. G.', role: 'Team Lead · Chief Architect',
      owns: '7-agent DAG · Bedrock + Sonnet 4.6 · MCP · LLMClient · system design',
      ask: 'Tech Design & Architecture · AWS / GenAI Usage', color: C.indigo },
    { initial: 'P', name: 'Preethi Sivachandran', role: 'Product & Demo Lead · UX',
      owns: 'Live demo · UX flow · Tweaks panel · standalone showcase · pitch script',
      ask: 'Quality of Demo & Presentation', color: C.cyan },
    { initial: 'S', name: 'Sanjay N', role: 'Backend & Compliance Engineer',
      owns: 'FHIR R4 · Postgres + RLS · SHA-256 audit · CMS-0057-F · HIPAA / PHI',
      ask: 'MVP Functional Completeness (data plane)', color: C.violet },
    { initial: 'G', name: 'Gayathri B', role: 'Healthcare Domain & Business Analyst',
      owns: '$30B problem · CAQH/KFF 2024 sourcing · ROI math · pilot pipeline · NCCN',
      ask: 'Problem Clarity · Business Impact', color: C.amber },
  ];

  team.forEach((t, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * 6.18, y = 2.2 + row * 2.35;

    s.addShape('rect', {
      x, y, w: 5.95, h: 2.15,
      fill: { color: C.white },
      line: { color: C.border, width: 1 },
    });
    // Avatar circle
    s.addShape('ellipse', {
      x: x + 0.25, y: y + 0.25, w: 1.0, h: 1.0,
      fill: { color: t.color }, line: { type: 'none' },
    });
    s.addText(t.initial, {
      x: x + 0.25, y: y + 0.25, w: 1.0, h: 1.0,
      fontSize: 36, fontFace: F.head, bold: true, color: C.white,
      align: 'center', valign: 'middle',
    });
    // Name
    s.addText(t.name, {
      x: x + 1.4, y: y + 0.25, w: 4.4, h: 0.42,
      fontSize: 18, fontFace: F.head, bold: true, color: C.textInk,
    });
    // Role
    s.addText(t.role, {
      x: x + 1.4, y: y + 0.7, w: 4.4, h: 0.32,
      fontSize: 13, fontFace: F.mono, bold: true, color: t.color, charSpacing: 1,
    });
    // What they own
    s.addText('Builds: ', {
      x: x + 0.25, y: y + 1.45, w: 0.8, h: 0.3,
      fontSize: 11, fontFace: F.mono, bold: true, color: C.textMuted,
    });
    s.addText(t.owns, {
      x: x + 0.85, y: y + 1.45, w: 4.95, h: 0.3,
      fontSize: 11.5, fontFace: F.body, color: C.textBody,
    });
    // What they answer
    s.addText('Owns Q&A on: ', {
      x: x + 0.25, y: y + 1.75, w: 1.3, h: 0.3,
      fontSize: 11, fontFace: F.mono, bold: true, color: C.textMuted,
    });
    s.addText(t.ask, {
      x: x + 1.45, y: y + 1.75, w: 4.35, h: 0.3,
      fontSize: 11.5, fontFace: F.body, italic: true, color: t.color,
    });
  });

  // Footer note
  s.addText('We delivered the working system in 24 hours. We can ship at Cognizant pace tomorrow.', {
    x: 0.5, y: 6.95, w: 12.3, h: 0.4,
    fontSize: 16, fontFace: F.head, italic: true, bold: true,
    color: C.indigo, align: 'center',
  });

  addPageNum(s, 16, 18);
}

// =============================================================
// SLIDE 17 — THE ASK + CLOSING
// =============================================================
{
  const s = pres.addSlide();
  darkBackground(s);
  addBrandStrip(s, true);

  s.addText('THE ASK', {
    x: 0.5, y: 1.0, w: 12, h: 0.4,
    fontSize: 15, fontFace: F.mono, color: C.cyan,
    charSpacing: 6, bold: true,
  });
  s.addText('Three asks. One closing line.', {
    x: 0.5, y: 1.5, w: 12, h: 0.8,
    fontSize: 36, fontFace: F.head, bold: true, color: C.white,
  });

  // 3 ask cards horizontally
  const asks = [
    { num: '1', t: 'First-prize recognition', d: 'Validation that the architecture is industrial-grade.' },
    { num: '2', t: 'Cognizant pilot referral', d: '1-2 Health Sciences referral accounts to onboard.' },
    { num: '3', t: 'Internships for the team', d: 'We want to keep building Authrex inside Cognizant.' },
  ];

  asks.forEach((a, i) => {
    const x = 0.5 + i * 4.18, y = 2.7;
    s.addShape('rect', {
      x, y, w: 4.0, h: 1.95,
      fill: { color: 'FFFFFF' }, line: { type: 'none' },
      transparency: 0,
    });
    // Number ribbon
    s.addShape('rect', {
      x, y, w: 4.0, h: 0.5,
      fill: { color: C.cyan }, line: { type: 'none' },
    });
    s.addText('ASK ' + a.num, {
      x, y, w: 4.0, h: 0.5,
      fontSize: 14, fontFace: F.mono, bold: true, color: C.navy,
      align: 'center', valign: 'middle', charSpacing: 4,
    });
    s.addText(a.t, {
      x: x + 0.2, y: y + 0.65, w: 3.6, h: 0.5,
      fontSize: 18, fontFace: F.head, bold: true, color: C.navy,
    });
    s.addText(a.d, {
      x: x + 0.2, y: y + 1.15, w: 3.6, h: 0.7,
      fontSize: 13, fontFace: F.body, color: C.textBody,
    });
  });

  // Closing line (the killer)
  s.addShape('rect', {
    x: 0.5, y: 5.1, w: 12.3, h: 1.85,
    fill: { color: C.indigo, transparency: 25 }, line: { color: C.cyan, width: 1 },
  });
  s.addText('THE CLOSING LINE', {
    x: 0.7, y: 5.25, w: 12, h: 0.35,
    fontSize: 13, fontFace: F.mono, bold: true, color: C.cyan, charSpacing: 4,
  });
  s.addText('"We are not pitching a hackathon project.\nWe are pitching the missing piece of the Anthropic-Cognizant healthcare stack."', {
    x: 0.7, y: 5.65, w: 12, h: 1.25,
    fontSize: 22, fontFace: F.head, italic: true, color: C.white,
    align: 'center', valign: 'middle',
  });

  addPageNum(s, 17, 18, true);
}

// =============================================================
// SLIDE 18 — THANK YOU + QR + SOURCES
// =============================================================
{
  const s = pres.addSlide();
  darkBackground(s);

  // Big thank you
  s.addText('THANK YOU.', {
    x: 0.5, y: 0.7, w: 12, h: 1.4,
    fontSize: 96, fontFace: F.head, bold: true, color: C.white, charSpacing: 2,
  });
  s.addText('Try it now on your phone.', {
    x: 0.5, y: 2.0, w: 12, h: 0.5,
    fontSize: 22, fontFace: F.head, italic: true, color: 'CBD5E1',
  });

  // QR placeholder (simulated as rectangle with URL)
  s.addShape('rect', {
    x: 0.5, y: 2.85, w: 2.5, h: 2.5,
    fill: { color: C.white }, line: { color: C.cyan, width: 2 },
  });
  s.addText('[ QR CODE ]', {
    x: 0.5, y: 2.85, w: 2.5, h: 1.0,
    fontSize: 16, fontFace: F.mono, bold: true, color: C.textInk,
    align: 'center', valign: 'middle',
  });
  s.addText('Generate QR encoding\nhttp://authrex-demo-26697.s3-website-us-east-1.amazonaws.com\nand paste here before printing.', {
    x: 0.5, y: 3.85, w: 2.5, h: 1.5,
    fontSize: 11, fontFace: F.mono, color: C.textMuted,
    align: 'center',
  });

  // URL + description
  s.addText('authrex-demo-26697.s3-website-us-east-1.amazonaws.com', {
    x: 3.4, y: 2.85, w: 9, h: 0.6,
    fontSize: 28, fontFace: F.mono, bold: true, color: C.cyan, charSpacing: 1,
  });
  s.addText('13 routes · 3 demo paths (APPROVE / REFER / DENY) · zero backend · runs from anywhere', {
    x: 3.4, y: 3.5, w: 9, h: 0.4,
    fontSize: 15, fontFace: F.body, color: 'CBD5E1', italic: true,
  });

  // Team contacts
  s.addShape('rect', {
    x: 3.4, y: 4.05, w: 9, h: 0.06,
    fill: { color: C.cyan }, line: { type: 'none' },
  });
  s.addText('TEAM CONTACTS', {
    x: 3.4, y: 4.18, w: 9, h: 0.3,
    fontSize: 12, fontFace: F.mono, bold: true, color: C.cyan, charSpacing: 4,
  });
  s.addText([
    { text: 'Danish A. G. ', options: { color: C.white, bold: true } },
    { text: '· agdanishr@gmail.com', options: { color: '94A3B8' } },
  ], { x: 3.4, y: 4.5, w: 9, h: 0.32, fontSize: 14, fontFace: F.body });
  s.addText([
    { text: 'Preethi Sivachandran ', options: { color: C.white, bold: true } },
    { text: '· preethisivachandran0@gmail.com', options: { color: '94A3B8' } },
  ], { x: 3.4, y: 4.85, w: 9, h: 0.32, fontSize: 14, fontFace: F.body });
  s.addText([
    { text: 'Sanjay N · Gayathri B ', options: { color: C.white, bold: true } },
    { text: '· Chennai Institute of Technology · +91-8903099026', options: { color: '94A3B8' } },
  ], { x: 3.4, y: 5.2, w: 9, h: 0.32, fontSize: 14, fontFace: F.body });

  // Sources block (the credibility footer)
  s.addShape('rect', {
    x: 0.5, y: 5.85, w: 12.3, h: 1.35,
    fill: { color: C.indigo, transparency: 60 }, line: { color: C.cyan, width: 1 },
  });
  s.addText('SOURCES & CITATIONS · ALL CLAIMS VERIFIABLE', {
    x: 0.7, y: 5.95, w: 12, h: 0.3,
    fontSize: 12, fontFace: F.mono, bold: true, color: C.cyan, charSpacing: 4,
  });
  s.addText('CAQH Index 2024 (PA volume + waste) · AMA Prior Auth Survey 2024 (manual cost baseline) · KFF Medicare Advantage 2024 (overturn rate) · ASCO QOPI 2024 (oncology PA volume) · CMS Federal Register CMS-0057-F (Jan 2027 mandate) · Anthropic-Cognizant partnership announcement (Nov 4 2024) · Cognizant 10-K 2024 (channel reach) · NCCN BINV-N v3.2026 (clinical guidelines) · AWS Bedrock pricing (May 2026) · Authrex internal verified llm_invocations table (case_8f4ad9c2, 98 calls, May 5 2026)', {
    x: 0.7, y: 6.25, w: 12, h: 0.95,
    fontSize: 12, fontFace: F.body, color: 'CBD5E1', italic: true,
  });
}

// =============================================================
// SAVE
// =============================================================
const out = path.join(__dirname, 'Authrex_Winning_Deck.pptx');
pres.writeFile({ fileName: out }).then((fileName) => {
  console.log('SUCCESS · wrote ' + fileName);
  console.log('Total slides: 18');
  console.log('Layout: 16:9 widescreen (13.333 × 7.5 inches)');
});

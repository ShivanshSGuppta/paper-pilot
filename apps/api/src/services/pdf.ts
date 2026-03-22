import { chromium } from "playwright";
import fs from "node:fs";

function resolveChromiumExecutablePath() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_PATH,
    process.env.CHROMIUM_PATH,
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  ].filter((value): value is string => Boolean(value));

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? undefined;
}

const layoutStyles = `
  @page {
    size: A4;
    margin: 16mm 14mm 18mm;
  }
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    color: #111827;
    margin: 0;
    background: white;
  }
  .paper {
    width: 100%;
    max-width: 100%;
  }
  .header {
    text-align: center;
    margin-bottom: 14px;
    border-bottom: 2px solid #111827;
    padding-bottom: 10px;
  }
  .header .school {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    margin-top: 8px;
    font-size: 12px;
  }
  .chips { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 8px; }
  .chip {
    border: 1px solid #d1d5db;
    border-radius: 999px;
    padding: 4px 10px;
    font-size: 11px;
    background: #f9fafb;
  }
  .student-box {
    border: 1px solid #d1d5db;
    border-radius: 12px;
    padding: 10px 12px;
    margin: 14px 0 18px;
    font-size: 12px;
  }
  .student-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .line { border-bottom: 1px dashed #9ca3af; min-height: 16px; margin-top: 4px; }
  .section {
    break-inside: avoid;
    margin-bottom: 16px;
  }
  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    border-left: 4px solid #f97316;
    padding-left: 10px;
    margin-bottom: 8px;
  }
  .section-title h2 {
    margin: 0;
    font-size: 15px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .section-title p {
    margin: 0;
    font-size: 11px;
    color: #4b5563;
  }
  .question {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #e5e7eb;
    page-break-inside: avoid;
  }
  .question:last-child { border-bottom: 0; }
  .q-text {
    font-size: 13px;
    line-height: 1.55;
  }
  .q-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    min-width: 72px;
  }
  .badge {
    border-radius: 999px;
    font-size: 10px;
    padding: 3px 8px;
    border: 1px solid #d1d5db;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .easy { background: #ecfdf5; color: #047857; }
  .medium { background: #fff7ed; color: #c2410c; }
  .hard { background: #fef2f2; color: #b91c1c; }
  .marks {
    font-size: 11px;
    color: #111827;
    font-weight: 700;
  }
  .instructions {
    font-size: 12px;
    color: #374151;
    margin-bottom: 10px;
    padding: 8px 10px;
    border: 1px dashed #d1d5db;
    border-radius: 10px;
    background: #fafafa;
  }
`;

export function renderAssessmentHtml(payload: {
  title: string;
  schoolName: string;
  subject: string;
  className: string;
  durationMinutes: number;
  maximumMarks: number;
  instructions?: string[];
  sections: Array<{
    title: string;
    instruction: string;
    questions: Array<{ text: string; difficulty: string; marks: number; type: string }>;
  }>;
  answerKey?: Array<{ questionRef?: string; answer: string }>;
}, options?: { includeAnswerKey?: boolean; teacherMode?: boolean }) {
  const teacherMode = options?.teacherMode ?? false;
  const includeAnswerKey = options?.includeAnswerKey ?? teacherMode;

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>${layoutStyles}</style>
    </head>
    <body>
      <div class="paper">
        <div class="header">
          <div class="school">${payload.schoolName}</div>
          <div class="chips">
            <span class="chip">${payload.subject}</span>
            <span class="chip">Class ${payload.className}</span>
            <span class="chip">Time Allowed: ${payload.durationMinutes} mins</span>
            <span class="chip">Maximum Marks: ${payload.maximumMarks}</span>
          </div>
          <div class="meta-grid">
            <div></div>
            <div>${payload.title}</div>
          </div>
        </div>
        <div class="student-box">
          <div class="student-row">
            <div>Name<div class="line"></div></div>
            <div>Roll Number<div class="line"></div></div>
            <div>Section<div class="line"></div></div>
          </div>
        </div>
        <div class="instructions">
          ${(payload.instructions?.length ? payload.instructions : ["Read all questions carefully.", "Write answers neatly."]).map((item) => `<div>${item}</div>`).join("")}
        </div>
        ${payload.sections
          .map(
            (section) => `
              <div class="section">
                <div class="section-title">
                  <h2>${section.title}</h2>
                  <p>${section.instruction}</p>
                </div>
                ${section.questions
                  .map(
                    (question, index) => `
                      <div class="question">
                        <div class="q-text">${index + 1}. ${question.text}</div>
                        <div class="q-meta">
                          <span class="badge ${question.difficulty}">${question.difficulty}</span>
                          <span class="marks">${question.marks} marks</span>
                        </div>
                      </div>
                    `
                  )
                  .join("")}
              </div>
            `
          )
          .join("")}
        ${includeAnswerKey && payload.answerKey?.length ? `<div class="section"><div class="section-title"><h2>Answer Key</h2><p>Teacher reference only</p></div>${payload.answerKey.map((item, index) => `<div class="question"><div class="q-text">${index + 1}. ${item.answer}</div><div class="q-meta"><span class="badge medium">key</span></div></div>`).join("")}</div>` : ""}
      </div>
    </body>
  </html>`;
}

export async function htmlToPdfBuffer(html: string) {
  const browser = await chromium.launch({
    headless: true,
    executablePath: resolveChromiumExecutablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1240, height: 1754 }
    });
    await page.setContent(html, { waitUntil: "networkidle" });
    return await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" }
    });
  } finally {
    await browser.close();
  }
}

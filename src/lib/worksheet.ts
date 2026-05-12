import { jsPDF } from "jspdf";

function pickProblems(count: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const isAddition = Math.random() < 0.6;
    if (isAddition) {
      const a = Math.floor(Math.random() * 20);
      const b = Math.floor(Math.random() * 20);
      out.push(`${a} + ${b} =`);
    } else {
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * (a + 1));
      out.push(`${a} − ${b} =`);
    }
  }
  return out;
}

export function generateWorksheet(): Blob {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("GanitAR Practice Worksheet", pageW / 2, 60, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(115, 103, 92);
  doc.text("Name: ____________________", 72, 90);
  doc.text("Date: ____________", pageW - 200, 90);

  const cols = 3;
  const rows = 4;
  const problems = pickProblems(cols * rows);
  const gridTop = 130;
  const gridBottom = pageH - 80;
  const gridLeft = 72;
  const gridRight = pageW - 72;
  const cellW = (gridRight - gridLeft) / cols;
  const cellH = (gridBottom - gridTop) / rows;

  doc.setDrawColor(220, 215, 205);
  doc.setLineWidth(0.5);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const x = gridLeft + c * cellW;
      const y = gridTop + r * cellH;
      doc.rect(x + 4, y + 4, cellW - 8, cellH - 8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(24, 50, 74);
      doc.text(problems[i], x + cellW / 2, y + cellH / 2 + 8, {
        align: "center",
      });
    }
  }

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(160, 150, 138);
  doc.text(
    "Scan or open in GanitAR to check your answers — no accounts, no tracking.",
    pageW / 2,
    pageH - 40,
    { align: "center" },
  );

  return doc.output("blob");
}

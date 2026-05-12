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
      out.push(`${a} - ${b} =`);
    }
  }
  return out;
}

export function generateWorksheet(): Blob {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const leftMargin = 72;
  const rightMargin = 72;
  const contentLeft = leftMargin;
  const contentRight = pageW - rightMargin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("GanitAR Practice Worksheet", pageW / 2, 60, {
    align: "center",
    baseline: "alphabetic",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(115, 103, 92);
  doc.text("Name: ____________________", contentLeft, 92, {
    align: "left",
    baseline: "alphabetic",
  });
  doc.text("Date: ____________", contentRight, 92, {
    align: "right",
    baseline: "alphabetic",
  });

  const cols = 3;
  const rows = 4;
  const problems = pickProblems(cols * rows);
  const gridTop = 120;
  const gridBottom = pageH - 80;
  const cellW = (contentRight - contentLeft) / cols;
  const cellH = (gridBottom - gridTop) / rows;

  doc.setDrawColor(220, 215, 205);
  doc.setLineWidth(0.5);

  const problemFontSize = 26;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const x = contentLeft + c * cellW;
      const y = gridTop + r * cellH;
      doc.rect(x + 6, y + 6, cellW - 12, cellH - 12);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(problemFontSize);
      doc.setTextColor(24, 50, 74);
      doc.text(problems[i], x + cellW / 2, y + cellH / 2, {
        align: "center",
        baseline: "middle",
      });
    }
  }

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(160, 150, 138);
  doc.text(
    "Scan or open in GanitAR to check your answers. No accounts, no tracking.",
    pageW / 2,
    pageH - 40,
    { align: "center", baseline: "alphabetic" },
  );

  return doc.output("blob");
}

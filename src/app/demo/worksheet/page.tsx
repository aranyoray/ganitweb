import type { Metadata } from "next";
import DemoLayout from "@/components/demos/DemoLayout";
import WorksheetDemo from "@/components/demos/WorksheetDemo";

export const metadata: Metadata = {
  title: "Practice worksheet PDF",
  description:
    "Generate the same 3×4 practice worksheet the GanitAR iOS app prints — right in your browser, no install needed.",
};

export default function WorksheetDemoPage() {
  return (
    <DemoLayout
      title="Practice worksheet PDF"
      description="Generates the same 3×4 grid of practice problems the iOS app prints. Preview, regenerate, or download as PDF."
    >
      <WorksheetDemo />
    </DemoLayout>
  );
}

import type { Metadata } from "next";
import DemoLayout from "@/components/demos/DemoLayout";
import ParserDemo from "@/components/demos/ParserDemo";

export const metadata: Metadata = {
  title: "Expression parser",
  description:
    "Live demo of the exact grammar the GanitAR iOS app uses to validate scanned and spoken math problems.",
};

export default function ParserDemoPage() {
  return (
    <DemoLayout
      title="Expression parser"
      description="The exact pure-Swift grammar from the iOS app, ported to TypeScript. Type or click a sample to see how it parses — including the five named error cases."
    >
      <ParserDemo />
    </DemoLayout>
  );
}

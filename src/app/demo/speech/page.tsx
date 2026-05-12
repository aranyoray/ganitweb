import type { Metadata } from "next";
import DemoLayout from "@/components/demos/DemoLayout";
import SpeechDemo from "@/components/demos/SpeechDemo";

export const metadata: Metadata = {
  title: "Voice input",
  description:
    "Say a math problem out loud. The browser converts words to digits using the same parser the iOS app uses, then runs it through the expression grammar.",
};

export default function SpeechDemoPage() {
  return (
    <DemoLayout
      title="Voice input"
      description={`Click the button, say a math problem like "twenty plus seven" or "fifteen minus four", and watch the number-word parser turn it into digits and run it through the expression grammar.`}
    >
      <SpeechDemo />
    </DemoLayout>
  );
}

import type { Metadata } from "next";
import DemoLayout from "@/components/demos/DemoLayout";
import SubtractionDemo from "@/components/demos/SubtractionDemo";

export const metadata: Metadata = {
  title: "Subtraction in color",
  description:
    "Blue cubes stay, red cubes leave. The visual semantics the iOS app uses for take-away.",
};

export default function SubtractionDemoPage() {
  return (
    <DemoLayout
      title="Subtraction in color"
      description="Set the starting count and how many to take away. Blue cubes stay. Red cubes leave. The visual semantics the iOS app uses for take-away."
    >
      <SubtractionDemo />
    </DemoLayout>
  );
}

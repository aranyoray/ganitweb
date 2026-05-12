import type { Metadata } from "next";
import DemoLayout from "@/components/demos/DemoLayout";
import PilesDemo from "@/components/demos/PilesDemo";

export const metadata: Metadata = {
  title: "Tap-to-combine piles",
  description:
    "Two piles of cubes. Tap one and watch it fly into the other — the same Bruner enactive gesture the iOS app uses for addition.",
};

export default function PilesDemoPage() {
  return (
    <DemoLayout
      title="Tap-to-combine piles"
      description="Two piles of cubes. Tap either one — pile B flies into pile A and the sum appears. Same gesture, same math as the iOS app's addition view."
    >
      <PilesDemo />
    </DemoLayout>
  );
}

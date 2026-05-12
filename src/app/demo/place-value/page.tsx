import type { Metadata } from "next";
import DemoLayout from "@/components/demos/DemoLayout";
import PlaceValueDemo from "@/components/demos/PlaceValueDemo";

export const metadata: Metadata = {
  title: "Place-value blocks",
  description:
    "Type any number 0–999 and watch hundreds flats, tens rods, and unit cubes assemble. Same Dienes base-10 manipulatives the iOS app renders in AR.",
};

export default function PlaceValueDemoPage() {
  return (
    <DemoLayout
      title="Place-value blocks"
      description="Type a number from 0 to 999. The browser shows the same Dienes base-10 manipulatives the iOS app renders in AR — flats for hundreds, rods for tens, cubes for units."
    >
      <PlaceValueDemo />
    </DemoLayout>
  );
}

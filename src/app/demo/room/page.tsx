import type { Metadata } from "next";
import DemoLayout from "@/components/demos/DemoLayout";
import RoomDemo from "@/components/demos/RoomDemo";

export const metadata: Metadata = {
  title: "3D Room mode",
  description:
    "A tiny virtual classroom in your browser. Combine piles, add or subtract, orbit the camera. No AR device needed — same Bruner gesture in 3D.",
};

export default function RoomDemoPage() {
  return (
    <DemoLayout
      title="3D Room mode"
      description="A virtual math room. Tap a pile to combine, drag to orbit, pinch to zoom. Designed for kids without an AR-capable device."
    >
      <RoomDemo />
    </DemoLayout>
  );
}

"use client";

import dynamic from "next/dynamic";
import type { CoolingSpot } from "@/generated/prisma";

const MapPreview = dynamic(() => import("@/components/public/MapPreview"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-lg border bg-muted animate-pulse" />
  ),
});

export default function MapPreviewWrapper({ spots }: { spots: CoolingSpot[] }) {
  return <MapPreview spots={spots} />;
}

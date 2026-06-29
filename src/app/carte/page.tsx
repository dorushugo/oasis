import { getOpenSpots } from "@/lib/queries";
import MapPageClient from "@/components/public/MapPageClient";

export const dynamic = "force-dynamic";

export default async function CartePage() {
  const spots = await getOpenSpots();

  return <MapPageClient spots={spots} />;
}

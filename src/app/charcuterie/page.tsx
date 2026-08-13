import { MockupHub } from "@/components/charcuterie/MockupHub";

export const dynamic = "force-dynamic";

export default function CharcuterieHubPage() {
  // Resolved server-side so seasonal ranking is identical across hydration.
  const month = new Date().getMonth() + 1;
  return <MockupHub month={month} />;
}

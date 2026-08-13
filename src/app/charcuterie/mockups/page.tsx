import { MockupHub } from "@/components/charcuterie/MockupHub";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mockups · Charcuterie · Cookbook" };

/** The original gallery of six views, kept because the alternatives are still
 *  worth looking at side by side. /charcuterie itself now goes to Studio. */
export default function CharcuterieMockupsPage() {
  // Resolved server-side so seasonal ranking is identical across hydration.
  const month = new Date().getMonth() + 1;
  return <MockupHub month={month} />;
}

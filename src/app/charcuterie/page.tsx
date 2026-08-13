import { redirect } from "next/navigation";

/**
 * Studio is the charcuterie section.
 *
 * The six views were a way of deciding what this should be, and that question
 * is settled — so /charcuterie goes straight to the one that won rather than
 * asking you to pick a mockup every time. The others still resolve at their own
 * URLs; the gallery that indexed them is at /charcuterie/mockups.
 */
export default function CharcuteriePage() {
  redirect("/charcuterie/studio");
}

import { PocketBoard } from "@/components/charcuterie/PocketBoard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pocket · Charcuterie Board Draft",
};

export default function PocketPage() {
  const month = new Date().getMonth() + 1;
  return <PocketBoard month={month} />;
}

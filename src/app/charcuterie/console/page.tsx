import { ConsoleBoard } from "@/components/charcuterie/ConsoleBoard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Console · Charcuterie Board Draft",
};

export default function ConsolePage() {
  const month = new Date().getMonth() + 1;
  return <ConsoleBoard month={month} />;
}

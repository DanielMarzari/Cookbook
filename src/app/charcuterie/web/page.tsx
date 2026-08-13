import { WebGraph } from "@/components/charcuterie/WebGraph";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Web · Charcuterie Board Draft",
};

export default function WebPage() {
  const month = new Date().getMonth() + 1;
  return <WebGraph month={month} />;
}

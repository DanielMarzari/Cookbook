import { EditorialBoard } from "@/components/charcuterie/EditorialBoard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Editorial · Charcuterie Board Draft",
};

export default function EditorialPage() {
  const month = new Date().getMonth() + 1;
  return <EditorialBoard month={month} />;
}

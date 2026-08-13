import CharcuterieNav from "@/components/charcuterie/CharcuterieNav";

export const metadata = {
  title: "Charcuterie · Cookbook",
  description:
    "Plan a board: pick a shape, fill it section by section, and get told what goes with what.",
};

export default function CharcuterieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
      <header className="pt-10 md:pt-14 mb-8">
        <h1 className="text-[34px] md:text-[52px] leading-[1.02] tracking-[-0.02em] font-normal text-text mb-4">
          Build a board
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          Two hundred and two ingredients, and the reasons they go together.
          Tell it what you already have and it&rsquo;ll rank what belongs next
          to it — then show you how to cut it so the board looks like you meant
          it.
        </p>
      </header>

      <CharcuterieNav />

      {children}
    </div>
  );
}

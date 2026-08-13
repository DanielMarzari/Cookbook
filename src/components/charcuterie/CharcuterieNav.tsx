"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOCKUPS } from "@/lib/charcuterie/mockups";

/** Section nav, in the same idiom as the site header: a text row where the
 *  active item is marked by an underline rather than a filled pill. */
export default function CharcuterieNav() {
  const pathname = usePathname();
  const active = pathname.split("/")[2] ?? "";

  const items = [
    { slug: "", label: "Overview" },
    ...MOCKUPS.map((m) => ({ slug: m.slug, label: m.name })),
    { slug: "boards", label: "Saved boards" },
  ];

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border pb-3 text-sm">
      {items.map((item) => {
        const isActive = active === item.slug;
        return (
          <Link
            key={item.slug || "overview"}
            href={`/charcuterie${item.slug ? `/${item.slug}` : ""}`}
            className={`pb-0.5 border-b transition-colors ${
              isActive
                ? "border-text text-text"
                : "border-transparent text-text-secondary hover:border-text hover:text-text"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

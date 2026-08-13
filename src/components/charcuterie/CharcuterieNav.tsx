"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
/** Section nav, in the same idiom as the site header: a text row where the
 *  active item is marked by an underline rather than a filled pill.
 *
 *  Studio leads because it is the section now — the other five views moved
 *  behind one Mockups link rather than each taking a slot in a row you read
 *  every time. */
export default function CharcuterieNav() {
  const pathname = usePathname();
  const active = pathname.split("/")[2] ?? "";

  const items = [
    { slug: "studio", label: "Studio" },
    { slug: "boards", label: "Saved boards" },
    { slug: "photos", label: "Ingredient photos" },
    { slug: "mockups", label: "Mockups" },
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

import Link from "next/link";

const categories = [
  {
    name: "Početna",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z" />
      </svg>
    ),
  },
  {
    name: "Satovi",
    href: "/satovi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <rect x="7" y="6" width="10" height="12" rx="3" />
        <path d="M9 6V3h6v3M9 18v3h6v-3M12 9v3l2 1" />
      </svg>
    ),
  },
  {
    name: "Narukvice",
    href: "/narukvice",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path d="M5 8c0-2 3-4 7-4s7 2 7 4-3 4-7 4-7-2-7-4Z" />
        <path d="M5 8v8c0 2 3 4 7 4s7-2 7-4V8" />
        <path d="M5 12c0 2 3 4 7 4s7-2 7-4" />
      </svg>
    ),
  },
  {
    name: "Ogrlice",
    href: "/ogrlice",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path d="M4 4c1 8 4 13 8 13s7-5 8-13" />
        <path d="M12 17v2" />
        <path d="m12 19-2 2h4l-2-2Z" />
      </svg>
    ),
  },
  {
    name: "Novčanici",
    href: "/novcanici",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M3 9h18M16 14h2" />
        <path d="M6 6V4h12v2" />
      </svg>
    ),
  },
  {
    name: "Pokloni",
    href: "/pokloni",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <rect x="3" y="10" width="18" height="11" rx="1" />
        <path d="M2 7h20v3H2zM12 7v14M12 7H8a2 2 0 1 1 2-2c0 2 2 2 2 2Zm0 0h4a2 2 0 1 0-2-2c0 2-2 2-2 2Z" />
      </svg>
    ),
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#d6b878]/20 bg-[#17110d]/60">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-3 gap-y-8 sm:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group flex flex-col items-center gap-3 text-[#a99987] transition-colors duration-300 hover:text-[#d6b878]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d6b878]/20 bg-[#d6b878]/[0.04] transition-all duration-300 group-hover:border-[#d6b878]/60 group-hover:bg-[#d6b878]/10 group-hover:scale-110">
                {category.icon}
              </div>

              <span className="text-xs font-medium tracking-wide sm:text-sm">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 border-t border-[#d6b878]/15 pt-6 text-center text-xs text-[#8f8071]">
          © {new Date().getFullYear()} WATCH STORE. Sva prava zadržana.
        </div>
      </div>
    </footer>
  );
}
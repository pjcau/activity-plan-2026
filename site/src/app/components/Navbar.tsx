"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Gare" },
  { href: "/allenamenti", label: "Allenamenti" },
  { href: "/alimentazione", label: "Alimentazione" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-emerald-800 border-b border-emerald-600">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-3 px-2 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-white border-b-2 border-white"
                  : "text-emerald-200 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

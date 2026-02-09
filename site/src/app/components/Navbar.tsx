"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

const links = [
  { href: "/", label: "Gare" },
  { href: "/allenamenti", label: "Allenamenti" },
  { href: "/alimentazione", label: "Alimentazione" },
  { href: "/ricette", label: "Ricette" },
  { href: "/libri", label: "Libri" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const allLinks = user
    ? [...links, { href: "/le-mie-gare", label: "Le Mie Gare" }]
    : links;

  return (
    <nav className="bg-emerald-800 dark:bg-gray-800 border-b border-emerald-600 dark:border-gray-700 transition-colors">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-3 px-2 text-sm font-medium transition-colors whitespace-nowrap ${
                pathname === link.href
                  ? "text-white border-b-2 border-white"
                  : "text-emerald-200 dark:text-gray-400 hover:text-white"
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

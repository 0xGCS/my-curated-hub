import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Sun, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { name: "AI", path: "/category/ai" },
  { name: "Crypto", path: "/category/crypto" },
  { name: "Investing", path: "/category/investing" },
];

const types = [
  { name: "People", path: "/type/people" },
  { name: "Platforms", path: "/type/platforms" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const isActive = (path: string) => location.pathname === path;
  const isCategoryActive = categories.some((c) => isActive(c.path));
  const isTypeActive = types.some((t) => isActive(t.path));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-medium text-foreground">
            Compendium
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={cn(
              "nav-link",
              isActive("/") && "nav-link-active"
            )}
          >
            Home
          </Link>

          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "nav-link inline-flex items-center gap-1",
                  isCategoryActive && "nav-link-active"
                )}
              >
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-40">
              {categories.map((category) => (
                <DropdownMenuItem key={category.path} asChild>
                  <Link
                    to={category.path}
                    className={cn(
                      "w-full cursor-pointer",
                      isActive(category.path) && "bg-accent"
                    )}
                  >
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Types Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "nav-link inline-flex items-center gap-1",
                  isTypeActive && "nav-link-active"
                )}
              >
                Type
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-40">
              {types.map((type) => (
                <DropdownMenuItem key={type.path} asChild>
                  <Link
                    to={type.path}
                    className={cn(
                      "w-full cursor-pointer",
                      isActive(type.path) && "bg-accent"
                    )}
                  >
                    {type.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="hidden md:flex"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors",
                isActive("/") ? "bg-accent font-medium" : "hover:bg-muted"
              )}
            >
              Home
            </Link>

            <div className="px-4 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Categories
            </div>
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-6 py-2 rounded-lg transition-colors",
                  isActive(category.path)
                    ? "bg-accent font-medium"
                    : "hover:bg-muted"
                )}
              >
                {category.name}
              </Link>
            ))}

            <div className="px-4 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Type
            </div>
            {types.map((type) => (
              <Link
                key={type.path}
                to={type.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-6 py-2 rounded-lg transition-colors",
                  isActive(type.path)
                    ? "bg-accent font-medium"
                    : "hover:bg-muted"
                )}
              >
                {type.name}
              </Link>
            ))}

            <div className="px-4 pt-4 border-t border-border mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="w-full justify-start gap-2"
              >
                {isDark ? (
                  <>
                    <Sun className="h-4 w-4" /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" /> Dark Mode
                  </>
                )}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

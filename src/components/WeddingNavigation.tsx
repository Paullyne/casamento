import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Heart, Home, UserCheck, Gift, Camera, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Início", href: "/", icon: Home },
  { name: "RSVP", href: "/rsvp", icon: UserCheck },
  { name: "Presentes", href: "/gifts", icon: Gift },
  { name: "Galeria", href: "/gallery", icon: Camera },
  { name: "Local", href: "/venue", icon: MapPin },
];

export function WeddingNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-accent/20 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 group">
            <Heart className="h-6 w-6 text-primary group-hover:animate-pulse" />
            <span className="font-romantic text-xl font-semibold text-gradient-romantic">
              Albert & Pauline
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "text-primary bg-primary/10 shadow-soft"
                      : "text-muted-foreground hover:text-primary hover:bg-accent/20"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-up">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                      isActive
                        ? "text-primary bg-primary/10 shadow-soft"
                        : "text-muted-foreground hover:text-primary hover:bg-accent/20"
                    )
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
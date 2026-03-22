import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, PenLine, BarChart3, Menu, MessageSquare, LogOut, Crown, Settings, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { navigateToExternal } from "@/lib/navigation";
import { useState, useEffect } from "react";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut, user, subscription } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' as const })
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "My Dreams" },
    { to: "/dreams/new", icon: PenLine, label: "Record Dream" },
    { to: "/patterns", icon: BarChart3, label: "Patterns" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const tierLabel =
    subscription.tier === "lifetime"
      ? "Lifetime Dreamer"
      : subscription.tier === "pro"
      ? "Pro"
      : "Free";

  const handleManage = async () => {
    const { data, error } = await supabase.functions.invoke("customer-portal");
    if (data?.url) navigateToExternal(data.url);
    else toast.error(error?.message || "Could not open billing portal");
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Top nav */}
      <header className="cta-dark-gradient border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="w-8 h-8 gradient-navy rounded-lg flex items-center justify-center text-sm">🌙</div>
            DreamWeave
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                <span className="hidden md:inline text-sm">{user?.email}</span>
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Crown className="w-3 h-3" /> {tierLabel}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {subscription.tier === "pro" && (
                <DropdownMenuItem onClick={handleManage} className="gap-2 cursor-pointer">
                  <Settings className="w-4 h-4" /> Manage Subscription
                </DropdownMenuItem>
              )}
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="gap-2 cursor-pointer flex items-center">
                    <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/contact" className="gap-2 cursor-pointer flex items-center">
                  <MessageSquare className="w-4 h-4" /> Contact
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="gap-2 cursor-pointer text-destructive">
                <LogOut className="w-4 h-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium ${
                isActive(item.to) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

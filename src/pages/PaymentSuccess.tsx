import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const PaymentSuccess = () => {
  const { refreshSubscription } = useAuth();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");

  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          {plan === "lifetime" ? "Welcome, Lifetime Dreamer! 🎉" : "You're now Pro! 🚀"}
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          {plan === "lifetime"
            ? "You've unlocked all features forever. No subscriptions, no renewals — just unlimited dream exploration."
            : "Unlimited AI analyses and pattern recognition are now yours. Time to uncover what your dreams really mean."}
        </p>
        <Link to="/dashboard">
          <Button className="gradient-indigo text-white font-semibold gap-2">
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
};

export default PaymentSuccess;

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By using DreamWeave, you agree to these terms. If you don't agree, please don't use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p>DreamWeave provides an AI-powered dream journaling and analysis platform. Dream analyses are for entertainment and self-reflection purposes and should not be considered medical or psychological advice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
            <p>You are responsible for maintaining the security of your account. You must provide accurate information when creating an account. You must be at least 13 years old to use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Subscriptions & Payments</h2>
            <p>Free accounts include 3 AI analyses per month. Paid plans (Pro at $9.99/month, Lifetime at $99 one-time) unlock unlimited analyses. Subscriptions can be cancelled at any time through the billing portal. Refunds are handled on a case-by-case basis.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Content Ownership</h2>
            <p>You retain full ownership of your dream entries. By using the service, you grant us a limited license to process your content solely for providing the analysis features.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
            <p>DreamWeave is provided "as is." We are not liable for any decisions made based on dream analyses. The service is for entertainment and personal insight only.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
            <p>Questions about these terms? Email <a href="mailto:hello@dreamweave.me" className="text-primary hover:underline">hello@dreamweave.me</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;

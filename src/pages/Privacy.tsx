import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect information you provide directly: your email address when you create an account, and dream journal entries you choose to record. We also collect usage data such as pages visited and features used.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>Your dream entries are used solely to provide AI-powered analysis and pattern detection within your account. We do not sell, share, or use your dream content for training AI models. Your data belongs to you.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. Data Storage & Security</h2>
            <p>Your data is stored securely with encryption at rest and in transit. We use industry-standard security measures to protect your personal information and dream entries.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Payment Processing</h2>
            <p>Payments are processed by Stripe. We never store your credit card information on our servers. Stripe's privacy policy governs the handling of your payment data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p>You can delete your account and all associated dream data at any time. You can export your dream entries. You can opt out of marketing communications.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
            <p>For privacy questions, email us at <a href="mailto:hello@dreamweave.me" className="text-primary hover:underline">hello@dreamweave.me</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

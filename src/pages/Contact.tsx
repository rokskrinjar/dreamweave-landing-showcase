import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";
import dreamweaveLogo from "@/assets/dreamweave-logo.png";
import { z } from "zod";

const contactSchema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Message cannot be empty").max(2000, "Message must be under 2000 characters"),
});

const Contact = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState(user?.email ?? "");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = contactSchema.safeParse({ email, message });
    if (!parsed.success) {
      toast({ title: "Validation error", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }

    setSending(true);
    const { error } = await supabase.from("contact_messages" as any).insert({
      email: parsed.data.email,
      message: parsed.data.message,
      user_id: user?.id ?? null,
    } as any);

    setSending(false);

    if (error) {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
      return;
    }

    setSent(true);
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 gradient-navy rounded-xl flex items-center justify-center text-xl">🌙</div>
              <h1 className="text-2xl font-bold text-foreground">Contact Us</h1>
            </div>
            <p className="text-muted-foreground">Have a question, bug report, or feedback? We'd love to hear from you.</p>
          </div>

          {sent ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
              <div className="text-4xl">✉️</div>
              <h2 className="text-lg font-semibold text-foreground">Thanks for reaching out!</h2>
              <p className="text-muted-foreground text-sm">We'll review your message and get back to you as soon as possible.</p>
              <Link to="/">
                <Button variant="outline" className="mt-4">Back to Home</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Your email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's on your mind…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  maxLength={2000}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground text-right">{message.length}/2000</p>
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                <Send className="w-4 h-4 mr-2" />
                {sending ? "Sending…" : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;

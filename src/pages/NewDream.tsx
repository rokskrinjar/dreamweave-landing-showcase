import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";

const moods = ["peaceful", "anxious", "euphoric", "confused", "nostalgic", "fearful"];

const NewDream = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { data, error } = await supabase
      .from("dreams")
      .insert({
        user_id: user.id,
        title,
        content,
        mood: mood || null,
        tags,
      })
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    toast.success("Dream saved!");
    navigate(`/dreams/${data.id}`);
  };

  return (
    <AppLayout>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">Record a Dream</h1>
        <p className="text-muted-foreground mb-8">
          Write down everything you remember. Don't overthink it — raw details are better.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
            <Input
              placeholder="Give your dream a name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">What happened?</label>
            <Textarea
              placeholder="I was in a dark room, and suddenly..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[200px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">How did you feel?</label>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(mood === m ? "" : m)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    mood === m
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Tags (optional)</label>
            <Input
              placeholder="water, flying, family (comma-separated)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full gradient-indigo text-white py-6 font-semibold text-base" disabled={saving}>
            <Sparkles className="w-5 h-5 mr-2" />
            {saving ? "Saving..." : "Save Dream"}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default NewDream;

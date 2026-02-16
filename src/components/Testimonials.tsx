import { Star } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      text: "I've had this nightmare about falling for YEARS. After 2 weeks of logging, DreamWeave showed me it always happens before big presentations at work. Now I prep differently and the nightmare's basically gone.",
      author: "Maria C.",
      role: "Marketing Director",
      initial: "M",
    },
    {
      text: "My therapist actually asked me about DreamWeave after I started bringing more specific dream insights to our sessions. It's not a replacement for therapy, but it's an incredible supplement.",
      author: "David R.",
      role: "Software Engineer",
      initial: "D",
    },
    {
      text: "Honestly thought dream analysis was woo-woo stuff. But the AI picked up on a grief pattern I didn't even realize I was processing. That hit different.",
      author: "Sarah W.",
      role: "Teacher",
      initial: "S",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Real people. Real breakthroughs.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We don't do fake 5-star reviews. These are actual users who found something unexpected in their dreams.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-8 rounded-3xl shadow-lg border border-border hover:shadow-xl transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-indigo text-white rounded-full flex items-center justify-center font-semibold text-lg">
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.author}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

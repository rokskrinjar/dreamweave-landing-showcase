export const Testimonials = () => {
  const testimonials = [
    {
      text: "DreamWeave.me helped me understand recurring nightmares I'd had for years. The psychological insights were incredibly accurate and actionable.",
      author: "Maria Chen",
      role: "Psychology Student",
      initial: "M",
    },
    {
      text: "The pattern recognition is amazing. I discovered connections between my stress levels and dream themes that I never noticed before.",
      author: "David Rodriguez",
      role: "Software Engineer",
      initial: "D",
    },
    {
      text: "As a therapist, I recommend DreamWeave.me to clients interested in dream work. The multi-perspective analysis is professionally thorough.",
      author: "Dr. Sarah Williams",
      role: "Licensed Therapist",
      initial: "S",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            What dreamers are saying
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who have discovered deeper self-understanding through their dreams
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
              <p className="italic text-slate-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-indigo text-white rounded-full flex items-center justify-center font-semibold">
                  {testimonial.initial}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.author}</h4>
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

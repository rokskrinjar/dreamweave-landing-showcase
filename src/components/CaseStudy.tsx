export const CaseStudy = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            See It in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow Rachel's journey from restless nights to real self-understanding.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <video
            controls
            preload="metadata"
            className="w-full rounded-2xl shadow-lg border border-border"
          >
            <source src="/videos/tutorial.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

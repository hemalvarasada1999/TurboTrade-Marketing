import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "I sleep better knowing my money is working 24/7.",
      author: "Rajesh Kumar",
      role: "IT Professional",
      rating: 5,
    },
    {
      quote: "Finally, a tech-driven approach that beats my manual trading efforts.",
      author: "Priya Sharma",
      role: "Entrepreneur",
      rating: 5,
    },
    {
      quote: "The best part? I don't have to manage anything.",
      author: "Amit Patel",
      role: "Business Owner",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Investors Who Found{" "}
              <span className="text-accent">Freedom.</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light">
              Real stories from investors who transformed their financial future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-md border-white/20 p-8 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <Quote className="h-10 w-10 text-accent mb-4 opacity-50" />
                
                <div className="flex mb-4 gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>

                <blockquote className="text-lg mb-6 text-white/90 font-light leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                <div className="border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-sm text-white/60">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

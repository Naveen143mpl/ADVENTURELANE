import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { ExperienceCard } from "@/components/ExperienceCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image_url: string;
  category: string;
  duration: string;
  rating: number;
}

const Home = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setExperiences(data || []);
      setFilteredExperiences(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load experiences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = experiences.filter(
      (exp) =>
        exp.title.toLowerCase().includes(query.toLowerCase()) ||
        exp.location.toLowerCase().includes(query.toLowerCase()) ||
        exp.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredExperiences(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero onSearch={handleSearch} />
      
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Popular Experiences</h2>
          <p className="text-muted-foreground">
            Handpicked adventures for unforgettable moments
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-lg text-muted-foreground">
              No experiences found. Try a different search.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExperiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                id={experience.id}
                title={experience.title}
                description={experience.description}
                price={experience.price}
                location={experience.location}
                imageUrl={experience.image_url}
                category={experience.category}
                duration={experience.duration}
                rating={experience.rating}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-hot-air-balloon.jpg";

interface HeroProps {
  onSearch: (query: string) => void;
}

export const Hero = ({ onSearch }: HeroProps) => {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Hot air balloon ride at sunrise"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/20 to-background/40" />
      </div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-primary-foreground md:text-6xl">
            Discover Your Next Adventure
          </h1>
          <p className="mb-8 text-xl text-primary-foreground/90">
            Book unforgettable experiences around the world
          </p>
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search destinations, activities..."
              className="h-14 rounded-full border-0 bg-background pl-12 text-lg shadow-lg"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExperienceCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  category: string;
  duration: string;
  rating: number;
}

export const ExperienceCard = ({
  id,
  title,
  description,
  price,
  location,
  imageUrl,
  category,
  duration,
  rating,
}: ExperienceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-0 shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:scale-[1.02]"
      onClick={() => navigate(`/experience/${id}`)}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-background/90 text-foreground border-0">
            {category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        <p className="mb-4 text-muted-foreground line-clamp-2 text-sm">
          {description}
        </p>
        <div className="mb-4 flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <span className="text-2xl font-bold text-primary">₹{(price * 83).toFixed(0)}</span>
            <span className="text-sm text-muted-foreground"> / person</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

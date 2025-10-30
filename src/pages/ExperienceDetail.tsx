import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { SlotSelector } from "@/components/SlotSelector";
import { MapPin, Clock, Star, Users, ArrowLeft } from "lucide-react";
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

interface Slot {
  id: string;
  date: string;
  time: string;
  available_spots: number;
  total_spots: number;
}

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperienceDetails();
  }, [id]);

  const fetchExperienceDetails = async () => {
    try {
      const { data: expData, error: expError } = await supabase
        .from("experiences")
        .select("*")
        .eq("id", id)
        .single();

      if (expError) throw expError;

      const { data: slotsData, error: slotsError } = await supabase
        .from("slots")
        .select("*")
        .eq("experience_id", id)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (slotsError) throw slotsError;

      setExperience(expData);
      setSlots(slotsData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load experience details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!selectedSlot) {
      toast({
        title: "Select a time slot",
        description: "Please select a date and time to continue",
      });
      return;
    }
    navigate(`/checkout/${id}`, { state: { experience, slot: selectedSlot } });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Experience not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Experiences
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <img
              src={experience.image_url}
              alt={experience.title}
              className="h-[400px] w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="mb-4 text-4xl font-bold">{experience.title}</h1>
              <div className="mb-4 flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{experience.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{experience.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-secondary text-secondary" />
                  <span className="font-medium">{experience.rating}</span>
                </div>
              </div>
              <p className="text-lg leading-relaxed">{experience.description}</p>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted p-6">
              <div>
                <p className="text-sm text-muted-foreground">Price per person</p>
                <p className="text-3xl font-bold text-primary">
                  ₹{(experience.price * 83).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <SlotSelector
            slots={slots}
            onSelectSlot={setSelectedSlot}
            selectedSlot={selectedSlot}
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="w-full max-w-md text-lg"
            onClick={handleBookNow}
            disabled={!selectedSlot}
          >
            Continue to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;

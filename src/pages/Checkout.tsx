import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Loader2, Tag } from "lucide-react";
import { format } from "date-fns";

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { experience, slot } = location.state || {};
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!experience || !slot) {
    navigate("/");
    return null;
  }

  const subtotal = experience.price;
  const total = Math.max(0, subtotal - discount);

  const validatePromoCode = async () => {
    if (!promoCode.trim()) return;
    
    setIsValidatingPromo(true);
    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.toUpperCase())
        .eq("active", true)
        .single();

      if (error || !data) {
        toast({
          title: "Invalid promo code",
          description: "This promo code is not valid",
          variant: "destructive",
        });
        setDiscount(0);
        return;
      }

      const discountAmount =
        data.discount_type === "percentage"
          ? (subtotal * data.discount_value) / 100
          : data.discount_value;

      setDiscount(discountAmount);
      toast({
        title: "Promo code applied!",
        description: `You saved ₹${(discountAmount * 83).toFixed(0)}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to validate promo code",
        variant: "destructive",
      });
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if slot is still available
      const { data: slotData, error: slotError } = await supabase
        .from("slots")
        .select("available_spots")
        .eq("id", slot.id)
        .single();

      if (slotError || !slotData || slotData.available_spots === 0) {
        toast({
          title: "Slot unavailable",
          description: "This time slot is no longer available",
          variant: "destructive",
        });
        navigate(`/experience/${id}`);
        return;
      }

      // Create booking
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          experience_id: experience.id,
          slot_id: slot.id,
          user_name: formData.name,
          user_email: formData.email,
          user_phone: formData.phone || null,
          promo_code: promoCode || null,
          total_price: total,
          status: "confirmed",
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Update slot availability
      const { error: updateError } = await supabase
        .from("slots")
        .update({ available_spots: slotData.available_spots - 1 })
        .eq("id", slot.id);

      if (updateError) throw updateError;

      navigate("/confirmation", { state: { booking: bookingData, experience, slot } });
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(`/experience/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="border-t pt-4">
                    <Label htmlFor="promo">Promo Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={validatePromoCode}
                        disabled={isValidatingPromo}
                      >
                        {isValidatingPromo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Tag className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Booking"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8 shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <img
                    src={experience.image_url}
                    alt={experience.title}
                    className="mb-4 h-40 w-full rounded-lg object-cover"
                  />
                  <h3 className="mb-2 text-lg font-semibold">{experience.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(slot.date), "EEEE, MMMM d, yyyy")} at {slot.time}
                  </p>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{(subtotal * 83).toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Discount</span>
                      <span>-₹{(discount * 83).toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{(total * 83).toFixed(0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

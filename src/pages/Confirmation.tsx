import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, MapPin, Mail } from "lucide-react";
import { format } from "date-fns";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, experience, slot } = location.state || {};

  if (!booking || !experience || !slot) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your adventure is all set. We've sent a confirmation email to{" "}
              {booking.user_email}
            </p>
          </div>

          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-6 space-y-6">
              <div>
                <img
                  src={experience.image_url}
                  alt={experience.title}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
                <h2 className="mb-2 text-2xl font-semibold">{experience.title}</h2>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-muted-foreground">
                      {format(new Date(slot.date), "EEEE, MMMM d, yyyy")} at {slot.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{experience.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-muted-foreground">{experience.duration}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-muted-foreground">{booking.user_name}</p>
                    <p className="text-muted-foreground">{booking.user_email}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Paid</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{(booking.total_price * 83).toFixed(0)}
                  </span>
                </div>
                {booking.promo_code && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Promo code "{booking.promo_code}" applied
                  </p>
                )}
              </div>

              <div className="space-y-3 border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Booking ID:</strong> {booking.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  Please arrive 15 minutes before your scheduled time. Bring a valid ID
                  and your booking confirmation.
                </p>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Explore More Experiences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

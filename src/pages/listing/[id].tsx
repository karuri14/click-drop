import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLeads } from "@/hooks/useLeads";
import { useAuth } from "@/context/AuthContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, MessageSquare, Calendar } from "lucide-react";

interface PropertyDetails {
  id: string;
  title: string;
  price: number;
  description: string;
  location: string;
  features: string[];
  images: string[];
  realtorName: string;
  realtorPhone: string;
  realtorEmail: string;
}

export default function PropertyListingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createLead } = useLeads(id);
  const [openBookCall, setOpenBookCall] = useState(false);
  const [openInterested, setOpenInterested] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propertyDetails, setPropertyDetails] =
    useState<PropertyDetails | null>(null);
  const [realtorDetails, setRealtorDetails] = useState<any>(null);

  // Fetch property details from Supabase
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch property listing
        const propertyResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/property_listings?id=eq.${id}&select=*`,
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          },
        );

        if (!propertyResponse.ok) {
          throw new Error("Failed to fetch property details");
        }

        const propertyData = await propertyResponse.json();

        if (!propertyData || propertyData.length === 0) {
          throw new Error("Property not found");
        }

        const property = propertyData[0];

        // Fetch realtor details
        const realtorResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${property.user_id}&select=*`,
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          },
        );

        if (!realtorResponse.ok) {
          throw new Error("Failed to fetch realtor details");
        }

        const realtorData = await realtorResponse.json();
        const realtor = realtorData[0] || {
          full_name: "Property Owner",
          email: "contact@example.com",
          phone: "Contact via email",
        };

        // Record a view
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/property_views`,
          {
            method: "POST",
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              property_id: id,
              viewer_id: user?.id || null,
              viewed_at: new Date().toISOString(),
            }),
          },
        );

        // Parse features from description or use default features
        const features = property.features || [
          "Bedrooms",
          "Bathrooms",
          "Parking",
          "Square Footage",
          "Year Built",
          "Property Type",
        ];

        // Format property details
        setPropertyDetails({
          id: property.id,
          title: property.title,
          price: Number(property.price),
          description: property.description,
          location: property.location,
          features: features,
          images: property.images || [
            property.image_url ||
              "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
          ],
          realtorName: realtor.full_name,
          realtorPhone: realtor.phone,
          realtorEmail: realtor.email,
        });

        setRealtorDetails(realtor);
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching property details",
        );
        console.error("Error fetching property details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, user]);

  const handleSubmit = async (
    event: React.FormEvent,
    type: "call" | "interest",
  ) => {
    event.preventDefault();
    if (!id || !propertyDetails) return;

    try {
      // Get form data
      const formData = new FormData(event.target as HTMLFormElement);
      const formValues: Record<string, string> = {};

      formData.forEach((value, key) => {
        formValues[key] = value.toString();
      });

      // Create lead in database
      const leadData = {
        property_id: id,
        name: formValues.name || formValues["name-interested"] || "",
        email: formValues.email || formValues["email-interested"] || "",
        phone: formValues.phone || formValues["phone-interested"] || "",
        message: formValues.message || formValues["message-interested"] || "",
        lead_type: type,
        created_at: new Date().toISOString(),
      };

      await createLead(leadData);

      setFormSubmitted(true);
      setTimeout(() => {
        setOpenBookCall(false);
        setOpenInterested(false);
        setFormSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting lead:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !propertyDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || "Property not found"}</p>
          <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Property Images Carousel */}
      <div className="w-full max-w-6xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        <Carousel className="w-full">
          <CarouselContent>
            {propertyDetails.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="overflow-hidden rounded-xl aspect-[16/9]">
                    <img
                      src={image}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      {/* Property Details */}
      <div className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {propertyDetails.title}
                </h1>
                <div className="flex items-center mt-2">
                  <MapPin className="h-5 w-5 text-gray-500 mr-1" />
                  <span className="text-gray-600">
                    {propertyDetails.location}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">
                  ${propertyDetails.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Description
              </h2>
              <p className="mt-2 text-gray-700 leading-relaxed">
                {propertyDetails.description}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Features</h2>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {propertyDetails.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      •
                    </Badge>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Interested in this property?</CardTitle>
                <CardDescription>
                  Contact the realtor or request more information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">
                      {propertyDetails.realtorPhone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">
                      {propertyDetails.realtorEmail}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Dialog open={openBookCall} onOpenChange={setOpenBookCall}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Calendar className="mr-2 h-4 w-4" /> Book a Call
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book a Call</DialogTitle>
                      <DialogDescription>
                        Fill out the form below to schedule a call with{" "}
                        {propertyDetails.realtorName}.
                      </DialogDescription>
                    </DialogHeader>
                    {formSubmitted ? (
                      <div className="py-6 text-center">
                        <h3 className="text-lg font-medium text-green-600">
                          Thank you!
                        </h3>
                        <p className="mt-2">
                          We've received your request and will contact you
                          shortly.
                        </p>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => handleSubmit(e, "call")}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              placeholder="+1 (555) 123-4567"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preferred-time">Preferred Time</Label>
                          <Input
                            id="preferred-time"
                            placeholder="e.g., Weekdays after 5pm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message (Optional)</Label>
                          <Textarea
                            id="message"
                            placeholder="Any specific questions or concerns?"
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit">Submit Request</Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>

                <Dialog open={openInterested} onOpenChange={setOpenInterested}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" /> I'm Interested
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Express Interest</DialogTitle>
                      <DialogDescription>
                        Let {propertyDetails.realtorName} know you're interested
                        in this property.
                      </DialogDescription>
                    </DialogHeader>
                    {formSubmitted ? (
                      <div className="py-6 text-center">
                        <h3 className="text-lg font-medium text-green-600">
                          Thank you!
                        </h3>
                        <p className="mt-2">
                          We've received your interest and will contact you
                          shortly.
                        </p>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => handleSubmit(e, "interest")}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name-interested">Full Name</Label>
                            <Input
                              id="name-interested"
                              placeholder="John Doe"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone-interested">
                              Phone Number
                            </Label>
                            <Input
                              id="phone-interested"
                              placeholder="+1 (555) 123-4567"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email-interested">Email</Label>
                          <Input
                            id="email-interested"
                            type="email"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="whatsapp-interested">
                            WhatsApp Number (Optional)
                          </Label>
                          <Input
                            id="whatsapp-interested"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message-interested">
                            Message (Optional)
                          </Label>
                          <Textarea
                            id="message-interested"
                            placeholder="Any specific questions about the property?"
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit">Submit</Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Realtor Info */}
      <div className="max-w-6xl mx-auto mt-12 mb-16 px-4 sm:px-6 lg:px-8">
        <div className="border-t pt-8">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${propertyDetails.realtorName}`}
                alt="Realtor"
                className="h-16 w-16 rounded-full"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {propertyDetails.realtorName}
              </h3>
              <p className="text-gray-600">Licensed Real Estate Agent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

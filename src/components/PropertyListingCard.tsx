import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Share2Icon,
  PencilIcon,
  TrashIcon,
  CopyIcon,
  FacebookIcon,
  MessageSquareIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";

interface PropertyListingCardProps {
  id?: string;
  title?: string;
  price?: number;
  description?: string;
  location?: string;
  images?: string[];
  onEdit?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const PropertyListingCard: React.FC<PropertyListingCardProps> = ({
  id = "1",
  title = "Modern 3 Bedroom Apartment",
  price = 250000,
  description = "Beautiful modern apartment with spacious rooms, high ceilings, and plenty of natural light. Recently renovated with premium finishes.",
  location = "Downtown, City Center",
  images = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80",
  ],
  onEdit = () => {},
  onShare = () => {},
  onDelete = () => {},
}) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://example.com/listing/${id}`);
    // Could add toast notification here
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=https://example.com/listing/${id}`,
      "_blank",
    );
  };

  const handleShareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=Check out this property: https://example.com/listing/${id}`,
      "_blank",
    );
  };

  return (
    <Card className="w-full max-w-[350px] overflow-hidden bg-white">
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <AspectRatio ratio={4 / 3}>
                  <img
                    src={image}
                    alt={`Property image ${index + 1}`}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <Badge className="absolute top-2 right-2 bg-primary text-white">
          ${price.toLocaleString()}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{location}</span>
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{description}</p>
      </CardContent>

      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
          <PencilIcon className="h-4 w-4 mr-1" /> Edit
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Share2Icon className="h-4 w-4 mr-1" /> Share
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="grid gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex justify-start"
                onClick={handleCopyLink}
              >
                <CopyIcon className="h-4 w-4 mr-2" /> Copy Link
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex justify-start"
                onClick={handleShareFacebook}
              >
                <FacebookIcon className="h-4 w-4 mr-2" /> Share on Facebook
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex justify-start"
                onClick={handleShareWhatsApp}
              >
                <MessageSquareIcon className="h-4 w-4 mr-2" /> Share on WhatsApp
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(id)}
        >
          <TrashIcon className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyListingCard;

import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

// Mock PropertyListingCard component since we don't have access to the actual implementation
interface PropertyListingCardProps {
  id: string;
  title: string;
  price: number;
  description: string;
  location: string;
  images: string[];
}

const PropertyListingCard: React.FC<PropertyListingCardProps> = ({
  id,
  title,
  price,
  description,
  location,
  images,
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col bg-white">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={
            images[0] ||
            "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80"
          }
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary text-white">
            ${price.toLocaleString()}
          </Badge>
        </div>
      </div>
      <CardContent className="flex-1 flex flex-col p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{location}</p>
        <p className="text-sm line-clamp-3 mb-4 flex-1">{description}</p>
        <div className="flex justify-between items-center mt-auto">
          <Button variant="outline" size="sm">
            View Details
          </Button>
          <Button variant="secondary" size="sm">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface Property {
  id: string;
  title: string;
  price: number;
  description: string;
  location: string;
  images: string[];
  createdAt: string;
}

interface RealtorInfo {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  contactInfo: string;
  activeListings: number;
}

export default function PortfolioPage() {
  const { userId } = useParams<{ userId: string }>();
  const [properties, setProperties] = React.useState<Property[]>([
    {
      id: "1",
      title: "Modern Apartment with Ocean View",
      price: 450000,
      description:
        "Beautiful 3-bedroom apartment with stunning ocean views, modern amenities, and a spacious balcony.",
      location: "Miami Beach, FL",
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      ],
      createdAt: "2023-05-15",
    },
    {
      id: "2",
      title: "Luxury Villa with Pool",
      price: 1250000,
      description:
        "Exclusive 5-bedroom villa with private pool, garden, and entertainment area in a gated community.",
      location: "Beverly Hills, CA",
      images: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      ],
      createdAt: "2023-06-20",
    },
    {
      id: "3",
      title: "Downtown Loft",
      price: 350000,
      description:
        "Stylish loft in the heart of downtown with high ceilings, exposed brick, and modern finishes.",
      location: "Chicago, IL",
      images: [
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
      ],
      createdAt: "2023-07-05",
    },
    {
      id: "4",
      title: "Suburban Family Home",
      price: 580000,
      description:
        "4-bedroom family home with large backyard, finished basement, and updated kitchen.",
      location: "Austin, TX",
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
      ],
      createdAt: "2023-08-12",
    },
    {
      id: "5",
      title: "Beachfront Condo",
      price: 620000,
      description:
        "2-bedroom beachfront condo with direct beach access, renovated interior, and community amenities.",
      location: "San Diego, CA",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      ],
      createdAt: "2023-09-01",
    },
    {
      id: "6",
      title: "Mountain Retreat",
      price: 750000,
      description:
        "Cozy 3-bedroom cabin with mountain views, wood-burning fireplace, and outdoor hot tub.",
      location: "Aspen, CO",
      images: [
        "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80",
      ],
      createdAt: "2023-10-15",
    },
  ]);

  const [realtorInfo, setRealtorInfo] = React.useState<RealtorInfo>({
    id: userId || "123",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    bio: "Luxury real estate specialist with over 10 years of experience helping clients find their dream homes.",
    contactInfo: "sarah.johnson@realestate.com | (555) 123-4567",
    activeListings: 6,
  });

  const [searchTerm, setSearchTerm] = React.useState("");
  const [priceFilter, setPriceFilter] = React.useState("");

  const filteredProperties = React.useMemo(() => {
    let filtered = [...properties];

    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (priceFilter) {
      switch (priceFilter) {
        case "low":
          filtered = filtered.sort((a, b) => a.price - b.price);
          break;
        case "high":
          filtered = filtered.sort((a, b) => b.price - a.price);
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [properties, searchTerm, priceFilter]);

  return (
    <div className="min-h-screen bg-background">
      {/* Realtor Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={realtorInfo.avatar} alt={realtorInfo.name} />
              <AvatarFallback>
                {realtorInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{realtorInfo.name}</h1>
              <p className="text-muted-foreground mt-1">{realtorInfo.bio}</p>
              <div className="mt-2">
                <Badge variant="outline" className="mr-2">
                  {realtorInfo.activeListings} Active Listings
                </Badge>
                <Badge variant="secondary">Real Estate Professional</Badge>
              </div>
              <p className="mt-3 text-sm">{realtorInfo.contactInfo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by property name, location, or description"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="text-muted-foreground h-4 w-4" />
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="low">Price: Low to High</SelectItem>
                <SelectItem value="high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Property Listings */}
      <div className="container mx-auto px-4 py-8">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyListingCard
                key={property.id}
                id={property.id}
                title={property.title}
                price={property.price}
                description={property.description}
                location={property.location}
                images={property.images}
              />
            ))}
          </div>
        ) : (
          <Card className="w-full py-12">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-semibold">No properties found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search criteria
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setPriceFilter("");
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {realtorInfo.name} - Real Estate
            Portfolio
          </p>
          <p className="mt-1">
            Contact for inquiries: {realtorInfo.contactInfo}
          </p>
        </div>
      </footer>
    </div>
  );
}

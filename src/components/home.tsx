import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart3,
  Copy,
  Edit,
  Eye,
  Home,
  Link2,
  MoreHorizontal,
  Plus,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("listings");
  const [copySuccess, setCopySuccess] = useState("");

  // Mock data for property listings
  const listings = [
    {
      id: "1",
      title: "Modern Apartment in Downtown",
      price: "$250,000",
      location: "Downtown, City Center",
      views: 124,
      leads: 8,
      createdAt: "2023-05-15",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    },
    {
      id: "2",
      title: "Luxury Villa with Pool",
      price: "$750,000",
      location: "Beachside, Ocean View",
      views: 256,
      leads: 15,
      createdAt: "2023-06-02",
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    },
    {
      id: "3",
      title: "Cozy Family Home",
      price: "$420,000",
      location: "Suburban Area, Green Valley",
      views: 89,
      leads: 5,
      createdAt: "2023-06-10",
      image:
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80",
    },
  ];

  // Mock data for analytics
  const analytics = {
    totalListings: 3,
    totalLeads: 28,
    totalViews: 469,
    conversionRate: "5.97%",
  };

  // Function to copy listing link to clipboard
  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/listing/${id}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(`Copied listing #${id}`);
    setTimeout(() => setCopySuccess(""), 2000);
  };

  // Function to copy portfolio link to clipboard
  const copyPortfolioLink = () => {
    const url = `${window.location.origin}/portfolio/user123`; // Replace with actual user ID
    navigator.clipboard.writeText(url);
    setCopySuccess("Portfolio link copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Realtor Lead Platform</h1>
          </div>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Users className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Leads</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Avatar>
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=realtor"
                alt="User"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {/* Dashboard Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your property listings and track lead generation.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={copyPortfolioLink}>
              <Link2 className="mr-2 h-4 w-4" />
              Copy Portfolio Link
            </Button>
            <Link to="/create-listing">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Copy Success Message */}
        {copySuccess && (
          <div className="mb-4 rounded-md bg-green-100 p-2 text-green-800">
            {copySuccess}
          </div>
        )}

        {/* Analytics Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalListings}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalLeads}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalViews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.conversionRate}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="listings"
          className="mb-6"
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="listings">
              <Home className="mr-2 h-4 w-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Listings Tab Content */}
          <TabsContent value="listings" className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Your Property Listings</h3>
              <div className="w-64">
                <Input placeholder="Search listings..." />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded-md">
                            <img
                              src={listing.image}
                              alt={listing.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="font-medium">{listing.title}</div>
                        </div>
                      </TableCell>
                      <TableCell>{listing.price}</TableCell>
                      <TableCell>{listing.location}</TableCell>
                      <TableCell>{listing.views}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{listing.leads}</Badge>
                      </TableCell>
                      <TableCell>{listing.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyToClipboard(listing.id)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy Link</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Share Listing</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-2">
                                  <p className="text-sm text-muted-foreground">
                                    Share this listing on:
                                  </p>
                                  <div className="flex gap-2">
                                    <Button
                                      className="flex-1"
                                      variant="outline"
                                    >
                                      Facebook
                                    </Button>
                                    <Button
                                      className="flex-1"
                                      variant="outline"
                                    >
                                      WhatsApp
                                    </Button>
                                    <Button
                                      className="flex-1"
                                      variant="outline"
                                    >
                                      Email
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <p className="mb-2 text-sm text-muted-foreground">
                                    Or copy the link:
                                  </p>
                                  <div className="flex gap-2">
                                    <Input
                                      readOnly
                                      value={`${window.location.origin}/listing/${listing.id}`}
                                    />
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        copyToClipboard(listing.id)
                                      }
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Analytics Tab Content */}
          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Lead Generation Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">
                    Analytics chart will be displayed here
                  </p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Top Performing Listing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-md">
                          <img
                            src={listings[1].image}
                            alt={listings[1].title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{listings[1].title}</p>
                          <p className="text-sm text-muted-foreground">
                            {listings[1].leads} leads
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Recent Leads
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">John Doe</span>
                          </div>
                          <Badge variant="outline">New</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>MS</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">Maria Smith</span>
                          </div>
                          <Badge variant="outline">New</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HomePage;

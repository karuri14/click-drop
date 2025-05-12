import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  AlertCircle,
  BarChart3,
  Copy,
  Edit,
  Eye,
  Home,
  Link2,
  Loader2,
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
import { usePropertyListings } from "@/hooks/usePropertyListings";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("listings");
  const [copySuccess, setCopySuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch property listings from Supabase
  const {
    listings,
    loading: listingsLoading,
    error: listingsError,
    fetchListings,
    removeListing,
  } = usePropertyListings();

  // Fetch analytics data from Supabase
  const {
    analytics,
    loading: analyticsLoading,
    error: analyticsError,
  } = useAnalytics(user?.id);

  // Filter listings based on search term
  const filteredListings = searchTerm
    ? listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : listings;

  // Refresh data when user changes
  useEffect(() => {
    if (user) {
      fetchListings();
    }
  }, [user, fetchListings]);

  // Function to copy listing link to clipboard
  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/listing/${id}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(`Copied listing #${id}`);
    setTimeout(() => setCopySuccess(""), 2000);
  };

  // Function to copy portfolio link to clipboard
  const copyPortfolioLink = () => {
    if (!user) return;
    const url = `${window.location.origin}/portfolio/${user.id}`;
    navigator.clipboard.writeText(url);
    setCopySuccess("Portfolio link copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  // Function to handle listing deletion
  const handleDeleteListing = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const success = await removeListing(id);
      if (success) {
        setCopySuccess("Listing deleted successfully");
        setTimeout(() => setCopySuccess(""), 2000);
      }
    }
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
            <Button onClick={copyPortfolioLink} disabled={!user}>
              <Link2 className="mr-2 h-4 w-4" />
              Copy Portfolio Link
            </Button>
            <Button onClick={() => navigate("/create-listing")}>
              <Plus className="mr-2 h-4 w-4" />
              New Listing
            </Button>
          </div>
        </div>

        {/* Copy Success Message */}
        {copySuccess && (
          <div className="mb-4 rounded-md bg-green-100 p-2 text-green-800">
            {copySuccess}
          </div>
        )}

        {/* Analytics Cards */}
        {analyticsError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load analytics data</AlertDescription>
          </Alert>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="text-2xl font-bold">
                  {analytics.totalListings}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="text-2xl font-bold">{analytics.totalLeads}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="text-2xl font-bold">{analytics.totalViews}</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="text-2xl font-bold">
                  {analytics.conversionRate}
                </div>
              )}
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
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {listingsError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load property listings
                </AlertDescription>
              </Alert>
            )}

            {listingsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredListings.length > 0 ? (
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
                    {filteredListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 overflow-hidden rounded-md">
                              <img
                                src={
                                  listing.image_url ||
                                  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
                                }
                                alt={listing.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="font-medium">{listing.title}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          ${Number(listing.price).toLocaleString()}
                        </TableCell>
                        <TableCell>{listing.location}</TableCell>
                        <TableCell>{listing.views_count || 0}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {listing.leads_count || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(listing.created_at).toLocaleDateString()}
                        </TableCell>
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
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/edit-listing/${listing.id}`)
                                  }
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/listing/${listing.id}`)
                                  }
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    handleDeleteListing(listing.id)
                                  }
                                >
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
            ) : (
              <Card className="w-full py-12">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <h3 className="text-xl font-semibold">No properties found</h3>
                  <p className="text-muted-foreground mt-2">
                    {searchTerm
                      ? "Try adjusting your search criteria"
                      : "Create your first property listing"}
                  </p>
                  {searchTerm ? (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setSearchTerm("")}
                    >
                      Clear search
                    </Button>
                  ) : (
                    <Button
                      className="mt-4"
                      onClick={() => navigate("/create-listing")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Listing
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
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
                      {analyticsLoading ? (
                        <div className="flex items-center justify-center h-12">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : analytics.topPerformingListing ? (
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 overflow-hidden rounded-md">
                            <img
                              src={
                                analytics.topPerformingListing.image_url ||
                                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"
                              }
                              alt={analytics.topPerformingListing.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">
                              {analytics.topPerformingListing.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {analytics.topPerformingListing.leads_count || 0}{" "}
                              leads
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No listings yet
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Recent Leads
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsLoading ? (
                        <div className="flex items-center justify-center h-12">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : analytics.recentLeads &&
                        analytics.recentLeads.length > 0 ? (
                        <div className="space-y-2">
                          {analytics.recentLeads
                            .slice(0, 3)
                            .map((lead, index) => (
                              <div
                                key={lead.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>
                                      {lead.name
                                        ? lead.name
                                            .substring(0, 2)
                                            .toUpperCase()
                                        : "??"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">
                                    {lead.name || lead.email}
                                  </span>
                                </div>
                                <Badge variant="outline">
                                  {new Date(
                                    lead.created_at,
                                  ).toLocaleDateString()}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No leads yet
                        </p>
                      )}
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

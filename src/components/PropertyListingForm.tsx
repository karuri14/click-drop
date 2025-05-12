import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  PlusCircle,
  X,
  Upload,
  MapPin,
  DollarSign,
  Type,
  FileText,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  price: z.string().min(1, { message: "Price is required" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  location: z.string().min(5, { message: "Location is required" }),
  ctaType: z.enum(["book_call", "interested", "both"], {
    required_error: "Please select a CTA type",
  }),
});

type PropertyFormValues = z.infer<typeof formSchema>;

interface PropertyListingFormProps {
  onSubmit?: (data: PropertyFormValues & { images: File[] }) => void;
  initialData?: PropertyFormValues & { images?: string[] };
  isEditing?: boolean;
}

export default function PropertyListingForm({
  onSubmit,
  initialData,
  isEditing = false,
}: PropertyListingFormProps = {}) {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images || [],
  );

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      price: "",
      description: "",
      location: "",
      ctaType: "both",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages([...images, ...newFiles]);

      // Create preview URLs for the new images
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newUrls = [...imageUrls];
    URL.revokeObjectURL(newUrls[index]); // Clean up the URL object
    newUrls.splice(index, 1);
    setImageUrls(newUrls);
  };

  const handleSubmit = (values: PropertyFormValues) => {
    if (onSubmit) {
      onSubmit({
        ...values,
        images,
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isEditing ? "Edit Property Listing" : "Create New Property Listing"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Property Images</h3>
              <div className="grid grid-cols-3 gap-4">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden border border-gray-200"
                  >
                    <img
                      src={url}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer bg-gray-50">
                  <div className="flex flex-col items-center justify-center py-4 px-2 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600">
                      Upload Image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                  />
                </label>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Property Details</h3>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Title</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Type className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="3 Bedroom Apartment in City Center"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="250,000"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="123 Main St, City, State"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Textarea
                          placeholder="Describe the property, its features, and any other important details..."
                          className="min-h-32 pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Lead Capture Settings</h3>
              <FormField
                control={form.control}
                name="ctaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call-to-Action Buttons</FormLabel>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div
                        className={`border rounded-lg p-4 cursor-pointer ${field.value === "book_call" ? "border-primary bg-primary/5" : "border-gray-200"}`}
                        onClick={() => form.setValue("ctaType", "book_call")}
                      >
                        <Phone className="h-6 w-6 mb-2 text-primary" />
                        <h4 className="font-medium">Book a Call</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Allow prospects to schedule a call with you
                        </p>
                      </div>
                      <div
                        className={`border rounded-lg p-4 cursor-pointer ${field.value === "interested" ? "border-primary bg-primary/5" : "border-gray-200"}`}
                        onClick={() => form.setValue("ctaType", "interested")}
                      >
                        <PlusCircle className="h-6 w-6 mb-2 text-primary" />
                        <h4 className="font-medium">I'm Interested</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Simple button for expressing interest
                        </p>
                      </div>
                      <div
                        className={`border rounded-lg p-4 cursor-pointer ${field.value === "both" ? "border-primary bg-primary/5" : "border-gray-200"}`}
                        onClick={() => form.setValue("ctaType", "both")}
                      >
                        <div className="flex space-x-1 mb-2">
                          <Phone className="h-6 w-6 text-primary" />
                          <PlusCircle className="h-6 w-6 text-primary" />
                        </div>
                        <h4 className="font-medium">Both Options</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Include both CTA buttons
                        </p>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 pt-6 flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update Listing" : "Create Listing"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

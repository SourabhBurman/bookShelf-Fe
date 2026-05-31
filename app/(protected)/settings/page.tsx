"use client";

import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Settings, Save, MapPin, Clock, Banknote } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function OwnerSettingsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  let role = "user";
  if (user?.role) {
    role =
      typeof user.role === "string"
        ? user.role
        : String(user.role.type || user.role).toLowerCase();
  }

  if (role !== "owner") {
    return (
      <DashboardShell userTitle="Unauthorized">
        <Forbidden />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell userTitle="Library Settings">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Navigation / Sections */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          <Button
            variant="ghost"
            className="justify-start bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
          >
            <Settings className="mr-2 h-4 w-4" /> General Configuration
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <MapPin className="mr-2 h-4 w-4" /> Location & Address
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <Clock className="mr-2 h-4 w-4" /> Operating Hours
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <Banknote className="mr-2 h-4 w-4" /> Fines & Fees
          </Button>
        </div>

        {/* Settings Forms */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg font-semibold">
                General Information
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Update your library&apos;s public profile and branding.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Library Name</Label>
                <Input
                  defaultValue="Central City Library"
                  className="bg-zinc-950/50 border-white/10 text-white focus-visible:ring-purple-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Contact Email</Label>
                <Input
                  defaultValue="hello@centralcitylib.com"
                  className="bg-zinc-950/50 border-white/10 text-white focus-visible:ring-purple-500/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Public Description</Label>
                <textarea
                  defaultValue="A massive collection of digital and physical books located in the heart of the city."
                  className="w-full rounded-md bg-zinc-950/50 border border-white/10 text-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 min-h-[100px] resize-y"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4 flex justify-end">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg font-semibold">
                Fines & Penalties
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Configure automated daily fees for overdue rentals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Overdue Fee (Per Day)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                      $
                    </span>
                    <Input
                      defaultValue="1.50"
                      className="pl-8 bg-zinc-950/50 border-white/10 text-white focus-visible:ring-purple-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Max Fine Cap</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                      $
                    </span>
                    <Input
                      defaultValue="30.00"
                      className="pl-8 bg-zinc-950/50 border-white/10 text-white focus-visible:ring-purple-500/50"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-4 flex justify-end">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20">
                <Save className="mr-2 h-4 w-4" /> Save Pricing
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

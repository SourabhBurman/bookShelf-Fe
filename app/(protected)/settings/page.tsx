"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { User_Roles } from "@/graphql/generated/graphql";
import { Settings, Save, MapPin } from "lucide-react";
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
import { UpdateLibraryDocument } from "@/graphql/library/mutations.generated";

export default function OwnerSettingsPage() {
  const { user, setUser, isLoading } = useAuth();
  // The parent protected layout only renders this page once `user` has
  // loaded, so it's safe to seed the form from it directly on mount.
  const [name, setName] = useState(() => user?.library_owned?.name || "");
  const [address, setAddress] = useState(
    () => user?.library_owned?.address || "",
  );
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  const [updateLibrary, { loading: isSaving }] = useMutation(
    UpdateLibraryDocument,
  );

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (user?.role?.type !== User_Roles.LibraryOwner) {
    return <Forbidden />;
  }

  const handleSave = async () => {
    if (!user?.library_owned?.id) return;
    try {
      setSaveError("");
      setSaved(false);
      const { data } = await updateLibrary({
        variables: {
          id: user.library_owned.id,
          input: { name: name.trim(), address: address.trim() },
        },
      });
      if (data?.updateLibrary) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                library_owned: {
                  ...prev.library_owned,
                  name: data.updateLibrary?.name ?? prev.library_owned?.name,
                  address:
                    data.updateLibrary?.address ?? prev.library_owned?.address,
                },
              }
            : prev,
        );
        setSaved(true);
      }
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save changes");
    }
  };

  return (
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
      </div>

      {/* Settings Form */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              Library Profile
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Update your library&apos;s name and address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Library Name</Label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaved(false);
                }}
                className="bg-zinc-950/50 border-white/10 text-white focus-visible:ring-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Address</Label>
              <Input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setSaved(false);
                }}
                className="bg-zinc-950/50 border-white/10 text-white focus-visible:ring-purple-500/50"
              />
            </div>
            {saveError && <p className="text-sm text-rose-400">{saveError}</p>}
            {saved && (
              <p className="text-sm text-emerald-400">
                Changes saved successfully.
              </p>
            )}
          </CardContent>
          <CardFooter className="border-t border-white/5 pt-4 flex justify-end">
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20"
              disabled={isSaving || !name.trim() || !address.trim()}
              onClick={handleSave}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

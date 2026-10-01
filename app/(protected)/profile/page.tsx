"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "@/context/AuthContext";
import { User, Save, KeyRound, Mail } from "lucide-react";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Gender } from "@/graphql/generated/graphql";
import { UpdateUserDocument } from "@/graphql/user/mutations.generated";

export default function ProfilePage() {
  const { user, setUser, isLoading } = useAuth();
  const [name, setName] = useState(() => user?.name || "");
  const [gender, setGender] = useState<Gender>(
    () => user?.gender || Gender.Other,
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [updateUser, { loading: isSavingProfile }] =
    useMutation(UpdateUserDocument);
  const [updatePassword, { loading: isSavingPassword }] =
    useMutation(UpdateUserDocument);

  if (isLoading || !user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (!user.id) return;
    try {
      setProfileError("");
      setProfileSaved(false);
      const { data } = await updateUser({
        variables: { id: user.id, input: { name: name.trim(), gender } },
      });
      if (data?.updateUser) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                name: data.updateUser?.name ?? prev.name,
                gender: data.updateUser?.gender ?? prev.gender,
              }
            : prev,
        );
        setProfileSaved(true);
      }
    } catch (e) {
      setProfileError(e instanceof Error ? e.message : "Failed to save changes");
    }
  };

  const handleChangePassword = async () => {
    if (!user.id) return;
    setPasswordError("");
    setPasswordSaved(false);
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    try {
      await updatePassword({
        variables: { id: user.id, input: { password: newPassword } },
      });
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
    } catch (e) {
      setPasswordError(
        e instanceof Error ? e.message : "Failed to change password",
      );
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-3 py-4 rounded-lg bg-zinc-900/50 border border-white/5">
          <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0">
            <User className="h-5 w-5 text-purple-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">
              {user.name}
            </span>
            <span className="text-xs text-zinc-400 truncate">
              {user.role?.displayName}
            </span>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-col gap-8">
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold">
              Personal Information
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Update your name and gender.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setProfileSaved(false);
                }}
                className="bg-zinc-950/50 border-white/10 text-white focus-visible:ring-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> Email
              </Label>
              <Input
                value={user.email ?? ""}
                readOnly
                disabled
                className="bg-zinc-950/30 border-white/5 text-zinc-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Gender</Label>
              <ToggleGroup
                type="single"
                value={gender}
                onValueChange={(val) => {
                  if (val) {
                    setGender(val as Gender);
                    setProfileSaved(false);
                  }
                }}
                className="justify-start gap-3"
              >
                <ToggleGroupItem
                  value={Gender.Male}
                  className="flex-1 border border-white/10 bg-zinc-950/50 data-[state=on]:bg-purple-500/20 data-[state=on]:text-purple-400 data-[state=on]:border-purple-500/50 text-zinc-300"
                >
                  Male
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={Gender.Female}
                  className="flex-1 border border-white/10 bg-zinc-950/50 data-[state=on]:bg-purple-500/20 data-[state=on]:text-purple-400 data-[state=on]:border-purple-500/50 text-zinc-300"
                >
                  Female
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={Gender.Other}
                  className="flex-1 border border-white/10 bg-zinc-950/50 data-[state=on]:bg-purple-500/20 data-[state=on]:text-purple-400 data-[state=on]:border-purple-500/50 text-zinc-300"
                >
                  Other
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {profileError && (
              <p className="text-sm text-rose-400">{profileError}</p>
            )}
            {profileSaved && (
              <p className="text-sm text-emerald-400">
                Changes saved successfully.
              </p>
            )}
          </CardContent>
          <CardFooter className="border-t border-white/5 pt-4 flex justify-end">
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20"
              disabled={isSavingProfile || !name.trim()}
              onClick={handleSaveProfile}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSavingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-purple-400" /> Change Password
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Choose a new password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordSaved(false);
                }}
                className="bg-zinc-950/50 border-white/10 text-white focus-visible:ring-purple-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordSaved(false);
                }}
                className="bg-zinc-950/50 border-white/10 text-white focus-visible:ring-purple-500/50"
              />
            </div>
            {passwordError && (
              <p className="text-sm text-rose-400">{passwordError}</p>
            )}
            {passwordSaved && (
              <p className="text-sm text-emerald-400">
                Password changed successfully.
              </p>
            )}
          </CardContent>
          <CardFooter className="border-t border-white/5 pt-4 flex justify-end">
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20"
              disabled={isSavingPassword || !newPassword || !confirmPassword}
              onClick={handleChangePassword}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSavingPassword ? "Saving..." : "Change Password"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { CreateLibraryDocument } from "@/graphql/library/mutations.generated";
import { BookImportFlow } from "@/components/library/BookImportFlow";
import { useState } from "react";
import { Library, Building2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Library as LibrayType, User_Roles } from "@/graphql/generated/graphql";
import MyLoading from "@/components/myLoading";
import { Field, Form, useForm } from "@formisch/react";
import * as v from "valibot";
import { FieldLabel } from "@/components/ui/field";

const setupSchema = v.object({
  name: v.pipe(
    v.string("Library Name is required"),
    v.minLength(3, "Name must be at least 3 characters"),
  ),
  address: v.pipe(
    v.string("Address is required"),
    v.minLength(5, "Address must be at least 5 characters"),
  ),
});

type SetupSchema = v.InferInput<typeof setupSchema>;

export default function LibrarySetupPage() {
  const { user, setUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [newLibrary, setNewLibrary] = useState<LibrayType | null>(null);

  const [createLibrary, { loading }] = useMutation(CreateLibraryDocument, {
    onCompleted: (data) => {
      if (data.createLibrary) {
        setNewLibrary(data.createLibrary);
        setStep(2);
      }
    },
  });

  const finishSetup = () => {
    if (user && newLibrary) {
      setUser({
        ...user,
        library_owned: newLibrary,
      });
    }
    router.replace("/dashboard");
  };

  const setupForm = useForm({
    schema: setupSchema,
  });

  if (isAuthLoading) {
    return <MyLoading />;
  }

  if (user?.role?.type !== User_Roles.LibraryOwner) {
    return <Forbidden />;
  }

  // Check if they already have a library
  if (user?.library_owned) {
    router.push("/dashboard");
    return null;
  }

  const handleFormSubmission = (response: SetupSchema) => {
    createLibrary({
      variables: {
        input: {
          name: response.name,
          address: response.address,
        },
      },
    });
  };

  if (step === 2 && newLibrary?.id) {
    return (
      <div className="py-12 w-full px-4">
        <BookImportFlow
          libraryId={newLibrary.id as string}
          onComplete={finishSetup}
          onSkip={finishSetup}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-10">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 mb-6 border border-purple-500/20 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]">
          <Library className="h-8 w-8 text-purple-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">
          Set Up Your Library
        </h1>
        <p className="text-zinc-400 text-lg">
          Welcome, Owner! Create your library profile to start adding books to
          your inventory and taking orders.
        </p>
      </div>

      <Form
        of={setupForm}
        onSubmit={handleFormSubmission}
        className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl"
      >
        <div className="space-y-4">
          <Field of={setupForm} path={["name"]}>
            {(field) => (
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-zinc-300 flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4 text-purple-400" /> Library Name
                </label>
                <Input
                  id="name"
                  value={field.input ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="e.g. Central City Library"
                  className="bg-zinc-950 border-white/10 text-white h-12 rounded-xl focus-visible:ring-purple-500/50"
                  required
                />
                {field.errors && (
                  <p className="text-sm text-rose-500 animate-in fade-in slide-in-from-top-1">
                    {field.errors}
                  </p>
                )}
              </div>
            )}
          </Field>

          <Field of={setupForm} path={["address"]}>
            {(field) => (
              <div className="space-y-2">
                <FieldLabel htmlFor="input-invalid">Invalid Input</FieldLabel>
                <label
                  htmlFor="address"
                  className="text-sm font-medium text-zinc-300 flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-purple-400" /> Library Address
                </label>
                <Input
                  id="address"
                  value={field.input ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="e.g. 123 Main St, New York, NY 10001"
                  className="bg-zinc-950 border-white/10 text-white h-12 rounded-xl focus-visible:ring-purple-500/50"
                  required
                />
                {field.errors && (
                  <p className="text-sm text-rose-500 animate-in fade-in slide-in-from-top-1">
                    {field.errors}
                  </p>
                )}
              </div>
            )}
          </Field>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold shadow-[0_0_20px_-3px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating Library...
            </div>
          ) : (
            "Create Library Profile"
          )}
        </Button>
      </Form>
    </div>
  );
}

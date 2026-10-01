"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Forbidden } from "@/components/ui/Forbidden";
import { User_Roles } from "@/graphql/generated/graphql";
import {
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
} from "@/graphql/review/hooks";
import { GetAllReviewsDocument } from "@/graphql/review/queries.generated";
import { AlertCircle, Star, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 15;

export default function AdminReviewsPage() {
  const { user, isLoading } = useAuth();
  const { allReviews, allReviewsLoading, allReviewsError } =
    useGetAllReviewsQuery();
  const [deleteReview, { loading: isDeleting }] = useDeleteReviewMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(allReviews.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedReviews = useMemo(
    () => allReviews.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [allReviews, safePage],
  );

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setActionError("");
      await deleteReview({
        variables: { id: deletingId },
        refetchQueries: [{ query: GetAllReviewsDocument }],
      });
      setDeletingId(null);
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Failed to delete review",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (user?.role?.type !== User_Roles.Admin) {
    return <Forbidden />;
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-white text-lg font-semibold">
              Review Moderation
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {allReviews.length}{" "}
              {allReviews.length === 1 ? "review" : "reviews"} across the
              catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {allReviewsLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
              </div>
            ) : allReviewsError ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <AlertCircle className="h-8 w-8 text-rose-500 mb-3" />
                <p className="text-zinc-300 font-medium mb-1">
                  Couldn&apos;t load reviews
                </p>
                <p className="text-zinc-500 text-sm break-all">
                  {allReviewsError.message}
                </p>
              </div>
            ) : allReviews.length === 0 ? (
              <div className="p-10 text-center text-zinc-400">
                No reviews have been submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                    <tr>
                      <th className="px-6 py-4 font-medium">Book</th>
                      <th className="px-6 py-4 font-medium">Reviewer</th>
                      <th className="px-6 py-4 font-medium">Rating</th>
                      <th className="px-6 py-4 font-medium">Comment</th>
                      <th className="px-6 py-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedReviews.map((r) => (
                      <tr
                        key={r?.id}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-4 text-white font-medium">
                          {r?.book?.name}
                        </td>
                        <td className="px-6 py-4 text-zinc-300">
                          <div>{r?.user?.name}</div>
                          <div className="text-xs text-zinc-500">
                            {r?.user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < (r?.rating ?? 0) ? "text-yellow-500 fill-yellow-500" : "text-zinc-600"}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400 max-w-xs truncate">
                          {r?.comment}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setActionError("");
                              setDeletingId(r?.id ?? null);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Dialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <DialogContent className="border-white/10 bg-zinc-950 text-white">
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will permanently remove this review. This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {actionError && <p className="text-sm text-rose-400">{actionError}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-transparent border-white/10 text-white hover:bg-white/5"
              onClick={() => setDeletingId(null)}
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-500 hover:bg-rose-600 text-white"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

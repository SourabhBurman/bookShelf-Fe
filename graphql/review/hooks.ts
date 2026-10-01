import { useQuery, useMutation } from "@apollo/client/react";
import { GetReviewsForBookDocument, GetAllReviewsDocument } from "./queries.generated";
import { CreateReviewDocument, DeleteReviewDocument } from "./mutations.generated";

export const useGetReviewsForBookQuery = (bookId: string) => {
  const { data, loading, error, refetch } = useQuery(
    GetReviewsForBookDocument,
    {
      variables: { bookId },
      skip: !bookId,
    },
  );
  return {
    reviews: data?.getReviewsForBook ?? [],
    reviewsLoading: loading,
    reviewsError: error,
    refetchReviews: refetch,
  };
};

export const useCreateReviewMutation = () => useMutation(CreateReviewDocument);
export const useDeleteReviewMutation = () => useMutation(DeleteReviewDocument);

export const useGetAllReviewsQuery = () => {
  const { data, loading, error, refetch } = useQuery(GetAllReviewsDocument);
  return {
    allReviews: data?.getAllReviews ?? [],
    allReviewsLoading: loading,
    allReviewsError: error,
    refetchAllReviews: refetch,
  };
};

import { useQuery, useMutation } from "@apollo/client/react";
import { GetMyWaitlistDocument } from "./queries.generated";
import { JoinWaitlistDocument, LeaveWaitlistDocument } from "./mutations.generated";

export const useGetMyWaitlistQuery = (skip?: boolean) => {
  const { data, loading, error, refetch } = useQuery(GetMyWaitlistDocument, {
    skip,
  });
  return {
    waitlist: data?.getMyWaitlist ?? [],
    waitlistLoading: loading,
    waitlistError: error,
    refetchWaitlist: refetch,
  };
};

export const useJoinWaitlistMutation = () => useMutation(JoinWaitlistDocument);
export const useLeaveWaitlistMutation = () => useMutation(LeaveWaitlistDocument);

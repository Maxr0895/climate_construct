import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.subcontractor.$post>;
type RequestType = InferRequestType<typeof client.api.subcontractor.$post>["json"];

export const useCreateSubcontractor = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.subcontractor.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Subcontractor created");
      queryClient.invalidateQueries({ queryKey: ["subcontractor"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to create subcontractor");
    },
  });

  return mutation;
};

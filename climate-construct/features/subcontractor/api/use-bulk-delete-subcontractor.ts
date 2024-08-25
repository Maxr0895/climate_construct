import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.subcontractor["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.subcontractor["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteSubcontractor = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.subcontractor["bulk-delete"]["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Subcontractor deleted");
      queryClient.invalidateQueries({ queryKey: ["subcontractor"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete subcontractor");
    },
  });

  return mutation;
};

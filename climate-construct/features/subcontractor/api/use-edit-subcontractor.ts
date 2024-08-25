import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.subcontractor[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.subcontractor[":id"]["$patch"]>["json"];

export const useEditSubcontractor = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.subcontractor[":id"]["$patch"]({ 
        param: { id },
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Subcontractor updated");
      queryClient.invalidateQueries({ queryKey: ["subcontractor", { id }] });
      queryClient.invalidateQueries({ queryKey: ["subcontractors"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to edit subcontractor");
    },
  });

  return mutation;
};
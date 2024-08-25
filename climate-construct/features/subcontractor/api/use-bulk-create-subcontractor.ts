import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.subcontractor["bulk-create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.subcontractor["bulk-create"]["$post"]>["json"];

export const useBulkCreateSubcontractor = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
       console.log(json);
      const response = await client.api.subcontractor["bulk-create"]["$post"]({ json });
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

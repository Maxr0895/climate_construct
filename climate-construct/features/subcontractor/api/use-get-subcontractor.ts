import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetSubcontractor = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["subcontractor", { id }],
    queryFn: async () => {
      const response = await client.api.subcontractor[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subcontractor");
      }

      const { data } = await response.json();
      return {
        ...data,
        amount: convertAmountFromMiliunits(data.amount),
      };
    },
  });

  return query;
};
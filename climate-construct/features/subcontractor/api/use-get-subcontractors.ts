import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetSubcontractors = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["subcontractors", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.subcontractor.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subcontractors");
      }

      const { data } = await response.json();
      return data.map((subcontractor) => ({
        ...subcontractor,
        amount: convertAmountFromMiliunits(subcontractor.amount),
      }));
    },
  });

  return query;
};
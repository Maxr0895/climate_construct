"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { useNewSubcontractor } from "@/features/subcontractor/hooks/use-new-subcontractor";
import { useGetSubcontractors } from "@/features/subcontractor/api/use-get-subcontractors"; // Updated
import { useBulkDeleteSubcontractor } from "@/features/subcontractor/api/use-bulk-delete-subcontractor"; // Updated
import { useBulkCreateSubcontractor } from "@/features/subcontractor/api/use-bulk-create-subcontractor"; // Updated

import { NewSubcontractorSheet } from "@/features/subcontractor/components/new-subcontractor-sheet";
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";


import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";

import { subcontractors as subcontractorSchema } from "@/db/schema"; // Updated
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { columns } from "./columns";
import { ImportCard } from "./import-card";
import { UploadButton } from "./upload-button";

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULTS = { 
  data: [],
  errors: [],
  meta: {},
};

const SubcontractorPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log({ results });
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const newSubcontractor = useNewSubcontractor();
  const createSubcontractors = useBulkCreateSubcontractor(); // Updated
  const deleteSubcontractors = useBulkDeleteSubcontractor(); // Updated
  const subcontractorsQuery = useGetSubcontractors(); // Updated
  const subcontractors = Array.isArray(subcontractorsQuery.data) ? subcontractorsQuery.data : []; // Updated

  const isDisabled =
    subcontractorsQuery.isLoading ||
    deleteSubcontractors.isPending; // Updated

  const onSubmitImport = async (
    values: typeof subcontractorSchema.$inferInsert[], // Updated
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error("Please select an account to continue.");
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
      date: new Date(value.date),
    }));

    createSubcontractors.mutate(data, { // Updated
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  if (subcontractorsQuery.isLoading) { // Updated
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }

  return ( 
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Subcontractor History
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button 
               onClick={() => {
    console.log('newSubcontractor state:', newSubcontractor);
    newSubcontractor.onOpen();
  }} 
              size="sm"
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="supplier"
            columns={columns} 
            data={subcontractors} // Updated
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteSubcontractors.mutate({ ids }); // Updated
            }}
            disabled={isDisabled} // Updated
          />
        </CardContent>
      </Card>
     
    </div>
  );
};
 
export default SubcontractorPage;
import { z } from "zod";
import { Loader2, Volume } from "lucide-react";

import { useGetSubcontractor } from "@/features/subcontractor/api/use-get-subcontractor";
import { useOpenSubcontractor } from "@/features/subcontractor/hooks/use-open-subcontractor";
import { useEditSubcontractor } from "@/features/subcontractor/api/use-edit-subcontractor";
import { useDeleteSubcontractor } from "@/features/subcontractor/api/use-delete-subcontractor";
import { SubcontractorForm } from "@/features/subcontractor/components/subcontractor-form";

import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

import { useConfirm } from "@/hooks/use-confirm";
import { insertSubcontractorSchema } from "@/db/schema";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const formSchema = insertSubcontractorSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditSubcontractorSheet = () => {
  const { isOpen, onClose, id } = useOpenSubcontractor();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this subcontractor."
  );

  const subcontractorQuery = useGetSubcontractor(id);
  const editMutation = useEditSubcontractor(id);
  const deleteMutation = useDeleteSubcontractor(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({
    name
  });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({
    name
  });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    subcontractorQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = 
    subcontractorQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        }
      });
    }
  };

  const defaultValues = subcontractorQuery.data ? {
    accountId: subcontractorQuery.data.accountId,
    categoryId: subcontractorQuery.data.categoryId,
    amount: subcontractorQuery.data.amount.toString(),
    date: subcontractorQuery.data.date 
      ? new Date(subcontractorQuery.data.date)
      : new Date(),
    supplier: subcontractorQuery.data.supplier,
    units: subcontractorQuery.data.units,
    volume: subcontractorQuery.data.volume,
    notes: subcontractorQuery.data.notes,
    expense_category: subcontractorQuery.data.expense_category,
  } : {
    accountId: "",
    categoryId: "",
    amount: "",
    date: new Date(),
    supplier: "",
    units: "",
    volume: "",
    notes: "",
    expense_category: "",
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit Subcontractor
            </SheetTitle>
            <SheetDescription>
              Edit an existing subcontractor
            </SheetDescription>
          </SheetHeader>
          {isLoading
            ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 text-muted-foreground animate-spin" />
              </div>
            ) : (
              <SubcontractorForm
                id={id}
                defaultValues={defaultValues}
                onSubmit={onSubmit}
                onDelete={onDelete}
                disabled={isPending}
                categoryOptions={categoryOptions}
                onCreateCategory={onCreateCategory}
                accountOptions={accountOptions}
                onCreateAccount={onCreateAccount}
              />
            )
          }
        </SheetContent>
      </Sheet>
    </>
  );
};

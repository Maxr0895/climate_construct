import { z } from "zod";
import { Loader2 } from "lucide-react";

import { SubcontractorForm } from "@/features/subcontractor/components/subcontractor-form";
import { useNewSubcontractor } from "@/features/subcontractor/hooks/use-new-subcontractor";
import { useCreateSubcontractor } from "@/features/subcontractor/api/use-create-subcontractor";

import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

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

export const NewSubcontractorSheet = () => {
  const { isOpen, onClose } = useNewSubcontractor();
  console.log('NewSubcontractorSheet rendered, isOpen:', isOpen);
  const createMutation = useCreateSubcontractor();

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
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading =
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    console.log("handleOpenChange called with open:", open);
    if (open) {
      console.log("Sheet opened");
    } else {
      console.log("Sheet closed");
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            New Subcontractor
          </SheetTitle>
          <SheetDescription>
            Add a new Subcontractor
          </SheetDescription>
        </SheetHeader>
        {isLoading
          ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          )
          : (
            <SubcontractorForm
              onSubmit={onSubmit}
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
  );
};
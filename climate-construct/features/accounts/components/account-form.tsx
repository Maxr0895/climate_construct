import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePickers } from "@/components/date-pickers";
import { format } from 'date-fns';
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertAccountSchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = insertAccountSchema.pick({
  name: true,
  division: true, // Include division in form schema
    startDate: true, // Include startDate in form schema
  endDate: true, // Include endDate in form schema
  operationalControl: true, // Include operationalControl in form schema
  projectCode: true, // Include projectCode in form schema
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };
  
  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Project Name, Project Number"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

     <FormField
          name="projectCode"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Project Code
              </FormLabel>
              <FormControl>
                <Input
  {...field}
  value={field.value || ''}
  disabled={disabled}
  placeholder="e.g. Project Code"
/>
              </FormControl>
            </FormItem>
          )}
        />

 <FormField
          name="operationalControl"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Operational Control
              </FormLabel>
              <FormControl>
               <Select
  {...field}
  value={field.value || ''}
  disabled={disabled}
>
  <option value="">Select...</option>
  <option value="true">Yes</option>
  <option value="false">No</option>
</Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="division"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Division
              </FormLabel>
                <FormControl>
        <Input
          {...field}
          value={field.value || ''} // Define value after spreading field
          disabled={disabled}
          placeholder="e.g. Division Name"
        />
      </FormControl>
            </FormItem>
          )}
        />

 <FormField
        name="startDate"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Start Date
            </FormLabel>
            <FormControl>
             <DatePickers
  value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : undefined}
  onChange={(date?: Date) => date && field.onChange(format(date, 'yyyy-MM-dd'))}
  disabled={disabled}
/>
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        name="endDate"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              End Date
            </FormLabel>
            <FormControl>
              <DatePickers
  value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : undefined}
  onChange={(date?: Date) => date && field.onChange(format(date, 'yyyy-MM-dd'))}
  disabled={disabled}
/>
            </FormControl>
          </FormItem>
        )}
      />

        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create account"}
        </Button>
        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="size-4 mr-2" />
            Delete account
          </Button>
        )}
      </form>
    </Form>
  )
};

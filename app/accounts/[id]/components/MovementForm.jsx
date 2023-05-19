import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function MovementForm({
  account,
  categories,
  currencies,
  isPending,
  onSubmit,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isPending}>
        <input
          hidden
          name="accountId"
          value={account.id}
          {...register("accountId")}
        />
        <div className="mt-2 flex gap-2">
          <div className="relative mb-5 basis-1/2">
            <Label>
              Title
              <Input
                id="title"
                name="title"
                className={errors.title ? "border-red-600" : ""}
                {...register("title", { required: "Title is required" })}
              />
            </Label>
            {errors.title ? (
              <small className="absolute -bottom-5 text-xs text-red-600">
                {errors.title.message}
              </small>
            ) : null}
          </div>
          <div className="relative mb-5 basis-1/2">
            <Label htmlFor="category">
              Category
              <Controller
                name="categoryId"
                control={control}
                rules={{
                  validate: (value, formSate) => {
                    if (!value) {
                      return "Category is required";
                    }

                    return null;
                  },
                }}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={errors.categoryId ? "border-red-600" : ""}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Income</SelectLabel>
                        {categories
                          .filter(
                            (category) =>
                              category.movement_types.type === "income"
                          )
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Spent</SelectLabel>
                        {categories
                          .filter(
                            (category) =>
                              category.movement_types.type === "spent"
                          )
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Label>
            {errors.categoryId ? (
              <small className="absolute -bottom-5 text-xs text-red-600">
                {errors.categoryId.message}
              </small>
            ) : null}
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <div className=" relative mb-5 basis-1/2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              className={errors.title ? "border-red-600" : ""}
              {...register("amount", {
                required: "Amount is required",
                valueAsNumber: true,
              })}
            />
            {errors.amount ? (
              <small className="absolute -bottom-5 text-xs text-red-600">
                {errors.amount.message}
              </small>
            ) : null}
          </div>
          <div className="relative mb-5 basis-1/2">
            <Label htmlFor="currency">Currency</Label>
            <Controller
              name="currencyId"
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) {
                    return "Currency is required";
                  }

                  return null;
                },
              }}
              render={({ field }) => (
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={errors.currencyId ? "border-red-600" : ""}
                  >
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.id} value={currency.id}>
                        {currency.name} ({currency.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.currencyId ? (
              <small className="absolute -bottom-5 text-xs text-red-600">
                {errors.currencyId.message}
              </small>
            ) : null}
          </div>
        </div>
        <Label htmlFor="description">
          Description
          <Textarea className="resize-none" {...register("description")} />
        </Label>
        <div className="mt-4 flex justify-end">
          <Button className="bg-green-600" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </fieldset>
    </form>
  );
}

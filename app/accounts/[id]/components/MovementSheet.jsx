"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function MovementSheet({
  account,
  movement,
  currencies,
  categories,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToogleIsOpen = () => {
    setIsOpen((old) => !old);
  };

  return (
    <>
      <Button className="bg-green-600" onClick={handleToogleIsOpen}>
        New movement
      </Button>

      <Sheet open={isOpen} onOpenChange={handleToogleIsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{movement ? "Edit" : "Create"} Movement</SheetTitle>
          </SheetHeader>
          <form className="mt-4">
            <input hidden name="account" value={account.id} />
            <div className="mt-2 flex gap-2">
              <div className="basis-1/2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" />
              </div>
              <div className="basis-1/2">
                <Label htmlFor="category">Category</Label>
                <Select id="category" name="category">
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <div className="basis-1/2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" name="amount" type="number" />
              </div>
              <div className="basis-1/2">
                <Label htmlFor="currency">Currency</Label>
                <Select id="currency" name="currency">
                  <SelectTrigger className="">
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
              </div>
            </div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="resize-none"
            />
            <div className="mt-4 flex justify-end">
              <Button className="bg-green-600">save</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

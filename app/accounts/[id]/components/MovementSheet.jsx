import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import MovementForm from "./MovementForm";
import useMutation from "@/hooks/useMutation";
import { useToast } from "@/components/ui/use-toast";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MovementSheet({
  isOpen,
  account,
  movement,
  currencies,
  categories,
  onClose,
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation("movements");

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const onSubmit = (data) => {
    mutate({
      data,
      onSuccess: () => {
        toast({
          title: (
            <div className="border-se flex items-center gap-2">
              <Check className="h-4 w-4" />
              Movement created successfully!
            </div>
          ),
          variant: "success",
        });
        onClose();
        router.refresh();
      },
      onError: (e) => {
        console.log(">>>", e);
        toast({
          title: (
            <div className="border-se flex items-center gap-2">
              <X className="h-4 w-4" />
              Oops, there's been an error!
            </div>
          ),
          variant: "error",
        });
      },
    });
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{movement ? "Edit" : "Create"} Movement</SheetTitle>
          </SheetHeader>
          <MovementForm
            account={account}
            currencies={currencies}
            categories={categories}
            isPending={isPending}
            onSubmit={onSubmit}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

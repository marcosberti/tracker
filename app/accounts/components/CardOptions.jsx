import { Edit2, Loader2, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CardOptions({
  isPending,
  canDelete,
  onEdit,
  onDelete,
}) {
  return (
    <div className="absolute right-2 top-2 hidden group-hover:block">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownItemDialog
            isPending={isPending}
            disabled={!canDelete}
            onConfirm={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownItemDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function DropdownItemDialog({ disabled, isPending, onConfirm, children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          // disabled={disabled}
          onSelect={(e) => e.preventDefault()}
        >
          {children}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this account?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="bg-green-600"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

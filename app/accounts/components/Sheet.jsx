import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { patchAction } from '../actions';

export default function AccountSheet({ isOpen, account, onOpenChange }) {
	// TODO: add zod validations
	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent size="content">
				<SheetHeader>
					<SheetTitle>{account ? 'Edit' : 'Create'} account</SheetTitle>
				</SheetHeader>
				<form action={patchAction} className="mt-4">
					<div className="mb-2">
						<Label htmlFor="name">Name</Label>
						<Input id="name" name="name" />
					</div>
					<div className="mb-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							name="description"
							className="resize-none"
						/>
					</div>
					<div className="mb-2 flex gap-4">
						<div className="basis-1/2">
							<Label htmlFor="currency">Currency</Label>
							<Select id="currency" name="currency">
								<SelectTrigger className="">
									<SelectValue placeholder="Select a currency" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">Light</SelectItem>
									<SelectItem value="dark">Dark</SelectItem>
									<SelectItem value="system">System</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="basis-1/2">
							<Label htmlFor="icon">Icon</Label>
							<Input id="icon" name="icon" />
							<small className="text-xs">
								You can find icons in{' '}
								<a
									className="text-blue-400 underline hover:text-blue-600"
									href="https://lucide.dev/"
									target="_blank"
								>
									this page
								</a>
							</small>
						</div>
					</div>

					<div className="flex justify-end">
						<Button className="w-24" type="submit">
							Save
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
}

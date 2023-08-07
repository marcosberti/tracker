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
import { Controller, useForm } from 'react-hook-form';
import FieldWithError from '@/app/components/field-with-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Info, Loader2, X } from 'lucide-react';
import { COLORS } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import useMutation from '@/hooks/useMutation';

function getDefaultValues(account) {
	return {
		accountId: account?.id,
		name: account?.name,
		currencyId: account?.currencies?.id,
		color: account?.color,
		icon: account?.icon,
		description: account?.description,
		main: account?.main ?? false,
	};
}

const COLOR_CLASSES = COLORS.reduce((acc, color) => {
	acc[color] = `bg-${color}-600`;
	return acc;
}, {});

function AccountForm({ isPending, account, currencies, onSubmit }) {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: getDefaultValues(account),
	});

	return (
		<form
			className="mt-4 flex flex-col gap-2"
			onSubmit={handleSubmit(onSubmit)}
			noValidate
		>
			<div className="flex gap-2">
				<FieldWithError className="basis-1/2" error={errors.name?.message}>
					<Label htmlFor="name">
						Name
						<Input
							className={errors.name ? 'border-red-600' : ''}
							{...register('name', { required: 'Name is required' })}
						/>
					</Label>
				</FieldWithError>
				<FieldWithError
					className="basis-1/2"
					error={errors.currencyId?.message}
				>
					<Label>
						Currency
						<Controller
							name="currencyId"
							control={control}
							rules={{
								validate: value => {
									if (!value) {
										return 'Currency is required';
									}

									return null;
								},
							}}
							render={({ field }) => (
								<Select
									defaultValue={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										className={errors.currencyId ? 'border-red-600' : ''}
									>
										<SelectValue placeholder="Select a currency" />
									</SelectTrigger>
									<SelectContent>
										{currencies.map(currency => (
											<SelectItem key={currency.id} value={currency.id}>
												{currency.name} ({currency.code})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</Label>
				</FieldWithError>
			</div>
			<div className="flex gap-2">
				<FieldWithError className="basis-1/2" error={errors.color?.message}>
					<Label>
						Color
						<Controller
							name="color"
							control={control}
							rules={{
								validate: value => {
									if (!value) {
										return 'Color is required';
									}

									return null;
								},
							}}
							render={({ field }) => (
								<Select
									defaultValue={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										className={errors.color ? 'border-red-600' : ''}
									>
										<SelectValue placeholder="Select a color" />
									</SelectTrigger>
									<SelectContent>
										{COLORS.map(color => (
											<SelectItem key={color} value={color}>
												<div className="flex items-center gap-2">
													{color}{' '}
													<div
														className={`h-4 w-4 rounded-md ${COLOR_CLASSES[color]}`}
													/>
												</div>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</Label>
				</FieldWithError>
				<FieldWithError className="basis-1/2" error={errors.icon?.message}>
					<Label>
						Icon
						<Input
							className={errors.icon ? 'border-red-600' : ''}
							{...register('icon', { required: 'Icon is required' })}
						/>
						<small className="mt-2 block text-xs">
							You can find icons in{' '}
							<a
								className="text-blue-400 underline hover:text-blue-600"
								href="https://lucide.dev/"
								target="_blank"
							>
								this page
							</a>
						</small>
					</Label>
				</FieldWithError>
			</div>
			<div>
				<Label>
					Description
					<Textarea className="resize-none" {...register('description')} />
				</Label>
			</div>
			<div>
				<Label className="flex items-center gap-2">
					<Controller
						name="main"
						control={control}
						render={({ field }) => (
							<Checkbox
								disabled={account?.main}
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
						)}
					/>
					Set as main account
				</Label>
				<Alert variant="info" className="mt-4 flex items-start">
					<div className="flex gap-2">
						<Info className="h-4 w-4" />
						<AlertDescription className="max-w-xs">
							There can only be one main account. If there is already one, it
							will be replace for this one
						</AlertDescription>
					</div>
				</Alert>
			</div>

			<div className="mt-4 flex  justify-end">
				<Button disabled={isPending}>
					{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Save
				</Button>
			</div>
		</form>
	);
}

export default function AccountSheet({ isOpen, account, currencies, onClose }) {
	const router = useRouter();
	const { toast } = useToast();
	const { mutate: postMutate, isPending: isPostPending } =
		useMutation('accounts');
	const { mutate: patchMutate, isPending: isPatchPending } = useMutation(
		'accounts',
		'PATCH',
	);
	const isPending = isPostPending || isPatchPending;

	const handleClose = () => {
		if (isPending) return;
		onClose();
	};

	const handleSubmit = values => {
		const mutate = account ? patchMutate : postMutate;
		const data = account ? { ...values, accountId: account.id } : values;
		mutate({
			data,
			onSuccess: () => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<Check className="h-4 w-4" />
							Account {account ? 'updated' : 'created'} successfully!
						</div>
					),
					variant: 'success',
				});
				onClose();
				router.refresh();
			},
			onError: e => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<X className="h-4 w-4" />
							Oops, there's been an error!
						</div>
					),
					variant: 'error',
				});
			},
		});
	};

	return (
		<Sheet open={isOpen} onOpenChange={handleClose}>
			<SheetContent size="content">
				<SheetHeader>
					<SheetTitle>{account ? 'Edit' : 'Create'} account</SheetTitle>
				</SheetHeader>
				<AccountForm
					isPending={isPending}
					account={account}
					currencies={currencies}
					onSubmit={handleSubmit}
				/>
			</SheetContent>
		</Sheet>
	);
}

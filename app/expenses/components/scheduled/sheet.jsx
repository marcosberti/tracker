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
import { Textarea } from '@/components/ui/textarea';
import FieldWithError from '@/app/components/field-with-error';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Check, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import useMutation from '@/hooks/useMutation';

const getDefaultValues = scheduled => {
	return {
		title: scheduled?.title ?? '',
		from_date: scheduled?.from_date ?? '',
		to_date: scheduled?.to_date ?? null,
		amount: scheduled?.amount ?? '',
		description: scheduled?.description ?? '',
		account_id: scheduled?.accounts?.id ?? '',
		category_id: scheduled?.categories?.id ?? '',
	};
};

const ScheduledForm = ({
	isPending,
	scheduled,
	accounts,
	categories,
	onSubmit,
}) => {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: getDefaultValues(scheduled) });
	// TODO
	const isAccountDisabled = false; //Boolean(scheduled);

	return (
		<form
			className="mt-4 flex flex-col gap-2"
			onSubmit={handleSubmit(onSubmit)}
			noValidate
		>
			<fieldset disabled={isPending}>
				<div className="flex gap-2">
					<FieldWithError className="basis-1/2" error={errors.title?.message}>
						<Label>
							Title
							<Input
								id="title"
								name="title"
								className={errors.title ? 'border-red-600' : ''}
								{...register('title', { required: 'Title is required' })}
							/>
						</Label>
					</FieldWithError>
					<FieldWithError className="basis-1/2" error={errors.amount?.message}>
						<Label htmlFor="amount">Amount</Label>
						<Input
							id="amount"
							name="amount"
							type="number"
							min="0"
							className={errors.amount ? 'border-red-600' : ''}
							{...register('amount', {
								valueAsNumber: true,
								validate: value => {
									if (Number.isNaN(value)) {
										return 'Amount is required';
									}

									if (value < 0) {
										return 'Amount must be greater than 0';
									}

									return null;
								},
							})}
						/>
					</FieldWithError>
				</div>
				<div className=" flex gap-2">
					<FieldWithError
						className="basis-1/2"
						error={errors.from_date?.message}
					>
						<Label>
							From
							<Input
								name="from_date"
								type="date"
								className={errors.from_date ? 'border-red-600' : ''}
								{...register('from_date', {
									required: 'First payment date is required',
								})}
							/>
						</Label>
					</FieldWithError>
					{/* <FieldWithError error={errors.to_date?.message}>
						<Label>
							To
							<Input
								name="to_date"
								type="date"
								className={errors.to_date ? 'border-red-600' : ''}
								{...register('to_date', {
									required: 'First payment date is required',
								})}
							/>
						</Label>
					</FieldWithError> */}
				</div>
				<div className="flex gap-2">
					<FieldWithError
						className="basis-1/2"
						error={errors.account_id?.message}
					>
						<Label htmlFor="account">Account</Label>
						<Controller
							name="account_id"
							control={control}
							rules={{
								validate: value => {
									if (!value) {
										return 'Account is required';
									}

									return null;
								},
							}}
							render={({ field }) => (
								<Select
									disabled={isAccountDisabled}
									defaultValue={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										className={errors.account_id ? 'border-red-600' : ''}
									>
										<SelectValue placeholder="Select an account" />
									</SelectTrigger>
									<SelectContent>
										{accounts.map(account => (
											<SelectItem key={account.id} value={account.id}>
												{account.name} ({account.currencies.code})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</FieldWithError>
					<FieldWithError
						className="basis-1/2"
						error={errors.category_id?.message}
					>
						<Label htmlFor="category">Category</Label>
						<Controller
							name="category_id"
							control={control}
							rules={{
								validate: value => {
									if (!value) {
										return 'Category is required';
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
										className={errors.category_id ? 'border-red-600' : ''}
									>
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map(category => (
											<SelectItem key={category.id} value={category.id}>
												{category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</FieldWithError>
				</div>
				<Label htmlFor="description">
					Description
					<Textarea className="resize-none" {...register('description')} />
				</Label>
				<div className="mt-4 flex justify-end">
					<Button disabled={isPending}>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save
					</Button>
				</div>
			</fieldset>
		</form>
	);
};

export default function ScheduledSheet({
	isOpen,
	accounts,
	scheduled,
	categories,
	onClose,
}) {
	const router = useRouter();
	const { toast } = useToast();
	const { mutate: postMutate, isPending: isPostPending } =
		useMutation('scheduled');
	const { mutate: patchMutate, isPending: isPatchPending } = useMutation(
		'scheduled',
		'PATCH',
	);

	const isPending = isPostPending || isPatchPending;

	const handleClose = () => {
		if (isPending) return;
		onClose();
	};

	const onSubmit = values => {
		const mutate = scheduled ? patchMutate : postMutate;
		const data = scheduled ? { ...values, scheduledId: scheduled.id } : values;

		mutate({
			data,
			onSuccess: () => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<Check className="h-4 w-4" />
							Scheduled {scheduled ? 'updated' : 'created'} successfully!
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
			<SheetContent>
				<SheetHeader>
					<SheetTitle>
						scheduled expense{' '}
						{scheduled ? (
							<small className="text-sm font-light">(editing)</small>
						) : null}
					</SheetTitle>
				</SheetHeader>
				<ScheduledForm
					isPending={isPending}
					scheduled={scheduled}
					accounts={accounts}
					categories={categories}
					onSubmit={onSubmit}
				/>
			</SheetContent>
		</Sheet>
	);
}

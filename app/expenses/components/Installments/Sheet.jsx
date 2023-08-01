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
import FieldWithError from '@/app/components/FieldWithError';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import useMutation from '@/hooks/useMutation';

const getDefaultValues = installment => {
	return {
		title: installment?.title ?? '',
		first_payment_date: installment?.first_payment_date ?? '',
		amount: installment?.amount ?? '',
		description: installment?.description ?? '',
		installments: installment?.installments
			? String(installment?.installments)
			: '',
		account_id: installment?.accounts?.id ?? '',
		category_id: installment?.categories?.id ?? '',
	};
};

const InstallmentForm = ({
	isPending,
	installment,
	accounts,
	categories,
	onSubmit,
}) => {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: getDefaultValues(installment) });
	const isAccountDisabled = installment?.paid_installments > 0;

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<fieldset disabled={isPending}>
				<div className="mt-2 flex gap-2">
					<FieldWithError error={errors.title?.message}>
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
					<FieldWithError error={errors.first_payment_date?.message}>
						<Label>
							First payment
							<Input
								name="first_payment_date"
								type="date"
								className={errors.first_payment_date ? 'border-red-600' : ''}
								{...register('first_payment_date', {
									required: 'First payment date is required',
								})}
							/>
						</Label>
					</FieldWithError>
				</div>
				<div className="mt-2 flex gap-2">
					<FieldWithError error={errors.installments?.message}>
						<Label>Installments</Label>
						<Controller
							name="installments"
							control={control}
							rules={{
								validate: value => {
									if (!value) {
										return 'Installments is required';
									}

									if (value <= 0) {
										return 'Installments must be greater than 0';
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
										className={errors.installments ? 'border-red-600' : ''}
									>
										<SelectValue placeholder="Select installments" />
									</SelectTrigger>
									<SelectContent>
										{['3', '6', '12', '24'].map(installment => (
											<SelectItem key={installment} value={installment}>
												{installment}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</FieldWithError>
					<FieldWithError error={errors.amount?.message}>
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
				<div className="mt-2 flex gap-2">
					<FieldWithError error={errors.account_id?.message}>
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
					<FieldWithError error={errors.category_id?.message}>
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

export default function InstallmentSheet({
	isOpen,
	accounts,
	installment,
	categories,
	onClose,
}) {
	const router = useRouter();
	const { toast } = useToast();
	const { mutate: postMutate, isPending: isPostPending } =
		useMutation('installments');
	const { mutate: patchMutate, isPending: isPatchPending } = useMutation(
		'installments',
		'PATCH',
	);

	const isPending = isPostPending || isPatchPending;

	const handleClose = () => {
		if (isPending) return;
		onClose();
	};

	const onSubmit = values => {
		const mutate = installment ? patchMutate : postMutate;
		const data = installment
			? { ...values, installmentId: installment.id }
			: values;

		data.installments = +data.installments;

		mutate({
			data,
			onSuccess: () => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<Check className="h-4 w-4" />
							Installment {installment ? 'updated' : 'created'} successfully!
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
						installment expense{' '}
						{installment ? (
							<small className="text-sm font-light">(editing)</small>
						) : null}
					</SheetTitle>
				</SheetHeader>
				<InstallmentForm
					isPending={isPending}
					installment={installment}
					accounts={accounts}
					categories={categories}
					onSubmit={onSubmit}
				/>
			</SheetContent>
		</Sheet>
	);
}

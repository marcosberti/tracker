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
	SelectGroup,
	SelectLabel,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Check, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import useMutation from '@/hooks/useMutation';
import FieldWithError from '@/app/components/field-with-error';
import { formatCurrency } from '@/lib/utils';

function getDefaultValues(account, movement) {
	return {
		accountId: account.id,
		title: movement?.title,
		amount: movement?.amount,
		description: movement?.description,
		categoryId: movement?.categories?.id,
		currencyId: movement?.currencies?.id ?? account.currencies.id,
		parentMovementId: movement?.parent_movement_id,
	};
}

function MovementForm({
	account,
	movement,
	movements,
	categories,
	currencies,
	isPending,
	onSubmit,
}) {
	const {
		register,
		control,
		watch,
		resetField,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: getDefaultValues(account, movement) });

	const amountWatch = watch('amount');
	const exchangeRateWatch = watch('exchangeRate');
	const parentMovementIdWatch = watch('parentMovementId');
	const parentMovement = movements.find(m => m.id === parentMovementIdWatch);
	const currency = currencies.find(c => c.id === account.currencies.id);
	const currencyWatch = watch('currencyId');
	const isExchangeRateRequired = currencyWatch !== account.currencies.id;
	const availableCategories = parentMovementIdWatch
		? categories.filter(
				c =>
					c.movement_types.type ===
					parentMovement.categories.movement_types.type,
		  )
		: categories;
	const incomeCategories = availableCategories.filter(
		c => c.movement_types.type === 'income',
	);
	const spentCategories = availableCategories.filter(
		c => c.movement_types.type === 'spent',
	);

	return (
		<form
			className="mt-4 flex flex-col gap-2"
			onSubmit={handleSubmit(onSubmit)}
			noValidate
		>
			<fieldset disabled={isPending}>
				<input hidden name="accountId" {...register('accountId')} />
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
					<FieldWithError
						className="basis-1/2"
						error={errors.categoryId?.message}
					>
						<Label htmlFor="category">
							Category
							<Controller
								name="categoryId"
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
											className={errors.categoryId ? 'border-red-600' : ''}
										>
											<SelectValue placeholder="Select a category" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{incomeCategories.length ? (
													<>
														<SelectLabel>Income</SelectLabel>
														{incomeCategories.map(category => (
															<SelectItem key={category.id} value={category.id}>
																{category.name}
															</SelectItem>
														))}
													</>
												) : null}
											</SelectGroup>
											<SelectGroup>
												{spentCategories.length ? (
													<>
														<SelectLabel>Expense</SelectLabel>
														{spentCategories.map(category => (
															<SelectItem key={category.id} value={category.id}>
																{category.name}
															</SelectItem>
														))}
													</>
												) : null}
											</SelectGroup>
										</SelectContent>
									</Select>
								)}
							/>
						</Label>
					</FieldWithError>
				</div>
				<div className="flex gap-2">
					<FieldWithError className="basis-1/2" error={errors.amount?.message}>
						<Label htmlFor="amount">Amount</Label>
						<Input
							id="amount"
							name="amount"
							type="number"
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
					<FieldWithError
						className="basis-1/2"
						error={errors.currencyId?.message}
					>
						<Label htmlFor="currency">Currency</Label>
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
					</FieldWithError>
				</div>
				{isExchangeRateRequired ? (
					<div className="flex items-center gap-2">
						<FieldWithError
							className="basis-1/2"
							error={errors.exchangeRate?.message}
						>
							<Label
								className={!isExchangeRateRequired ? 'text-gray-400' : null}
								disabled={!isExchangeRateRequired}
							>
								Exchange rate
								<Input
									type="number"
									className={errors.exchangeRate ? 'border-red-600' : ''}
									disabled={!isExchangeRateRequired}
									{...register('exchangeRate', {
										valueAsNumber: true,
										validate: value => {
											if (Number.isNaN(value)) {
												return 'Exchange rate is required';
											}

											if (value < 0) {
												return 'Exchange rate must be greater than 0';
											}

											return null;
										},
									})}
								/>
							</Label>
						</FieldWithError>
						<div>
							={' '}
							{amountWatch && exchangeRateWatch
								? formatCurrency(amountWatch * exchangeRateWatch, currency.code)
								: null}
						</div>
					</div>
				) : null}
				<FieldWithError error={errors.parentMovementId?.message}>
					<Label>
						Belongs to
						<Controller
							name="parentMovementId"
							control={control}
							render={({ field }) => (
								<Select
									disabled={!movements.length}
									defaultValue={field.value}
									onValueChange={value => {
										resetField('categoryId');
										field.onChange(value);
									}}
								>
									<SelectTrigger
										className={errors.parentMovementId ? 'border-red-600' : ''}
									>
										<SelectValue placeholder="Select a parent element" />
									</SelectTrigger>
									<SelectContent>
										{movements.map(movement => (
											<SelectItem key={movement.id} value={movement.id}>
												{movement.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</Label>
				</FieldWithError>
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
}

export default function MovementSheet({
	isOpen,
	account,
	movement,
	movements,
	currencies,
	categories,
	onClose,
}) {
	const router = useRouter();
	const { toast } = useToast();
	const { mutate: postMutate, isPending: isPostPending } =
		useMutation('movements');
	const { mutate: patchMutate, isPending: isPatchPending } = useMutation(
		'movements',
		'PATCH',
	);

	const isPending = isPostPending || isPatchPending;

	const handleClose = () => {
		if (isPending) return;
		onClose();
	};

	const handleSubmit = values => {
		const mutate = movement ? patchMutate : postMutate;
		const data = movement ? { ...values, movementId: movement.id } : values;
		mutate({
			data,
			onSuccess: () => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<Check className="h-4 w-4" />
							Movement {movement ? 'updated' : 'created'} successfully!
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

	let posibleParentMovements = movements.filter(
		m => !m.isPaymentPending && !m.parent_movement_id,
	);
	if (movement) {
		posibleParentMovements = posibleParentMovements.filter(
			m => m.id !== movement.id,
		);
	}

	return (
		<Sheet open={isOpen} onOpenChange={handleClose}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>
						what are you paying?{' '}
						{movement ? (
							<small className="text-sm font-light">(editing)</small>
						) : null}
					</SheetTitle>
				</SheetHeader>
				<MovementForm
					isPending={isPending}
					account={account}
					movement={movement}
					movements={posibleParentMovements}
					currencies={currencies}
					categories={categories}
					onSubmit={handleSubmit}
				/>
			</SheetContent>
		</Sheet>
	);
}

'use client';
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
import { Controller, useForm } from 'react-hook-form';
import FieldWithError from '@/app/components/field-with-error';
import { formatCurrency } from '@/lib/utils';
import { Check, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import useMutation from '@/hooks/useMutation';

function getDefaultValues(scheduled) {
	return {
		amount: scheduled.amount,
		description: scheduled.description,
		currencyId: scheduled.currencies.id,
	};
}

function ScheduledForm({
	isPending,
	movements,
	currencies,
	scheduled,
	onSubmit,
}) {
	const {
		register,
		watch,
		control,
		resetField,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: getDefaultValues(scheduled) });
	const amountWatch = watch('amount');
	const exchangeRateWatch = watch('exchangeRate');
	const currencyWatch = watch('currencyId');
	const currency = currencies.find(c => c.id === currencyWatch);
	const isExchangeRateRequired = currencyWatch !== scheduled.currencies.id;

	return (
		<form className="mt-4" onSubmit={handleSubmit(onSubmit)} noValidate>
			<fieldset
				disabled={isPending}
				className={isPending ? 'text-gray-400' : null}
			>
				<div className="flex gap-2">
					<FieldWithError className="basis-1/2" error={errors.amount?.message}>
						<Label>
							Amount
							<Input
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
										onValueChange={value => {
											field.onChange(value);
											resetField('exchangeRate');
										}}
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
				<FieldWithError error={errors.date?.message}>
					<Label htmlFor="date">Date</Label>
					<Input
						id="date"
						name="date"
						type="date"
						className={errors.date ? 'border-red-600' : ''}
						{...register('date', {
							validate: value => {
								if (!value) {
									return 'Date is required';
								}

								return null;
							},
						})}
					/>
				</FieldWithError>
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
				{movements.length ? (
					<FieldWithError error={errors.parentMovementId?.message}>
						<Label>
							Sub item of
							<Controller
								name="parentMovementId"
								control={control}
								render={({ field }) => (
									<Select
										defaultValue={field.value}
										onValueChange={field.onChange}
									>
										<SelectTrigger
											className={
												errors.parentMovementId ? 'border-red-600' : ''
											}
										>
											<SelectValue placeholder="Select a payment" />
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
				) : null}
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

export default function ScheduledSheet({
	isOpen,
	account,
	movements,
	currencies,
	scheduled,
	onClose,
}) {
	const router = useRouter();
	const { toast } = useToast();
	const { mutate, isPending } = useMutation('movements');

	const handleClose = () => {
		if (isPending) return;
		onClose();
	};

	const handleSubmit = values => {
		const data = {
			title: scheduled.title,
			categoryId: scheduled.categories.id,
			scheduledId: scheduled.id,
			accountId: account.id,
			...values,
			date: new Date(values.date).toDateString(),
		};

		mutate({
			data,
			onSuccess: () => {
				toast({
					title: (
						<div className="border-se flex items-center gap-2">
							<Check className="h-4 w-4" />
							Payment for {scheduled.title} registered successfully!
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

	const parentMovements = movements.filter(m => !m.isPaymentPending);

	return (
		<Sheet open={isOpen} onOpenChange={handleClose}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{scheduled.title} payment</SheetTitle>
				</SheetHeader>
				<ScheduledForm
					isPending={isPending}
					movements={parentMovements}
					currencies={currencies}
					scheduled={scheduled}
					onSubmit={handleSubmit}
				/>
			</SheetContent>
		</Sheet>
	);
}

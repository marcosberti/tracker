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
import FieldWithError from '@/app/components/FieldWithError';

function getDefaultValues(account, movement) {
	return {
		accountId: account.id,
		title: movement?.title,
		amount: movement?.amount,
		description: movement?.description,
		categoryId: movement?.categories?.id,
		currencyId: movement?.currencies?.id ?? account.currencies.id,
	};
}

function MovementForm({
	account,
	movement,
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
	} = useForm({ defaultValues: getDefaultValues(account, movement) });

	return (
		<form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
			<fieldset disabled={isPending}>
				<input hidden name="accountId" {...register('accountId')} />
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
					<FieldWithError error={errors.categoryId?.message}>
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
												<SelectLabel>Income</SelectLabel>
												{categories
													.filter(
														category =>
															category.movement_types.type === 'income',
													)
													.map(category => (
														<SelectItem key={category.id} value={category.id}>
															{category.name}
														</SelectItem>
													))}
											</SelectGroup>
											<SelectGroup>
												<SelectLabel>Expense</SelectLabel>
												{categories
													.filter(
														category =>
															category.movement_types.type === 'spent',
													)
													.map(category => (
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
					</FieldWithError>
				</div>
				<div className="mt-2 flex gap-2">
					<FieldWithError error={errors.amount?.message}>
						<Label htmlFor="amount">Amount</Label>
						<Input
							id="amount"
							name="amount"
							type="number"
							className={errors.amount ? 'border-red-600' : ''}
							{...register('amount', {
								required: 'Amount is required',
								valueAsNumber: true,
							})}
						/>
					</FieldWithError>
					<FieldWithError error={errors.currencyId?.message}>
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

	const onSubmit = values => {
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
					account={account}
					movement={movement}
					currencies={currencies}
					categories={categories}
					isPending={isPending}
					onSubmit={onSubmit}
				/>
			</SheetContent>
		</Sheet>
	);
}

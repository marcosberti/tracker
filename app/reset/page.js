'use client';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { useForm } from 'react-hook-form';
import FieldWithError from '../components/field-with-error';

const STATUS = {
	idle: 'idle',
	loading: 'loading',
	error: 'error',
	sent: 'sent',
};

export default function Reset() {
	const supabase = createBrowserClient();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [state, setState] = useState({
		status: STATUS.idle,
	});

	const onSubmit = async values => {
		setState({ status: STATUS.loading });
		const { email } = values;

		await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.origin}/update`,
		});
		setState({ status: STATUS.sent });
	};

	const isLoading = state.status === STATUS.loading;
	const isSent = state.status === STATUS.sent;

	return (
		<div className="flex h-full flex-col items-center justify-center">
			<div className="mb-8 text-center">
				<h1 className="text-xl font-medium">tracker</h1>
				<small className="text-xs font-thin">
					donttheyalllookthesameinside
				</small>
			</div>

			<form
				className="flex w-full flex-col gap-2 px-8"
				noValidate
				onSubmit={handleSubmit(onSubmit)}
			>
				<FieldWithError error={errors.email?.message}>
					<Label>
						email
						<Input
							name="email"
							type="email"
							className={errors.email ? 'border-red-600' : ''}
							{...register('email', { required: 'Email is required' })}
						/>
					</Label>
				</FieldWithError>
				<div className="mt-4">
					<Button
						className="w-full"
						disabled={isLoading || isSent}
						type="submit"
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isSent ? 'recovery link has been sent' : 'send recovery link'}
					</Button>
					{isSent || true ? (
						<div className="flex justify-center">
							<small className="font-light">check your inbox</small>
						</div>
					) : null}
					{state.error ? (
						<small className="text-center text-xs text-red-600">
							{state.error}
						</small>
					) : null}
				</div>
			</form>
		</div>
	);
}

'use client';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { useForm } from 'react-hook-form';

const STATUS = {
	idle: 'idle',
	loading: 'loading',
	error: 'error',
};

export default function Login() {
	const supabase = createBrowserClient();
	const {
		register,
		resetField,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [state, setState] = useState({
		status: STATUS.idle,
	});

	const onSubmit = async values => {
		setState({ status: STATUS.loading });
		const { email, password } = values;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setState({
				status: STATUS.error,
				error: 'Invalid credentials',
			});
			resetField('password');
		}
	};

	const isLoading = state.status === STATUS.loading;

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
				<div className="relative mb-5 basis-1/2">
					<Label>
						email
						<Input
							name="email"
							type="email"
							className={errors.email ? 'border-red-600' : ''}
							{...register('email', { required: 'Email is required' })}
						/>
					</Label>
					{errors.email ? (
						<small className="absolute -bottom-5 text-xs text-red-600">
							{errors.email.message}
						</small>
					) : null}
				</div>

				<div className="relative mb-5 basis-1/2">
					<Label>
						password
						<Input
							name="password"
							type="password"
							className={errors.password ? 'border-red-600' : ''}
							{...register('password', { required: 'Password is required' })}
						/>
					</Label>
					{errors.password ? (
						<small className="absolute -bottom-5 text-xs text-red-600">
							{errors.password.message}
						</small>
					) : null}
				</div>

				<Button className="mt-4" disabled={isLoading} type="submit">
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Log in
				</Button>
				{state.error ? (
					<small className="text-center text-xs text-red-600">
						{state.error}
					</small>
				) : null}
			</form>
		</div>
	);
}

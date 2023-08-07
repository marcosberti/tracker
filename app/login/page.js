'use client';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase-browser';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import FieldWithError from '../components/field-with-error';

const STATUS = {
	idle: 'idle',
	loading: 'loading',
	error: 'error',
};

export default function Login() {
	const supabase = createBrowserClient();
	const router = useRouter();
	const {
		register,
		resetField,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [state, setState] = useState({
		status: STATUS.idle,
	});

	const handleForgot = () => {
		router.push('/reset');
	};

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
		} else {
			router.push('/');
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

				<FieldWithError error={errors.password?.message}>
					<Label>
						password
						<Input
							name="password"
							type="password"
							className={errors.password ? 'border-red-600' : ''}
							{...register('password', { required: 'Password is required' })}
						/>
					</Label>

					<div className="flex justify-center">
						<Button
							className="text-xs font-light hover:text-blue-400"
							variant="link"
							onClick={handleForgot}
						>
							Forgot password?
						</Button>
					</div>
				</FieldWithError>

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

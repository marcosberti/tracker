export default function FieldWithError({ error, children }) {
	return (
		<div className="relative mb-5 basis-1/2">
			{children}
			{error ? (
				<small className="absolute -bottom-5 text-xs text-red-600">
					{error}
				</small>
			) : null}
		</div>
	);
}

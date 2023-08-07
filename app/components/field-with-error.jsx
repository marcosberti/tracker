export default function FieldWithError({ error, className, children }) {
	return (
		<div className={className}>
			{children}
			{error ? <small className="text-xs text-red-600">{error}</small> : null}
		</div>
	);
}

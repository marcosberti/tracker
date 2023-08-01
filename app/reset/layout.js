export default function Layout({ children }) {
  return (
    <div className="h-full flex">
      <div className="basis-1/3">
        {children}
      </div>
      <div className="h-full w-full bg-login-background bg-cover" />
    </div>
  )
}
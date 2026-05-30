export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center p-4">
      {children}
    </div>
  )
}

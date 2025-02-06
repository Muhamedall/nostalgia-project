export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="overscroll-containmt-4 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          {children}
        </div>
      </div>
    );
  }
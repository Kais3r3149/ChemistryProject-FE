import Link from "next/link";
import { FlaskConical, Shield, Zap, Database } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh">
      {/* Left panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-primary-500/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-64 h-64 rounded-full bg-primary-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-dots opacity-10" />
        </div>

        <div className="relative flex flex-col justify-between w-full p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <FlaskConical className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              {APP_NAME}
            </span>
          </Link>

          {/* Center content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold text-white leading-tight">
                Analyze drug interactions
                <br />
                <span className="text-primary-200">with confidence.</span>
              </h2>
              <p className="text-primary-100/80 text-base max-w-md leading-relaxed">
                Comprehensive interaction data from DrugBank for accurate, research-grade results.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                { icon: Database, label: "1.4M+", text: "drug pair interactions" },
                { icon: Shield, label: "DrugBank", text: "validated data source" },
                { icon: Zap, label: "<1s", text: "query response time" },
              ].map(({ icon: Icon, label, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-4 w-4 text-primary-200" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{label}</p>
                    <p className="text-xs text-primary-200/70">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-xs text-primary-300/60">
            © {new Date().getFullYear()} {APP_NAME}. Built for academic research.
          </p>
        </div>
      </div>

      {/* Right panel — Auth form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12 relative">
        {/* Subtle mesh background */}
        <div className="absolute inset-0 bg-mesh opacity-50" />

        <div className="relative w-full max-w-md space-y-8">
          {/* Mobile logo (hidden on desktop) */}
          <div className="flex flex-col items-center gap-2 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
              <FlaskConical className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {APP_NAME}
            </h1>
          </div>

          {/* Auth form */}
          {children}
        </div>
      </div>
    </div>
  );
}

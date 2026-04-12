import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-24">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-dots opacity-10" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary-100 border border-white/10 mb-8">
          <Sparkles className="h-4 w-4" />
          Free for researchers
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Start Checking Drug
          <br />
          Interactions Today
        </h2>

        <p className="mt-6 text-lg text-primary-100/90 max-w-2xl mx-auto leading-relaxed">
          Free access to AI-powered drug interaction analysis. Sign up and
          explore DDI, DTI, PPI interactions, gene-disease associations, and
          drug response predictions.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl shadow-primary-900/20 group font-semibold text-base px-8"
            asChild
          >
            <Link href="/register">
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold text-base px-8"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-200/70 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary-300/40 border-2 border-primary-600 flex items-center justify-center text-xs text-white">
                R
              </div>
              <div className="h-8 w-8 rounded-full bg-primary-400/40 border-2 border-primary-600 flex items-center justify-center text-xs text-white">
                P
              </div>
              <div className="h-8 w-8 rounded-full bg-primary-500/40 border-2 border-primary-600 flex items-center justify-center text-xs text-white">
                M
              </div>
            </div>
            <span>Trusted by researchers</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>No credit card required</span>
          <span className="hidden sm:inline">•</span>
          <span>TDC-powered datasets</span>
        </div>
      </div>
    </section>
  );
}

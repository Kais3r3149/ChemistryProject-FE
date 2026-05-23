import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-primary-700 dark:bg-primary-900 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* Text */}
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to check drug interactions?
            </h2>
            <p className="text-primary-200/80 leading-relaxed">
              Free access to DrugBank-sourced interaction data. No credit card required.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-primary-300/70 pt-1">
              <span>DDI &middot; DTI &middot; Drug-Food &middot; Drug-Condition</span>
              <span>1.4M+ interaction pairs</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button
              size="lg"
              className="bg-white text-primary-700 hover:bg-primary-50 font-semibold group"
              asChild
            >
              <Link href="/register">
                Create free account
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="!bg-transparent border-white/40 text-white hover:!bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}

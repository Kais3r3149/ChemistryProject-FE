"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, CheckCircle, AlertCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resetPassword } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token. Please request a new reset link.");
  }, [token]);

  const canSubmit =
    !!token &&
    newPassword.length >= 6 &&
    newPassword === confirmPassword &&
    !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="border-border/50 shadow-xl shadow-black/5 animate-fade-in-up">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-xl font-bold">Password reset!</CardTitle>
          <CardDescription className="text-base">
            Your password has been updated successfully.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center pb-6">
          <Link
            href="/login"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Sign in with new password →
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-xl shadow-black/5 animate-fade-in-up">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950/40">
          <KeyRound className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
        <CardDescription className="text-base">
          Choose a strong password — minimum 6 characters.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New password */}
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="h-11 pr-10"
                disabled={!token}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showNew ? "Hide" : "Show"}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className={`h-11 pr-10 ${
                  confirmPassword && confirmPassword !== newPassword
                    ? "border-red-400 focus-visible:ring-red-400"
                    : ""
                }`}
                disabled={!token}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showConfirm ? "Hide" : "Show"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 font-semibold"
            disabled={!canSubmit}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Resetting...</>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center pb-6">
        <Link
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Request a new reset link
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

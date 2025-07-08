"use client";

import React from "react";
import { Mail, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

interface EmailVerificationProps {
  email?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  onResendClick?: () => void;
  onOpenEmailClick?: () => void;
  variant?: "default" | "success" | "warning" | "invalid" | "pending";
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email = "user@example.com",
  title = "Check your email",
  description = "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.",
  buttonText = "Resend verification email",
  onResendClick = () => console.log("Resend clicked"),
  onOpenEmailClick = () => {
    window.location.href = `mailto:${email}`;
  },
  variant = "default",
}) => {
  const variantStyles = {
    default: {
      container: "bg-background border-border",
      title: "text-foreground",
      description: "text-muted-foreground",
      button: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondaryButton: "border-border text-foreground hover:bg-accent",
    },
    success: {
      container: "bg-green-50 border-green-200",
      title: "text-green-900",
      description: "text-green-700",
      button: "bg-green-600 text-white hover:bg-green-700",
      secondaryButton: "border-green-300 text-green-700 hover:bg-green-100",
    },
    warning: {
      container: "bg-amber-50 border-amber-200",
      title: "text-amber-900",
      description: "text-amber-700",
      button: "bg-amber-600 text-white hover:bg-amber-700",
      secondaryButton: "border-amber-300 text-amber-700 hover:bg-amber-100",
    },
    invalid: {
      container: "bg-red-50 border-red-200",
      title: "text-red-900",
      description: "text-red-700",
      button: "bg-red-600 text-white hover:bg-red-700",
      secondaryButton: "border-red-300 text-red-700 hover:bg-red-100",
    },
    pending: {
      container: "bg-background border-border",
      title: "text-foreground",
      description: "text-muted-foreground",
      button: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondaryButton: "border-border text-foreground hover:bg-accent",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card className={`max-w-md mx-auto shadow-lg ${styles.container}`}>
      <CardHeader className="text-center pb-4">
        <h2 className={`text-2xl font-bold ${styles.title}`}>{title}</h2>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <p className={`text-sm leading-relaxed ${styles.description}`}>
            {description}
          </p>
          <div className={`mt-3 p-3 rounded-lg bg-muted/50 border`}>
            <p className="text-sm font-medium text-foreground">{email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={onResendClick} className={`w-full ${styles.button}`}>
            {buttonText}
          </Button>

          <Button
            variant="outline"
            onClick={onOpenEmailClick}
            className={`w-full gap-2 ${styles.secondaryButton}`}
          >
            <ExternalLink className="w-4 h-4" />
            Open email app
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              onClick={onResendClick}
              className="text-primary hover:underline font-medium"
            >
              try again
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

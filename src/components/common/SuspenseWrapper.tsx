import React, { Suspense } from "react";
import LoadingSpinner from "../common/LoadingSpinner";

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallback = (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner />
    </div>
  ),
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

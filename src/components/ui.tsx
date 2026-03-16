import React from "react";

type BaseProps = {
  className?: string;
  children: React.ReactNode;
};

export const Card: React.FC<BaseProps> = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-gray-700 bg-[#020617] ${className}`}>{children}</div>
);

export const CardHeader: React.FC<BaseProps> = ({ className = "", children }) => (
  <div className={`px-4 pt-3 ${className}`}>{children}</div>
);

export const CardContent: React.FC<BaseProps> = ({ className = "", children }) => (
  <div className={`px-4 pb-3 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<BaseProps> = ({ className = "", children }) => (
  <h2 className={`font-semibold ${className}`}>{children}</h2>
);

export const Button = ({
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => (
  <button
    className={`inline-flex items-center justify-center rounded-full bg-teal-500 px-3 py-1 text-sm text-white transition hover:bg-teal-400 ${className}`}
    {...props}
  >
    {children}
  </button>
);

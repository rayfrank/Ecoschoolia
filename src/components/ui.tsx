import React from "react";

export const Card = ({ className = "", children }: any) => (
  <div className={`rounded-2xl border border-gray-700 bg-[#020617] ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ className = "", children }: any) => (
  <div className={`px-4 pt-3 ${className}`}>{children}</div>
);

export const CardContent = ({ className = "", children }: any) => (
  <div className={`px-4 pb-3 ${className}`}>{children}</div>
);

export const CardTitle = ({ className = "", children }: any) => (
  <h2 className={`font-semibold ${className}`}>{children}</h2>
);

export const Button = ({
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => (
  <button
    className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm bg-teal-500 text-white hover:bg-teal-400 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

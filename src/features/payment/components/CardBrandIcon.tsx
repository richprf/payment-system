import type { CardBrand } from "../types";

interface CardBrandIconProps {
  brand: CardBrand;
  className?: string;
}

export function CardBrandIcon({ brand, className = "h-6 w-10" }: CardBrandIconProps) {
  if (brand === "visa") {
    return (
      <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <text
          x="24"
          y="21"
          textAnchor="middle"
          fill="white"
          fontSize="13"
          fontWeight="700"
          fontFamily="system-ui"
        >
          VISA
        </text>
      </svg>
    );
  }

  if (brand === "mastercard") {
    return (
      <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
        <rect width="48" height="32" rx="4" fill="#1f1f1f" />
        <circle cx="20" cy="16" r="8" fill="#EB001B" />
        <circle cx="28" cy="16" r="8" fill="#F79E1B" />
        <path
          d="M24 10.4a8 8 0 0 1 0 11.2 8 8 0 0 1 0-11.2Z"
          fill="#FF5F00"
        />
      </svg>
    );
  }

  if (brand === "amex") {
    return (
      <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
        <rect width="48" height="32" rx="4" fill="#016FD0" />
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fill="white"
          fontSize="9"
          fontWeight="800"
          fontFamily="system-ui"
        >
          AMEX
        </text>
      </svg>
    );
  }

  if (brand === "discover") {
    return (
      <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
        <rect width="48" height="32" rx="4" fill="#fff" stroke="#e5e7eb" />
        <text
          x="24"
          y="20"
          textAnchor="middle"
          fill="#F76F1A"
          fontSize="8"
          fontWeight="800"
          fontFamily="system-ui"
        >
          DISCOVER
        </text>
      </svg>
    );
  }

  if (brand === "unionpay") {
    return (
      <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
        <rect width="48" height="32" rx="4" fill="#fff" stroke="#e5e7eb" />
        <rect x="10" y="8" width="9" height="16" rx="2" fill="#D10429" />
        <rect x="19.5" y="8" width="9" height="16" rx="2" fill="#0169B7" />
        <rect x="29" y="8" width="9" height="16" rx="2" fill="#0C8B3C" />
      </svg>
    );
  }

  if (brand === "jcb") {
    return (
      <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
        <rect width="48" height="32" rx="4" fill="#0E4C96" />
        <text
          x="24"
          y="21"
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="800"
          fontFamily="system-ui"
        >
          JCB
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
      <rect width="48" height="32" rx="4" fill="#e2e8f0" />
      <rect x="8" y="10" width="14" height="10" rx="2" fill="#94a3b8" />
      <rect x="26" y="12" width="14" height="3" rx="1.5" fill="#cbd5e1" />
      <rect x="26" y="18" width="10" height="3" rx="1.5" fill="#cbd5e1" />
    </svg>
  );
}

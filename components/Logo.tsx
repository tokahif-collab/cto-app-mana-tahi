export function ManaTahiLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 250 250"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="250" height="250" rx="52" fill="#1E5B3E" />
      <rect
        x="20"
        y="20"
        width="210"
        height="210"
        rx="46"
        stroke="white"
        strokeWidth="16"
      />
      <rect
        x="62"
        y="62"
        width="126"
        height="126"
        rx="34"
        stroke="white"
        strokeWidth="13"
      />
      <path
        d="M84 152 V108 a41 41 0 0 1 82 0 V152"
        stroke="white"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M107 152 V122 a18 18 0 0 1 36 0 V152"
        stroke="white"
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M125 152 V198"
        stroke="white"
        strokeWidth="13"
        strokeLinecap="round"
      />
    </svg>
  );
}
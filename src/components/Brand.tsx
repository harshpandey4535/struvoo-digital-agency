import type { CSSProperties } from "react";

type BrandProps = {
  className?: string;
  monochrome?: boolean;
  style?: CSSProperties;
};

// Vector reconstruction of the supplied artwork, not a font-based wordmark.
export function BrandSymbol({
  className = "",
  monochrome = false,
  style,
}: BrandProps) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <g fill={monochrome ? "currentColor" : "var(--blue, #38BDF8)"}>
        <path d="M2 61c6 23 26 38 48 38 13-7 19-18 16-27-8 7-18 11-32 8C19 77 8 69 2 61Z" />
        <path d="M45.8 1.2C21.4 3.2 2 23.3 2 47.7c0 18.2 14.2 22.5 31.5 22.5h17.9c9.9 0 15.3 2.9 13.5 9.1-2.2 7.8-13.6 14.9-27.5 18.8 19.2 5 36.9-3.8 42.6-20.9 6.9-20.7-6.1-30.3-27.3-30.3H39c-16.8 0-19.8-10.2-13.1-24.1 4.2-9.1 11.3-16.8 19.9-21.6Z" />
        <path d="M52.6 1c20 .9 37 14.4 43.8 32.7l-19.5 6.1c-7.1-8.7-13.8-10.4-27.2-10.4H35.6C31.8 18.2 40.4 6 52.6 1Z" />
        <path d="M98 40.9c5.2 25.6-10 50.4-33.5 57.7 14.5-14.4 17.9-29.9 11.8-42.1L98 40.9Z" />
      </g>
    </svg>
  );
}

function Wordmark({ monochrome }: { monochrome: boolean }) {
  return (
    <g fill="currentColor" fillRule="evenodd">
      <path
        fill={monochrome ? "currentColor" : "var(--blue, #38BDF8)"}
        d="M73 1H31C12 1 1 11 1 27c0 16 12 24 31 24h17c8 0 12 3 12 8s-4 8-12 8H2v15h48c21 0 33-10 33-26 0-17-13-25-32-25H34c-8 0-12-3-12-8s4-7 12-7h44L73 1Zm-1 18h14v2H72v-2ZM0 61h17v2H0v-2Z"
      />
      <path d="M88 1h76v17h-28v64h-20V18H88V1Z" />
      <path d="M174 1h39c22 0 35 11 35 29 0 12-6 21-17 26l21 26h-24l-18-23h-16v23h-20V1Zm20 17v25h18c11 0 16-4 16-13 0-8-5-12-16-12h-18Z" />
      <path d="M261 1h20v45c0 14 6 21 18 21s18-7 18-21V1h20v46c0 24-14 37-38 37s-38-13-38-37V1Z" />
      <path
        fill={monochrome ? "currentColor" : "var(--blue, #38BDF8)"}
        d="M347 1h22l23 57 23-57h22l-35 81h-20L347 1Z"
      />
      <path d="M483 0c26 0 44 18 44 42s-18 42-44 42-44-18-44-42S457 0 483 0Zm0 18c-14 0-24 10-24 24s10 24 24 24 24-10 24-24-10-24-24-24ZM581 0c26 0 44 18 44 42s-18 42-44 42-44-18-44-42S555 0 581 0Zm0 18c-14 0-24 10-24 24s10 24 24 24 24-10 24-24-10-24-24-24Z" />
    </g>
  );
}

export function Brand({
  className = "",
  monochrome = false,
  style,
}: BrandProps) {
  return (
    <svg
      className={`brand ${className}`}
      style={style}
      viewBox="0 0 770 102"
      role="img"
      aria-label="Struvoo"
    >
      <svg x="0" y="0" width="102" height="102" viewBox="0 0 100 100">
        <BrandSymbol monochrome={monochrome} />
      </svg>
      <g transform="translate(137 9)">
        <Wordmark monochrome={monochrome} />
      </g>
    </svg>
  );
}

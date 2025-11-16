
import React from 'react';

// FIX: Explicitly type iconProps with React.SVGProps<SVGSVGElement> to prevent type inference issues.
// This ensures that properties like `strokeLinecap` and `strokeLinejoin` are correctly typed as
// literal strings ("round") rather than the general `string` type.
const iconProps: React.SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const ShoppingCart: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}>
    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

export const Edit2: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

export const Save: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);

export const X: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export const Plus: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export const Trash2: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

export const Loader2: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
);

export const Search: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

export const Filter: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
);

export const MessageCircle: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
);

export const Truck: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
);

export const ZoomIn: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
);

export const ChevronLeft: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><polyline points="15 18 9 12 15 6"></polyline></svg>
);

export const ChevronRight: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><polyline points="9 18 15 12 9 6"></polyline></svg>
);

export const MapPin: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

export const Upload: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = '' }) => (
  <svg {...iconProps} width={size} height={size} className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

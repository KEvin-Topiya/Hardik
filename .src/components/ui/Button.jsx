import React from 'react';

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}) {
  const baseStyles =
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B8A99A] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-[#4A3F35] text-white hover:bg-[#5C4F43] active:bg-[#3D3229]',
    secondary:
    'bg-[#EDE7E0] text-[#3D3229] hover:bg-[#DDD5CC] active:bg-[#C9BDB0]',
    outline:
    'border border-[#C9BDB0] text-[#5C4F43] hover:border-[#4A3F35] hover:text-[#3D3229] bg-transparent',
    ghost: 'text-[#6B5D50] hover:text-[#3D3229] hover:bg-[#F5F0EB]'
  };
  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-8 py-3'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}>

      {children}
    </button>);

}
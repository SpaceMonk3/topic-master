'use client';

import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      expand={false}
      richColors
      closeButton={false}
      toastOptions={{
        duration: 5000,
        style: {
          background: '#3b82f6', // Bright blue background
          border: 'none',
          color: 'white',
          fontWeight: '500',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          marginTop: '4rem',
          opacity: '1',
          maxWidth: '420px',
          width: '100%',
          zIndex: '100000',
          textAlign: 'center',
          padding: '1rem 1.5rem',
        },
        classNames: {
          toast:
            'group toast group-[.toaster]:text-white group-[.toaster]:shadow-xl',
          description: 'group-[.toast]:text-white',
          actionButton:
            'group-[.toast]:bg-white group-[.toast]:text-blue-600',
          cancelButton:
            'group-[.toast]:bg-white group-[.toast]:text-blue-600',
        },
      }}
      {...props}
    />
  );
};

export { Toaster }; 
'use client';

import { Toast, ToastProvider, ToastViewport } from '@radix-ui/react-toast';
import { useState } from 'react';

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport className="fixed bottom-0 right-0 p-4 flex flex-col gap-2 w-96 max-w-full z-50" />
    </ToastProvider>
  );
}
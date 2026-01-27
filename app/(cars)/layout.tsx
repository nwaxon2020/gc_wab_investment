'use client';

import React from 'react';

export default function CarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="cars-module-wrapper">
      {children}
    </section>
  );
}
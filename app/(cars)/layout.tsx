
import React from 'react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GC WAB CAR COLLECTION - Elite Automobile Luxury',
  description: 'Available Cars and Automobile Services',
}

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
// app/(cars)/layout.tsx

export default function FashionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {/* You can add a specific sidebar or nav for cars here */}
      {children}
    </section>
  )
}
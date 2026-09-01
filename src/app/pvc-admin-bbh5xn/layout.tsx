export const metadata = {
  title: "Admin Panel - PVC Showpiece Bazar",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

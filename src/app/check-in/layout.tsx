import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Asistencia",
  description: "Registra tu asistencia escaneando el código QR",
};

export default function CheckInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

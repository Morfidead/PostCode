import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Почта Премиум — сервисы Почты и предложения партнёров",
  description:
    "Демонстрационная концепция единой подписки на сервисы Почты России и предложения партнёров. Условия и цены требуют подтверждения.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

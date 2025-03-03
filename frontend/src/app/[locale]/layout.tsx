import initTranslations from "@/app/i18n";
import LayoutComponent from "@/components/LayoutComponent"; // 클라이언트 컴포넌트 가져오기
import ClientProviders from "@/components/providers/ClientProviders";
import TranslationsProvider from "@/components/TranslationsProvider";
import "@fontsource/inter";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinSight",
  description:
    "Empowering you with actionable financial insights for smarter investments and decisions.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const i18nNamespaces = ["common"];
  const locale = params.locale;
  const { resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <html lang={locale}>
      <body>
        <ClientProviders>
          <TranslationsProvider
            namespaces={i18nNamespaces}
            locale={locale}
            resources={resources}
          >
            <LayoutComponent>{children}</LayoutComponent>
          </TranslationsProvider>
        </ClientProviders>
      </body>
    </html>
  );
}

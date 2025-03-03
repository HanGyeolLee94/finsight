interface I18nConfig {
  locales: string[];
  defaultLocale: string;
  prefixDefault?: boolean;
  noPrefix?: boolean;
}

const i18nConfig: I18nConfig = {
  locales: ["en", "ko"],
  defaultLocale: "en",
  prefixDefault: false,
  noPrefix: true,
};

export default i18nConfig;

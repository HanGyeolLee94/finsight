"use client";
import { useTranslation } from "react-i18next";

interface TranslatedTextProps {
  translationKey: string;
  text?: string; // Optional fallback text
}

export function TranslatedText({
  translationKey,
  text,
}: TranslatedTextProps): string {
  const { t } = useTranslation();

  // Pass the fallback text (if provided) to the `t` function
  return t(translationKey, text || translationKey);
}

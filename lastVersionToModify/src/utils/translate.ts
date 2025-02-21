import translate from "google-translate-api-x";
import { franc } from "franc-min";

/**
 * Detects the language of the given text.
 * @param text - The input text.
 * @returns The detected language ('en' for English, 'ar' for Arabic, or null if not detected).
 */
export const detectLanguage = (text: string): "en" | "ar" | null => {
  if (!text) return null;

  const detectedLang = franc(text, { minLength: 2 });

  if (detectedLang === "eng") return "en";
  if (detectedLang === "ara") return "ar";
  
  return null;
};

/**
 * Translates text to the target language.
 * @param text - The text to translate.
 * @param targetLang - The target language ('en' or 'ar').
 * @returns The translated text.
 */
export const translateText = async (text: string, targetLang: "en" | "ar"): Promise<string> => {
  try {
    const response = await translate(text, { to: targetLang });
    return response.text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text if translation fails
  }
};

import type { Locale, LocalizedText } from './types';

export const DEFAULT_LOCALE: Locale = 'en';

export function resolveText(value: LocalizedText, locale: Locale): string {
	if (typeof value === 'string') {
		return value;
	}

	return value[locale] ?? value.en;
}

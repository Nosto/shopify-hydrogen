import { useMatches } from 'react-router';

type CountryLegacy = {
  market?: {
    id?: string;
  };
} | null;

type RootLike = {
  language?: string;
  selectedLocale?: { language?: string; currency?: string };
  nostoProviderData?: { localization?: { country?: CountryLegacy }; language?: string };
  nostoSessionData?: unknown | Promise<unknown>;
};

export function useHydrogenRootFallback(): Partial<RootLike> {
  const matches = useMatches() as Array<{ data?: unknown }>;
  const data = matches?.[0]?.data as any;

  return {
    language: data?.nostoProviderData?.language ?? data?.consent?.language,
    selectedLocale: data?.selectedLocale,
    nostoProviderData: data?.nostoProviderData,
    nostoSessionData: data?.nostoSessionData,
  };
}

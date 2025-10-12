export type Region = 'Americas' | 'Europe' | 'APAC' | 'Middle East & Africa' | 'Global';

export interface RegionMapping {
  [key: string]: string[];
}

export const REGION_COUNTRY_MAP: RegionMapping = {
  'Americas': [
    'United States',
    'Canada',
    'Mexico',
    'Brazil',
    'Argentina',
    'Chile',
    'Colombia',
    'Peru',
    'Venezuela',
    'Ecuador',
    'Costa Rica',
    'Panama',
    'Uruguay',
  ],
  'Europe': [
    'United Kingdom',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'Sweden',
    'Switzerland',
    'Poland',
    'Ireland',
    'Belgium',
    'Austria',
    'Denmark',
    'Norway',
    'Finland',
    'Portugal',
    'Czech Republic',
    'Romania',
    'Greece',
  ],
  'APAC': [
    'Australia',
    'Singapore',
    'Japan',
    'China',
    'India',
    'South Korea',
    'New Zealand',
    'Hong Kong',
    'Malaysia',
    'Thailand',
    'Indonesia',
    'Philippines',
    'Vietnam',
    'Taiwan',
    'Pakistan',
    'Bangladesh',
  ],
  'Middle East & Africa': [
    'United Arab Emirates',
    'Saudi Arabia',
    'South Africa',
    'Israel',
    'Egypt',
    'Kenya',
    'Nigeria',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'Jordan',
    'Morocco',
    'Ghana',
  ],
  'Global': ['Remote', 'Worldwide']
};

// Reverse mapping: country -> region
export const COUNTRY_TO_REGION: Record<string, Region> = {};
Object.entries(REGION_COUNTRY_MAP).forEach(([region, countries]) => {
  countries.forEach(country => {
    COUNTRY_TO_REGION[country] = region as Region;
  });
});

// Map US state codes to "United States"
export const US_STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

/**
 * Get region for a country
 */
export const getRegionForCountry = (country: string): Region | undefined => {
  return COUNTRY_TO_REGION[country];
};

/**
 * Get all countries in a region
 */
export const getCountriesInRegion = (region: Region): string[] => {
  return REGION_COUNTRY_MAP[region] || [];
};

/**
 * Check if selection includes entire region
 */
export const isEntireRegionSelected = (
  selectedLocations: string[],
  region: Region
): boolean => {
  const regionCountries = getCountriesInRegion(region);
  return regionCountries.every(country => selectedLocations.includes(country));
};

/**
 * Get all countries from mixed region/country selection
 */
export const expandRegionsToCountries = (
  selection: string[]
): string[] => {
  const expanded = new Set<string>();
  
  selection.forEach(item => {
    if (REGION_COUNTRY_MAP[item]) {
      // It's a region - add all its countries
      getCountriesInRegion(item as Region).forEach(c => expanded.add(c));
    } else {
      // It's a country - add it directly
      expanded.add(item);
    }
  });
  
  return Array.from(expanded);
};

/**
 * Extract country from location string
 */
export const getCountryFromLocation = (location: string): string => {
  if (location === 'Remote' || location === 'Worldwide') return 'Remote';
  
  const parts = location.split(',').map(p => p.trim());
  const lastPart = parts[parts.length - 1];
  
  // Check if it's a US state code
  if (US_STATE_CODES.includes(lastPart)) {
    return 'United States';
  }
  
  // Check if it's a recognized country
  if (COUNTRY_TO_REGION[lastPart]) {
    return lastPart;
  }
  
  // Default: return as-is (could be a country not in our map)
  return lastPart;
};

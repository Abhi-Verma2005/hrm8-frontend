import { DateRange } from 'react-day-picker';

export interface CustomDateRangePreset {
  id: string;
  name: string;
  range: DateRange;
  createdAt: string;
}

const STORAGE_KEY = 'custom_date_range_presets';

export function getCustomPresets(): CustomDateRangePreset[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveCustomPreset(name: string, range: DateRange): CustomDateRangePreset {
  const presets = getCustomPresets();
  
  const newPreset: CustomDateRangePreset = {
    id: Date.now().toString(),
    name,
    range,
    createdAt: new Date().toISOString(),
  };
  
  presets.push(newPreset);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  
  return newPreset;
}

export function deleteCustomPreset(id: string): void {
  const presets = getCustomPresets();
  const filtered = presets.filter(preset => preset.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

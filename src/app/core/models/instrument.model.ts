export type Instrument = 'guitar' | 'bass' | 'piano' | 'drums' | 'violin';

export interface InstrumentConfig {
  id: Instrument;
  displayName: string;
  icon: string;
  categories: string[];
  supportsTuner: boolean;
  supportsChords: boolean;
}

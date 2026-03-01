import { Instrument } from './instrument.model';

export interface CustomCategories {
  [instrument: string]: string[]; // instrument -> array of custom category names
}

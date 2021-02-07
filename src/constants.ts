import { EntryTypes } from "./types";
import { assertNever } from './utils';

export const apiBaseUrl = 'http://localhost:3001/api';



export const entryIcon = (
  type: EntryTypes
): "stethoscope" | "hospital" | "briefcase" => {
  switch (type) {
    case EntryTypes.HealthCheck:
      return "stethoscope";
    case EntryTypes.Hospital:
      return "hospital";
    case EntryTypes.OccupationalHealthcare:
      return "briefcase";
    default:
      return assertNever(type)
  }
};
export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

interface SickLeave {
  startDate: string;
  endDate: string;
}
interface Discharge {
  date: string;
  criteria: string;
}

interface HospitalEntry extends BaseEntry {
  type: EntryTypes.Hospital;
  discharge: Discharge;
}
interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryTypes.OccupationalHealthcare;
  employerName: string;
  sickLeave?: SickLeave;
}
interface HealthCheckEntry extends BaseEntry {
  type: EntryTypes.HealthCheck;
  healthCheckRating: HealthCheckRating;
}
export enum EntryTypes {
  HealthCheck = "HealthCheck",
  Hospital = "Hospital",
  OccupationalHealthcare = "OccupationalHealthcare",
}

// export type EntryTypesUnion = `${EntryTypes}`;
// export type EntryTypesUnion = EntryTypes.HealthCheck | En
// export type EntryTypesUnion<K> =   [K in Entry["type"]] 

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

  export type AllKeys<T> = T extends T ? keyof T : never;
  export type DistributiveOmit<T, K extends AllKeys<T>> = T extends T ? Pick<T, Exclude<keyof T, K>> : never;
  export type NewEntry = DistributiveOmit<Entry, "id">;
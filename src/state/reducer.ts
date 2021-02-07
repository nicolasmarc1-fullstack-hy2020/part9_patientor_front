import { State } from "./state";
import { Patient, Diagnosis } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...state.patients,
          ...action.payload.reduce(
            (acc, patient) => ({ ...acc, [patient.id]: patient }),
            {}
          ),
        },
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: {
          ...state.diagnoses,
          ...action.payload.reduce(
            (acc, diagnosis) => ({ ...acc, [diagnosis.code]: diagnosis }),
            {}
          ),
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    default:
      return state;
  }
};

export const setPatientList = (payload: Array<Patient>): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload,
  };
};
export const setDiagnosisList = (payload: Array<Diagnosis>): Action => {
  return {
    type: "SET_DIAGNOSIS_LIST",
    payload,
  };
};
export const addPatient = (payload: Patient): Action => {
  return {
      type: "ADD_PATIENT",
      payload
  };
};
export const updatePatient = (payload: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload,
  };
};

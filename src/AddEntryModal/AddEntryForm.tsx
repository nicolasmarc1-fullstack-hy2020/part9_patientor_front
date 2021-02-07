import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form, getIn } from "formik";

import { EntryTypes, NewEntry, Diagnosis } from "../types";
import { BaseEntry } from "./../types";
import {
  DiagnosisSelection,
  NumberField,
  TextField,
} from "../AddPatientModal/FormField";
import { useStateValue } from "../state";

interface Props {
  onSubmit: (values: NewEntry) => void;
  onCancel: () => void;
  entryType: EntryTypes;
}

export const AddEntryForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  entryType,
}) => {
  const [{ diagnoses }] = useStateValue();

  const baseInitialValues: Omit<BaseEntry, "id"> = {
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
  };

  const getInitialValues = (entryType: EntryTypes): NewEntry => {
    switch (entryType) {
      case EntryTypes.HealthCheck:
        return {
          ...baseInitialValues,
          type: EntryTypes.HealthCheck,
          healthCheckRating: 0,
        };
      case EntryTypes.Hospital:
        return {
          ...baseInitialValues,
          type: EntryTypes.Hospital,
          discharge: { date: "", criteria: "" },
        };
      case EntryTypes.OccupationalHealthcare:
        return {
          ...baseInitialValues,
          type: EntryTypes.OccupationalHealthcare,
          employerName: "",
          sickLeave: { startDate: "", endDate: "" },
        };
    }
  };

  const renderAdditionalFields = (entryType: EntryTypes) => {
    switch (entryType) {
      case EntryTypes.HealthCheck:
        return (
          <>
            <Field
              label="Health check rating"
              placeholder="Rating"
              name="healthCheckRating"
              component={NumberField}
              min={1}
              max={4}
            />
          </>
        );
      case EntryTypes.Hospital:
        return (
          <>
            <Field
              label="Discharge date"
              type="date"
              placeholder="YYYY-MM-DD"
              name="discharge.date"
              component={TextField}
            />
            <Field
              label="Discharge criteria"
              placeholder="Discharge criteria"
              name="discharge.criteria"
              component={TextField}
            />
          </>
        );
      case EntryTypes.OccupationalHealthcare:
        return (
          <>
            <Field
              label="Employer name"
              placeholder="Employer name"
              name="employerName"
              component={TextField}
            />
            <Field
              label="Sick leave start date"
              placeholder="YYYY-MM-DD"
              type="date"
              name="sickLeave.startDate"
              component={TextField}
            />
            <Field
              label="Sick leave end date"
              placeholder="YYYY-MM-DD"
              type="date"
              name="sickLeave.endDate"
              component={TextField}
            />
          </>
        );
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...getInitialValues(entryType),
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        // const errors: { [field: string]: string } = {};
        const errors: Record<string, string | Record<string, string>> = {};
        // const errors: any = {};

        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        }
        if (values.type === "HealthCheck") {
          if (!values.healthCheckRating) {
            errors.healthCheckRating = requiredError;
          }
        }
        if (values.type === "Hospital") {
          if (!values.discharge.date) {
            errors.discharge = {
              date: requiredError,
            };
          }
          if (!values.discharge.criteria) {
            errors.discharge = {
              criteria: requiredError,
            };
          }
        }
        if (values.type === "OccupationalHealthcare") {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
          if (
            (values.sickLeave?.endDate || values.sickLeave?.startDate) &&
            !(values.sickLeave?.endDate && values.sickLeave?.startDate)
          ) {
            errors.sickLeave = {
              startDate:
                "need a start and end date for sickleave or no sickleave",
              endDate:
                "need a start and end date for sickleave or no sickleave",
            };
          }
        }
        return errors;
      }}
    >
      {({
        isValid,
        dirty,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
        errors,
        values,
      }) => {
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              type="date"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            {renderAdditionalFields(entryType)}
            <DiagnosisSelection
              diagnoses={Object.values(diagnoses) as Diagnosis[]}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            />

            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid || isSubmitting}
                >
                  Add
                </Button>
                {/* The submit button is enabled only if the form is valid and dirty,
                which means that the user has edited some of the fields. */}
                {/* We handle form submission through Formik, because it allows us to call the
                 validation function before performing the actual submission. If the 
                 validation function returns any errors, the submission is cancelled. */}
              </Grid.Column>
            </Grid>
            {/* <pre>{JSON.stringify(errors, null, 2)}</pre>
            <pre>{JSON.stringify(values, null, 2)}</pre> */}
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;

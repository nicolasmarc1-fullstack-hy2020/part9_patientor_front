import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon, Card, Button } from "semantic-ui-react";
import {
  Entry,
  EntryTypes,
  Gender,
  HealthCheckRating,
  NewEntry,
  Patient,
} from "../types";
import { apiBaseUrl, entryIcon } from "../constants";
import { useParams } from "react-router-dom";
import { updatePatient, useStateValue } from "../state";
import HealthRatingBar from "../components/HealthRatingBar";
import AddEntryModal from "../AddEntryModal";
import { assertNever } from "../utils";

const PatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients, diagnoses }, dispatch] = useStateValue();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [serverError, setServerError] = React.useState<string | undefined>();
  const openModal = (): void => setModalOpen(true);

  const patient = patients[id];

  if (patient === undefined || patient === null) {
    return null;
  }

  const healthIconColor = (
    healthRating: HealthCheckRating
  ): "red" | "orange" | "yellow" | "green" => {
    switch (healthRating) {
      case HealthCheckRating.CriticalRisk:
        return "red";
      case HealthCheckRating.HighRisk:
        return "orange";
      case HealthCheckRating.LowRisk:
        return "yellow";
      case HealthCheckRating.Healthy:
        return "green";
    }
  };
  const genderIcon = (gender: Gender): "man" | "woman" | "genderless" => {
    switch (gender) {
      case "male":
        return "man";
      case "female":
        return "woman";
      default:
        return "genderless";
    }
  };


  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case EntryTypes.HealthCheck:
        return (
          <ul>
            <li>
              HealthCheck rating:{" "}
              <Icon
                color={healthIconColor(entry.healthCheckRating)}
                name="heart"
              />
              <HealthRatingBar
                rating={entry.healthCheckRating}
                showText={true}
              />
            </li>
          </ul>
        );
      case EntryTypes.Hospital:
        return (
          <ul>
            <li>Discharge date: {entry.discharge.date}</li>
            <li>Discharge criteria: {entry.discharge.criteria}</li>
          </ul>
        );
      case EntryTypes.OccupationalHealthcare:
        return (
          <ul>
            <li>Employer Name: {entry.employerName}</li>
            {entry.sickLeave && (
              <li>
                Sick Leave: from {entry.sickLeave?.startDate ?? "-"} to{" "}
                {entry.sickLeave?.endDate ?? "-"}
              </li>
            )}
          </ul>
        );
      default:
        return assertNever(entry);
    }
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setServerError(undefined);
  };
  const submitNewEntry = async (values: NewEntry) => {
    const body = { ...values };

    if (body.type === EntryTypes.OccupationalHealthcare) {
      if (!body.sickLeave?.endDate && !body.sickLeave?.startDate) {
        body.sickLeave = undefined;
      }
    }

    try {
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${patient.id}/entries`,
        values
      );
      dispatch(updatePatient(updatedPatient));
      closeModal();
    } catch (e) {
      setServerError(e.response.data);
    }
  };

  return (
    <div>
      <h2>
        {patient.name} <Icon size="big" name={genderIcon(patient.gender)} />
      </h2>
      <p>SSN: {patient.ssn}</p>
      <p>Occupation: {patient.occupation}</p>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        serverError={serverError}
        onClose={closeModal}
      />

      <h3>Entries</h3>
      <Card fluid>
        <Button primary onClick={openModal}>
          Add New Entry
        </Button>
      </Card>
      <Card.Group>
        {patient.entries.map((entry) => (
          <Card fluid key={entry.id}>
            <Card.Content>
              <Card.Header>
                {entry.date}
                <Icon size="big" name={entryIcon(entry.type)} />
              </Card.Header>
              <Card.Description>
                <div>{entry.description}</div>
              </Card.Description>

              <EntryDetails entry={entry} />

              {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
                <>
                  <h4>Diagnoses:</h4>
                  <ul>
                    {entry.diagnosisCodes?.map((diagnosis) => (
                      <li key={diagnosis}>{diagnoses[diagnosis]?.name}</li>
                    ))}
                  </ul>
                </>
              )}
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  );
};

export default PatientPage;

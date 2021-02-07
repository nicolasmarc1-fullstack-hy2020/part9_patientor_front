import React from "react";
import { Modal, Segment } from "semantic-ui-react";
import AddPatientForm, { PatientFormValues } from "./AddPatientForm";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormValues) => void;
  serverError?: string;
}

const AddPatientModal = ({ modalOpen, onClose, onSubmit,  serverError }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={true} closeIcon>
    <Modal.Header>Add a new patient</Modal.Header>
    {console.log(serverError)}
    <Modal.Content>
      {serverError && <Segment inverted color="red">{`Error: ${serverError}`}</Segment>}
      <AddPatientForm onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
);

export default AddPatientModal;

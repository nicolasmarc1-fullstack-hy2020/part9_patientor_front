import React from "react";
import {
  Dropdown,
  DropdownProps,
  Grid,
  Icon,
  Modal,
  Segment,
} from "semantic-ui-react";
import { entryIcon } from "../constants";
import { EntryTypes, NewEntry } from "../types";
import AddEntryForm from "./AddEntryForm";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: NewEntry) => void;
  serverError?: string;
}

const entryTypeOptions = [
  {
    key: EntryTypes.HealthCheck,
    value: EntryTypes.HealthCheck,
    text: "Health Check",
    icon: entryIcon(EntryTypes.HealthCheck),
  },
  {
    key: EntryTypes.OccupationalHealthcare,
    value: EntryTypes.OccupationalHealthcare,
    text: "Occupational Health Care",
    icon: entryIcon(EntryTypes.OccupationalHealthcare),
  },
  {
    key: EntryTypes.Hospital,
    value: EntryTypes.Hospital,
    text: "Hospital",
    icon: entryIcon(EntryTypes.Hospital),
  },
];

const AddEntryModal = ({
  modalOpen,
  onClose,
  onSubmit,
  serverError,
}: Props) => {
  const [formType, setFormType] = React.useState<EntryTypes>(
    entryTypeOptions[0].value
  );

  const handleChange = (e: React.SyntheticEvent, { value }: DropdownProps) => {
    setFormType(value as EntryTypes);
    // setFormType((e.target as HTMLInputElement).value as EntryTypes);
  };

  return (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
      <Modal.Header>
        <Segment>
          <h2>
            Add a new entry <Icon size="big" name={entryIcon(formType)} />{" "}
          </h2>
        </Segment>
        <Segment inverted color="teal">
          <Dropdown
            options={entryTypeOptions}
            defaultValue={formType}
            onChange={handleChange}
            pointing
            header={"Choose an entry type:"}
          />
        </Segment>
      </Modal.Header>
      <Modal.Content>
        {serverError && (
          <Segment inverted color="red">{`Error: ${serverError}`}</Segment>
        )}
        <AddEntryForm
          onSubmit={onSubmit}
          onCancel={onClose}
          entryType={formType}
        />
      </Modal.Content>
    </Modal>
  );
};

export default AddEntryModal;

import React from "react";
import "./index.scss";
import { useVisualMode } from "hooks/useVisualMode";
import Header from "./header";
import Show from "./show";
import Empty from "./empty";
import Form from "./Form";
import Status from "./status";
import Confirm from "./confirm";
import Error from "./error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETING = "DELETING";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  function trash() {
    transition(DELETING, true)
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => transition(EMPTY)} onSave={save}/>}
      {mode === SAVING && <Status message="Saving..."/>}
      {mode === CONFIRM && <Confirm message="Are you sure you would like to delete?" onConfirm={() => trash()} onCancel={() => back()} />}
      {mode === DELETING && <Status message="Deleting..."/>}
      {mode === EDIT && <Form
        name={props.interview.student}
        interviewer={props.interview.interviewer.id}
        interviewers={props.interviewers}
        onCancel={() => transition(SHOW)}
        onSave={save}/>}
      {mode === ERROR_SAVE && <Error message="Could not save appointment" onClose={() => back()}/>}
      {mode === ERROR_DELETE && <Error message="Could not delete appointment" onClose={() => back()}/>}
    </article>
  );
};

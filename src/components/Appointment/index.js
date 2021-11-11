import React, { useEffect } from "react";
import "./index.scss";
import { useVisualMode } from "hooks/useVisualMode";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

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
  const { interview, id, time, interviewers, bookInterview, cancelInterview } = props;
  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    bookInterview(id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  function trash() {
    transition(DELETING, true)
    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }

  useEffect( () => {
    if (interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [interview, transition, mode]);

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && interview && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && <Form interviewers={interviewers} onCancel={() => transition(EMPTY)} onSave={save}/>}
      {mode === SAVING && <Status message="Saving..."/>}
      {mode === CONFIRM && <Confirm message="Are you sure you would like to delete?" onConfirm={() => trash()} onCancel={() => back()} />}
      {mode === DELETING && <Status message="Deleting..."/>}
      {mode === EDIT && <Form
        name={interview.student}
        interviewer={interview.interviewer.id}
        interviewers={interviewers}
        onCancel={() => transition(SHOW)}
        onSave={save}/>}
      {mode === ERROR_SAVE && <Error message="Could not save appointment" onClose={() => back()}/>}
      {mode === ERROR_DELETE && <Error message="Could not delete appointment" onClose={() => back()}/>}
    </article>
  );
};

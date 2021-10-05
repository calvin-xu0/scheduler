import React from "react";
import "./index.scss";
import { useVisualMode } from "hooks/useVisualMode";
import Header from "./header";
import Show from "./show";
import Empty from "./empty";
import Form from "./Form";
import Status from "./status";
import Confirm from "./confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETING = "DELETING";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW));
  }

  function trash() {
    transition(DELETING)
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY));
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => transition(EMPTY)} onSave={save}/>}
      {mode === SAVING && <Status message="Saving..."/>}
      {mode === CONFIRM && <Confirm message="Are you sure you would like to delete?" onConfirm={() => trash()}/>}
      {mode === DELETING && <Status message="Deleting..."/>}
    </article>
  );
};

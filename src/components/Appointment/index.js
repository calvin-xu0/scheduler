import React from "react";
import "./index.scss";
import Header from "./header";
import Show from "./show";
import Empty from "./empty";

export default function Appointment(props) {
  return (
    <article className="appointment">
      <Header time={props.time} />
      {props.interview ? <Show {...props.interview}/> : <Empty />}
    </article>
  );
};

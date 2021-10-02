import React, {useState, useEffect} from "react";
import DayList from "./DayList";
import Appointment from "components/Appointment/index";
import "components/Application.scss";
const axios = require('axios');

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//     interview: {
//       student: "John Smith",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Jane Doe",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 5,
//     time: "4pm"
//   }
// ];

export default function Application(props) {
  // const [days, setDays] = useState([]);
  // const [day, setDay] = useState('');
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  })
  // const appointmentsParsed = appointments.map( appointment => <Appointment key={appointment.id} {...appointment}/>);
  const setDay = day => setState({...state, day});
  const setDays = days => setState(prev => ({...prev, days}));

  useEffect(() => axios.get('/api/days').then(res => setDays(res.data)), []);
  
  return (
    <main className="layout">

      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>

      <section className="schedule">
        {/* { appointmentsParsed } */}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

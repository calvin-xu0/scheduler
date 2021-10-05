import { useState, useEffect } from 'react';
const axios = require('axios');

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({...state, day});

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return (axios.put(`/api/appointments/${id}`, {interview})
      .then(res => {
        setState({...state, appointments, days: updateSpots(id, {...state, appointments})});
        // return {...state, appointments};
      })
      // .then(state => updateSpots(id, state))
      );
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return (axios.delete(`/api/appointments/${id}`)
      .then(res => {
        setState({...state, appointments, days: updateSpots(id, {...state, appointments})});
        // setState({...state, appointments});
        // return {...state, appointments};
      })
      // .then(pendingState => updateSpots(id, pendingState))
      );
  }

  const updateSpots = (id, pendingState = state) => {
    const foundDay = pendingState.days.find(day => day.appointments.includes(id));
    const spotsArray = foundDay.appointments;
    const nullCount = spotsArray.reduce( (collector, current) => collector + (pendingState.appointments[current].interview === null), 0);
    const day = {...pendingState.days[foundDay.id - 1], spots: nullCount};
    const days = [...pendingState.days];
    days.splice(foundDay.id - 1, 1, day);
    return days
    // setState({...pendingState, days});
  }

  useEffect(() => {
      Promise.all([
        axios.get('/api/days'),
        axios.get('/api/appointments'),
        axios.get('/api/interviewers')
      ]).then( all => {
        setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
      })
    }, []);

  return {state, setDay, bookInterview, cancelInterview, updateSpots}
};


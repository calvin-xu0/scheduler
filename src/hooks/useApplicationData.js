import { useReducer, useEffect } from 'react';
import axios from 'axios';

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function useApplicationData() {
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.value}
      case SET_APPLICATION_DATA:
        return {...state, ...action.value}
      case SET_INTERVIEW: {
        return {...state, ...action.value}
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer,
    {
      day: "Monday",
      days: [],
      appointments: {},
      interviewers: {}
    }
  );

  const setDay = day => dispatch({type: SET_DAY, value: day});

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const days = updateSpots(id, {...state, appointments});

    return (
      axios.put(`/api/appointments/${id}`, {interview})
        .then(res => {
          console.log("Socket sent:", {type: SET_INTERVIEW, value: {appointments, days}})
          dispatch({type: SET_INTERVIEW, value: {appointments, days}})
        })
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
    const days = updateSpots(id, {...state, appointments});

    return (
      axios.delete(`/api/appointments/${id}`)
        .then(res => {
          dispatch({type: SET_INTERVIEW, value: {appointments, days}})
        })
    );
  }

  const updateSpots = (id, pendingState = state) => {
    const foundDay = pendingState.days.find(day => day.appointments.includes(id));
    const spotsArray = foundDay.appointments;
    const nullCount = spotsArray.reduce( (collector, current) => collector + (pendingState.appointments[current].interview === null), 0);
    const day = {...pendingState.days[foundDay.id - 1], spots: nullCount};
    const days = [...pendingState.days];
    days.splice(foundDay.id - 1, 1, day);
    return days;
  }

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then( all => {
      const [days, appointments, interviewers] = all.map(obj => obj.data);
      dispatch({type: SET_APPLICATION_DATA, value: {days, appointments, interviewers}});
    })

  }, []);

  useEffect( () => {
    const dispatchInterview = data => {
      const {id, interview} = data;
      console.log("State", state, "Data", data)
      const appointment = {
        ...state.appointments[id],
        interview: interview ? { ...interview } : null
      };
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      const days = updateSpots(id, {...state, appointments});
  
      dispatch({type: SET_INTERVIEW, value: {appointments, days}})
    };
    
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    ws.onopen = evt => ws.send('ping');
    
    ws.onmessage = evt => {
      const responseObj = JSON.parse(evt.data);
      if ([SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW].includes(responseObj.type)) {
        dispatchInterview(responseObj);
      }
    };

    return (() => ws.close());
  }, [state])

  return {state, setDay, bookInterview, cancelInterview, updateSpots}
};


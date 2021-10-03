export const getAppointmentsForDay = (state, day) => {
  const result = [];
  for (const obj of Object.values(state.days)) {
    if (obj.name === day) {
      for (let appointmentId of obj.appointments) {
        result.push(state.appointments[appointmentId]);
      }
      break;
    }
  }
  return result;
};

export const getInterviewersForDay = (state, day) => {
  const interviewerCount = {};
  for (const obj of Object.values(state.days)) {
    if (obj.name === day) {
      for (let appointmentId of obj.appointments) {
        if (state.appointments[appointmentId].interview) {
          interviewerCount[state.appointments[appointmentId].interview.interviewer]++;
        }
      }
      break;
    }
  }
  const result = Object.keys(interviewerCount).map(id => state.interviewers[id]);
  return result;
};

export const getInterview = (state, interview) => {
  if (!interview) {
    return null;
  }
  return {...interview, interviewer: state.interviewers[interview.interviewer]};
}
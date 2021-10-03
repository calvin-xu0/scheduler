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

export const getInterview = (state, interview) => {
  if (!interview) {
    return null;
  }
  const result = {...interview};
  result.interviewer = state.interviewers[interview.interviewer];
  
  return result;
}
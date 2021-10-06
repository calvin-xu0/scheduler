export const getAppointmentsForDay = (state, day) => {
  const result = [];
  for (const obj of state.days) {
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
  const result = [];
  for (const obj of state.days) {
    if (obj.name === day) {
      for (let interviewerId of obj.interviewers) {
        result.push(state.interviewers[interviewerId]);
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
  return {...interview, interviewer: state.interviewers[interview.interviewer]};
}
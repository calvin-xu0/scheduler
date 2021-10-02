export function getAppointmentsForDay(state, day) {
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
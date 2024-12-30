export const timeSlotToDate = (
  sessionDate: string | Date,
  timeSlot: string,
) => {
  return {
    startTime: new Date(
      new Date(sessionDate).getTime() +
        parseInt(timeSlot.split('_')[0], 10) * 60 * 60 * 1000,
    ),
    endTime: new Date(
      new Date(sessionDate).getTime() +
        parseInt(timeSlot.split('_')[1], 10) * 60 * 60 * 1000,
    ),
  };
};

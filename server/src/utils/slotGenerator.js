export const generateSlots = (
    workingStart,
    workingEnd,
    slotDuration
  ) => {
    const slots = [];
  
    let [hour, minute] = workingStart.split(":").map(Number);
  
    const [endHour, endMinute] = workingEnd
      .split(":")
      .map(Number);
  
    while (
      hour < endHour ||
      (hour === endHour && minute < endMinute)
    ) {
      const start = `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;
  
      minute += slotDuration;
  
      if (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute %= 60;
      }
  
      const end = `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;
  
      slots.push({
        startTime: start,
        endTime: end,
      });
    }
  
    return slots;
  };
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// export function minutesToTime(minutes: number): string {
//   if (minutes == null || isNaN(minutes)) return "";
//   const hours = Math.floor(minutes / 60);
//   const mins = minutes % 60;
//   return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
// }

export function minutesToTime(minutes: number): string {
  const m = minutes % (24 * 60);
  const hours = Math.floor(m / 60);
  const mins = m % 60;
  
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMins = mins.toString().padStart(2, '0');
  
  return `${displayHours}:${displayMins} ${ampm}`;
}
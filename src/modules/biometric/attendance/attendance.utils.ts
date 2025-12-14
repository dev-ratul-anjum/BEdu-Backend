// --- SLOT CONFIG ---
export const SLOT_CONFIG = {
  morning: { start: "07:30", end: "08:00", late_end: "08:15" },
  noon: { start: "11:30", end: "12:00", late_end: "12:15" },
};

export const to_minutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);

  return h * 60 + m;
};

export const LATE_PRESENT_ENABLED = true;
export const MAX_CUMULATIVE_COUNT = 3;

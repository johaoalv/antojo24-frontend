const PANAMA_TZ = "America/Panama";

const isoFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: PANAMA_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const clockFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: PANAMA_TZ,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export const getPanamaTime = () =>
  isoFormatter.format(new Date()).replace(", ", "T");

export const getPanamaTime12h = () =>
  clockFormatter.format(new Date()).toLowerCase();

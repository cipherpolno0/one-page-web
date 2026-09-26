export const formatThaiDate = (date: string) => {
  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "long",
    timeZone: "UTC"
  }).format(parsedDate);
};

export const toISODate = date => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

export const dayAfter = value => {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + 1);
  return toISODate(date);
};

export const formatDate = value => new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T12:00:00`));

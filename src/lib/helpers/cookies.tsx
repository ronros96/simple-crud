export const setAcknowledge = () => {
  document.cookie = `acknowledge=true; max-age=${60 * 60 * 24 * 7}; path=/; SameSite=Lax`;
};

export const getAcknowledge = (): boolean => {
  return document.cookie
    .split('; ')
    .some((cookie) => cookie === 'acknowledge=true');
};

export const destroyAcknowledge = () => {
  document.cookie = `acknowledge=; max-age=0; path=/; SameSite=Lax`;
};
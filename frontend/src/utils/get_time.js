export const getPanamaTime = () => {
  const date = new Date();
  const panamaOffset = -5 * 60; 
  const localOffset = date.getTimezoneOffset(); 
  const panamaTime = new Date(date.getTime() + (panamaOffset - localOffset) * 60000);

  // Formato: "YYYY-MM-DDTHH:MM:SS" (sin "Z" ni milisegundos)
  return panamaTime.toISOString().replace('Z', '').split('.')[0];
};
export const getPanamaTime = () => {
    const date = new Date();
  

    const panamaOffset = -5 * 60; 
    const localOffset = date.getTimezoneOffset(); 
  
  
    const panamaTime = new Date(date.getTime() + (panamaOffset - localOffset) * 60000);
  
    return panamaTime.toISOString(); 
  };
  
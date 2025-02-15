function obtenerHoraPeru() {
    const now = new Date();
    // Convertir a la hora local de Perú
    const options = { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit', 
                      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formatoPeru = new Intl.DateTimeFormat('en-GB', options).formatToParts(now);
    
    // Extraer las partes necesarias
    const fecha = formatoPeru.reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    
    // Crear formato "YYYYMMDDHHmmss"
    return `${fecha.year}${fecha.month}${fecha.day}${fecha.hour}${fecha.minute}${fecha.second}`;
  }
  
  // Variable "hoy" en formato "YYYYMMDDHHmmss"
  const hoy = obtenerHoraPeru();

// Función que convierte "hoy" a formato "dd/mm/yyyy"
function conviertef(hoy) {
    const year = hoy.slice(0, 4);
    const month = hoy.slice(4, 6);
    const day = hoy.slice(6, 8);
    return `${day}/${month}/${year}`;
  }
  
  // Función que convierte "hoy" a formato "hora:minuto:segundo"
  function convierteh(hoy) {
    const hour = hoy.slice(8, 10);
    const minute = hoy.slice(10, 12);
    const second = hoy.slice(12, 14);
    return `${hour}:${minute}:${second}`;
  }
  
  // Función que combina ambos formatos
  function convierte(hoy) {
    const fecha = conviertef(hoy);
    const hora = convierteh(hoy);
    return `${fecha} ${hora}`;
  }

module.exports = {hoy,convierte,conviertef,convierteh}
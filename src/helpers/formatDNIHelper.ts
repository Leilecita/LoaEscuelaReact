export const formatDNI = (dni: string | number) => {
 if (!dni) return '';
 const clean = dni.toString().replace(/\D/g, ''); // elimina puntos o espacios
 return clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // agrega puntos cada 3 cifras
};
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../core/services/axiosClient';

// Tipado consistente con claves string
type ValoresPorClases = { [key: string]: number };

export const ClasesPriceContext = createContext<{ valores: ValoresPorClases }>({ valores: {} });

export const ClasesPriceProvider = ({ children }: { children: ReactNode }) => {
  const [valores, setValores] = useState<ValoresPorClases>({});

  useEffect(() => {
    const fetchClasesPrice = async () => {
     
      try {
        const res = await api.get('/classes_price.php',{
         params: { 
           method: 'getAll',
         }});

        if (res.data?.result === 'success' && Array.isArray(res.data.data)) {
          const map: ValoresPorClases = {};
          res.data.data.forEach((item: { classes: number; price: number }) => {
            map[item.classes.toString()] = item.price; // clave como string
          });
          setValores(map);
        } else {
          console.warn('⚠️ Resultado no es success:', res.data);
        }
      } catch (error) {
        console.error('❌ Error al traer precios de clases:', error);
      }
    };

    fetchClasesPrice();
  }, []);

  return (
    <ClasesPriceContext.Provider value={{ valores }}>
      {children}
    </ClasesPriceContext.Provider>
  );
};

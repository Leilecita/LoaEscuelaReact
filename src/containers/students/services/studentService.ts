import React from 'react';
import api from './axiosClient';
import axios from 'axios';

export type ReportSeasonPresent = {
  name: string;
  cant_presents: number;
  cant_buyed_classes: number;
  tot_amount: number;
  tot_paid_amount: number;
};

export type ReportStudent = {
  student_id: number;
  nombre: string;
  apellido: string; 
  dni: string;
  presente: string;
  planilla_presente_id: number ;
  planilla_alumno_id: number;
  tel_mama: string;
  tel_papa: string;
  nombre_mama: string;
  nombre_papa: string;
  taken_classes: ReportSeasonPresent[];
  created: string;
  updated_date: string;

};

export type Student = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;

  tel_mama: string;
  tel_papa: string;
  nombre_mama: string;
  nombre_papa: string;
  
  created: string;
  updated_date: string;
}

export async function fetchStudentsByAssists(
  page: number,
  category: string, 
  subcategoria: string, 
  date: string,
  onlyPresents = 'false',
  orderby = 'alf',
  query = ''
): Promise<{ planilla_id: number; list_rep: ReportStudent[] }> {

  
  const response = await api.get('/students.php', {
    params: {
      method: 'getStudentsByAssists',
      page,
      category:'todos',
      categoria: category,        
      subcategoria,   
      date,
      onlyPresents,
      orderby,
      ...(query ? { query } : {}),
    },
    
  });
  
  if (response.data.result === 'success') {
    return response.data.data;
  } else if (response.data.result === 'error' && response.data.message === 'Session invalida') {
    throw new Error('Sesión inválida. Por favor inicie sesión nuevamente.');
  } else {
    throw new Error(response.data.message || 'Error al obtener estudiantes');
  }
}

export async function fetchAllStudents(
  page: number,
  category: string,
  query: string,
  order: 'created' | 'nombre' 
): Promise<Student[]> {
  const response = await api.get('/students.php', {
    params: {
      method: 'getStudents',
      page,
      categoria: category,
      order,
      ...(query ? { query } : {}),
    },
  })
  console.log('Parámetros enviados:', { page: page, category, query, order });

  if (response.data.result === 'success') {
    return response.data.data 
  } else {
    throw new Error(response.data.message || 'Error al obtener estudiantes')
  }
}
export async function savePresent(data: {
  planilla_id: number
  alumno_id: number
  fecha_presente: string
}) {
  const response = await api.post('/planillas_presentes.php', data);

  if (response.data.result !== 'success') {
    throw new Error(response.data.message || 'Error al guardar presente');
  }
  return response.data.data;
}

export async function removePresent(id: number) {
  try {
    const response = await api.delete(`/planillas_presentes.php?id=${id}`)

    if (response.status !== 200 && response.status !== 204) {
      throw new Error('Error en respuesta del servidor')
    }

    // Si es 204 no hay contenido, devolvemos éxito
    if (response.status === 204) {
      return { result: 'success' }
    }

    return response.data
  } catch (error) {
    console.error('Error en removePresent:', error)
    throw error
  }
}

export async function addStudentToAssist(studentData: {
  planilla_id: number;
  alumno_id: number;
}) {
  try {
    const response = await api.post('/planillas_alumnos.php', studentData)

    if (response.data.result !== 'success') {
      throw new Error(response.data.message || 'Error al asignar el estudiante')
    }

    return response.data.data
  } catch (error: any) {
    console.error('Error al asignar estudiante:', error)
    throw error
  }
}

export async function postStudent(studentData: {
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  dni: string;
  tel_adulto: string;
  tel_mama: string;
  nombre_mama: string;
  edad: number;
}) {
  try {
    const response = await api.post('/students.php', studentData)

    if (response.data.result !== 'success') {
      throw new Error(response.data.message || 'Error al guardar estudiante')
    }

    return response.data.data
  } catch (error: any) {
    console.error('Error al crear estudiante:', error)
    throw error
  }
}


export function usePresentCount(
  category: string,
  subcategoria: string,
  date: string,
  refreshSignal: boolean
) {
  const [countPresentes, setCountPresentes] = React.useState<number>(0)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchCount() {
      setLoading(true)
      try {
        const response = await api.get('/students.php', {
          params: {
            method: 'getValues',
            category,
            categoria: category, // si el backend requiere ambas
            subcategoria,
            date,
          },
        })

        console.log('Respuesta contador:', response.data)
        console.log('date:', date)

        if (response.data?.result === 'success' && response.data?.data?.tot_presents !== undefined) {
          console.log('Respuesta API getValues:', response.data);
          setCountPresentes(response.data.data.tot_presents)
        } else {
          console.warn('Respuesta inesperada al contar presentes', response.data)
        }
      } catch (e: any) {
        console.error('Error cargando contador de presentes:', e)
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCount()
  }, [category, subcategoria, date, refreshSignal])

  return { countPresentes, loading, error }
}






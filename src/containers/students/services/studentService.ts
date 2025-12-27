import React from 'react';
import api from '../../../core/services/axiosClient';
import axios from 'axios';
import { Alert } from 'react-native';

export type ReportSeasonPresent = {
  name: string;
  cant_presents: number;
  cant_buyed_classes: number;
  tot_amount: number;
  tot_paid_amount: number;
  cant_gift_classes: number;
};

export type ReportPresent = {
  id: number; 
  planilla: string;
  fecha_presente: number;
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
  tel_adulto: string;
  nombre_mama: string;
  nombre_papa: string;
  taken_classes: ReportSeasonPresent[];
  created: string;
  updated_date: string;
  student_observation: string;
  category: string;
  sub_category: string;
  current_student: string;

  // ✅ Nuevos campos agregados
  autorizado1_nombre: string | null;
  autorizado1_dni: string | null;
  autorizado1_parentesco: string | null;

  autorizado2_nombre: string | null;
  autorizado2_dni: string | null;
  autorizado2_parentesco: string | null;

  autorizado3_nombre: string | null;
  autorizado3_dni: string | null;
  autorizado3_parentesco: string | null;

  salud: string | null;
  deportes: string | null;
  sabe_nadar: string | null;

};

export type Student = {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;

  observation: string;

  tel_mama: string;
  tel_papa: string;
  tel_adulto: string;
  nombre_mama: string;
  nombre_papa: string;
  
  created: string;
  updated_date: string;
  category: string;
  sub_category: string;
}


export async function getResumenStudent(
  student_id: number
): Promise<ReportSeasonPresent[]> {
  const response = await api.get('/seasons.php', {
    params: {
      method: 'getResumInfoByStudent',
      student_id,
    },
  })

  if (response.data.result === 'success') {
    return response.data.data 
  } else {
    throw new Error(response.data.message || 'Error al obtener estudiantes')
  }
}

export async function getPresentsStudent(
  student_id: number
): Promise<ReportPresent[]> {
  const response = await api.get('/planillas_presentes.php', {
    params: {
      method: 'getPresentsByStudent',
      id: student_id,
    },
  })

  if (response.data.result === 'success') {
    return response.data.data 
  } else {
    throw new Error(response.data.message || 'Error al obtener estudiantes')
  }
}

export async function fetchStudentsForPayment(
  page: number,
  category: string,
  query: string,

  date: string,
  onlyPresents = 'false',
  orderby = 'alf',
): Promise<{ planilla_id: number; list_rep: ReportStudent[] }> {

  
  const response = await api.get('/students.php', {
    params: {
      method: 'getStudentsByAssists',
      page,
      category:'todos',
      categoria: category,        
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

export async function fetchStudentsByAssists(
  page: number,
  category: string, 
  subcategoria: string, 
  date: string,
  onlyPresents = 'false',
  orderby = 'alf',
  query = '',
  activeFilter: 'si' | 'no' = 'si'
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
      current_student: activeFilter 
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

export async function updatePresentObservacion(
  planilla_presente_id: number,
  observacion: string
): Promise<boolean> {
  try {
    const response = await api.put('/planillas_presentes.php', {
      id: planilla_presente_id,
      observacion,
    })

    if (response.data.result !== 'success') {
      throw new Error(response.data.message || 'Error al actualizar observación')
    }

    return true
  } catch (error) {
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

export async function checkExistStudent(dni: string): Promise<boolean> {
  try {
    const response = await api.get('/students.php', {
      params: {
        dni,
        method: 'checkExistStudent',
      },
    });

    return response.data.data.val?.toLowerCase().trim() === "true";
  } catch (error) {

    Alert.alert('Error', 'No se pudo validar el DNI.');
    return false;
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
  observation: string;
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
  const [countStudents, setCountStudents] = React.useState<number>(0)
  const [countActiveStudents, setCountActiveStudents] = React.useState<number>(0)
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
          setCountStudents(response.data.data.tot_students)
          setCountActiveStudents(response.data.data.tot_active_students)
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

  return { countActiveStudents, countStudents, countPresentes, loading, error }
}



export async function updateStudentActive(
  planilla_alumno_id: number,
  current_student: 'si' | 'no'
) {
  try {
    const response = await api.put('/planillas_alumnos.php', {
      id: planilla_alumno_id,
      current_student,
    });

    console.log('📥 Response updateStudentActive:', response.data);

    if (response.data.result !== 'success') {
      throw new Error(response.data.message || 'Error al actualizar estudiante');
    }

    return response.data.data;
  } catch (error: any) {
    console.error(
      '❌ Error updateStudentActive:',
      error.response?.data || error.message
    );
    throw error;
  }
}


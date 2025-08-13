

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
}


export async function createPayment(studentData: {
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
    const response = await api.post('/incomes.php', studentData)

    if (response.data.result !== 'success') {
      throw new Error(response.data.message || 'Error al guardar estudiante')
    }

    return response.data.data
  } catch (error: any) {
    console.error('Error al crear estudiante:', error)
    throw error
  }
}







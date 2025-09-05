// src/features/incomes/services/incomeService.ts
import api from '../../../core/services/axiosClient';

export type Income = {
  income_id: number;
  student_id: number;
  class_course_id: number;
  amount: number;
  description: string;
  income_created: string;
  detail: string | number;
  payment_method: string;
  payment_place: string;

  category: string;
  sub_category: string;
};

export type IncomeStudent = {
  income_id: number;
  class_course_id: number;
  student_id: number;
  amount: number;
  description: string;
  created: string;
  detail: string;
  payment_method: string;
  payment_place: string;
  category: string;
  sub_category: string;

};

export async function fetchIncomes(
  page: number,
  payment_place = '',
  category = '',
  payment_method = ''
): Promise<Income[]> {
  const params: any = { method: 'getAllIncomes', page };

  if (payment_place) {
    params.payment_place = payment_place;
  }

  if (category) {
    params.category = category;
  }

  if (payment_method) {
    params.payment_method = payment_method;
  }

  const response = await api.get('/incomes.php', { params });

  if (response.data.result === 'success') {
    return response.data.data as Income[];
  } else {
    throw new Error(response.data.message || 'Error al obtener pagos');
  }
}



export async function fetchIncomesByStudent(studentId: number, page: number): Promise<IncomeStudent[]> {
  const params = {
    method: 'getIncomesByStudent',
    student_id: studentId,
    page, // así lo recibe usePaginatedFetch
  };

  const response = await api.get('/class_courses.php', { params });

  if (response.data.result === 'success') {
    return response.data.data as IncomeStudent[];
  } else {
    throw new Error(response.data.message || 'Error al obtener pagos');
  }
}

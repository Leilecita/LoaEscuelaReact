// src/features/incomes/services/incomeService.ts
import api from '../../../core/services/axiosClient';

export type Income = {
  income_id: number;
  student_id: number;
  amount: number;
  description: string;
  income_created: string;
  detail: string | number;
  payment_method: string;
  category: string;
};

export async function fetchIncomes(
  page: number,
  payment_place = ''
): Promise<Income[]> {
  const params: any = { method: 'getAllIncomes', page };
  
  // Solo agregar filtro si payment_place no está vacío
  if (payment_place) {
    params.payment_place = payment_place;
  }

  const response = await api.get('/incomes.php', { params });

  if (response.data.result === 'success') {
    return response.data.data as Income[];
  } else {
    throw new Error(response.data.message || 'Error al obtener pagos');
  }
}

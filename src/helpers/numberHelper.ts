
// Quita todo lo que no sea número y devuelve un number
export function parseCurrency(value: string): number {
 return parseFloat(value.replace(/\D/g, '')) || 0;
}

// Formatea un número a $ 1.234 para mostrar en UI
export function currencyToDisplay(value: number): string {
 if (!value) return '';
 return '$ ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
// utils/dateTimeHelpers.ts

export function getCurrentLocalDateTime(): string {
 const now = new Date();
 const pad = (n: number) => n.toString().padStart(2, '0');
 return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export function getCurrentLocalDate(): string {
 const now = new Date();
 const pad = (n: number) => n.toString().padStart(2, '0');
 return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function formatDateToYYYYMMDD(date: Date): string {
 const pad = (n: number) => n.toString().padStart(2, '0');
 return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Devuelve fecha y hora en formato "YYYY-MM-DD HH:mm:ss"
export function formatDateToFullDateTime(date: Date): string {
 const pad = (n: number) => n.toString().padStart(2, '0');
 return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
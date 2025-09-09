// helpers/avatarColors.ts
import { COLORS } from 'core/constants'

export const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'escuela':
      return COLORS.escuela
    case 'colonia':
      return COLORS.colonia
    default:
      return COLORS.high
  }
}

// helpers/avatarColors.ts
import { COLORS } from 'core/constants'

export const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'adultos':
      return COLORS.adultos
    case 'intermedios':
      return COLORS.intermedios
    case 'mini':
      return COLORS.mini
    case 'kids':
      return COLORS.kids
    case 'highschool':
        return COLORS.highschool
    default:
      return COLORS.high
  }
}

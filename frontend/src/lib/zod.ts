import { z } from 'zod'

export const loginField = z
  .string()
  .trim()
  .min(3, 'Минимум 3 символа')
  .max(50, 'Максимум 50 символов')
  .regex(/^[a-zA-Z0-9_.-]+$/, 'Только латиница, цифры и символы _ . -')

export const emailField = z.string().trim().min(1, 'Укажите Email').check(z.email('Неверный формат'))

export const passwordField = z.string().min(6, 'Пароль должен содержать минимум 6 символов')

export const requiredStringField = (message = 'Обязательное поле') => z.string().trim().min(1, message)

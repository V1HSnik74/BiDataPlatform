import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authApi } from '../../api/auth'
import { AuthCard } from '../../components/AuthCard'
import { FormInput } from '../../components/FormInput'
import { Icon } from '../../components/Icon'
import { useCustomForm } from '../../hooks/useCustomForm'
import { ROUTES } from '../../lib/routes'
import { loginField, emailField, passwordField, requiredStringField } from '../../lib/zod'
import css from './index.module.scss'

const registerSchema = z
  .object({
    login: loginField,
    email: emailField,
    password: passwordField,
    password_confirm: requiredStringField('Подтвердите пароль'),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Пароли не совпадают',
    path: ['password_confirm'],
  })

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { form } = useCustomForm({
    defaultValues: {
      login: '',
      email: '',
      password: '',
      password_confirm: '',
    },
    validationSchema: registerSchema,
    successMessage: 'Аккаунт успешно создан! Теперь войдите в систему.',
    onSubmit: async ({ value }) => {
      await authApi.register(value)
      navigate(ROUTES.REGISTER)
    },
  })

  return (
    <AuthCard
      title="Создание аккаунта"
      subtitle={
        <>
          Начните управлять источниками данных и<br />
          панелями показателей
        </>
      }
      footer={
        <div className={css.footerPrompt}>
          <span>Уже есть аккаунт?</span>
          <Link to={ROUTES.LOGIN} className={css.loginLink}>
            Войти
          </Link>
        </div>
      }
    >
      <form
        className={css.form}
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        noValidate
      >
        <form.Field name="login">
          {(field) => <FormInput field={field} label="Имя пользователя" placeholder="name" autoComplete="off" />}
        </form.Field>
        <form.Field name="email">
          {(field) => (
            <FormInput field={field} label="Email" placeholder="name@example.com" type="email" autoComplete="off" />
          )}
        </form.Field>
        <form.Field name="password">{(field) => <FormInput field={field} label="Пароль" isPassword />}</form.Field>
        <form.Field name="password_confirm">
          {(field) => <FormInput field={field} label="Подтверждение пароля" type="password" />}
        </form.Field>
        <form.Subscribe selector={(state) => [state.isSubmitting]}>
          {([isSubmitting]) => (
            <div className={css.submitWrapper}>
              <button type="submit" className={css.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icon name="loader" size={16} className={css.spinner} />
                    <span>Создание...</span>
                  </>
                ) : (
                  'Создать аккаунт'
                )}
              </button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </AuthCard>
  )
}

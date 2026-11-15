import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authApi } from '../../api/auth'
import { AuthCard } from '../../components/AuthCard'
import { FormInput } from '../../components/FormInput'
import { Icon } from '../../components/Icon'
import { useCustomForm } from '../../hooks/useCustomForm'
import { ROUTES } from '../../lib/routes'
import { requiredStringField } from '../../lib/zod'
import css from './index.module.scss'

const loginSchema = z.object({
  identifier: requiredStringField('Введите логин или email'),
  password: requiredStringField('Введите пароль'),
  remember_me: z.boolean(),
})

export const LoginPage = () => {
  const navigate = useNavigate()

  const { form } = useCustomForm({
    defaultValues: {
      identifier: '',
      password: '',
      remember_me: false,
    },
    validationSchema: loginSchema,
    onSubmit: async ({ value }) => {
      const data = await authApi.login(value)
      localStorage.setItem('access_token', data.access_token)
      navigate(ROUTES.DASHBOARDS)
    },
  })

  return (
    <AuthCard
      title="Вход в BI-платформу"
      subtitle={
        <>
          Введите учётные данные для доступа к<br />
          дашбордам и наборам данных
        </>
      }
      footer={
        <div className={css.footerPrompt}>
          <span>Нет аккаунта?</span>
          <Link to={ROUTES.REGISTER} className={css.link}>
            Зарегистрироваться
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
        <form.Field name="identifier">
          {(field) => (
            <FormInput
              field={field}
              label="Логин или email"
              placeholder="name@example.com"
              autoComplete="off"
              leftIcon={<Icon name="user" size={16} />}
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <FormInput
              field={field}
              label="Пароль"
              labelRight={
                <Link to={ROUTES.FORGOT_PASSWORD} className={css.forgotLink}>
                  Забыли пароль?
                </Link>
              }
              isPassword
            />
          )}
        </form.Field>
        <form.Field name="remember_me">
          {(field) => (
            <label className={css.checkboxLabel}>
              <input
                type="checkbox"
                className={css.checkbox}
                checked={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.checked)}
              />
              <span>Запомнить меня</span>
            </label>
          )}
        </form.Field>
        <form.Subscribe selector={(state) => [state.isSubmitting]}>
          {([isSubmitting]) => (
            <div className={css.submitWrapper}>
              <button type="submit" className={css.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Icon name="loader" size={16} className={css.spinner} />
                    <span>Вход...</span>
                  </>
                ) : (
                  'Войти'
                )}
              </button>
            </div>
          )}
        </form.Subscribe>
      </form>
    </AuthCard>
  )
}

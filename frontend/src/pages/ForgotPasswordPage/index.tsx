import { useState } from 'react'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { authApi } from '../../api/auth'
import { AuthCard } from '../../components/AuthCard'
import { FormInput } from '../../components/FormInput'
import { Icon } from '../../components/Icon'
import { useCustomForm } from '../../hooks/useCustomForm'
import { ROUTES } from '../../lib/routes'
import { emailField } from '../../lib/zod'
import css from './index.module.scss'

const forgotPasswordSchema = z.object({
  email: emailField,
})

export const ForgotPasswordPage = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)
  const { form } = useCustomForm({
    defaultValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async ({ value }) => {
      await authApi.forgotPassword(value)
      setSubmittedEmail(value.email)
    },
  })
  return (
    <AuthCard
      title="Восстановление пароля"
      subtitle={
        submittedEmail ? (
          <>
            Мы отправили инструкции по сбросу пароля на
            <br />
            <span className={css.emailHighlight}>{submittedEmail}</span>
          </>
        ) : (
          <>
            Введите email, привязанный к вашему аккаунту,
            <br />и мы отправим ссылку для сброса пароля
          </>
        )
      }
      footer={
        <Link to={ROUTES.LOGIN} className={css.backLink}>
          <Icon name="back" size={15} />
          <span>Вернуться ко входу</span>
        </Link>
      }
    >
      {submittedEmail ? (
        <div className={css.successBox}>
          <div className={css.successIcon}>
            <Icon name="done" size={24} />
          </div>
          <p className={css.successText}>
            Проверьте папку «Входящие» или «Спам». Если вы указали неверный адрес, вы можете отправить запрос повторно.
          </p>
          <button type="button" className={css.secondaryBtn} onClick={() => setSubmittedEmail(null)}>
            Указать другой email
          </button>
        </div>
      ) : (
        <form
          className={css.form}
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          noValidate
        >
          <form.Field name="email">
            {(field) => (
              <FormInput
                field={field}
                label="Рабочий email"
                type="email"
                placeholder="name@example.com"
                autoComplete="off"
                leftIcon={<Icon name="mail" size={16} />}
              />
            )}
          </form.Field>
          <form.Subscribe selector={(state) => [state.isSubmitting]}>
            {([isSubmitting]) => (
              <div className={css.submitWrapper}>
                <button type="submit" className={css.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Icon name="loader" size={16} className={css.spinner} />
                      <span>Отправка...</span>
                    </>
                  ) : (
                    'Отправить инструкции'
                  )}
                </button>
              </div>
            )}
          </form.Subscribe>
        </form>
      )}
    </AuthCard>
  )
}

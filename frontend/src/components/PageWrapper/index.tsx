import type { DefinedUseQueryResult, UseQueryResult } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorPageComponent } from '../../components/ErrorPageComponent'
import { ROUTES } from '../../lib/routes'
import { LoaderPageComponent } from '../LoaderPageComponent'

class CheckExistsError extends Error {}
const checkExistsFn = <T,>(value: T, message?: string): NonNullable<T> => {
  if (!value) {
    throw new CheckExistsError(message)
  }
  return value
}

type Props = Record<string, any>
type QueryResult = UseQueryResult<any, any>
type QuerySuccessResult<TQueryResult extends QueryResult> = DefinedUseQueryResult<
  NonNullable<TQueryResult['data']>,
  null
>
type HelperProps<TQueryResult extends QueryResult | undefined> = {
  queryResult: TQueryResult extends QueryResult ? QuerySuccessResult<TQueryResult> : undefined
}
type SetPropsProps<TQueryResult extends QueryResult | undefined> = HelperProps<TQueryResult> & {
  checkExists: typeof checkExistsFn
}
type PageWrapperProps<TProps extends Props, TQueryResult extends QueryResult | undefined> = {
  redirectAuthorized?: boolean

  authorizedOnly?: boolean
  authorizedOnlyTitle?: string
  authorizedOnlyMessage?: string

  checkExists?: (helperProps: HelperProps<TQueryResult>) => boolean
  checkExistsTitle?: string
  checkExistsMessage?: string

  title: string | ((titleProps: HelperProps<TQueryResult> & TProps) => string)
  isTitleExact?: boolean

  useQuery?: () => TQueryResult
  setProps?: (setPropsProps: SetPropsProps<TQueryResult>) => TProps
  Page: React.FC<TProps>
}

const Title = ({ children }: { children: string }) => {
  useEffect(() => {
    document.title = children
  }, [children])
  return null
}

type ResolveResult<TProps> = { ok: true; props: TProps } | { ok: false; error: unknown }

const resolveProps = <TProps,>(fn: () => TProps): ResolveResult<TProps> => {
  try {
    return { ok: true, props: fn() }
  } catch (error) {
    return { ok: false, error }
  }
}

const PageWrapper = <TProps extends Props = object, TQueryResult extends QueryResult | undefined = undefined>({
  redirectAuthorized,
  authorizedOnly,
  authorizedOnlyTitle = 'Требуется авторизация',
  authorizedOnlyMessage = 'Эта страница доступна только авторизованным пользователям',
  checkExists,
  checkExistsTitle = 'Не найдено',
  checkExistsMessage = 'Запрашиваемая страница не существует',
  title,
  isTitleExact = false,
  useQuery,
  setProps,
  Page,
}: PageWrapperProps<TProps, TQueryResult>) => {
  const navigate = useNavigate()
  const isAuthorized = !!localStorage.getItem('access_token')
  const queryResult = useQuery?.()
  const redirectNeeded = redirectAuthorized && isAuthorized

  useEffect(() => {
    if (redirectNeeded) {
      navigate(ROUTES.DASHBOARDS, { replace: true })
    }
  }, [redirectNeeded, navigate])

  if (queryResult?.isLoading || redirectNeeded) {
    return <LoaderPageComponent />
  }

  if (authorizedOnly && !isAuthorized) {
    return <ErrorPageComponent title={authorizedOnlyTitle} message={authorizedOnlyMessage} />
  }

  if (queryResult?.error) {
    const err = queryResult.error
    if (isAxiosError(err) && err.response?.status === 403) {
      return (
        <ErrorPageComponent
          title="Доступ запрещён"
          message="У вашей учётной записи недостаточно прав для просмотра этого раздела"
        />
      )
    }
    return <ErrorPageComponent message={err.message} />
  }

  const helperProps = { queryResult: queryResult as never }

  if (checkExists) {
    const notExists = !checkExists(helperProps)
    if (notExists) {
      return <ErrorPageComponent title={checkExistsTitle} message={checkExistsMessage} />
    }
  }

  const result = resolveProps(() => (setProps?.({ ...helperProps, checkExists: checkExistsFn }) ?? {}) as TProps)

  if (!result.ok) {
    if (result.error instanceof CheckExistsError) {
      return <ErrorPageComponent title={checkExistsTitle} message={result.error.message || checkExistsMessage} />
    }
    throw result.error
  }

  const calculatedTitle = typeof title === 'function' ? title({ ...helperProps, ...result.props }) : title
  const exactTitle = isTitleExact ? calculatedTitle : `${calculatedTitle} – BiDataPlatform`

  return (
    <>
      <Title>{exactTitle}</Title>
      <Page {...result.props} />
    </>
  )
}

export const withPageWrapper = <
  TProps extends Props = object,
  TQueryResult extends QueryResult | undefined = undefined,
>(
  pageWrapperProps: Omit<PageWrapperProps<TProps, TQueryResult>, 'Page'>
) => {
  return (Page: PageWrapperProps<TProps, TQueryResult>['Page']) => {
    return () => <PageWrapper {...pageWrapperProps} Page={Page} />
  }
}

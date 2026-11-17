import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppToaster } from './components/AppToaster'
import { Layout } from './components/Layout'
import { QueryProvider } from './lib/QueryProvider'
import { ROUTES } from './lib/routes'
import { AdminPage } from './pages/AdminPage'
import { ChartBuilder } from './pages/ChartBuilderPage'
import { Dashboard } from './pages/DashboardPage'
import { DataSourcePage } from './pages/DataSourcePage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

export const App = () => {
  return (
    <QueryProvider>
      <AppToaster />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route element={<Layout />}>
            <Route path={ROUTES.SOURCES} element={<DataSourcePage />} />
            <Route path={ROUTES.NEWCHART} element={<ChartBuilder />} />
            <Route path={ROUTES.DASHBOARDS} element={<Dashboard />} />
            <Route path={ROUTES.ADMIN} element={<AdminPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  )
}

import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { QueryProvider } from './lib/QueryProvider'
import { ROUTES } from './lib/routes'
import { ChartBuilder } from './pages/ChartBuilderPage'
import { Dashboard } from './pages/DashboardPage'
import { DataSourcePage } from './pages/DataSourcePage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

export const App = () => {
  return (
    <QueryProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route element={<Layout />}>
            <Route path={ROUTES.SOURCES} element={<DataSourcePage />} />
            <Route path={ROUTES.NEWCHART} element={<ChartBuilder />} />
            <Route path={ROUTES.DASHBOARDS} element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  )
}

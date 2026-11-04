import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { QueryProvider } from './lib/QueryProvider'
import { ROUTES } from './lib/routes'
import { ChartBuilder } from './pages/ChartBuilderPage'
import { DataSourcePage } from './pages/DataSourcePage'

const Page = () => {
  return <h1>Hello!</h1>
}

export const App = () => {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<Page />} />
            <Route path={ROUTES.SOURCES} element={<DataSourcePage />} />
            <Route path={ROUTES.NEWCHART} element={<ChartBuilder />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  )
}

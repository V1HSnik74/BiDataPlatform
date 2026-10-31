import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ROUTES } from './lib/routes'
import { DataSourcePage } from './pages/DataSourcePage'

const Page = () => {
  return <h1>Hello!</h1>
}

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<Page />} />
          <Route path={ROUTES.SOURCES} element={<DataSourcePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

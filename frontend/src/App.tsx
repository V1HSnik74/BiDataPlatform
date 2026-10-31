import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { DataSourcePage } from './pages/DataSourcePage'

const Page = () => {
  return <h1>Hello!</h1>
}

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Page />} />
          <Route path="/sources" element={<DataSourcePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

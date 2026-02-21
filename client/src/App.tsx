import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { FormsPage } from './pages/FormsPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms" element={<FormsPage />} />
      </Routes>
    </Layout>
  )
}

export default App

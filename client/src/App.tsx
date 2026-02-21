import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { FormBuilderPage } from './pages/FormBuilderPage'
import { FormFillerPage } from './pages/FormFillerPage'
import { FormResponsesPage } from './pages/FormResponsesPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms/new" element={<FormBuilderPage />} />
        <Route path="/forms/:id/edit" element={<FormBuilderPage />} />
        <Route path="/forms/:id/fill" element={<FormFillerPage />} />
        <Route path="/forms/:id/responses" element={<FormResponsesPage />} />
      </Routes>
    </Layout>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AuthCallback from './pages/AuthCallback'
import Exercises from './pages/Exercises/Exercises'
import ExerciseDetail from './pages/Exercises/ExerciseDetail'
import CreateExercise from './pages/Exercises/CreateExercise'
import Routines from './pages/Routines/Routines'
import RoutineDetail from './pages/Routines/RoutineDetail'
import RoutineCreator from './pages/Routines/RoutineCreator'
import Splits from './pages/Splits/Splits'
import SplitForm from './pages/Splits/SplitForm'
import SplitDetail from './pages/Splits/SplitDetail'
import Measurements from './pages/Measurements/Measurements'
import UserManagement from './pages/UserManagement'
import { AccessibilityProvider } from './context/AccessibilityContext'
import AccessibilityButton from './components/AccessibilityButton'

export default function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/new" element={<CreateExercise />} />
            <Route path="/exercises/:id" element={<ExerciseDetail />} />
            <Route path="/exercises/:id/edit" element={<CreateExercise />} />
            <Route path="/routines" element={<Routines />} />
            <Route path="/routines/new" element={<RoutineCreator />} />
            <Route path="/routines/:id" element={<RoutineDetail />} />
            <Route path="/routines/:id/edit" element={<RoutineCreator />} />
            <Route path="/splits" element={<Splits />} />
            <Route path="/splits/new" element={<SplitForm />} />
            <Route path="/splits/:id" element={<SplitDetail />} />
            <Route path="/splits/:id/edit" element={<SplitForm />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/users" element={<UserManagement />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <AccessibilityButton />
      </BrowserRouter>
    </AccessibilityProvider>
  )
}

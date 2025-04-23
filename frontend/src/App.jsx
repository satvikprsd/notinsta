import Home from './components/Home'
import { LoadingProvider } from './components/LoadingContext'
import MainPage from './components/MainPage'
import Profile from './components/Profile'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', element: <MainPage />,children: [{path: '/',element: <Home />}, {path: '/profile/:username', element: <Profile />}] },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <SignIn /> },
])
function App() {

  return (
    <div className='bg-background'>
      <LoadingProvider>
        <RouterProvider router={router}/>
      </LoadingProvider>
    </div>
  )
}

export default App

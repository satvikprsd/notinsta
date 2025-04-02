import Home from './components/Home'
import MainPage from './components/MainPage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', element: <MainPage />,children: [{path: '/',element: <Home />},]},
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <SignIn /> },
])
function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App

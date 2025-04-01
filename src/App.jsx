import Home from './components/Home'
import MainPage from './components/MainPage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', element: <MainPage />, children: [{path: '/home', component: <Home />}] },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <SignIn /> },
])
function App() {

  return (
    <div className='bg-black w-screen h-screen'>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App

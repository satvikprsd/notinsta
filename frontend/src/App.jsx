import ChatPage from './components/ChatPage'
import Home from './components/Home'
import { LoadingProvider } from './components/LoadingContext'
import { ChatProvider } from './components/ChatContext'
import MainPage from './components/MainPage'
import PostPage from './components/PostPage'
import Profile from './components/Profile'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SearchProvider } from './components/SearchContext'
import { SidebarActiveProvider } from './components/SideBarActiveContext'
import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setOnlineUsers, setSocket } from './redux/chatSlice'
import { useSocket } from './components/SocketContext'

const router = createBrowserRouter([
  { path: '/', element: <MainPage />,children: [{path: '/',element: <Home />}, {path: '/profile/:username', element: <Profile />}, { path: '/p/:postid', element: <PostPage />}, { path: '/chat', element: <ChatPage />}, { path: '/chat/:chatid', element: <ChatPage />}] },
  { path: '/signup', element: <SignUp /> },
  { path: '/login', element: <SignIn /> },
])
function App() {
  const {user} = useSelector(store=>store.auth);
  const { setSocketIO } = useSocket();
  const dispatch = useDispatch();
  useEffect(()=>{
      if(user){
        const socketio = io(import.meta.env.VITE_BACKEND_URL, {
          query: {
            userID: user?._id
          }
        });
        setSocketIO(socketio);
        socketio.on('getOnlineUsers', (users)=>{
          dispatch(setOnlineUsers(users))
        })

        return () => {
          socketio?.close();
          setSocketIO(null);
        }
      }
  }, [user, dispatch])
  return (
    <div className='bg-background'>
      <SidebarActiveProvider>
        <SearchProvider>
          <LoadingProvider>
            <ChatProvider>
              <RouterProvider router={router}/>
            </ChatProvider>
          </LoadingProvider>
        </SearchProvider>
      </SidebarActiveProvider>
    </div>
  )
}

export default App

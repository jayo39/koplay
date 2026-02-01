import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import UserProvider from './provider/userProvider.jsx';
import PostPage from './pages/post.jsx';

const router = createBrowserRouter([
  {path: "/", element: <App/>},
  {path: "/login", element: <LoginPage/>},
  {path: "/register", element: <RegisterPage/>},
  {path: "/post", element: <PostPage/>}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import './index.css'
import App from './App.jsx'
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import UserProvider from './provider/userProvider.jsx';
import SchedulePage from './pages/schedule.jsx';
import FriendPage from './pages/friend.jsx';
import MessagePage from './pages/message.jsx';
import AdminPage from './pages/admin.jsx';
import PostPage from './pages/post.jsx'
import ProfilePage from './pages/profile.jsx';
import PostSinglePage from './pages/postSingle.jsx';
import { withLogin, withLoginAndAdmin } from './hoc/hoc.jsx';
import GPAPage from './pages/gpa.jsx';
import PostPersonalPage from './pages/postPersonal.jsx';
import InvalidPage from './pages/invalid.jsx';
import PrivacyPage from './pages/privacy.jsx';

const ProtectedSchedule = withLogin(SchedulePage);
const ProtectedFriend = withLogin(FriendPage);
const ProtectedMessage = withLogin(MessagePage);
const ProtectedPost = withLogin(PostPage);
const ProtectedProfile = withLogin(ProfilePage);
const ProtectedSinglePost = withLogin(PostSinglePage);
const ProtectedGPA = withLogin(GPAPage);
const ProtectedPostpersonal = withLogin(PostPersonalPage);

const ProtectedAdmin = withLoginAndAdmin(AdminPage);

const router = createBrowserRouter([
  {path: "/", element: <App/>},
  {path: "/login", element: <LoginPage/>},
  {path: "/register", element: <RegisterPage/>},
  {path: "/privacy", element: <PrivacyPage/>},
  {path: "/schedule/:userId?", element: <ProtectedSchedule/>},
  {path: "/friend", element: <ProtectedFriend/>},
  {path: "/profile", element: <ProtectedProfile/>},
  {path: "/message", element: <ProtectedMessage/>},
  {path: "/gpa", element: <ProtectedGPA/>},
  {path: "/post/:categoryId", element: <ProtectedPost/>},
  {path: "/post/:categoryId/:postId", element: <ProtectedSinglePost/>},
  {path: "/post/my/:type", element: <ProtectedPostpersonal/>},
  {path: "*", element: <InvalidPage />},
  {path: "/admin", element: <ProtectedAdmin/>},
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  </StrictMode>,
)

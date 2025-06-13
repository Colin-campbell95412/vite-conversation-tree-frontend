import { Routes, Route } from "react-router-dom";
import AdminLoginPage from "pages/Admin/Auth/AdminLoginPage";


import {
  ROUTE_ADMIN_LOGIN,
  ROUTE_ADMIN_USER,
  ROUTE_ADMIN_CONVERSATION,
  ROUTE_ADMIN_EDIT_CONVERSATION,
  ROUTE_ADMIN_DOC,
  ROUTE_ADMIN_LAB,
}
  from "constants/navigation_constants";
import AdminUserPage from "pages/Admin/User/AdminUserPage";
import AdminConversationPage from "pages/Admin/Conversation/AdminConversationPage";
import EditConversationPage from "pages/Admin/Conversation/EditConversationPage";
import AdminLabPage from "pages/Admin/Lab/AdminLabPage";  
import AdminDocPage from "pages/Admin/Doc/AdminDocPage";

export const RouterConfig = () => {
  return (
    <Routes>
      <Route path={ROUTE_ADMIN_LOGIN} element={<AdminLoginPage />} />
      <Route path={ROUTE_ADMIN_USER} element={<AdminUserPage />} />
      <Route path={ROUTE_ADMIN_CONVERSATION} element={<AdminConversationPage />} />
      <Route path={ROUTE_ADMIN_EDIT_CONVERSATION} element={<EditConversationPage />} />
      <Route path={ROUTE_ADMIN_DOC} element={<AdminDocPage />} />
      <Route path={ROUTE_ADMIN_LAB} element={<AdminLabPage />} />
      
    </Routes>
  );
};

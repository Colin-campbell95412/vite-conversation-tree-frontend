import { FloatButton } from 'antd';
import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNav from './AdminNav';
// import AdminFooter from './AdminFooter';
import './AdminLayout.css';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="admin-main-content">
        <AdminNav />
        <div className="admin-content">
        {children}
        </div>
      </div>
      <FloatButton.BackTop /> 
    </div>
  );
};

export default AdminLayout;
import { useState, useEffect } from 'react';
import './AdminLayout.css';
import { Row, Col } from 'antd';
import { Link, useLocation } from "react-router-dom";
// import Logo from 'assets/png/footer_logo.png';
import { ProductOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { ROUTE_ADMIN_CONVERSATION, ROUTE_ADMIN_DOC, ROUTE_ADMIN_LAB, ROUTE_ADMIN_USER } from 'constants/navigation_constants';

const AdminSidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const handleClick = (item: string) => {
    setActiveItem(item);
  };

  return (
    <div className="sidebar-content">
      <div className="d-flex justify-center">
        {/* <img src={Logo} width="160" height="50" alt="Logo" /> */}
      </div>
      <Row>
        {/* <Col className={`sidebar-item ${activeItem === ROUTE_ADMIN_CONTACT || activeItem === ROUTE_ADMIN ? 'active' : ''}`}>
          <Link
            to={ROUTE_ADMIN_CONTACT}
            className="sidebar-link"
            onClick={() => handleClick(ROUTE_ADMIN_CONTACT)}
          >
            <ProductOutlined /> Contacts
          </Link>
        </Col> */}

        {/* <Col className={`sidebar-item ${activeItem === ROUTE_ADMIN_PRODUCT ? 'active' : ''}`}>
          <Link
            to={ROUTE_ADMIN_PRODUCT}
            className="sidebar-link"
            onClick={() => handleClick(ROUTE_ADMIN_PRODUCT)}
          >
            <ProductOutlined /> Product Management
          </Link>
        </Col> */}
        <Col className={`sidebar-item ${activeItem === ROUTE_ADMIN_CONVERSATION ? 'active' : ''}`}>
          <Link
            to={ROUTE_ADMIN_CONVERSATION}
            className="sidebar-link"
            onClick={() => handleClick(ROUTE_ADMIN_CONVERSATION)}
          >
            <ProductOutlined /> Conversations
          </Link>
        </Col>

        <Col className={`sidebar-item ${activeItem === ROUTE_ADMIN_USER ? 'active' : ''}`}>
          <Link
            to={ROUTE_ADMIN_USER}
            className="sidebar-link"
            onClick={() => handleClick(ROUTE_ADMIN_USER)}
          >
            <UserSwitchOutlined /> Users
          </Link>
        </Col>
        
        <Col className={`sidebar-item ${activeItem === ROUTE_ADMIN_LAB ? 'active' : ''}`}>
          <Link
            to={ROUTE_ADMIN_LAB}
            className="sidebar-link"    
            onClick={() => handleClick(ROUTE_ADMIN_LAB)}
          >
            <ProductOutlined /> Lab
          </Link>
        </Col>

        <Col className={`sidebar-item ${activeItem === ROUTE_ADMIN_DOC ? 'active' : ''}`}>
          <Link
            to={ROUTE_ADMIN_DOC}
            className="sidebar-link"
            onClick={() => handleClick(ROUTE_ADMIN_DOC)}
          >
            <UserSwitchOutlined /> Doc
          </Link>
        </Col>
        {/* <Col className={`sidebar-item ${activeItem === ROUTE_ADMIN_PAYMENT ? 'active' : ''}`}>
          <Link
            to={ROUTE_ADMIN_PAYMENT}
            className="sidebar-link"
            onClick={() => handleClick(ROUTE_ADMIN_PAYMENT)}
          >
            <ProductOutlined /> Payment Management
          </Link>
        </Col> */}

      </Row>
    </div>
  );
};

export default AdminSidebar;
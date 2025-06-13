import { useEffect, useState } from 'react';
import { Layout, Avatar, Dropdown, Space, Typography, Modal, Button, Form, Input, Row, Col } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import ImgAvatar from 'assets/png/avatar.png';
import Toast from 'components/Toast/Toast';

import './AdminLayout.css';
import { ROUTE_ADMIN, ROUTE_ADMIN_CONVERSATION, ROUTE_ADMIN_DOC, ROUTE_ADMIN_EDIT_CONVERSATION, ROUTE_ADMIN_LAB, ROUTE_ADMIN_USER } from 'constants/navigation_constants';
import { useLocation } from "react-router-dom";
import { apiPost } from 'ajax/apiServices';
import { UrlAdminUpdateProfile } from 'ajax/apiUrls';
import { useDispatch, useSelector } from 'react-redux';
import { clearAdminInfo } from '../../redux/reducers/adminSlice';
import { MenuItemType } from 'antd/es/menu/interface';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const adminInfo = useSelector((state: any) => state.admin)
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard Management");

  const [visiblePassword, setVisiblePassword] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Toggle visibility for the password field
  const togglePasswordVisibility = (field: any) => {
    setVisiblePassword((prevState: any) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    dispatch(clearAdminInfo());
    window.location.href = "/admin/login";
  };

  // const handleProfile = () => {
  //   setModalVisible(true);
  // };

  const onFinish = async (formValues: any) => {
    if (formValues.new_password === formValues.confirm_password) {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formValues.username);
      formDataToSend.append("password", formValues.password);
      formDataToSend.append("new_password", formValues.new_password);

      apiPost(UrlAdminUpdateProfile, formDataToSend)
        .then(() => {
          Toast('Profile updated successfully.', "success");
          setModalVisible(false);
        })
        .catch((err) => {
          Toast(err, "error");
        });
    } else {
      Toast("New password doesn't match with confirm password!", "error");
    }
  };

  const menuItems: MenuItemType[] = [
    {
      key: 'user-info',
      disabled: true,
      label: (
        <Space direction="horizontal">
          <Avatar size="large" src={ImgAvatar} />
          <div>
            <Text strong>{adminInfo.username}</Text>
            <br />
            <Text type="secondary">{adminInfo.username}</Text>
          </div>
        </Space>
      ),
    },
    // {
    //   key: 'profile',
    //   label: (
    //     <Button type="link" className="btn-navbar-item" onClick={handleProfile}>
    //       My Profile
    //     </Button>
    //   ),
    // },
    {
      key: 'logout',
      label: (
        <Button type="link" className="btn-navbar-item" onClick={handleSignOut}>
          Sign out
        </Button>
      ),
    },
  ];

  useEffect(() => {
    let path = location.pathname;
    let tmpTitle = ''

    if (path == ROUTE_ADMIN) {
      tmpTitle = "Conversation"
    } else if (path == ROUTE_ADMIN_USER) {
      tmpTitle = "User"
    } else if (path == ROUTE_ADMIN_DOC) {
      tmpTitle = "Doc"
    } else if (path == ROUTE_ADMIN_LAB) {
      tmpTitle = "Lab"
    } else if (path == ROUTE_ADMIN_CONVERSATION) {
      tmpTitle = "Conversation"
    } else if (path == ROUTE_ADMIN_EDIT_CONVERSATION) {
      tmpTitle = "Conversation"
    }
    setPageTitle(tmpTitle)
  }, [location])
  
  return (
    <Header className="admin-navbar">
      <Row wrap={false} style={{ width: '100%' }}>
        <Col flex="auto">
          <h1>{pageTitle} Management</h1>
        </Col>
        <Col flex="none">
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            onOpenChange={setOpen}
            open={open}
          >
            <span style={{ cursor: 'pointer', top: '0' }}>
              <Avatar size="large" src={ImgAvatar} />
            </span>
          </Dropdown></Col>
      </Row>

      <Modal
        wrapClassName="vertical-center-modal"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 className="mb-20">My Profile</h2>
        </div>
        <Form name="normal_login" className="login-form" onFinish={onFinish}
          initialValues={{
            username: adminInfo.username, // Set the initial value for the email field
          }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Name!" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              type={visiblePassword.password ? "text" : "password"} // Toggle visibility
              placeholder="Password"
              suffix={
                visiblePassword.password ? (
                  <EyeInvisibleOutlined
                    onClick={() => togglePasswordVisibility("password")}
                  />
                ) : (
                  <EyeOutlined onClick={() => togglePasswordVisibility("password")} />
                )
              }
            />
          </Form.Item>

          <Form.Item
            name="new_password"
            rules={[{ required: true, message: "Please input your New Password!" }]}
          >
            <Input
              type={visiblePassword.newPassword ? "text" : "password"} // Toggle visibility
              placeholder="New Password"
              suffix={
                visiblePassword.newPassword ? (
                  <EyeInvisibleOutlined
                    onClick={() => togglePasswordVisibility("newPassword")}
                  />
                ) : (
                  <EyeOutlined onClick={() => togglePasswordVisibility("newPassword")} />
                )
              }
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            rules={[{ required: true, message: "Please input your Confirm Password!" }]}
          >
            <Input
              type={visiblePassword.confirmPassword ? "text" : "password"} // Toggle visibility
              placeholder="Confirm Password"
              suffix={
                visiblePassword.confirmPassword ? (
                  <EyeInvisibleOutlined
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  />
                ) : (
                  <EyeOutlined onClick={() => togglePasswordVisibility("confirmPassword")} />
                )
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Change
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Header>
  );
};

export default AppHeader;
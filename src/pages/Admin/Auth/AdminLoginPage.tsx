import { useState, useEffect } from "react";
import Toast from "components/Toast/Toast";

import "./index.css";
import { Form, Input, Button, Row, Col } from "antd";
import { ROUTE_ADMIN_CONVERSATION } from "constants/navigation_constants";
import { UrlAdminLogin } from "ajax/apiUrls";
import { apiPost } from "ajax/apiServices";
import { useDispatch } from "react-redux";
import { setAdminInfo } from "../../../redux/reducers/adminSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { showEditUserModal } from "../User/EditUserModal/ShowEditUserModal";
function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // message.success("This is a success message!");
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin/login");
    }
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.style.overflow = "hidden";
    }

    return () => {
      if (rootElement) {
        rootElement.style.overflow = "";
      }
    };
  }, []);

  const onFinish = async (formValues: { username: string; password: string }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("username", formValues.username);
    formData.append("password", formValues.password);
    console.log("Login button Clicked: formData", formValues);
    apiPost(UrlAdminLogin, formData)
      .then((res: any) => {
        setLoading(false);
        localStorage.setItem("token", res.data.token);
        dispatch(setAdminInfo(res.data.user_info));
        window.location.href = ROUTE_ADMIN_CONVERSATION;
      })
      .catch((err) => {
        setLoading(false);
        Toast(err, "error");
      });
  };

  const onSignup = async () => {
    let dlgRes = await showEditUserModal({
      data: {},
      method: "add",
      show: true,
    })

    if (dlgRes == null) return
  };

  return (
    <>
      <Row gutter={16} className="admin-signin-content" justify={"center"}>
        <Col sm={24} className="auth-part">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            style={{ marginTop: 20 }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input className="login-input" placeholder="Username" />
            </Form.Item>
            <Form.Item
              style={{ marginTop: "20px" }}
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                type="password"
                placeholder="Password"
                className="login-input"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: "40px" }}>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
            </Form.Item>
            <Form.Item style={{ marginTop: "-10px" }}>
              <Button
                loading={loading}
                type="primary"
                className="login-form-button"
                onClick={() =>
                  onSignup()
                }
              >
                Sign up
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <ToastContainer />
    </>
  );
}

export default AdminLoginPage;

import React, { useEffect, useState } from "react";
import { confirmable } from "react-confirm";
import CustomInput from "components/CustomInput/CustomInput";
import { Col, Modal, Row, Select } from "antd";
import { apiPost } from "ajax/apiServices";
import Toast from "components/Toast/Toast";
import { UrlAdminSignup } from "ajax/apiUrls";

interface EditUserModalProps {
  show: boolean;
  method: string;
  data: any;
  onSuccess?: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  show,
  method,
  data,
  onSuccess,
}) => {
  const [isModalShow, setModalShow] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    user_id: "",
    role: "user",
  });

  interface FormErrors {
    username?: boolean;
    password?: boolean;
    role?: boolean;
  }

  const [errors, setErrors] = useState<FormErrors>({
    username: false,
    password: false,
  });

  // const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setModalShow(show);
    if (show) {
      // When modal opens, initialize based on method
      if (method === "edit" && data) {
        setFormData({
          username: data.username || "",
          password: "",
          user_id: data.id || "",
          role: "user",
        });
      } else {
        setFormData({
          username: "",
          password: "",
          user_id: "",
          role: "user",
        });
      }
    }
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    e.target.value = null;
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
    setErrors((prevErrors) => ({ ...prevErrors, role: false }));
  };

  const validateForm = () => {
    let newErrors: FormErrors = {};

    if (!formData.username.trim()) newErrors.username = true;

    if (!formData.password) newErrors.password = true;

    if (!formData.role) newErrors.role = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // if (!validateForm()) return;
    // setLoading(true);
    // console.log("Ok button clicked: formData:", formData);
    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formPayload.append(key, value as string);
      } else {
        formPayload.append(key, ""); // Fallback for null values
      }
    });

    apiPost(UrlAdminSignup, formPayload)
      .then((res: any) => {
        // console.log("Response from server:", res);
        if (res.status === "success") {
          Toast(res.message, "success");
          setModalShow(false);
          if (onSuccess) onSuccess();
        } else {
          Toast(res.message, "error");
        }

        setErrors({});
      })
      .catch((err) => {
        Toast(err, "error");
      })
      .finally(() => {
        // setIsLoading(false); // End loader
      });
  };

  return (
    <Modal
      wrapClassName="vertical-center-modal"
      open={isModalShow}
      onOk={() => {
        if (validateForm()) {
          handleSubmit();
        }
      }}
      onCancel={() => {
        setFormData({
          username: "",
          password: "",
          user_id: "",
          role: "user",
        });
        setErrors({
          username: false,
          password: false,
        });
        setModalShow(false);
      }}
    >
      <h2 style={{ textAlign: "center", marginTop: "-10px" }}>
        {method === "edit" ? "Edit User" : "Add User"}
      </h2>
      <div>
        <Row gutter={24}>
          <Col md={24}>
            <div
              className={`column-label ${
                focusedField === "name" ? "active" : ""
              }`}
            >
              Name
            </div>
            <CustomInput
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              formData={formData["username"]}
              handleChange={handleChange}
              errors={errors}
              name={"username"}
              placeholder={""}
              value={formData.username}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={24}>
            <div
              className={`column-label ${
                focusedField === "password" ? "active" : ""
              }`}
            >
              Password
            </div>
            <CustomInput
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              formData={formData["password"]}
              handleChange={handleChange}
              errors={errors}
              name={"password"}
              placeholder={""}
              value={formData.password}
            />
          </Col>
        </Row>
        {method === "signup" && (
          <Row gutter={24}>
            <Col md={24}>
              <div
                className={`column-label ${
                  focusedField === "role" ? "active" : ""
                }`}
              >
                Role
              </div>
              <Select
                value={formData.role}
                onChange={handleRoleChange}
                style={{ width: "100%" }}
              >
                <Select.Option value="admin">admin</Select.Option>
                <Select.Option value="user">user</Select.Option>
              </Select>
              {errors.role && (
                <div style={{ color: "red", fontSize: 12 }}>
                  Please select a role.
                </div>
              )}
            </Col>
          </Row>
        )}
      </div>
    </Modal>
  );
};

export default confirmable(EditUserModal);

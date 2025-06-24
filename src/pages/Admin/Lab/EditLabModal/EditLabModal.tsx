import React, { useEffect, useState } from "react";
import { confirmable } from "react-confirm";
import CustomInput from "components/CustomInput/CustomInput";
import { Col, Modal, Row } from "antd";
import { apiPost } from "ajax/apiServices";
import Toast from "components/Toast/Toast";
import { UrlAdminAddOrEditLab } from "ajax/apiUrls";
import CustomTextArea from "components/CustomTextArea/CustomTextArea";

interface EditLabModalProps {
  show: boolean;
  method: string;
  data: any;
  onSuccess?: () => void;
}

const EditLabModal: React.FC<EditLabModalProps> = ({
  show,
  method,
  data,
  onSuccess,
}) => {
  const [isModalShow, setModalShow] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lab_id: "",
  });

  interface FormErrors {
    title?: boolean;
    description?: boolean;
  }

  const [errors, setErrors] = useState<FormErrors>({
    title: false,
    description: false,
  });

  // const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setModalShow(show);
    if (show) {
      // When modal opens, initialize based on method
      if (method === "edit" && data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          lab_id: data.id || "",
        });
      } else {
        setFormData({
          title: "",
          description: "",
          lab_id: "",
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

  const validateForm = () => {
    let newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = true;

    if (!formData.description) newErrors.description = true;

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

    apiPost(UrlAdminAddOrEditLab, formPayload)
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
          title: "",
          description: "",
          lab_id: "",
        });
        setErrors({
          title: false,
          description: false,
        });

        setModalShow(false);
      }}
    >
      <h2 style={{ textAlign: "center", marginTop: "-10px" }}>
        {method === "edit" ? "Edit Lab" : "Add Lab"}
      </h2>
      <div>
        <Row gutter={24}>
          <Col md={24}>
            <div
              className={`column-label ${
                focusedField === "name" ? "active" : ""
              }`}
            >
              Title
            </div>
            <CustomInput
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              formData={formData["title"]}
              handleChange={handleChange}
              errors={errors}
              name={"title"}
              placeholder={""}
              value={formData.title}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={24}>
            <div
              className={`column-label ${
                focusedField === "description" ? "active" : ""
              }`}
            >
              description
            </div>
            <CustomTextArea
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              formData={formData["description"]}
              handleChange={handleChange}
              errors={errors}
              name={"description"}
              placeholder={""}
              value={formData.description}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default confirmable(EditLabModal);

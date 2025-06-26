import React, { useEffect, useState } from "react";
import { confirmable } from "react-confirm";
import CustomInput from "components/CustomInput/CustomInput";
import { Checkbox, Col, Modal, Row } from "antd";
import { apiPost, apiGet } from "ajax/apiServices";
import Toast from "components/Toast/Toast";
import { UrlAdminAddOrEditMessage, UrlAdminUsers } from "ajax/apiUrls";
//import CustomTextArea from "components/CustomTextArea/CustomTextArea";
import { BoldOutlined, UnderlineOutlined } from '@ant-design/icons';
import ReactSimpleWYSIWYG from "react-simple-wysiwyg";


interface EditMessageModalProps {
  show: boolean;
  method: string;
  data: any;
  onSuccess?: () => void;
  currentUserId: string;  // Assuming you need currentUserId for some reason
}

const EditMessageModal: React.FC<EditMessageModalProps> = ({
  show,
  method,
  data,
  onSuccess,
  currentUserId, // Assuming you need currentUserId for some reason
}) => {
  const [isModalShow, setModalShow] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    message_id: "",
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
  const [userList, setUserList] = useState<any[]>([]);
  // const currentUserId = data?.user_id || ""; // Assuming data contains user_id
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    setModalShow(show);
    
    if (show) {
      apiGet(UrlAdminUsers)
        .then((res: any) => {
          // console.log("Current User ID:", currentUserId);
          // if (res.status === "success") {
          // setUserList(Array.isArray(res) ? res.filter((user: any) => user.id !== currentUserId) : []);        
          setUserList(Array.isArray(res) ? [] : []);        

          // console.log("Filtered User List:", userList);
          // }
        }
      );
      // When modal opens, initialize based on method
      if (method === "edit" && data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          message_id: data.id || "",
        });
        setSelectedUsers(data.user_ids || []); // Assuming data.users is an array of user IDs
      } else {
        setFormData({
          title: "",
          description: "",
          message_id: "",
        });
        setSelectedUsers([]); // Reset selected users when adding a new message
      }
    }
  }, [show]);

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
    formPayload.append("user_ids", JSON.stringify(selectedUsers)); // Add selected users to the payload
    // console.log("Form Payload:", formPayload);
    apiPost(UrlAdminAddOrEditMessage, formPayload)
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

  const handleFormat = (format: 'bold' | 'underline') => {
    // Implement the formatting logic here
    document.execCommand(format, false, "");
    // console.log(`Apply ${format} formatting`);
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
          message_id: "",
        });
        setErrors({
          title: false,
          description: false,
        });

        setModalShow(false);
      }}
    >
      <h2 style={{ textAlign: "center", marginTop: "-10px" }}>
        {method === "edit" ? "Edit Message" : "Add Message"}
      </h2>
      <div>
        <Row gutter={24}>
          <Col md={18} style={{ paddingRight: 24 }}>
            <div style={{ marginBottom: 5 }}>
              <div className={`column-label ${focusedField === "name" ? "active" : ""}`}>Title</div>
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
            </div>
            <div style={{ marginBottom: 0 }}>
              <div className={`column-label ${focusedField === "description" ? "active" : ""}`}>Description</div>
              <ReactSimpleWYSIWYG
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                style={{ minHeight: 120, maxHeight:120, marginBottom: 0 }}
              />
            </div>
          </Col>
          <Col md={6} style={{ display: "flex", flexDirection: "column", background: "#f7f7f7", borderRadius: 8, padding: 12 }}>
            {/* <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 16 }}>User List</div> */}
            <div style={{ marginBottom: 3 }}>
              <Checkbox
                indeterminate={userList.length > 0 && selectedUsers.length > 0 && selectedUsers.length < userList.length}
                checked={
                  userList.length === 0 // If no users, checkbox is checked
                    ? true
                    : selectedUsers.length === userList.length
                }
                onChange={(e) => {
                  setSelectedUsers(e.target.checked ? userList.map(user => user.id) : []);
                }}
              >
                All users
              </Checkbox>
            </div>
            <div style={{ flex: 1,minHeight:'120px', maxHeight: '180px', border: '1px solid #ccf', borderRadius: 4, background: '#fff', padding: '8px' }}>
              {userList.map((user) => (
                <div key={user.id} style={{ marginBottom: "8px" }}>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                  >
                    {user.username}
                  </Checkbox>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default confirmable(EditMessageModal);

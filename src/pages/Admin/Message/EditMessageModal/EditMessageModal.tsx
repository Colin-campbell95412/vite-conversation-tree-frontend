import React, { useEffect, useState } from "react";
import { confirmable } from "react-confirm";
import CustomInput from "components/CustomInput/CustomInput";
import { Checkbox, Col, Modal, Row } from "antd";
import { apiPost, apiGet } from "ajax/apiServices";
import Toast from "components/Toast/Toast";
import { UrlAdminAddOrEditMessage, UrlAdminUsers } from "ajax/apiUrls";
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
    to: "All", // Add 'to' field
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
  const [isAllUsers, setIsAllUsers] = useState(true); // Track checkbox state

  useEffect(() => {
    setModalShow(show);
    
    if (show) {
      apiGet(UrlAdminUsers)
        .then((res: any) => {
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
          to: data.to || "All", // Set 'to' from data
        });
        setIsAllUsers((data.to || "All") === "All");
        setSelectedUsers(data.user_ids || []); // Assuming data.users is an array of user IDs
      } else {
        setFormData({
          title: "",
          description: "",
          message_id: "",
          to: "All",
        });
        setIsAllUsers(true);
        setSelectedUsers([]); // Reset selected users when adding a new message
      }
    }
  }, [show]);

  const handleToInputChange = (e: any) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, to: value }));
    setIsAllUsers(false);
  };

  const handleAllUsersCheckbox = (e: any) => {
    const checked = e.target.checked;
    setIsAllUsers(checked);
    if (checked) {
      setFormData(prev => ({ ...prev, to: "All" }));
    } else {
      setFormData(prev => ({ ...prev, to: "" }));
    }
  };

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
          to: "All",
        });
        setIsAllUsers(true);
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
              <div className={`column-label ${focusedField === "to" ? "active" : ""}`}>To</div>
              {isAllUsers ? (
                <input
                  type="text"
                  className="custom-input"
                  placeholder=""
                  name="to"
                  value=""
                  disabled
                  onFocus={() => setFocusedField("to")}
                  onBlur={() => setFocusedField(null)}
                />
              ) : (
                <CustomInput
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                  formData={formData["to"]}
                  handleChange={handleToInputChange}
                  errors={errors}
                  name={"to"}
                  placeholder={""}
                  value={formData.to}
                />
              )}
            </div>
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
          <Col md={6} style={{ display: "flex", flexDirection: "column", background: "#fff", borderRadius: 8, padding: 12 }}>
            <div style={{ marginBottom: 3 }}>
              <Checkbox
                checked={isAllUsers}
                onChange={handleAllUsersCheckbox}
              >
                All users
              </Checkbox>
            </div>
            {/* , border: '1px solid #ccf' */}
            {/* <div style={{ flex: 1,minHeight:'120px', maxHeight: '180px', borderRadius: 4, background: '#fff', padding: '8px' }}> */}
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
            {/* </div> */}
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default confirmable(EditMessageModal);
// export default confirmable(EditMessageModal);

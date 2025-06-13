import { toast } from "react-toastify";
import "./Toast.css";

const Toast = (toast_msg: string, type: string) => {
    if (type === "success") {
        toast.success(toast_msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            className: 'success',
        });
    }
    if (type === "error") {
        toast.error(toast_msg, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            className: 'failed',
        });
    }
};

export default Toast;
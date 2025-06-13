import { notification } from "antd";

export const SYSTEM_ERROR = "System error. Please try again later!";
export const errorMessage = "Something went wrong.";

export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
export const isEmpty = (list: any, field: any, errorList: any, index = undefined) => {
    if (
        list[field] === undefined ||
        list[field] === "" ||
        list[field] === " " ||
        list[field] == null
    ) {
        let res = [...errorList];
        if (!errorList.includes(field)) {
            res =
                index == undefined
                    ? [...errorList, field]
                    : [...errorList, index + field];
        }
        return res;
    }
    return errorList;
};
export function isNumber(n: any) {
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}
export const onlyUnique = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index;
};

export const ValidateEmail = (email: any) => {
    var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!pattern.test(email)) {
        return false;
    } else {
        return true;
    }
};

export const ValidPhone = (str: any) => {
    var isphone =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(str);
    return isphone;
};
export const numberWithCommas = (x: any) => {
    // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (x == undefined || x == null || x == 0 || x == "0.00") {
        return "0.00";
    } else {
        return Number(parseFloat(x).toFixed(2)).toLocaleString("en", {
            minimumFractionDigits: 2,
        });
    }
};
export const openDangerNotification = (props: any) => {
    notification.config({
        placement: 'topRight', // Set the position to bottom left
        duration: 2,
    });

    let msg = '';
    let notificationType = '';

    if (props === 1) {
        msg = "Registration successful!";
        notificationType = 'success'; // Set to success for successful registration
    } else if (props === 2) {
        msg = "Registration failed, please try again.";
        notificationType = 'error'; // Set to error for failed registration
    } else {
        msg = "An error occurred during registration.";
        notificationType = 'error'; // General error message
    }

    if (notificationType === 'success') {
        notification.success({
            message: 'Success Notification',
            description: msg,
        });
    } else {
        notification.error({
            message: 'Error Notification',
            description: msg,
        });
    }
};

export const formatToDDMMYYYY = (dateString: any) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
};

export const isOver18 = (dateString: any) => {
    // Parse the dateString manually (assuming the format is DD-MM-YYYY)
    const [day, month, year] = dateString.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day); // Months are zero-indexed in JS Dates
    const currentDate = new Date();


    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const month1 = currentDate.getMonth() - birthDate.getMonth();
    if (month1 < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 18;
};

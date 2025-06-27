import axios from "axios";
import { SYSTEM_ERROR } from "constants/global";
import Toast from "components/Toast/Toast";

export const axiosGet = (url: string, _params?: FormData) => {
    let token = localStorage.getItem('token');
    if (!token) {
        return Promise.reject("Token not found");
    }
    // console.log("axiosGet url", url);
    // console.log("axiosGet token", token);
    return new Promise((resolve, reject) => {
        try {
            axios
                .get(url,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                    })
                .then((res) => {
                    const { data } = res;
                    if (data.status === "success") {
                        resolve(data.data);
                    } else if (data.status == "token_failed") {
                        Toast(data.message, "error");
                        localStorage.removeItem('token');
                        setTimeout(() => {
                            if (window.location.pathname.includes("/admin")) {
                                window.location.href = "/admin/login"
                            } else {
                                window.location.href = "/signin"
                            }
                        }, 1500)
                    } else {
                        reject(data.message);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            reject(SYSTEM_ERROR);
        }
    });
};

export const axiosPost = (url: string, param: any) => {
    let token = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
        try {
            axios
                .post(url, param, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then((res) => {
                    const { data } = res;
                    if (data.status === "success") {
                        resolve(data);
                    } else {
                        if (data.status == "token_failed") {
                            localStorage.removeItem('token');
                            setTimeout(() => {
                                if (window.location.pathname.includes("/admin")) {
                                    window.location.href = "/admin/login"
                                } else {
                                    window.location.href = "/signin"
                                }
                            }, 1500)
                        } else {
                            reject(data.message);
                        }
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            reject(SYSTEM_ERROR);
        }
    });
};

export const axiosPut = (url: string, param: any) => {
    let token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
        try {
            axios
                .put(url, param, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then((res) => {
                    const { data } = res;
                    if (data.status === "success") {
                        resolve(data.data);
                    } else if (data.status == "token_failed") {
                        Toast(data.message, "error");
                        localStorage.removeItem('token');
                        setTimeout(() => {
                            if (window.location.pathname.includes("/admin")) {
                                window.location.href = "/admin/login"
                            } else {
                                window.location.href = "/signin"
                            }
                        }, 1500)
                    } else {
                        reject(data.message);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            reject(SYSTEM_ERROR);
        }
    });
};
export const axiosDelete = (url: string, param: any) => {
    let token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
        try {
            axios
                .delete(url, {
                    data: param,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((res) => {
                    const { data } = res;
                    if (data.status === "success") {
                        resolve(data);
                    } else if (data.status == "token_failed") {
                        Toast(data.message, "error");
                        localStorage.removeItem('token');
                        setTimeout(() => {
                            if (window.location.pathname.includes("/admin")) {
                                window.location.href = "/admin/login"
                            } else {
                                window.location.href = "/signin"
                            }
                        }, 1500)
                    } else {
                        reject(data.message);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        } catch (error) {
            reject(SYSTEM_ERROR);
        }
    });
};

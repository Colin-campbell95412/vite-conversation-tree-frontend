import { axiosDelete, axiosGet, axiosPost, axiosPut } from "./ajaxServices";

export const apiGet = (url: string, params?: FormData) => {
    return new Promise((resolve, reject) => {
        axiosGet(url, params)
            .then((res: any) => {
                resolve(res);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};
export const apiPost = (url: string, params: FormData) => {
    return new Promise((resolve, reject) => {
        axiosPost(url, params)
            .then((res: any) => {
                resolve(res);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};

export const apiPut = (url: string, params: FormData) => {
    return new Promise((resolve, reject) => {
        axiosPut(url, params)
            .then((res: any) => {
                resolve(res);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};

export const apiDelete = (url: string, params?: FormData) => {
    return new Promise((resolve, reject) => {
        axiosDelete(url, params)
            .then((res: any) => {
                resolve(res);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};
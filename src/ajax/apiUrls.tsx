export const BASE_URL = "http://localhost:8000/";   // For local development
//export const BASE_URL = "http://3.107.85.17:8000/"; // Replace with your production URL

//Admin Api No Token
export const UrlAdminLogin = BASE_URL + "api/admin/signin";
export const UrlAdminSignup = BASE_URL + "api/admin/signup";
export const UrlAdminUsers = BASE_URL + "api/admin/users";
export const UrlAdminBulkDeleteUsers = BASE_URL + "api/admin/bulk-delete-users";
export const UrlAdminDeleteUser = BASE_URL + "api/admin/delete-user";

export const UrlAdminAddOrEditDoc = BASE_URL + "api/admin/add-or-edit-doc";
export const UrlAdminDocs = BASE_URL + "api/admin/docs";
export const UrlAdminBulkDeleteDocs = BASE_URL + "api/admin/bulk-delete-docs";
export const UrlAdminDeleteDoc = BASE_URL + "api/admin/delete-doc";

export const UrlAdminAddOrEditLab = BASE_URL + "api/admin/add-or-edit-lab";
export const UrlAdminLabs = BASE_URL + "api/admin/labs";
export const UrlAdminBulkDeleteLabs = BASE_URL + "api/admin/bulk-delete-labs";
export const UrlAdminDeleteLab = BASE_URL + "api/admin/delete-lab";

export const UrlAdminAddOrEditMessage = BASE_URL + "api/admin/add-or-edit-message";
export const UrlAdminMessages = BASE_URL + "api/admin/messages";
export const UrlAdminBulkDeleteMessages = BASE_URL + "api/admin/bulk-delete-messages";
export const UrlAdminDeleteMessage = BASE_URL + "api/admin/delete-message";

export const UrlAdminConversations = BASE_URL + "api/conversations";
export const UrlAdminEditConversation = BASE_URL + "api/conversations/add";
export const UrlAdminDeleteConversation = BASE_URL + "api/conversations/delete";
export const UrlAdminBulkDeleteConversations = BASE_URL + "api/conversations/bulk-delete";


export const UrlAdminUpdateProfile = BASE_URL + "api/admin/update-profile";
export const getLoginServiceUrl = () => {
    return import.meta.env.VITE_LOGIN_SERVICE_URL;
}

export const getRedirectUriFromLogin = () => {
    return import.meta.env.VITE_REDIRECT_URI;
}

export const getApiUrl = () => {
    return import.meta.env.VITE_API_URL;
}
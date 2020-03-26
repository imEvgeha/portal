import jwtDecode from 'jwt-decode';

export const getTokenDuration = token => {
    const duration = (token.exp * 1000) - new Date().getTime();
    return duration;
};

export const isTokenExpired = token => {
    if (token.exp < (new Date().getTime() / 1000)) {
        return true;
    }
    return false;
};

export const isTokenValid = token => {
    if (!token || isTokenExpired(token)) {
        return false;
    }
    return true;
};

export const getValidToken = token => {
    const decodedToken = token && jwtDecode(token);
    if (isTokenValid(decodedToken)) {
        return token;
    }
};

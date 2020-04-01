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

export const isTokenValid = (token, url) => {
    if (!token || isTokenExpired(token) || (url && token.iss && !token.iss.includes(url))) {
        return false;
    }
    return true;
};

export const getValidToken = (token, url) => {
    const decodedToken = token && jwtDecode(token);
    if (isTokenValid(decodedToken, url)) {
        return token;
    }
};

export async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

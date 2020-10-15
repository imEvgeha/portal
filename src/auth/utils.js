import jwtDecode from 'jwt-decode';

export const getTokenDuration = token => {
    return token.exp * 1000 - new Date().getTime();
};

export const isTokenExpired = token => {
    return token.exp < new Date().getTime() / 1000;
};

export const isTokenValid = (token, url) => {
    return !(!token || isTokenExpired(token) || (url && token.iss && !token.iss.includes(url)));
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

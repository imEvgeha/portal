const initialState = {};

const userReducer = (state = initialState, action) => {
    const {type, payload} = action;

    switch(type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                ...payload.user,
            };
        case 'LOGOUT':
            return {};
        default: 
            return state;
    };
};

export default userReducer;

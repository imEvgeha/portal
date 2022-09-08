const errorReducer = (state = {}, action) => {
    const {type, payload = {}} = action;
    const matches = /(.*)_(REQUEST|ERROR)/.exec(type);

    // not a *_REQUEST / *_FAILURE actions, so we ignore them
    if (!matches) {
        return state;
    }

    const [, requestName, requestState] = matches;
    const {message = 'ERROR'} = payload;

    return {
        ...state,
        [requestName]: requestState === 'ERROR' ? message || 'ERROR' : '',
    };
};

export default errorReducer;

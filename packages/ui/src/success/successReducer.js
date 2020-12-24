const successReducer = (state = {}, action) => {
    const {type, payload} = action;
    const matches = /(.*)_(REQUEST|SUCCESS)/.exec(type);

    // not a *_REQUEST / *_FAILURE actions, so we ignore them
    if (!matches) {
        return state;
    }

    const [, requestName, requestState] = matches;
    return {
        ...state,
        [requestName]: requestState === 'SUCCESS' ? payload || 'SUCCESS' : '',
    };
};

export default successReducer;

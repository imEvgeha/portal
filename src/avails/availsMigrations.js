export default {
    // example
    0: state => {
        return {
            ...state,
            rights: {
                ...state.rights,
                list: {},
                total: 0,
            }
        };
    },
};

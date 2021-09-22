export const createInitialValues = fields => {
    let initialValues;
    fields.forEach(({name}) => (initialValues = {...initialValues, [name]: null}));

    return initialValues;
};

const convertBooleanToString = e => {
    if (e === true) {
        return 'Yes';
    } else if (e === false) {
        return 'No';
    } else {
        return '';
    }
};

export {
    convertBooleanToString
};
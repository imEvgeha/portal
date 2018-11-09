import moment from 'moment';

function validateDate(date) {

    return date && (''+date).length === 10 && moment(date).isValid();
}

export {validateDate};
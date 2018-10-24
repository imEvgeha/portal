function validateDate(date) {
    const parsed = new Date(date);
    return (parsed instanceof Date && !isNaN(parsed.getTime())) ? parsed : false;
}

export {validateDate};
export function minLength8(value) {
    if (value && value.length <= 8) {
        return 'INCORRECT_LENGTH';
    }
    return undefined;
}

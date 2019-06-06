export const formatTypeFirstLetter = type => {
    let t = type;
    if (type) {
        t = t[0].toUpperCase() + t.slice(1);
    }
    return t;
};
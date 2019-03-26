import moment from 'moment';

const formatISO = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';

function downloadFile(data) {
    //header containing filename sugestion is not accesible by javascript by default, aditional changes on server required
    //for now we recreate the filename using the same syntax as server
    const currentTime = new Date();
    let filename = 'avails_';
    filename += currentTime.getFullYear() + '_' + (currentTime.getMonth() + 1) + '_' + currentTime.getDate() + '_';
    filename += currentTime.getHours() + '_' + currentTime.getMinutes() + '_' + currentTime.getSeconds();
    filename += '.xlsx';

    const url = window.URL.createObjectURL(new Blob([data], {type: 'application/octet-stream'}));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.click();
    window.URL.revokeObjectURL(url);
}

function safeTrim(value){
    if(value === undefined || value === null) return value;
    if(typeof value === 'string'){
        return value.trim();
    }else{
        return value;
    }
}

function momentToISO(date) {
    return moment(date).format(formatISO);
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function prepareSortMatrixParam(sortedParams) {
    let matrix = '';
    if(sortedParams){
        sortedParams.forEach((entry) => {
            matrix += ';' + entry.id + '=' + (entry.desc ? 'DESC' : 'ASC');
        });
    }
    return matrix;
}
function prepareSortMatrixParamTitles(sortedParams) {
    let matrix = '';
        if(sortedParams){
            sortedParams.forEach((entry) => {
                matrix += '?sort=' + entry.id + ',' + (entry.desc ? 'DESC' : 'ASC');
            });
        }
    return matrix;
}
function mergeDeep(target, source) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

export {downloadFile, momentToISO, isObject, mergeDeep, prepareSortMatrixParam, safeTrim, prepareSortMatrixParamTitles};
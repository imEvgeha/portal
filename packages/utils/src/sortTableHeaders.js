import {cloneDeep} from 'lodash';

const sortTableHeaders = (columnDefinitions, headerNames) => {
    const reorderedHeaders = cloneDeep(columnDefinitions);
    headerNames.forEach((name, idx) => {
        if (idx === 0) return;
        const index = reorderedHeaders.findIndex(element => element.headerName === name);
        const temp = reorderedHeaders[index];
        reorderedHeaders[index] = reorderedHeaders[idx];
        reorderedHeaders[idx] = temp;
    });
    return reorderedHeaders;
};

export default sortTableHeaders;

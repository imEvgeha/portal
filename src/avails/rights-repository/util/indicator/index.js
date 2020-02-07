
export const INDICATOR_RED = 'INDICATOR_RED';
export const INDICATOR_SUCCESS = 'INDICATOR_SUCCESS';

export const calculateIndicatorType = (data) => {
    const {coreTitleId} = data;
    return coreTitleId !== null ? INDICATOR_SUCCESS : INDICATOR_RED;
};

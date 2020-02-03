
export const INDICATOR_RED = 'INDICATOR_RED';
export const INDICATOR_NON = 'INDICATOR_NON';

export const calculateIndicatorType = (data) => {
    const {coreTitleId} = data || {};
    return coreTitleId !== null ? INDICATOR_NON : INDICATOR_RED;
};

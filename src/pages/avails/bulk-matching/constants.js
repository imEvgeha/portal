export const TITLE_MATCHING_MSG = 'Select titles from the repositories that match the incoming right or declare a ';
export const TITLE_MATCHING_REVIEW_HEADER = 'Title Matching Review';
export const RIGHT_TABS = {
    SELECTED: 'Selected Rights',
    AFFECTED: 'Affected Rights',
    BONUS_RIGHTS: 'Existing Bonus Rights',
};
export const EXISTING_CORE_TITLE_ID_WARNING = 'Warning: Existing coreTitleIds of Affected Rights will be overridden.';
export const BONUS_RIGHTS_REVIEW_HEADER = 'Bonus Rights Review';
export const TITLE_BULK_MATCH_SUCCESS_MESSAGE = num => `You have successfully matched ${num} rights`;
export const TITLE_BONUS_RIGHTS_SUCCESS_MESSAGE = (count, existing) => `
${count ? `You have successfully created ${count} bonus rights.` : 'No bonus rights were created.'} 
${existing ? `${existing} bonus rights already exists.` : ''}
`;
export const EXISTING_BONUS_RIGHTS_PAGE_SIZE = 200;

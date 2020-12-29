export const TAGS = [
    {label: 'SELECTED', field: 'rightSelected'},
    {label: 'TPR RIGHT', field: 'temporaryPriceReduction'},
    {label: 'BONUS RIGHT', field: 'bonusRight'},
    {label: 'REMOVED FROM CATALOGUE', field: 'updatedCatalogReceived'},
];

export const HIGHLIGHTED_FIELDS = [
    {field: 'id', title: 'Right ID'},
    {field: 'coreTitleId', title: 'Core Title ID'},
    {field: 'title', title: 'Title'},
    {field: 'status', title: 'Status'},
    {field: 'rightStatus', title: 'Right Status'},
];

export const SHRINKED_FIELDS = [
    {field: 'id', title: 'Right ID'},
    {field: 'title', title: 'Title'},
];

export const THROTTLE_TRAILING_MS = 500;

export const NoteError = {
    note: "License Rights Description and/or Platform Category are missing for Licensee Service Region 'US'",
    noteStyle: 'error',
};

export const NotePending = {
    note: 'Click here for Right Matching',
    noteStyle: 'info',
};

export const NoteMerged = {
    note: "Right Editing disabled for rights with status 'Merged'",
    noteStyle: 'info',
};

export const STATUS = ['Error', 'Merged', 'Pending'];

export const OBJECT_FIELDS = ['cmContentIds', 'eidr', 'episodic', 'retailer'];

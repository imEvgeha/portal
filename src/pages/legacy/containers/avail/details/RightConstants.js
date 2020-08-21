const TERRITORY_TYPE = 'territory';

export default {
    TERRITORY_TYPE,
};

export const NoteError = {
    note: "LicenseRightsDescription and/or PlatformCategory are missing for Licensee Service Region 'US'",
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

export const PLATFORM_INFORM_MSG = 'Required for US Licensee';

export const CUSTOM_ERROR_HANDLING_FIELDS = ['territory', 'pricing', 'languageAudioTypes'];

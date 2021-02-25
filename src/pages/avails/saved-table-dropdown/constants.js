export const MY_SAVED_VIEWS_LABEL = 'My Saved Views';
export const MY_PREDEFINED_VIEWS_LABEL = 'Predefined Views';
export const SAVED_TABLE_DROPDOWN_LABEL = 'Saved Table Views:';

export const SAVED_TABLE_SELECT_OPTIONS = [
    {label: 'All', value: 'all'},
    {label: 'In Error', value: 'in-error'},
    {label: 'Ready/Pending', value: 'ready-or-pending'},
];
export const GROUPED_OPTIONS = [
    {
        label: MY_PREDEFINED_VIEWS_LABEL,
        options: SAVED_TABLE_SELECT_OPTIONS,
    },
    {
        label: MY_SAVED_VIEWS_LABEL,
        options: [],
    },
];

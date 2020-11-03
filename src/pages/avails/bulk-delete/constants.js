export const HEADER = {
    cells: [
        {
            key: 1,
            content: 'Linked Rights',
            width: 30,
            shouldTruncate: true,
        },
        {
            key: 2,
            content: 'Right ID',
            width: 15,
        },
        {
            key: 3,
            content: 'Type',
            width: 10,
        },
        {
            key: 4,
            content: 'Original Right',
            width: 25,
        },
        {
            key: 5,
            content: 'Source Right',
            width: 20,
        },
    ],
};

export const BULK_DELETE_WARNING_MSG = num => `Permanently delete ${num} Rights?`;
export const BULK_DELETE_LINKED_RIGHT_MSG = 'The following linked TPR/Bonus rights will also be marked as deleted:';
export const BULK_DELETE_CONTINUE_MSG = 'How would you like to continue?';
export const BULK_DELETE_BTN_DELETE = 'Mark as Deleted';
export const BULK_DELETE_BTN_CANCEL = 'Cancel';

import React from 'react';
import Tag from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

const partnerRequestColumnDefs = [
    {
        field: 'productDesc',
        colId: 'productDesc',
        headerName: 'Title',
        minWidth: 80,
        maxWidth: 150,
    },
    {
        field: 'version',
        colId: 'version',
        headerName: 'Version',
    },
    {
        field: 'srdueDate',
        colId: 'srdueDate',
        headerName: 'Due Date',
    },
    {
        field: 'materialNotes',
        colId: 'materialNotes',
        headerName: 'Notes',
        minWidth: 80,
        maxWidth: 500,
    },
    {
        field: 'primaryVideo',
        colId: 'primaryVideo',
        headerName: 'Primary Video',
        suppressSizeToFit: true,
    },
    {
        field: 'secondaryAudio',
        colId: 'secondaryAudio',
        headerName: 'Secondary Audio',
        suppressSizeToFit: true,
    },
    {
        field: 'subtitlesFull',
        colId: 'subtitlesFull',
        headerName: 'Subtitles Full',
        suppressSizeToFit: true,
    },
    {
        field: 'subtitlesForced',
        colId: 'subtitlesForced',
        headerName: 'Subtitles Forced',
        suppressSizeToFit: true,
    },
    {
        field: 'trailer',
        colId: 'trailer',
        headerName: 'Trailer',
        suppressSizeToFit: true,
    },
    {
        field: 'metaData',
        colId: 'metaData',
        headerName: 'Metadata',
        suppressSizeToFit: true,
    },
    {
        field: 'artWork',
        colId: 'artWork',
        headerName: 'Artwork',
        suppressSizeToFit: true,
    },
];
export const defaultColDef = {autoHeight: true, cellClass: 'cell', resizable: true};
export const columnDefs = partnerRequestColumnDefs.map(def => ({
    ...def,
    cellRendererFramework: data => {
        // render pill tags if the column is a list of languages
        if (isLanguageColumn(data.colDef.field)) {
            return renderLanguagesToTagGroup(data.value);
        }

        // otherwise just return the value
        return data.value;
    },
}));

/**
 * Checks if a given key is for a column that contains languages
 * @param {string} key the key to check
 */
const isLanguageColumn = key => {
    return [
        'secondaryAudio',
        'subtitlesFull',
        'subtitlesForced',
        'trailer',
        'metaData',
        'artWork',
    ].includes(key);
};

/**
 * Returns a sorted array of languages given a comma-delimited list of languages
 * @param {string} languages a comma-delimited list of languages
 */
const splitTrimSortLanguages = languages => {
    if (!languages) {
        return;
    }

    return languages
        .split(',')
        .map(language => language.trim())
        .sort();
};

/**
 * Renders an array of languages into a TagGroup
 * @param {string[]} languages an array of languages
 */
const renderLanguagesToTagGroup = languages => {
    return (
        !!languages && (
            <TagGroup>
                {splitTrimSortLanguages(languages).map(language => (
                    <Tag key={language} text={language} />
                ))}
            </TagGroup>
        )
    );
};

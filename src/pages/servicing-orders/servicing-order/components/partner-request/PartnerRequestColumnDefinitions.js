import React from 'react';
import Tag from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

const partnerRequestColumnDefs = [
    {
        field: 'productDesc',
        colId: 'productDesc',
        headerName: 'Title',
        minWidth: 100,
        suppressMovable: true,
        maxWidth: 150,
    },
    {
        field: 'version',
        colId: 'version',
        headerName: 'Version',
        minWidth: 150,
        suppressMovable: true,
    },
    {
        field: 'srdueDate',
        colId: 'srdueDate',
        headerName: 'Due Date',
        minWidth: 150,
        suppressMovable: true,
    },
    {
        field: 'materialNotes',
        colId: 'materialNotes',
        headerName: 'Notes',
        minWidth: 80,
        suppressMovable: true,
        maxWidth: 500,
    },
    {
        field: 'primaryVideo',
        colId: 'primaryVideo',
        headerName: 'Primary Video',
        suppressSizeToFit: true,
        minWidth: 100,
        suppressMovable: true,
    },
    {
        field: 'secondaryAudio',
        colId: 'secondaryAudio',
        headerName: 'Secondary Audio',
        suppressSizeToFit: true,
        minWidth: 150,
        suppressMovable: true,
    },
    {
        field: 'subtitlesFull',
        colId: 'subtitlesFull',
        headerName: 'Subtitles Full',
        suppressSizeToFit: true,
        minWidth: 150,
        suppressMovable: true,
    },
    {
        field: 'subtitlesForced',
        colId: 'subtitlesForced',
        headerName: 'Subtitles Forced',
        suppressSizeToFit: true,
        minWidth: 150,
        suppressMovable: true,
    },
    {
        field: 'trailer',
        colId: 'trailer',
        headerName: 'Trailer',
        suppressSizeToFit: true,
        minWidth: 150,
        suppressMovable: true,
    },
    {
        field: 'metaData',
        colId: 'metaData',
        headerName: 'Metadata',
        suppressSizeToFit: true,
        minWidth: 150,
        suppressMovable: true,
    },
    {
        field: 'artWork',
        colId: 'artWork',
        headerName: 'Artwork',
        suppressSizeToFit: true,
        minWidth: 150,
        suppressMovable: true,
    },
];

export const defaultColDef = {autoHeight: true, cellClass: 'cell', resizable: true};

export const columnDefs = partnerRequestColumnDefs.map(def => ({
    ...def,
    cellRendererFramework: data => {
        // render pill tags if the column is a list of languages
        // otherwise just return the value
        return <div className="nexus-c-partner-request__cell">{isLanguageColumn(data.colDef.field) ? renderLanguagesToTagGroup(data.value) : data.value}</div>;
    },
}));

/**
 * Checks if a given key is for a column that contains languages
 * @param {string} key the key to check
 */
const isLanguageColumn = key => {
    return ['secondaryAudio', 'subtitlesFull', 'subtitlesForced', 'trailer', 'metaData', 'artWork'].includes(key);
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

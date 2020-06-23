const columnDefinitions = [
    {
        'field': 'system',
        'headerName': 'System',
        'colId': 'displayName',
        'cellRenderer': 'loadingCellRenderer',
        'width': 150,
        'height': 50,
    },
    {
        'field': 'title',
        'headerName': 'Title',
        'colId': 'title',
        'cellRenderer': 'loadingCellRenderer',
        'width': 150
    },
    {
        'field': 'releaseYear',
        'headerName': 'Release Year',
        'colId': 'releaseYear',
        'cellRenderer': 'loadingCellRenderer',
        'valueFormatter': null,
        'width': 150
    },
    {
        'field': 'contentType',
        'headerName': 'Content Type',
        'colId': 'contentType',
        'cellRenderer': 'loadingCellRenderer',
        'width': 150
    },
    {
        'field': 'episodic.seriesTitleName',
        'headerName': 'Series',
        'cellRenderer': 'loadingCellRenderer',
        'width': 150
    },
    {
        'field': 'episodic.seasonTitleName',
        'headerName': 'Season',
        'cellRenderer': 'loadingCellRenderer',
        'width': 150
    },
    {
        'field': 'castCrew.director',
        'headerName': 'Director',
        'colId': 'displayName',
        'cellRenderer': 'loadingCellRenderer',
        'width': 150
    },
    {
        'field': 'editorialGenres',
        'headerName': 'Genres',
        'colId': 'genres',
        'cellRenderer': 'loadingCellRenderer',
        'width': 150
    },
    {
        'field': 'ratings',
        'headerName': 'Rating',
        'colId': 'ratings',
        'cellRenderer': 'loadingCellRenderer',
        'width': 150
    },
    {
        'field': 'externalIds.eidrLevel1',
        'headerName': 'EIDR 1',
        'colId': 'displayName',
        'cellRenderer': 'loadingCellRenderer',
        'width': 150
    },
    {
        'field': 'externalIds.eidrLevel2',
        'headerName': 'EIDR 2',
        'colId': 'displayName',
        'cellRenderer': 'loadingCellRenderer',
        'width': 150
    },
    {
        'field': 'castCrew.cast',
        'headerName': 'Cast',
        'colId': 'displayName',
        'cellRenderer': 'loadingCellRenderer',
        'width': 150
    }
];

export default columnDefinitions;

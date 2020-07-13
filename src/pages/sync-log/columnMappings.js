export default [
  {
    'colId': 'status',
    'field': 'status',
    'headerName': 'Error/Success',
    'width': 120,
    'valueFormatter': ({data}) => (data && data.publishErrors.length) ? 'Error' : 'Success'
  },
  {
    'colId': 'updatedAt',
    'field': 'updatedAt',
    'javaVariableName': 'updatedAt',
    'dataType': 'timestamp',
    'headerName': 'UpdatedAt',
    'minWidth': 150
  },
  {
    'colId': 'titleName',
    'field': 'titleName',
    'headerName': 'Title Name',
    'minWidth': 150
  },
  {
    'colId': 'coreTitleId',
    'field': 'coreTitleId',
    'headerName': 'Title ID',
    'width': 150
  },
  {
    'colId': 'type',
    'field': 'type',
    'headerName': 'Document Type',
    'width': 150
  },
  {
    'colId': 'externalSystemId',
    'field': 'externalSystemId',
    'headerName': 'Legacy System',
    'width': 120
  },
  {
    'colId': 'publishedAt',
    'field': 'publishedAt',
    'javaVariableName': 'publishedAt',
    'dataType': 'timestamp',
    'headerName': 'Published At',
    'minWidth': 150
  },
  {
    'colId': 'publishErrors',
    'field': 'publishErrors',
    'headerName': 'Publish Errors',
    'minWidth': 150,
    'cellRenderer': 'publishErrors',
  }
];

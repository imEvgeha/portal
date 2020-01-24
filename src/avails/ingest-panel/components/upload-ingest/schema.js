export default (params) => ([
  {
    'id': 'internal',
    'name': 'internal',
    'type': 'checkbox',
    'label': 'Internal',
    'description': '',
    'placeholder': '',
    'defaultValue': ''
  },
  {
    'id': 'licensor',
    'name': 'licensor',
    'type': 'select',
    'label': 'Provider',
    'description': '',
    'placeholder': '',
    'defaultValue': '',
    'options': [
      {
        'heading': 'licensors',
        'items': [
          {
            'label': 'P1',
            'value': 'p1'
          },
          {
            'label': 'P2',
            'value': 'p2'
          }
        ]
      }
    ],
    'visible': true,
    'required': false,
    'disabled': false,
    'disabledWhen': [
      {
        'id': 'internal is checked',
        'field': 'internal',
        'is': [
          {
            'value': 'true'
          }
        ]
      }
    ]
  },
  {
    'id': 'serviceRegions',
    'name': 'serviceRegions',
    'type': 'select',
    'label': 'Service Regions',
    'description': '',
    'placeholder': '',
    'defaultValue': '',
    'options': [
      {
        'heading': 'regions',
        'items': [
          {
            'label': 'UK',
            'value': 'uk'
          },
          {
            'label': 'US',
            'value': 'us'
          }
        ]
      }
    ],
    'visible': true,
    'required': false,
    'disabled': false,
    'visibleWhen': [],
    'requiredWhen': [],
    'disabledWhenAll': [
      {
        'id': 'provider is not selected',
        'field': 'licensor',
        'is': [
          ''
        ]
      },
      {
        'id': 'internal is selected',
        'field': 'internal',
        'isNot': [
          'true'
        ]
      }
    ]
  }
]);
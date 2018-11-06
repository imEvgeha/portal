//import Http from '../../util/Http';
//import config from 'react-global-configuration';


const mockedResponeAvailsMapping = {
    'mappings': [
        {
            'sheetColumnName': 'Studio',
            'displayName': 'Studio',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'studio'
        },
        {
            'sheetColumnName': 'Title',
            'displayName': 'Title',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'title'
        },
        {
            'sheetColumnName': 'Release Year',
            'displayName': 'Release Year',
            'dataType': 'year',
            'fullTextSearch': 'no',
            'javaVariableName': 'releaseYear'
        },
        {
            'sheetColumnName': 'Type',
            'displayName': 'Type',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'type'
        },
        {
            'sheetColumnName': 'Release Type',
            'displayName': 'Release Type',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'releaseType'
        },
        {
            'sheetColumnName': 'Licensor',
            'displayName': 'Licensor',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'licensor'
        },
        {
            'sheetColumnName': 'Territory',
            'displayName': 'Territory',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'territory'
        },
        {
            'sheetColumnName': 'Rating',
            'displayName': 'Rating',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'rating'
        },
        {
            'sheetColumnName': 'Genre(s)',
            'displayName': 'Genre(s)',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'genres'
        },
        {
            'sheetColumnName': 'SD',
            'displayName': 'SD',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'sd'
        },
        {
            'sheetColumnName': 'HD',
            'displayName': 'HD',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'hd'
        },
        {
            'sheetColumnName': '3D',
            'displayName': '3D',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'f3d'
        },
        {
            'sheetColumnName': '4K/UHD',
            'displayName': '4K/UHD',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'f4k'
        },
        {
            'sheetColumnName': 'DBO',
            'displayName': 'DBO',
            'dataType': 'money',
            'fullTextSearch': 'no',
            'javaVariableName': 'dbo'
        },
        {
            'sheetColumnName': 'Theatrical Release',
            'displayName': 'Theatrical Release',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'theatricalRelease'
        },
        {
            'sheetColumnName': 'PO Start',
            'displayName': 'PO Start',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'poStart'
        },
        {
            'sheetColumnName': 'Hotel Start',
            'displayName': 'Hotel Start',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'hotelStart'
        },
        {
            'sheetColumnName': 'Hotel End',
            'displayName': 'Hotel End',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'hotelEnd'
        },
        {
            'sheetColumnName': 'EST Start',
            'displayName': 'EST Start',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'estStart'
        },
        {
            'sheetColumnName': 'EST End',
            'displayName': 'EST End',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'estEnd'
        },
        {
            'sheetColumnName': 'VOD Start',
            'displayName': 'VOD Start',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'vodStart'
        },
        {
            'sheetColumnName': 'VOD End',
            'displayName': 'VOD End',
            'dataType': 'date',
            'fullTextSearch': 'no',
            'javaVariableName': 'vodEnd'
        },
        {
            'sheetColumnName': 'HV/Physical',
            'displayName': 'HV/Physical',
            'dataType': 'text',
            'fullTextSearch': 'yes',
            'javaVariableName': 'hvPhysical'
        },
        {
            'sheetColumnName': 'Foreign Language?',
            'displayName': 'Foreign Language?',
            'dataType': 'boolean',
            'fullTextSearch': 'no',
            'javaVariableName': 'foreignLanguage'
        }
    ]
};


const http = Http.create();

export const profileService = {
    getAvailsMapping: () => {
        // return http.get(config.get('gateway.url') + config.get('base.path') +'/avails/mapping-data');
        return new Promise(function(resolve) { //, reject) {
            setTimeout(function() {
                resolve({data: mockedResponeAvailsMapping});
            }, 300);
        });
    },

};

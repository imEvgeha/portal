# Portal dynamic form generator
Portal dynamic form generator is a new tool that will be build a form based on a provided json schema

## Supported types
- string
- number
- textarea
- boolean
- select
- multiselect

## Json schema
- See an example of json schema in `NEXUS\PORTAL\src\pages\avails\right-details`
- path should be the same as the field name in the API

## Dependencies
- Are used to provide dependencies between the fields
- The schema should be like below:

{

    "name": "Title"
    "type": "string",
    "path": "title",
    "dependencies": [
        {
            "view": "EDIT",
            "type": "readOnly",
            "field": "Core TitleId",
            "value": "any"
        }
    ]

}

- For view the possible values are: "EDIT" / "CREATE"
- For type the possible values are: "readOnly" / "required"

- This means that the field title will be marked as readOnly when Core TitleId field is not empty
- If you are providing a value then checks also that the value of Core TitleId field is equal to the one you provided
- If you want to check that the value is null then you should add: { "value": "" }

## Validation
- If you need to have some validation functions for a field, you need to add the property validation like below

{

    "validation": [
        {
            "name": "myProvidedFunction",
            "args": {
                "length": 4
            }
        }
    ]

}

- Then you need to create a file with the same name e.g. myProvidedFunction in the folder \NEXUS\PORTAL\src\ui\elements\nexus-dynamic-form\valdationUtils and write there your function

## Options Config
- Only for select/multiselect types
- This field is OPTIONAL, also all subfields are OPTIONAL
- available options are:
    1. options: for hardcoded options
    2. defaultValuePath: only for fetched options, if field value is NOT under the "value" property
    3. defaultLabelPath: only for fetched options, if field label is NOT under the "value" property
```json
    {
        "optionsConfig": {
            "options": [
            { "label": "Pending", "value": "Pending" },
            { "label": "Confirmed", "value": "Confirmed" },
            { "label": "Tentative", "value": "Tentative" },
            { "label": "Canceled", "value": "Canceled" },
            { "label": "Withdrawn", "value": "Withdrawn" }
            ],
            "defaultValuePath": "languageCode",
            "defaultLabelPath": "languageName"
        }
    }
```

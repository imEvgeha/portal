# Portal dynamic form generator

Portal dynamic form generator is a new tool that will be build a form based on a provided json schema

## Supported types

-   string
-   number
-   textarea
-   boolean

## Json schema

-   See an example of json schema in `NEXUS\PORTAL\src\pages\avails\right-details`
-   path should be the same as the field name in the API

## Dependencies

-   Are used to provide dependencies between the fields
-   The schema should be like below:

{

    "name": "Title"
    "type": "string",
    "path": "title",
    "dependencies": [
        {
            "view": "EDIT",
            "type": "readOnly",
            "field": "Core TitleId"
        }
    ]

}

-   For view the possible values are: "EDIT" / "CREATE"
-   For type the possible values are: "readOnly" / "required"

-   This means that the field title will be marked as readOnly when Core TitleId field is not empty
-   If you are providing a value then checks also that the value of Core TitleId field is equal to the one you provided

## Custom Validation

-   If you need to have a custom validation functionfor a field, you need to add the property

{
"customValidation": "myProvidedFunction"
}

-   Then you need to create a file with the same name e.g. myProvidedFunction in the folder \NEXUS\PORTAL\src\ui\elements\nexus-dynamic-form\valdationUtils and write there your function

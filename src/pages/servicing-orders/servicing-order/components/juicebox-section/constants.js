
export const languagePath = 'definition.orders[0].content[0].materials[0].components[0].languageId';

export const JUICEBOX_ORDER = {
    id: "fo_deiRExTo",
    type: "FulfillmentOrder",
    createdAt: "2021-01-25T22:18:42.299Z",
    updatedAt: "2021-01-25T22:19:53.501Z",
    createdBy: null,
    updatedBy: null,
    tenant: "MGM",
    fs: "JUICEBOX",
    readiness: "READY",
    status: "FAILED",
    acknowledgement: null,
    notes: null,
    definition: {
        tenantId: "MGM",
        tenantTitleId: "FARGO",
        orders: [
            {
                orderType: "ingest",
                orderDueDate: "2021-01-21T07:59:59Z",
                orderNotes: "test",
                tenantOrderId: "SR30000622-EOP000007100-3",
                internalOrderIds: [],
                orderRequestDate: "2020-11-20T00:54:00Z",
                ingestTarget: "DETE",
                orderRush: false,
                content: [
                    {
                        materials: [
                            {
                                type: "Primary",
                                components: [
                                    {
                                        languageId: "English",
                                        componentType: "Video",
                                        tenantComponentId: "52006060",
                                        sources: [
                                            {
                                                externalSourceLocation: "Deluxe",
                                                externalSourceFilename: "fargo_mgm_178_1080_2997d_xdcam_50mbps_eng_8ch.mxf",
                                                sourceIds: [
                                                    {
                                                        type: "Deluxe",
                                                        id: "9616519"
                                                    }
                                                ]
                                            }
                                        ],
                                        internalComponentIds: [
                                            {
                                                type: "DETE",
                                                id: "4706417"
                                            }
                                        ]
                                    }
                                ],
                                internalMaterialIds: [
                                    {
                                        type: "DETE",
                                        id: "DA17514"
                                    }
                                ]
                            }
                        ],
                        tenantContentId: "FARGO"
                    }
                ]
            }
        ],
        titleName: "FARGO (1996)",
        externalTitleIds: [
            {
                type: "MIO",
                id: "59909"
            }
        ],
        internalTitleIds: []
    },
    so_number: "SO_0000000516",
    external_id: "SR30000622-EOP000007100-3",
    fs_id: "",
    start_date: "2020-11-20T00:54:00Z",
    due_date: "2021-01-21T07:59:59Z",
    soi_doc_id: "soi_b4ce9zix",
    errors: [
        {
            error: "Invalid input for field 'languageId' at path [orders][0][content][0][materials][0][components][0][languageId]. Expecting one of: ['af', 'ar', 'ar-001', 'ar-DZ', 'ar-EG', 'ar-MA', 'as', 'az', 'be', 'bg', 'bn', 'bo', 'ca', 'cmn', 'cmn-Hans', 'cmn-Hant', 'crs', 'cs', 'da', 'da-DK', 'de', 'de-AT', 'de-CH', 'de-DE', 'el', 'el-GR', 'en', 'en-AU', 'en-CA', 'en-DE', 'en-DV', 'en-FR', 'en-GB', 'en-NZ', 'en-US', 'es', 'es-419', 'es-CA', 'es-ES', 'es-MX', 'es-US', 'et', 'fa', 'fi', 'fi-FI', 'fj', 'fr', 'fr-BE', 'fr-CA', 'fr-CH', 'fr-FR', 'he', 'hi', 'hr', 'ht', 'hu', 'hy', 'id', 'is', 'it', 'it-IT', 'iu', 'ja', 'ja-JP', 'ka', 'kk', 'km', 'ko', 'ko-KR', 'ks', 'ky', 'lo', 'LT', 'LV', 'mfe', 'mg', 'mk', 'mn', 'MOS', 'mr', 'ms', 'my', 'nan', 'nb', 'nd', 'ne', 'nl', 'nl-BE', 'nl-NL', 'nn', 'no', 'no-NO', 'or', 'pl', 'pl-PL', 'prs', 'pt', 'pt-BR', 'pt-PT', 'ro', 'ru', 'ru-RU', 'sk', 'sl', 'sn', 'so', 'sq', 'sr', 'sr-ME', 'ss', 'sv', 'sv-SE', 'sv-SV', 'sw', 'ta', 'te', 'tg', 'th', 'tk', 'tl', 'tn', 'tr', 'tr-TR', 'uk', 'UN-sp', 'ur', 'uz', 'vi', 'wo', 'xh', 'XX-xx', 'yue', 'yue-Hant', 'zh', 'zh-Hans', 'zh-Hant', 'zu', 'zz-CO', 'zz-ME', 'zz-ML', 'zz-ZZ'], Given: ''",
            severity: "ERROR"
        }
    ]
}

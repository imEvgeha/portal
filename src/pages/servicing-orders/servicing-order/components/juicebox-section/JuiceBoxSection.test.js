import React from 'react';
import {shallow} from 'enzyme';
import JuiceBoxSection from './JuiceBoxSection';

const JUICEBOX_TEST_ORDER = {
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
};

describe('JuiceBoxSection with Language', () => {
    const wrapper = shallow(
        <JuiceBoxSection
            selectedOrder={JUICEBOX_TEST_ORDER}
            setSelectedOrder={() => null}
        />
    );
    it('Should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('Should find language text', () => {
        expect(wrapper.find('.nexus-jb-lang-input_textfield')).toHaveLength(1);
    }); 

    // more test here
});

describe('JuiceBoxSection without Language', () => {
    const wrapper = shallow(
        <JuiceBoxSection
            selectedOrder={{id: "fo_fail",type: "FulfillmentOrder"}}
            setSelectedOrder={() => null}
        />
    );
    it('Should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('Should find not available language text', () => {
        expect(wrapper.find('p').text()).toEqual("Language not available with this order.");
    })
});

describe('JuiceBoxSection Language Only test', () => {
    const wrapper = shallow(
        <JuiceBoxSection
            selectedOrder={{definition: { orders: [{ content: [ { materials: [{components: [{languageId: "SPANISH"}]}]}]}]}}}
            setSelectedOrder={() => null}
        />
    );
    it('Should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    }); 

    it('Should find language text', () => {
        expect(wrapper.find('.nexus-jb-lang-input_textfield')).toHaveLength(1);
    }); 
});

import React from 'react';
import {shallow} from 'enzyme';
import CreateEditConfig from './CreateEditConfig';

describe('CreateEditConfig', () => {
    let wrapper = null;
    let visible = true;
    let formValues = {};

    const schema = [
        {
            id: 'id',
            name: 'id',
            type: 'text',
            label: 'Document Id',
            description: 'Couchbase record id',
            disable: true,
        },
        {
            id: 'createdAt',
            name: 'createdAt',
            type: 'timestamp',
            label: 'Created at',
            disable: true,
        },
    ];

    const onSubmit = values => {
        formValues = values;
    };

    beforeEach(() => {
        wrapper = shallow(
            <CreateEditConfig
                visible={visible}
                schema={schema}
                label="Label"
                displayName="Display Name"
                values={{...formValues}}
                onSubmit={onSubmit}
                onHide={() => (visible = false)}
            />
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a form', () => {
        expect(wrapper.find('Dialog')).toHaveLength(1);
    });
});

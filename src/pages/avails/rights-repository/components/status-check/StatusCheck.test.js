import React from 'react';
import Button from '@atlaskit/button';
import {shallow} from 'enzyme';
import StatusCheck from './StatusCheck';

describe('StatusCheck', () => {
    let wrapper = null;

    const props = {
        nonEligibleTitles: [
            {
                id: 1,
                title: 'title1',
                status: 'Merged',
                rightStatus: 'Pending',
                licensed: true,
                territory: [
                    {
                        selected: true,
                    },
                ],
            },
            {
                id: 2,
                title: 'title12',
                status: 'ReadyNew',
                rightStatus: 'Pending',
                licensed: false,
                territory: [
                    {
                        selected: false,
                    },
                ],
            },
        ],
    };

    beforeEach(() => {
        wrapper = shallow(<StatusCheck {...props} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('renders Dynamic Table', () => {
        expect(wrapper.find('DynamicTable')).toHaveLength(1);
    });

    it('renders 2 rows in Dynamic Table', () => {
        expect(wrapper.find('DynamicTable').props().rows).toHaveLength(2);
    });

    it('renders None in territories column for row 1', () => {
        expect(wrapper.find('DynamicTable').props().rows[0].cells[4].content.props.data).toEqual('NONE');
    });

    it('renders No in licensed column for row 2', () => {
        expect(wrapper.find('DynamicTable').props().rows[1].cells[3].content.props.data).toEqual('NO');
    });

    it('renders OK button', () => {
        expect(wrapper.find(Button)).toHaveLength(1);
    });
});

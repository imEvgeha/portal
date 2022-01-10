import React from 'react';
import {shallow} from 'enzyme';
import NexusStatusDot from './NexusStatusDot';

describe('NexusStatusDot', () => {
    let wrapper = null;

    const onAction = () => null;
    const label = 'VZ';
    const severity = 'success';
    const isDisabled = false;
    const isLoading = false;

    beforeEach(() => {
        wrapper = shallow(
            <NexusStatusDot
                onAction={onAction}
                label={label}
                severity={severity}
                isDisabled={isDisabled}
                isLoading={isLoading}
            />
        );
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render the status dot', () => {
        expect(wrapper.find('.nexus-c-status-dot')).toHaveLength(1);
    });
});

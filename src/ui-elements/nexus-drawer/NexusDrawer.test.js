import React from 'react';
import {shallow} from 'enzyme';

import NexusDrawer from './NexusDrawer';

describe('NexusDrawer', () => {
    let wrapper;
    it('should match snapshot', () => {
        wrapper = shallow(
            <NexusDrawer
                position="right"
                width="narrow"
                isOpen={true}
                onClose={() => null}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('should not render children when closed', () => {
        wrapper = shallow(
            <NexusDrawer
                onClose={() => null}
                isOpen={false}
            >
                <div>Child</div>
            </NexusDrawer>
        );
        expect(wrapper.contains(<div>Child</div>)).toBeFalsy();
    });

    it('should render children when opened', () => {
        wrapper = shallow(
            <NexusDrawer
                onClose={() => null}
                isOpen={true}
            >
                <div>Child</div>
            </NexusDrawer>
        );
        expect(wrapper.contains(<div>Child</div>)).toBeTruthy();
    });
});


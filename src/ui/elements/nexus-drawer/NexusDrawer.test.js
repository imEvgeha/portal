import React from 'react';
import {shallow} from 'enzyme';
import NexusDrawer from './NexusDrawer';

describe('NexusDrawer', () => {
    let wrapper = null;
    it('should match snapshot', () => {
        wrapper = shallow(<NexusDrawer width="narrow" isOpen={true} onClose={() => null} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should not render children when closed', () => {
        wrapper = shallow(
            <NexusDrawer onClose={() => null} isOpen={false}>
                <div>Child</div>
            </NexusDrawer>
        );
        expect(wrapper.contains(<div>Child</div>)).toBeFalsy();
    });

    it('should render children when opened', () => {
        wrapper = shallow(
            <NexusDrawer onClose={() => null} isOpen={true}>
                <div>Child</div>
            </NexusDrawer>
        );
        expect(wrapper.contains(<div>Child</div>)).toBeTruthy();
    });

    it('should have only one close button and call onClose when button is clicked', () => {
        const onClose = jest.fn();
        wrapper = shallow(<NexusDrawer onClose={onClose} isOpen={true} />);

        expect(wrapper.find('IconButton')).toHaveLength(1);
        wrapper.find('IconButton').props().onClick();
        expect(onClose).toHaveBeenCalled();
    });

    it('shows a spinner when the isLoading prop is true', () => {
        wrapper = shallow(<NexusDrawer isLoading={true} isOpen={true} onClose={() => null} />);
        expect(wrapper.find('Spinner')).toBeTruthy();
    });
});

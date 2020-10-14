import React from 'react';
import {shallow} from 'enzyme';
import NexusCharacterNameModal from './NexusCharacterNameModal';

describe('NexusCharacterNameModal', () => {
    let wrapper = null;
    it('should match snapshot', () => {
        wrapper = shallow(
            <NexusCharacterNameModal
                onSubmit={() => null}
                hint="hint"
                defaultVal="test"
                isModalOpen
                closeModal={() => null}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });
});

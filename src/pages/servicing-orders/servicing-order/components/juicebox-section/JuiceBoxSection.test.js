import React from 'react';
import {shallow} from 'enzyme';
import JuiceBoxSection from './JuiceBoxSection';
import {JUICEBOX_ORDER} from './constants';

describe('JuiceBoxSection', () => {
    const wrapper = shallow(
        <JuiceBoxSection
            selectedOrder={JUICEBOX_ORDER}
            setSelectedOrder={() => null}
        />
    );
    it('Should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});

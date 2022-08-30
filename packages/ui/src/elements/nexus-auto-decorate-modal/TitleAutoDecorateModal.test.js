import React from 'react';
import {shallow} from 'enzyme';
import TitleAutoDecorateModal from './TitleAutoDecorateModal';

describe('TitleAutoDecorateModal', () => {
    let wrapper = null;

    const initialValues = {
        autoDecorateTitle: '',
        displayTitle: '',
        shortTitle: '',
        shortSynopsis: '',
        mediumSynopsis: '',
    };

    beforeEach(() => {
        wrapper = shallow(<TitleAutoDecorateModal currentData={initialValues} display={true} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a form', () => {
        expect(wrapper.find('Dialog')).toHaveLength(1);
    });
});

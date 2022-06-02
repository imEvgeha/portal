import React from 'react';
import {Button} from '@portal/portal-components';
import NexusEntity from '@vubiquity-nexus/portal-ui/lib/elements/nexus-entity/NexusEntity';
import {shallow} from 'enzyme';
import {withHooks} from 'jest-react-hooks-shallow';
import {useForm} from 'react-hook-form';
import ExternalIDsSection from './ExternalIDsSection';

describe('External Ids Section', () => {
    let wrapper = null;
    const {control} = useForm;

    withHooks(() => {
        wrapper = shallow(<ExternalIDsSection control={control} register={() => null} />);
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render main wrapper component', () => {
        expect(wrapper.find('.nexus-c-array-element-wrapper')).toHaveLength(1);
    });

    it('should render one create button', () => {
        expect(wrapper.find('.nexus-c-array-add-button').find(Button)).toHaveLength(1);
    });

    it('should render NexusEntity title', () => {
        expect(wrapper.find(NexusEntity)).toHaveLength(1);
    });
});

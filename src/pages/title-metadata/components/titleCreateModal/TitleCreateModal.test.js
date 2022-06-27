import React from 'react';
import {isAllowed} from '@portal/portal-auth/permissions';
import {Checkbox as PortalCheckbox} from '@portal/portal-components';
import {shallow} from 'enzyme';
import {withHooks} from 'jest-react-hooks-shallow';
import configureStore from 'redux-mock-store';
import ExternalIDsSection from '../nexus-field-extarnal-ids/ExternalIDsSection';
import TitleCreate from './TitleCreateModal';

describe('TitleCreateModal', () => {
    let defaultWrapper = null;
    let matchingWrapper = null;
    let mockStore = null;
    let store = null;

    mockStore = configureStore();
    store = mockStore({ui: {toast: {list: []}}});

    describe('Default TitleCreateModal', () => {
        withHooks(() => {
            defaultWrapper = shallow(
                <TitleCreate store={store} display={true} onToggle={() => null} tenantCode="vu" isItMatching={false} />
            );
            // .dive()
            // .shallow();
        });

        it('should match snapshot', () => {
            expect(defaultWrapper).toMatchSnapshot();
        });

        it('should render main dialog window for create title', () => {
            expect(defaultWrapper.find('.nexus-c-title-create_dialog')).toHaveLength(1);
        });

        it('should render labels for create title dialog PortalDropdown', () => {
            if (isAllowed('publishTitleMetadata')) {
                expect(defaultWrapper.find('Dropdown')).toHaveLength(1);
            }
        });

        it('should render checkbox container and checkboxes for create title dialog window', () => {
            if (isAllowed('publishTitleMetadata')) {
                expect(defaultWrapper.find('.nexus-c-title-create_checkbox-container')).toHaveLength(1);
                expect(defaultWrapper.find(PortalCheckbox)).toHaveLength(2);
            } else {
                expect(defaultWrapper.find('.nexus-c-title-create_checkbox-container')).toHaveLength(0);
                expect(defaultWrapper.find(PortalCheckbox)).toHaveLength(0);
            }
        });

        it('should render external IDs section', () => {
            expect(defaultWrapper.find(ExternalIDsSection)).toHaveLength(1);
        });
    });

    describe('Matching TitleCreateModal', () => {
        withHooks(() => {
            matchingWrapper = shallow(
                <TitleCreate store={store} display={true} onToggle={() => null} isItMatching={true} />
            );
            // .dive()
            // .shallow();
        });

        it('should match snapshot', () => {
            expect(matchingWrapper).toMatchSnapshot();
        });

        it('should render main dialog window for create title', () => {
            expect(matchingWrapper.find('.nexus-c-title-create_dialog')).toHaveLength(1);
        });

        it('should render footer for create title dialog window', () => {
            const footerWrapper = shallow(matchingWrapper.find('Dialog').props().footer);
            expect(footerWrapper.find('.nexus-c-title-create_footer-container')).toHaveLength(1);
        });

        it('should render labels for create title dialog inputs', () => {
            expect(matchingWrapper.find('InputText')).toHaveLength(2);
        });

        it('should not render checkbox container and checkboxes for create title dialog window', () => {
            expect(matchingWrapper.find('.nexus-c-title-create_checkbox-container')).toHaveLength(0);
            expect(matchingWrapper.find(PortalCheckbox)).toHaveLength(0);
        });

        it('should render external IDs section', () => {
            expect(defaultWrapper.find(ExternalIDsSection)).toHaveLength(1);
        });
    });
});

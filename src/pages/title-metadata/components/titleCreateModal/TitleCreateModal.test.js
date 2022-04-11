import React from 'react';
import {shallow} from 'enzyme';
import {withHooks} from 'jest-react-hooks-shallow';
import {Checkbox} from 'primereact/checkbox';
import configureStore from 'redux-mock-store';
import ControllerWrapper from '../controllerWrapper/ControllerWrapper';
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
            )
                .dive()
                .shallow();
        });

        it('should match snapshot', () => {
            expect(defaultWrapper).toMatchSnapshot();
        });

        it('should render main dialog window for create title', () => {
            expect(defaultWrapper.find('.nexus-c-title-create_dialog')).toHaveLength(1);
        });

        it('should render footer for create title dialog window', () => {
            expect(defaultWrapper.find('.nexus-c-title-create_footer-container')).toHaveLength(1);
        });

        it('should render labels for create title dialog ControllerWrappers', () => {
            expect(defaultWrapper.find(ControllerWrapper)).toHaveLength(6);
        });

        it('should render checkbox container and checkboxes for create title dialog window', () => {
            expect(defaultWrapper.find('.nexus-c-title-create_checkbox-container')).toHaveLength(1);
            expect(defaultWrapper.find(Checkbox)).toHaveLength(2);
        });
    });

    describe('Matching TitleCreateModal', () => {
        withHooks(() => {
            matchingWrapper = shallow(
                <TitleCreate store={store} display={true} onToggle={() => null} isItMatching={true} />
            )
                .dive()
                .shallow();
        });

        it('should match snapshot', () => {
            expect(matchingWrapper).toMatchSnapshot();
        });

        it('should render main dialog window for create title', () => {
            expect(matchingWrapper.find('.nexus-c-title-create_dialog')).toHaveLength(1);
        });

        it('should render footer for create title dialog window', () => {
            expect(matchingWrapper.find('.nexus-c-title-create_footer-container')).toHaveLength(1);
        });

        it('should render labels for create title dialog inputs', () => {
            expect(matchingWrapper.find(ControllerWrapper)).toHaveLength(3);
        });

        it('should not render checkbox container and checkboxes for create title dialog window', () => {
            expect(matchingWrapper.find('.nexus-c-title-create_checkbox-container')).toHaveLength(0);
            expect(matchingWrapper.find(Checkbox)).toHaveLength(0);
        });
    });
});

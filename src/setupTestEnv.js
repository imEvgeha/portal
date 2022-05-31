import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

configure({adapter: new Adapter()});

// Catches unhandledRejection error thrown by nodejs 15
// eslint-disable-next-line no-empty-function
process.on('unhandledRejection', (reason, promise) => {});

jest.mock('react-intl', () => {
    const reactIntl = jest.requireActual('react-intl');
    const intl = reactIntl.createIntl({
        locale: 'en',
    });

    return {
        ...reactIntl,
        useIntl: () => intl,
    };
});

export const mockNavigate = jest.fn();
export const mockSubstring = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({
        search: {
            substring: mockSubstring,
        },
    }),
    useParams: () => ({}),
}));

export const mockDispatch = jest.fn();
export const mockSelector = jest.fn();
jest.mock('react-redux', () => {
    const r = jest.requireActual('react-redux');

    return {
        ...r,
        useDispatch: () => mockDispatch,
        useSelector: () => mockSelector,
    };
});

export const mockUseFieldArray = {
    fields: [],
    append: () => jest.fn(),
    remove: () => jest.fn(),
};
jest.mock('react-hook-form', () => {
    const r = jest.requireActual('react-hook-form');

    return {
        ...r,
        useFieldArray: () => mockUseFieldArray,
    };
});

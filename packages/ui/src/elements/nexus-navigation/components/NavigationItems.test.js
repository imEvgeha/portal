import {navigationPrimaryItems} from './NavigationItems';

describe('Nexus Navigation Items', () => {
    it('should match snapshot', () => {
        const items = navigationPrimaryItems('item', () => null);
        expect(items).toHaveLength(6);
    });
});

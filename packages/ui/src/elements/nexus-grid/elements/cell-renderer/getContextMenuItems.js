export default function getContextMenuItems(params) {
    const url = `/metadata/v2/detail/${params.node.data.id}`;
    return [
        'copy',
        'copyWithHeaders',
        {
            name: 'Open link in new tab ',
            action: () => {
                window.open(url, '_blank');
            },
        },
    ];
}

export default function getContextMenuItems(params, link) {
    const url = `${link}/${params.node.data.id}`;
    return [
        'copy',
        'copyWithHeaders',
        link && {
            name: 'Open link in new tab ',
            action: () => {
                window.open(url, '_blank');
            },
        },
    ];
}

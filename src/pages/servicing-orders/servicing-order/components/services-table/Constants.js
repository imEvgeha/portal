export const SELECT_VALUES = {
    type: ['Subtitles', 'Audio', 'Video'],
    version: [
        {subtitles: ['English', 'French', 'Italian']},
        {audio: ['English', 'French', 'Italian']},
        {video: ['Theatrical', 'Broadcast', 'Director\'s cut']}
    ],
    standard: [
        {subtitles: ['Text Type - Full Stream', 'Forced', 'SDH']},
        {audio: ['Mono', 'Stereo', '2.0 LTRT', '3.0', '4.0', '5.0', '5.1', '6.1', '7.1', 'Dolby E']},
        {video: ['SD', 'HD', '4K']}
    ],
    operationalStatus: ['On Hold', 'In Progress'],
    componentId: ['LOL-123'],
    spec: ['M-DBS-2396 SCC'],
    addRecipient: ['MGM', 'Vubiquity'],
    sourceStandard: ['_1080_23_976']
};

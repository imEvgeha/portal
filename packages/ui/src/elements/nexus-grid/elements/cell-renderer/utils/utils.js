import {formatNumberTwoDigits} from '@vubiquity-nexus/portal-utils/lib/Common';

const EPISODE = {
    name: 'Episode',
    apiName: 'EPISODE',
};

export const isNexusTitle = titleId => {
    return titleId && titleId.startsWith('titl');
};

export const renderTitleName = (title, contentType, seasonNumber, episodeNumber, seriesTitleName) => {
    if (contentType === EPISODE.apiName) {
        return seriesTitleName
            ? `${seriesTitleName} S${formatNumberTwoDigits(seasonNumber)} E${formatNumberTwoDigits(
                  episodeNumber
              )}: ${title}`
            : `[SeriesNotFound] S${formatNumberTwoDigits(seasonNumber)} E${formatNumberTwoDigits(
                  episodeNumber
              )}: ${title}`;
    }
    return title;
};

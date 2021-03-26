const dataTypes = {
    DATE: 'date',
    AUDIO: 'audio',
    RATING: 'rating',
    METHOD: 'method',
    YES_OR_NO: 'yesOrNo',
};

export default {
    dataTypes,
    columns: [
        {
            field: 'updatedBy',
            headerName: 'Author',
            noStyles: true,
        },
        {
            field: 'method',
            headerName: 'Method',
            noStyles: true,
            dataType: dataTypes.METHOD,
        },
        {
            field: 'lastUpdateReceivedAt',
            headerName: 'Last Received',
            dataType: dataTypes.DATE,
            noStyles: true,
        },
        {
            field: 'updatedAt',
            headerName: 'Last Updated',
            dataType: dataTypes.DATE,
        },
        {
            field: 'title',
            headerName: 'Title',
        },
        {
            field: 'start',
            headerName: 'Start',
            dataType: dataTypes.DATE,
        },
        {
            field: 'end',
            headerName: 'End',
            dataType: dataTypes.DATE,
        },
        {
            field: 'licensor',
            headerName: 'Licensor',
        },
        {
            field: 'licensed',
            headerName: 'Licensed',
            dataType: dataTypes.YES_OR_NO,
            hide: true,
        },
        {
            field: 'rightStatus',
            headerName: 'Right Status',
            hide: true,
        },
        {
            field: 'status',
            headerName: 'Status',
            hide: true,
        },
        {
            field: 'keywords',
            headerName: 'Keywords',
            hide: true,
        },
        {
            field: 'licensee',
            headerName: 'Licensee',
            hide: true,
        },
        {
            field: 'languageAudioTypes',
            headerName: 'Audio Language',
            dataType: dataTypes.AUDIO,
        },
        {
            field: 'affiliate',
            headerName: 'Affiliate',
        },
        {
            field: 'contentType',
            headerName: 'Content Type',
        },
        {
            field: 'availStart',
            headerName: 'Avail Start',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'availEnd',
            headerName: 'Avail End',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'startLag',
            headerName: 'Start Lag',
            hide: true,
        },
        {
            field: 'productionStudio',
            headerName: 'Production Studio',
            hide: true,
        },
        {
            field: 'platformCategory',
            headerName: 'Platform Category',
            hide: true,
        },
        {
            field: 'contractId',
            headerName: 'Contract Id',
            hide: true,
        },
        {
            field: 'titleStatus',
            headerName: 'Title Status',
            hide: true,
        },
        {
            field: 'coreTitleId',
            headerName: 'Core Title Id',
            hide: true,
        },
        {
            field: 'storeLanguage',
            headerName: 'Store Language',
            hide: true,
        },
        {
            field: 'ALID',
            headerName: 'ALID',
            hide: true,
        },
        {
            field: 'CID',
            headerName: 'CID',
            hide: true,
        },
        {
            field: 'licenseRightsDescription',
            headerName: 'License Rights Description',
            hide: true,
        },
        {
            field: 'territoryExcluded',
            headerName: 'Territory Excluded',
            hide: true,
        },
        {
            field: 'region',
            headerName: 'Region',
            hide: true,
        },
        {
            field: 'regionExcluded',
            headerName: 'Region Excluded',
            hide: true,
        },
        {
            field: 'genres',
            headerName: 'Genres',
            hide: true,
        },
        {
            field: 'bonusRight',
            headerName: 'Bonus Right',
            dataType: dataTypes.YES_OR_NO,
            hide: true,
        },
        {
            field: 'affiliateExclude',
            headerName: 'Affiliate Exclude',
            hide: true,
        },
        {
            field: 'assetLanguage',
            headerName: 'Asset Language',
            hide: true,
        },
        {
            field: 'language',
            headerName: 'Language',
            hide: true,
        },
        {
            field: 'localizationType',
            headerName: 'Localization Type',
            hide: true,
        },
        {
            field: 'holdbackLanguage',
            headerName: 'Holdback Language',
            hide: true,
        },
        {
            field: 'allowedLanguages',
            headerName: 'Allowed Languages',
            hide: true,
        },
        {
            field: 'requiredFulfillmentLanguages',
            headerName: 'Required Fulfillment Languages',
            hide: true,
        },
        {
            field: 'entryType',
            headerName: 'Entry Type',
            hide: true,
        },
        {
            field: 'displayTitle',
            headerName: 'Display Title',
            hide: true,
        },
        {
            field: 'episodic.seriesTitle',
            headerName: 'Series Title',
            hide: true,
        },
        {
            field: 'episodic.seriesDisplayTitle',
            headerName: 'Series Display Title',
            hide: true,
        },
        {
            field: 'episodic.seasonTitle',
            headerName: 'Season Title',
            hide: true,
        },
        {
            field: 'episodic.seasonDisplayTitle',
            headerName: 'Season Display Title',
            hide: true,
        },
        {
            field: 'episodic.seasonNumber',
            headerName: 'Season Number',
            hide: true,
        },
        {
            field: 'episodic.episodeTitle',
            headerName: 'Episode Title',
            hide: true,
        },
        {
            field: 'episodic.episodeDisplayTitle',
            headerName: 'Episode Display Title',
            hide: true,
        },
        {
            field: 'episodic.episodeNumber',
            headerName: 'Episode Number',
            hide: true,
        },
        {
            field: 'episodic.volumeTitle',
            headerName: 'Volume Title',
            hide: true,
        },
        {
            field: 'episodic.volumeDisplayTitle',
            headerName: 'Volume Display Title',
            hide: true,
        },
        {
            field: 'episodic.volumeNumber',
            headerName: 'Volume Number',
            hide: true,
        },
        {
            field: 'episodic.distributionNumber',
            headerName: 'Distribution Number',
            hide: true,
        },
        {
            field: 'episodic.volumeDistributionNumber',
            headerName: 'Volume Distribution Number',
            hide: true,
        },
        {
            field: 'episodic.episodeCount',
            headerName: 'Episode Count',
            hide: true,
        },
        {
            field: 'episodic.seasonCount',
            headerName: 'Season Count',
            hide: true,
        },
        {
            field: 'groupIdentity',
            headerName: 'Group Identity',
            hide: true,
        },
        {
            field: 'companyDisplayCredit',
            headerName: 'Company Display Credit',
            hide: true,
        },
        {
            field: 'castCrew',
            headerName: 'Cast Crew',
            hide: true,
        },
        {
            field: 'releaseYear',
            headerName: 'Release Year',
            hide: true,
        },
        {
            field: 'releaseHistoryOriginal',
            headerName: 'Release History Original',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'releaseHistoryPhysicalHV',
            headerName: 'Release History Physical HV',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'captions.captionIncluded',
            headerName: 'Caption Included',
            hide: true,
        },
        {
            field: 'captions.captionExemption',
            headerName: 'Caption Exemption',
            hide: true,
        },
        {
            field: 'any',
            headerName: 'Any',
            hide: true,
        },
        {
            field: 'totalRuntime',
            headerName: 'Total Runtime',
            hide: true,
        },
        {
            field: 'hdr',
            headerName: 'HDR',
            hide: true,
        },
        {
            field: 'wcg',
            headerName: 'WCG',
            hide: true,
        },
        {
            field: 'hfr',
            headerName: 'HFR',
            hide: true,
        },
        {
            field: 'ngAudio',
            headerName: 'NG Audio',
            hide: true,
        },
        {
            field: 'windowDuration',
            headerName: 'Window Duration',
            hide: true,
        },
        {
            field: 'temporaryPriceReduction',
            headerName: 'Temporary Price Reduction',
            hide: true,
        },
        {
            field: 'srp',
            headerName: 'SRP',
            hide: true,
        },
        {
            field: 'description',
            headerName: 'Description',
            hide: true,
        },
        {
            field: 'bonus',
            headerName: 'Bonus',
            hide: true,
        },
        {
            field: 'download',
            headerName: 'Download',
            hide: true,
        },
        {
            field: 'otherTerms',
            headerName: 'Other Terms',
            hide: true,
        },
        {
            field: 'otherInstructions',
            headerName: 'Other Instructions',
            hide: true,
        },
        {
            field: 'suppressionLiftDate',
            headerName: 'Suppression Lift Date',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'specialPreOrderFulfillDate',
            headerName: 'Special Pre Order Fulfill Date',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'announceDate',
            headerName: 'Announce Date',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'rentalDuration',
            headerName: 'Rental Duration',
            hide: true,
        },
        {
            field: 'watchDuration',
            headerName: 'Watch Duration',
            hide: true,
        },
        {
            field: 'exclusive',
            headerName: 'Exclusive',
            hide: true,
        },
        {
            field: 'exclusiveAttributes',
            headerName: 'Exclusive Attributes',
            hide: true,
        },
        {
            field: 'brandingRights',
            headerName: 'Branding Rights',
            hide: true,
        },
        {
            field: 'brandingRightsAttributes',
            headerName: 'Branding Rights Attributes',
            hide: true,
        },
        {
            field: 'cmContentIds.contentId',
            headerName: 'Content ID',
            hide: true,
        },
        {
            field: 'cmContentIds.seriesContentId',
            headerName: 'Series Content ID',
            hide: true,
        },
        {
            field: 'cmContentIds.seasonContentId',
            headerName: 'Season Content ID',
            hide: true,
        },
        {
            field: 'cmContentIds.volumeContentId',
            headerName: 'Volume Content ID',
            hide: true,
        },
        {
            field: 'cmContentIds.episodeContentId',
            headerName: 'Episode Content ID',
            hide: true,
        },
        {
            field: 'eidr.titleId',
            headerName: 'Title ID',
            hide: true,
        },
        {
            field: 'eidr.seriesId',
            headerName: 'Series ID',
            hide: true,
        },
        {
            field: 'eidr.seasonId',
            headerName: 'Season ID',
            hide: true,
        },
        {
            field: 'eidr.episodeTitleId',
            headerName: 'Episode Title ID',
            hide: true,
        },
        {
            field: 'eidr.volumeId',
            headerName: 'Volume ID',
            hide: true,
        },
        {
            field: 'eidr.episodeId',
            headerName: 'Episode ID',
            hide: true,
        },
        {
            field: 'eidr.editId',
            headerName: 'Edit ID',
            hide: true,
        },
        {
            field: 'eidr.encodeId',
            headerName: 'Encode ID',
            hide: true,
        },
        {
            field: 'altId',
            headerName: 'Alt ID',
            hide: true,
        },
        {
            field: 'seriesAltId',
            headerName: 'Series Alt ID',
            hide: true,
        },
        {
            field: 'seasonAltId',
            headerName: 'Season Alt ID',
            hide: true,
        },
        {
            field: 'volumeAltId',
            headerName: 'Volume Alt ID',
            hide: true,
        },
        {
            field: 'episodeAltId',
            headerName: 'Episode Alt ID',
            hide: true,
        },
        {
            field: 'availId',
            headerName: 'Avail ID',
            hide: true,
        },
        {
            field: 'uvId',
            headerName: 'UV ID',
            hide: true,
        },
        {
            field: 'maId',
            headerName: 'MA ID',
            hide: true,
        },
        {
            field: 'reportingId',
            headerName: 'Reporting ID',
            hide: true,
        },
        {
            field: 'metadata',
            headerName: 'Metadata',
            hide: true,
        },
        {
            field: 'packageLabel',
            headerName: 'Package Label',
            hide: true,
        },
        {
            field: 'exceptionFlag',
            headerName: 'Exception Flag',
            hide: true,
        },
        {
            field: 'serviceProvider',
            headerName: 'Service Provider',
            hide: true,
        },
        {
            field: 'bundledALIds',
            headerName: 'Bundled AL IDs',
            hide: true,
        },
        {
            field: 'retailer.retailerId1',
            headerName: 'Retailer ID',
            hide: true,
        },
        {
            field: 'retailer.retailerSeriesId',
            headerName: 'Retailer Series ID',
            hide: true,
        },
        {
            field: 'retailer.retailerSeasonId',
            headerName: 'Retailer Season ID',
            hide: true,
        },
        {
            field: 'retailer.retailerVolumeId',
            headerName: 'Retailer Volume ID',
            hide: true,
        },
        {
            field: 'retailer.retailerEpisodeId1',
            headerName: 'Retailer Episode Id1',
            hide: true,
        },
        {
            field: 'retailer.retailerSpare1',
            headerName: 'Retailer Spare 1',
            hide: true,
        },
        {
            field: 'boxOffice',
            headerName: 'Box Office',
            hide: true,
        },
        {
            field: 'usBoxOffice',
            headerName: 'US Box Office',
            hide: true,
        },
        {
            field: 'boxOfficeComment',
            headerName: 'Box Office Comment',
            hide: true,
        },
        {
            field: 'daysFromLVR',
            headerName: 'Days From LVR',
            hide: true,
        },
        {
            field: 'audioDescription',
            headerName: 'Audio Description',
            hide: true,
        },
        {
            field: 'imdbLink',
            headerName: 'IMDB Link',
            hide: true,
        },
        {
            field: 'termYear',
            headerName: 'Term Year',
            hide: true,
        },
        {
            field: 'reLicence',
            headerName: 'Re-License',
            hide: true,
        },
        {
            field: 'reWork',
            headerName: 'Re-Work',
            hide: true,
        },
        {
            field: 'contractualCategory',
            headerName: 'Contractual Category',
            hide: true,
        },
        {
            field: 'productType',
            headerName: 'Product Type',
            hide: true,
        },
        {
            field: 'subtitles',
            headerName: 'Subtitles',
            hide: true,
        },
        {
            field: 'startTime',
            headerName: 'Start Time',
            hide: true,
        },
        {
            field: 'materialDeliveryDate',
            headerName: 'Material Delivery Date',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'originalRightIds',
            headerName: 'Original Right Ids',
            hide: true,
        },
        {
            field: 'sourceRightId',
            headerName: 'Source Right Id',
            hide: true,
        },
        {
            field: 'copyright',
            headerName: 'Copyright',
            hide: true,
        },
        {
            field: 'canconNumber',
            headerName: 'Cancon Number',
            hide: true,
        },
        {
            field: 'termYearStart',
            headerName: 'Term Year Start',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'termYearEnd',
            headerName: 'Term Year End',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'productionYear',
            headerName: 'Production Year',
            hide: true,
        },
        {
            field: 'originallyReceivedAt',
            headerName: 'Originally Received At',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'updatedCatalogReceived',
            headerName: 'Removed from Catalogue',
            hide: true,
        },
        {
            field: 'updatedCatalogReceivedAt',
            headerName: 'Removed from Catalogue Date',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            dataType: dataTypes.DATE,
            hide: true,
        },
        {
            field: 'createdBy',
            headerName: 'Created By',
            hide: true,
        },
        {
            field: 'providerId',
            headerName: 'Provider Id',
            hide: true,
        },
        {
            field: 'isrc',
            headerName: 'ISRC',
            hide: true,
        },
        {
            field: 'videoFileName',
            headerName: 'Video FileName',
            hide: true,
        },
        {
            field: 'screenGrabFileName',
            headerName: 'Screen Grab FileName',
            hide: true,
        },
        {
            field: 'materialNotes',
            headerName: 'Material Notes',
            hide: true,
        },
        {
            field: 'supplierSynopsis',
            headerName: 'Supplier Synopsis',
            hide: true,
        },
        {
            field: 'recordingLabel',
            headerName: 'Recording Label',
            hide: true,
        },
        {
            field: 'titleLocal',
            headerName: 'Title Local',
            hide: true,
        },
        {
            colId: 'ratingSystem',
            field: 'rating',
            headerName: 'RatingSystem',
            dataType: dataTypes.RATING,
        },
        {
            colId: 'ratingValue',
            field: 'rating',
            headerName: 'RatingValue',
            dataType: dataTypes.RATING,
        },
        {
            field: 'licenseType',
            headerName: 'License Type',
        },
        {
            field: 'format',
            headerName: 'Format',
        },
    ],
    HEADER_ROW: {
        updatedBy: '-',
        method: '-',
        headerRow: true,
    },
    SEPARATION_ROW: {
        updatedBy: '-',
        method: '-',
        lastUpdateReceivedAt: 'History(+/-)',
        headerRow: true,
        separationRow: true,
    },
    SYSTEM: 'service-account-avails-client',
    RULES_ENGINE_INFO: [
        {
            field: 'templateName',
            displayName: 'Template Name',
        },
        {
            field: 'transformMethod',
            displayName: 'Transform Method',
        },
        {
            field: 'availColumn',
            displayName: 'Avail column',
        },
        {
            field: 'availRow',
            displayName: 'Avail Row',
        },
        {
            field: 'fileName',
            displayName: 'Filename',
        },
        {
            field: 'tabName',
            displayName: 'Sheet Name',
        },
    ],
    colors: {
        CURRENT_VALUE: 'LightGreen',
        STALE_VALUE: 'coral',
    },
    RATING_SUBFIELD: 'com.vubiquity.messaging.rights.Rating',
    method: {
        INGEST: 'Ingest',
        MANUAL: 'Manual',
    },
    INGEST_ACCOUNTS: ['service-account-avails-client'],
    COLUMN_TOOL_PANEL: [
        {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
                suppressRowGroups: true,
                suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true,
            },
        },
    ],
};

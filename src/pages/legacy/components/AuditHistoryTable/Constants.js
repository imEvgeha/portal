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
        },
        {
            field: 'rightStatus',
            headerName: 'Right Status',
        },
        {
            field: 'status',
            headerName: 'Status',
        },
        {
            field: 'keywords',
            headerName: 'Keywords',
        },
        {
            field: 'licensee',
            headerName: 'Licensee',
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
        },
        {
            field: 'availEnd',
            headerName: 'Avail End',
            dataType: dataTypes.DATE,
        },
        {
            field: 'startLag',
            headerName: 'Start Lag',
        },
        {
            field: 'productionStudio',
            headerName: 'Production Studio',
        },
        {
            field: 'platformCategory',
            headerName: 'Platform Category',
        },
        {
            field: 'contractId',
            headerName: 'Contract Id',
        },
        {
            field: 'titleStatus',
            headerName: 'Title Status',
        },
        {
            field: 'coreTitleId',
            headerName: 'Core Title Id',
        },
        {
            field: 'storeLanguage',
            headerName: 'Store Language',
        },
        {
            field: 'ALID',
            headerName: 'ALID',
        },
        {
            field: 'CID',
            headerName: 'CID',
        },
        {
            field: 'licenseRightsDescription',
            headerName: 'License Rights Description',
        },
        {
            field: 'territoryExcluded',
            headerName: 'Territory Excluded',
        },
        {
            field: 'region',
            headerName: 'Region',
        },
        {
            field: 'regionExcluded',
            headerName: 'Region Excluded',
        },
        {
            field: 'genres',
            headerName: 'Genres',
        },
        {
            field: 'bonusRight',
            headerName: 'Bonus Right',
            dataType: dataTypes.YES_OR_NO,
        },
        {
            field: 'affiliateExclude',
            headerName: 'Affiliate Exclude',
        },
        {
            field: 'assetLanguage',
            headerName: 'Asset Language',
        },
        {
            field: 'language',
            headerName: 'Language',
        },
        {
            field: 'localizationType',
            headerName: 'Localization Type',
        },
        {
            field: 'holdbackLanguage',
            headerName: 'Holdback Language',
        },
        {
            field: 'allowedLanguages',
            headerName: 'Allowed Languages',
        },
        {
            field: 'requiredFulfillmentLanguages',
            headerName: 'Required Fulfillment Languages',
        },
        {
            field: 'entryType',
            headerName: 'Entry Type',
        },
        {
            field: 'displayTitle',
            headerName: 'Display Title',
        },
        {
            field: 'episodic.seriesTitle',
            headerName: 'Series Title',
        },
        {
            field: 'episodic.seriesDisplayTitle',
            headerName: 'Series Display Title',
        },
        {
            field: 'episodic.seasonTitle',
            headerName: 'Season Title',
        },
        {
            field: 'episodic.seasonDisplayTitle',
            headerName: 'Season Display Title',
        },
        {
            field: 'episodic.seasonNumber',
            headerName: 'Season Number',
        },
        {
            field: 'episodic.episodeTitle',
            headerName: 'Episode Title',
        },
        {
            field: 'episodic.episodeDisplayTitle',
            headerName: 'Episode Display Title',
        },
        {
            field: 'episodic.episodeNumber',
            headerName: 'Episode Number',
        },
        {
            field: 'episodic.volumeTitle',
            headerName: 'Volume Title',
        },
        {
            field: 'episodic.volumeDisplayTitle',
            headerName: 'Volume Display Title',
        },
        {
            field: 'episodic.volumeNumber',
            headerName: 'Volume Number',
        },
        {
            field: 'episodic.distributionNumber',
            headerName: 'Distribution Number',
        },
        {
            field: 'episodic.volumeDistributionNumber',
            headerName: 'Volume Distribution Number',
        },
        {
            field: 'episodic.episodeCount',
            headerName: 'Episode Count',
        },
        {
            field: 'episodic.seasonCount',
            headerName: 'Season Count',
        },
        {
            field: 'groupIdentity',
            headerName: 'Group Identity',
        },
        {
            field: 'companyDisplayCredit',
            headerName: 'Company Display Credit',
        },
        {
            field: 'castCrew',
            headerName: 'Cast Crew',
        },
        {
            field: 'releaseYear',
            headerName: 'Release Year',
        },
        {
            field: 'releaseHistoryOriginal',
            headerName: 'Release History Original',
            dataType: dataTypes.DATE,
        },
        {
            field: 'releaseHistoryPhysicalHV',
            headerName: 'Release History Physical HV',
            dataType: dataTypes.DATE,
        },
        {
            field: 'captions.captionIncluded',
            headerName: 'Caption Included',
        },
        {
            field: 'captions.captionExemption',
            headerName: 'Caption Exemption',
        },
        {
            field: 'any',
            headerName: 'Any',
        },
        {
            field: 'totalRuntime',
            headerName: 'Total Runtime',
        },
        {
            field: 'hdr',
            headerName: 'HDR',
        },
        {
            field: 'wcg',
            headerName: 'WCG',
        },
        {
            field: 'hfr',
            headerName: 'HFR',
        },
        {
            field: 'ngAudio',
            headerName: 'NG Audio',
        },
        {
            field: 'windowDuration',
            headerName: 'Window Duration',
        },
        {
            field: 'temporaryPriceReduction',
            headerName: 'Temporary Price Reduction',
        },
        {
            field: 'srp',
            headerName: 'SRP',
        },
        {
            field: 'description',
            headerName: 'Description',
        },
        {
            field: 'bonus',
            headerName: 'Bonus',
        },
        {
            field: 'download',
            headerName: 'Download',
        },
        {
            field: 'otherTerms',
            headerName: 'Other Terms',
        },
        {
            field: 'otherInstructions',
            headerName: 'Other Instructions',
        },
        {
            field: 'suppressionLiftDate',
            headerName: 'Suppression Lift Date',
            dataType: dataTypes.DATE,
        },
        {
            field: 'specialPreOrderFulfillDate',
            headerName: 'Special Pre Order Fulfill Date',
            dataType: dataTypes.DATE,
        },
        {
            field: 'announceDate',
            headerName: 'Announce Date',
            dataType: dataTypes.DATE,
        },
        {
            field: 'rentalDuration',
            headerName: 'Rental Duration',
        },
        {
            field: 'watchDuration',
            headerName: 'Watch Duration',
        },
        {
            field: 'exclusive',
            headerName: 'Exclusive',
        },
        {
            field: 'exclusiveAttributes',
            headerName: 'Exclusive Attributes',
        },
        {
            field: 'brandingRights',
            headerName: 'Branding Rights',
        },
        {
            field: 'brandingRightsAttributes',
            headerName: 'Branding Rights Attributes',
        },
        {
            field: 'cmContentIds.contentId',
            headerName: 'Content ID',
        },
        {
            field: 'cmContentIds.seriesContentId',
            headerName: 'Series Content ID',
        },
        {
            field: 'cmContentIds.seasonContentId',
            headerName: 'Season Content ID',
        },
        {
            field: 'cmContentIds.volumeContentId',
            headerName: 'Volume Content ID',
        },
        {
            field: 'cmContentIds.episodeContentId',
            headerName: 'Episode Content ID',
        },
        {
            field: 'eidr.titleId',
            headerName: 'Title ID',
        },
        {
            field: 'eidr.seriesId',
            headerName: 'Series ID',
        },
        {
            field: 'eidr.seasonId',
            headerName: 'Season ID',
        },
        {
            field: 'eidr.episodeTitleId',
            headerName: 'Episode Title ID',
        },
        {
            field: 'eidr.volumeId',
            headerName: 'Volume ID',
        },
        {
            field: 'eidr.episodeId',
            headerName: 'Episode ID',
        },
        {
            field: 'eidr.editId',
            headerName: 'Edit ID',
        },
        {
            field: 'eidr.encodeId',
            headerName: 'Encode ID',
        },
        {
            field: 'altId',
            headerName: 'Alt ID',
        },
        {
            field: 'seriesAltId',
            headerName: 'Series Alt ID',
        },
        {
            field: 'seasonAltId',
            headerName: 'Season Alt ID',
        },
        {
            field: 'volumeAltId',
            headerName: 'Volume Alt ID',
        },
        {
            field: 'episodeAltId',
            headerName: 'Episode Alt ID',
        },
        {
            field: 'availId',
            headerName: 'Avail ID',
        },
        {
            field: 'uvId',
            headerName: 'UV ID',
        },
        {
            field: 'maId',
            headerName: 'MA ID',
        },
        {
            field: 'reportingId',
            headerName: 'Reporting ID',
        },
        {
            field: 'metadata',
            headerName: 'Metadata',
        },
        {
            field: 'packageLabel',
            headerName: 'Package Label',
        },
        {
            field: 'exceptionFlag',
            headerName: 'Exception Flag',
        },
        {
            field: 'serviceProvider',
            headerName: 'Service Provider',
        },
        {
            field: 'bundledALIds',
            headerName: 'Bundled AL IDs',
        },
        {
            field: 'retailer.retailerId1',
            headerName: 'Retailer ID',
        },
        {
            field: 'retailer.retailerSeriesId',
            headerName: 'Retailer Series ID',
        },
        {
            field: 'retailer.retailerSeasonId',
            headerName: 'Retailer Season ID',
        },
        {
            field: 'retailer.retailerVolumeId',
            headerName: 'Retailer Volume ID',
        },
        {
            field: 'retailer.retailerEpisodeId1',
            headerName: 'Retailer Episode Id1',
        },
        {
            field: 'retailer.retailerSpare1',
            headerName: 'Retailer Spare 1',
        },
        {
            field: 'boxOffice',
            headerName: 'Box Office',
        },
        {
            field: 'usBoxOffice',
            headerName: 'US Box Office',
        },
        {
            field: 'boxOfficeComment',
            headerName: 'Box Office Comment',
        },
        {
            field: 'daysFromLVR',
            headerName: 'Days From LVR',
        },
        {
            field: 'audioDescription',
            headerName: 'Audio Description',
        },
        {
            field: 'imdbLink',
            headerName: 'IMDB Link',
        },
        {
            field: 'termYear',
            headerName: 'Term Year',
        },
        {
            field: 'reLicence',
            headerName: 'Re-License',
        },
        {
            field: 'reWork',
            headerName: 'Re-Work',
        },
        {
            field: 'contractualCategory',
            headerName: 'Contractual Category',
        },
        {
            field: 'productType',
            headerName: 'Product Type',
        },
        {
            field: 'subtitles',
            headerName: 'Subtitles',
        },
        {
            field: 'startTime',
            headerName: 'Start Time',
        },
        {
            field: 'materialDeliveryDate',
            headerName: 'Material Delivery Date',
            dataType: dataTypes.DATE,
        },
        {
            field: 'originalRightIds',
            headerName: 'Original Right Ids',
        },
        {
            field: 'sourceRightId',
            headerName: 'Source Right Id',
        },
        {
            field: 'copyright',
            headerName: 'Copyright',
        },
        {
            field: 'canconNumber',
            headerName: 'Cancon Number',
        },
        {
            field: 'termYearStart',
            headerName: 'Term Year Start',
            dataType: dataTypes.DATE,
        },
        {
            field: 'termYearEnd',
            headerName: 'Term Year End',
            dataType: dataTypes.DATE,
        },
        {
            field: 'productionYear',
            headerName: 'Production Year',
        },
        {
            field: 'originallyReceivedAt',
            headerName: 'Originally Received At',
            dataType: dataTypes.DATE,
        },
        {
            field: 'updatedCatalogReceived',
            headerName: 'Removed from Catalogue',
        },
        {
            field: 'updatedCatalogReceivedAt',
            headerName: 'Removed from Catalogue Date',
            dataType: dataTypes.DATE,
        },
        {
            field: 'createdAt',
            headerName: 'Created At',
            dataType: dataTypes.DATE,
        },
        {
            field: 'createdBy',
            headerName: 'Created By',
        },
        {
            field: 'providerId',
            headerName: 'Provider Id',
        },
        {
            field: 'isrc',
            headerName: 'ISRC',
        },
        {
            field: 'videoFileName',
            headerName: 'Video FileName',
        },
        {
            field: 'screenGrabFileName',
            headerName: 'Screen Grab FileName',
        },
        {
            field: 'materialNotes',
            headerName: 'Material Notes',
        },
        {
            field: 'supplierSynopsis',
            headerName: 'Supplier Synopsis',
        },
        {
            field: 'recordingLabel',
            headerName: 'Recording Label',
        },
        {
            field: 'titleLocal',
            headerName: 'Title Local',
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

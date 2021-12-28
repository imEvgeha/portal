import { titleService } from '../titleMetadataServices';

export const fetchListOfUploadedMetadata = async (data, page, size) => {
  const {tenantCode, uploadedBy, uploadedAt, status} = data;
  if (tenantCode) {
      const body = { 
          uploadedBy,
          startDate: uploadedAt?.uploadedAtFrom,
          endDate: uploadedAt?.uploadedAtTo,
          status
      }
      const response = await titleService.getUploadedMetadata(body, tenantCode, page, size);
      return response
  }
};

export const downloadUploadedMetadata = async fileId => {
  if (fileId) {
      const response = await titleService.getUploadLogMetadataFile(fileId);
      return response
  }
};
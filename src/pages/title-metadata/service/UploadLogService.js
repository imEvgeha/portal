import { titleService } from '../titleMetadataServices';

export const fetchUploadedEMETsLog = async (data, page, size) => {
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

export const downloadUploadedEMETLog = async fileId => {
  if (fileId) {
      const response = await titleService.getUploadLogMetadataFile(fileId);
      return response
  }
};
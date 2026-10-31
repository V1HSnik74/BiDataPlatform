import type { components, operations } from './schema'

export type UploadResponse = components['schemas']['UploadResponse']
export type UploadDeleteResponse = components['schemas']['UploadDeleteResponse']
export type ValidationError = components['schemas']['HTTPValidationError']

export type GetUploadsParams = operations['get_uploads_api_uploads__get']['parameters']['query']
export type UploadFileParams = operations['upload_file_api_uploads__post']['parameters']['query']
export type DeleteUploadPathParams = operations['delete_upload_api_uploads__upload_id__delete']['parameters']['path']
export type DeleteUploadQueryParams = operations['delete_upload_api_uploads__upload_id__delete']['parameters']['query']

export type FileType = 'csv' | 'xlsx' | 'json' | 'xml'

import type { components, operations } from './schema'

// Uploads
export type UploadResponse = components['schemas']['UploadResponse']
export type UploadDeleteResponse = components['schemas']['UploadDeleteResponse']
export type ValidationError = components['schemas']['HTTPValidationError']
export type DeleteUploadPathParams = operations['delete_upload_api_uploads__upload_id__delete']['parameters']['path']

// Graphs
export type GraphBase = components['schemas']['GraphBase']
export type GraphResponse = components['schemas']['GraphResponse']
export type GraphDeleteResponse = components['schemas']['GraphDeleteResponse']
export type GraphPreviewDataPoint = Record<string, string | number>
export type DeleteGraphPathParams = operations['delete_graph_api_graphs__graph_id__delete']['parameters']['path']

// Other
export type FileType = 'csv' | 'xlsx' | 'json' | 'xml'

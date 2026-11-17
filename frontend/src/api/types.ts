import type { components, operations } from './schema'

// Uploads
export type UploadResponse = components['schemas']['UploadResponse']
export type UploadDeleteResponse = components['schemas']['UploadDeleteResponse']
export type ValidationError = components['schemas']['HTTPValidationError']
export type DeleteUploadPathParams = operations['delete_upload_api_uploads__upload_id__delete']['parameters']['path']

// Graphs
export type GraphBase = components['schemas']['GraphBase']
export type GraphUpdate = components['schemas']['GraphUpdate']
export type GraphResponse = components['schemas']['GraphResponse']
export type GraphDeleteResponse = components['schemas']['GraphDeleteResponse']
export type GraphPreviewDataPoint = Record<string, string | number>
export type DeleteGraphPathParams = operations['delete_graph_api_graphs__graph_id__delete']['parameters']['path']
export type UpdateGraphPathParams = operations['update_graph_api_graphs__graph_id__patch']['parameters']['path']

// Auth
export type UserRegister = components['schemas']['UserRegister']
export type UserResponse = components['schemas']['UserResponse']
export type UserLogin = components['schemas']['UserLogin']
export type TokenResponse = components['schemas']['TokenResponse']
export type ForgotPasswordRequest = components['schemas']['ForgotPasswordRequest']
export type ResetPasswordRequest = components['schemas']['ResetPasswordRequest']

// Admin
export type UsersResponse = components['schemas']['UsersResponse']
export type UserUpdatePermission = components['schemas']['UserUpdatePermission']
export type UserDeleteResponse = components['schemas']['UserDeleteResponse']
export type UserRole = UsersResponse['role']
export type UserScope = UsersResponse['scope']
export type DeleteUserPathParams = operations['delete_user_api_admin__user_id__delete']['parameters']['path']
export type UpdateUserPermissionsPathParams =
  operations['update_user_permissions_api_admin__user_id__patch']['parameters']['path']

// Other
export type FileType = 'csv' | 'xlsx' | 'json' | 'xml'

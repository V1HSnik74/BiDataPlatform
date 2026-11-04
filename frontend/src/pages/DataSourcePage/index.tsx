import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import type { UploadResponse } from '../../api/types'
import { uploadApi } from '../../api/uploads'
import { FileLabel } from '../../components/FileLabel'
import { Icon } from '../../components/Icon'
import { handleApiError } from '../../utils/errors'
import css from './index.module.scss'

const CURRENT_USER_ID = 1

const formatDate = (dateStr: string | null) => {
  if (!dateStr) {
    return 'Unknown'
  }
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const DataSourcePage = () => {
  const [files, setFiles] = useState<UploadResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setIsLoading(true)
        const data = await uploadApi.getUploads(CURRENT_USER_ID)
        setFiles(data)
      } catch (error) {
        handleApiError(error, 'Не удалось получить список файлов')
      } finally {
        setIsLoading(false)
      }
    }
    fetchFiles()
  }, [])

  const handleAcceptedFile = async (file: File) => {
    try {
      setIsUploading(true)
      const uploadedRecord = await uploadApi.uploadFile(CURRENT_USER_ID, file)
      setFiles((prev) => [uploadedRecord, ...prev])
    } catch (error) {
      handleApiError(error, 'Ошибка при загрузке файла')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await uploadApi.deleteUpload(id, CURRENT_USER_ID)
      setFiles((prev) => prev.filter((file) => file.id !== id))
    } catch (error) {
      handleApiError(error, 'Не удалось удалить файл')
    }
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', '.xls'],
      'application/json': ['.json'],
      'application/xml': ['.xml'],
      'text/xml': ['.xml'],
    },
    onDropAccepted: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        handleAcceptedFile(acceptedFiles[0])
      }
    },
    onDropRejected: (fileRejections) => {
      alert(`Upload error: ${fileRejections[0]?.errors[0]?.message}`)
    },
  })

  return (
    <div className={css.container}>
      <main className={css.main}>
        <h1 className={css.pageTitle}>Data Sources & File Management</h1>
        <div className={css.card}>
          <div
            {...getRootProps()}
            className={classNames(css.dropZone, {
              [css.dropZoneActive]: isDragActive,
              [css.disabled]: isUploading,
            })}
          >
            <input {...getInputProps()} className={css.hiddenInput} />
            <Icon name="uploadCloud" className={css.uploadIcon} size={44} strokeWidth={1.5} />
            <p className={css.uploadText}>
              {isUploading ? 'Uploading and parsing file...' : 'Drag & drop CSV, Excel, JSON or XML'}
            </p>
            <button type="button" className={css.uploadBtn} onClick={open} disabled={isUploading}>
              Upload File
            </button>
          </div>

          <div className={css.tableResponsive}>
            <table className={css.table}>
              <thead>
                <tr>
                  <th className={css.thFilename}>Filename</th>
                  <th className={css.thUploadDate}>Upload Date</th>
                  <th className={css.thDimensions}>Dimensions</th>
                  <th className={css.thMeasures}>Measures</th>
                  <th className={css.thActions}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                      Loading data sources...
                    </td>
                  </tr>
                ) : files.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                      No files uploaded yet. Upload a CSV, XLSX, JSON or XML file to get started.
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr key={file.id} className={css.tableRow}>
                      <td className={css.tdFilename}>
                        <FileLabel filename={file.filename} iconSize={18} />
                      </td>
                      <td className={css.tdUploadDate}>{formatDate(file.created_at)}</td>
                      <td className={css.tdDimensions}>
                        <div className={css.badgeGroup}>
                          {file.dimensions.map((dim, idx) => (
                            <span key={idx} className={css.dimensionBadge}>
                              {dim}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className={css.tdMeasures}>
                        <div className={css.badgeGroup}>
                          {file.measures.map((measure, idx) => (
                            <span key={idx} className={css.measureBadge}>
                              {measure}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className={css.tdActions}>
                        <div className={css.actionsContainer}>
                          <button type="button" className={css.deleteButton} onClick={() => handleDelete(file.id)}>
                            <Icon name="trash" size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

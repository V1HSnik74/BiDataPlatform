import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { uploadApi } from '../../api/uploads'
import { FileLabel } from '../../components/FileLabel'
import { Icon } from '../../components/Icon'
import { withPageWrapper } from '../../components/PageWrapper'
import { handleApiError } from '../../utils/errors'
import css from './index.module.scss'

const formatDate = (dateStr: string | null) => {
  if (!dateStr) {
    return 'Неизвестно'
  }
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const DataSourcePage = withPageWrapper({
  authorizedOnly: true,
  title: 'Источники данных',
  useQuery: () =>
    useQuery({
      queryKey: ['uploads'],
      queryFn: () => uploadApi.getUploads(),
    }),
  setProps: ({ queryResult }) => ({
    files: queryResult.data,
  }),
})(({ files }) => {
  const queryClient = useQueryClient()

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadApi.uploadFile(file),
    onSuccess: () => {
      toast.success('Файл успешно загружен')
      queryClient.invalidateQueries({ queryKey: ['uploads'] })
    },
    onError: (error) => {
      handleApiError(error, 'Ошибка при загрузке файла')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => uploadApi.deleteUpload(id),
    onSuccess: () => {
      toast.success('Файл удалён')
      queryClient.invalidateQueries({ queryKey: ['uploads'] })
    },
    onError: (error) => {
      handleApiError(error, 'Не удалось удалить файл')
    },
  })

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
        uploadMutation.mutate(acceptedFiles[0])
      }
    },
    onDropRejected: (fileRejections) => {
      toast.error(`Ошибка загрузки: ${fileRejections[0]?.errors[0]?.message}`)
    },
  })

  const isUploading = uploadMutation.isPending

  return (
    <div className={css.container}>
      <main className={css.main}>
        <h1 className={css.pageTitle}>Источники данных и управление файлами</h1>
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
              {isUploading ? 'Загрузка и обработка файла...' : 'Перетащите CSV, Excel, JSON или XML сюда'}
            </p>
            <button type="button" className={css.uploadBtn} onClick={open} disabled={isUploading}>
              Загрузить файл
            </button>
          </div>
          <div className={css.tableResponsive}>
            <table className={css.table}>
              <thead>
                <tr>
                  <th className={css.thFilename}>Имя файла</th>
                  <th className={css.thUploadDate}>Дата загрузки</th>
                  <th className={css.thDimensions}>Измерения</th>
                  <th className={css.thMeasures}>Меры</th>
                  <th className={css.thActions}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {files.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px' }}>
                      Файлы ещё не загружены. Загрузите файл CSV, XLSX, JSON или XML, чтобы начать работу.
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
                          <button
                            type="button"
                            className={css.deleteButton}
                            onClick={() => deleteMutation.mutate(file.id)}
                          >
                            <Icon name="trash" size={16} />
                            <span>Удалить</span>
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
})

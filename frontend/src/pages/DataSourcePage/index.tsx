import classNames from 'classnames'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Icon } from '../../components/Icon'
import css from './index.module.scss'

export type FileItem = {
  id: string
  name: string
  uploadDate: string
  dimensions: string[]
  measures: string[]
  fileType: 'csv' | 'xlsx' | 'json' | 'xml'
}

const INITIAL_FILES: FileItem[] = [
  {
    id: '1',
    name: 'Q4_Performance_Data.csv',
    uploadDate: 'Oct 29, 2026',
    dimensions: ['Department', 'Date', 'Departments'],
    measures: ['Hours', 'Salary'],
    fileType: 'csv',
  },
  {
    id: '2',
    name: 'Employee_Registry.xlsx',
    uploadDate: 'Oct 25, 2026',
    dimensions: ['Department', 'Date', 'Region'],
    measures: ['Salary', 'Department'],
    fileType: 'xlsx',
  },
  {
    id: '3',
    name: 'Financials_2025.json',
    uploadDate: 'Oct 20, 2026',
    dimensions: ['Category', 'Status'],
    measures: ['Hours', 'Revenue', 'Count'],
    fileType: 'json',
  },
  {
    id: '4',
    name: 'Operations_Logs.xml',
    uploadDate: 'Oct 20, 2026',
    dimensions: ['Status'],
    measures: ['Count', 'Cost'],
    fileType: 'xml',
  },
]

const getFileType = (filename: string): FileItem['fileType'] => {
  const name = filename.toLowerCase()

  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return 'xlsx'
  }
  if (name.endsWith('.json')) {
    return 'json'
  }
  if (name.endsWith('.xml')) {
    return 'xml'
  }
  return 'csv'
}

export const DataSourcePage = () => {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES)

  const handleAcceptedFile = (file: File) => {
    const newEntry: FileItem = {
      id: crypto.randomUUID(),
      name: file.name,
      uploadDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      dimensions: ['Imported_Dim'],
      measures: ['Imported_Measure'],
      fileType: getFileType(file.name),
    }

    setFiles((prev) => [newEntry, ...prev])
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
      const errorMsg = fileRejections[0]?.errors[0]?.message
      alert(`Upload error: ${errorMsg}`)
    },
  })

  const getFileIcon = (type: FileItem['fileType']) => {
    switch (type) {
      case 'xlsx':
        return <Icon name="fileSpreadsheet" className={classNames(css.fileIcon, css.xlsx)} />
      case 'json':
        return <Icon name="fileCode" className={classNames(css.fileIcon, css.json)} />
      case 'xml':
        return <Icon name="fileCode2" className={classNames(css.fileIcon, css.xml)} />
      default:
        return <Icon name="fileText" className={classNames(css.fileIcon, css.csv)} />
    }
  }

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  return (
    <div className={css.container}>
      <main className={css.main}>
        <h1 className={css.pageTitle}>Data Sources & File Management</h1>
        <div className={css.card}>
          <div
            {...getRootProps()}
            className={classNames(css.dropZone, {
              [css.dropZoneActive]: isDragActive,
            })}
          >
            <input {...getInputProps()} className={css.hiddenInput} />
            <Icon name="uploadCloud" className={css.uploadIcon} size={44} strokeWidth={1.5} />
            <p className={css.uploadText}>Drag & drop CSV, Excel, JSON or XML</p>
            <button type="button" className={css.uploadBtn} onClick={open}>
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
                {files.map((file) => (
                  <tr key={file.id} className={css.tableRow}>
                    <td className={css.tdFilename}>
                      <div className={css.fileNameCell}>
                        {getFileIcon(file.fileType)}
                        <span className={css.fileNameText}>{file.name}</span>
                      </div>
                    </td>
                    <td className={css.tdUploadDate}>{file.uploadDate}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

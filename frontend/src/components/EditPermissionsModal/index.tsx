import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { adminApi } from '../../api/admin'
import type { UsersResponse, UserUpdatePermission } from '../../api/types'
import { CustomSelect, type SelectOption } from '../CustomSelect'
import { Icon } from '../Icon'
import css from './index.module.scss'

const ROLE_OPTIONS: SelectOption<'admin' | 'user'>[] = [
  { value: 'user', label: 'Пользователь' },
  { value: 'admin', label: 'Администратор' },
]

const AddDepartmentForm = ({ onAdd, onCancel }: { onAdd: (name: string) => void; onCancel: () => void }) => {
  const [name, setName] = useState('')

  return (
    <form
      className={css.addDeptRow}
      onSubmit={(e) => {
        e.preventDefault()
        onAdd(name.trim())
      }}
    >
      <input
        type="text"
        className={css.deptInput}
        placeholder="Название нового отдела..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <button type="submit" className={css.addDeptConfirmBtn} disabled={!name.trim()}>
        ОК
      </button>
      <button type="button" className={css.addDeptCancelBtn} onClick={onCancel}>
        Отмена
      </button>
    </form>
  )
}

export const EditPermissionsModal = ({
  user,
  existingDepartments,
  onClose,
  onSuccess,
}: {
  user: UsersResponse
  existingDepartments: string[]
  onClose: () => void
  onSuccess: () => void
}) => {
  const [role, setRole] = useState<'admin' | 'user'>(user.role)
  const [scope, setScope] = useState<'default' | 'all' | 'department'>(user.scope || 'default')
  const [department, setDepartment] = useState<string>(user.department || '')
  const [isAddingDept, setIsAddingDept] = useState(false)
  const updateMutation = useMutation({
    mutationFn: (payload: UserUpdatePermission) => adminApi.updateUserPermissions(user.id, payload),
    onSuccess,
  })
  const allDepartments = Array.from(new Set([...existingDepartments, ...(department ? [department] : [])]))
  const departmentOptions: SelectOption<string>[] = allDepartments.map((dept) => ({
    value: dept,
    label: dept,
  }))
  const handleSave = () => {
    if (!department) {
      return
    }
    updateMutation.mutate({ role, scope, department })
  }
  const isDepartmentMissing = !department

  return (
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <div className={css.modalHeader}>
          <div>
            <h2 className={css.title}>Изменение доступа</h2>
            <span className={css.subtitle}>
              {user.login} ({user.email})
            </span>
          </div>
          <button type="button" className={css.closeBtn} onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className={css.modalBody}>
          <div className={css.fieldGroup}>
            <label className={css.label}>Системная роль</label>
            <CustomSelect value={role} options={ROLE_OPTIONS} onChange={setRole} />
          </div>
          <div className={css.fieldGroup}>
            <label className={css.label}>Отдел</label>
            <CustomSelect
              value={department}
              options={departmentOptions}
              placeholder="Не назначен"
              onChange={(val) => {
                setDepartment(val)
                setIsAddingDept(false)
              }}
              footer={
                <button type="button" className={css.addOptionBtn} onClick={() => setIsAddingDept(true)}>
                  <Icon name="add" size={14} />
                  <span>Добавить отдел...</span>
                </button>
              }
            />
            {isAddingDept && (
              <AddDepartmentForm
                onAdd={(newDept) => {
                  setDepartment(newDept)
                  setIsAddingDept(false)
                }}
                onCancel={() => setIsAddingDept(false)}
              />
            )}
          </div>
          <div className={css.fieldGroup}>
            <label className={css.label}>Область данных</label>
            <div className={css.radioList}>
              <label className={css.radioLabel}>
                <input type="radio" name="scope" checked={scope === 'all'} onChange={() => setScope('all')} />
                <span>Полный доступ</span>
              </label>
              <label className={css.radioLabel}>
                <input
                  type="radio"
                  name="scope"
                  checked={scope === 'department'}
                  onChange={() => setScope('department')}
                />
                <span>Только группа / отдел</span>
              </label>
              <label className={css.radioLabel}>
                <input type="radio" name="scope" checked={scope === 'default'} onChange={() => setScope('default')} />
                <span>Только личные данные</span>
              </label>
            </div>
          </div>
          <div className={css.warningBox}>
            <Icon name="alert" size={18} className={css.warningIcon} />
            <span className={css.warningText}>
              {isDepartmentMissing
                ? 'Необходимо назначить отдел — без него пользователь не сможет загружать файлы'
                : 'Ограничение области данных сократит доступ к связанным графикам'}
            </span>
          </div>
        </div>
        <div className={css.modalFooter}>
          <button type="button" className={css.secondaryBtn} onClick={onClose}>
            Отмена
          </button>
          <button
            type="button"
            className={css.primaryBtn}
            onClick={handleSave}
            disabled={updateMutation.isPending || isDepartmentMissing}
          >
            {updateMutation.isPending ? (
              <>
                <Icon name="loader" size={16} className={css.spinner} />
                <span>Сохранение...</span>
              </>
            ) : (
              'Сохранить'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

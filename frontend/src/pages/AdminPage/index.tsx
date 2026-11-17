import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { adminApi } from '../../api/admin'
import type { UsersResponse } from '../../api/types'
import { EditPermissionsModal } from '../../components/EditPermissionsModal'
import { Icon } from '../../components/Icon'
import { withPageWrapper } from '../../components/PageWrapper'
import { handleApiError } from '../../utils/errors'
import css from './index.module.scss'

export const AdminPage = withPageWrapper({
  authorizedOnly: true,
  title: 'Администрирование',
  useQuery: () =>
    useQuery({
      queryKey: ['admin-users'],
      queryFn: () => adminApi.getAllUsers(),
    }),
  setProps: ({ queryResult }) => ({
    users: queryResult.data,
  }),
})(({ users }) => {
  const queryClient = useQueryClient()
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
  const [editingUser, setEditingUser] = useState<UsersResponse | null>(null)
  const deleteMutation = useMutation({
    mutationFn: (userId: number) => adminApi.deleteUser(userId),
    onSuccess: () => {
      toast.success('Пользователь удалён')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (error) => {
      handleApiError(error, 'Не удалось удалить пользователя')
    },
  })
  const availableDepartments = useMemo(() => {
    const set = new Set<string>()
    users.forEach((u) => {
      if (u.department?.trim()) {
        set.add(u.department.trim())
      }
    })
    return Array.from(set)
  }, [users])

  return (
    <div className={css.adminLayout}>
      <div className={css.headerBlock}>
        <h1 className={css.pageTitle}>Управление пользователями и доступом</h1>
        <span className={css.breadcrumbs}>Администрирование / Управление доступом</span>
      </div>
      <div className={css.tabsBar}>
        <button type="button" className={classNames(css.tabBtn, css.tabBtnActive)}>
          <Icon name="users" size={16} />
          <span>Пользователи и роли</span>
        </button>
      </div>
      <div className={css.card}>
        <table className={css.table}>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Отдел</th>
              <th>Область доступа</th>
              <th style={{ width: '80px', textAlign: 'right' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={css.userInfo}>
                    <div className={css.avatar}>{user.login[0]?.toUpperCase()}</div>
                    <div>
                      <div className={css.userName}>{user.login}</div>
                    </div>
                  </div>
                </td>
                <td className={css.emailCell}>{user.email}</td>
                <td>
                  <span
                    className={classNames({
                      [css.badgeAdmin]: user.role === 'admin',
                      [css.badgeUser]: user.role !== 'admin',
                    })}
                  >
                    {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                  </span>
                </td>
                <td>
                  <span
                    className={classNames({
                      [css.badgeDept]: !!user.department,
                      [css.badgeUnassigned]: !user.department,
                    })}
                  >
                    {user.department || 'Не назначен'}
                  </span>
                </td>
                <td>
                  <span className={css.badgeScope}>
                    {user.scope === 'all'
                      ? 'Полный доступ'
                      : user.scope === 'department'
                        ? 'Только отдел'
                        : 'Только свои файлы'}
                  </span>
                </td>
                <td className={css.actionsCell}>
                  <button
                    type="button"
                    className={css.menuBtn}
                    onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                  >
                    <Icon name="moreHorizontal" />
                  </button>
                  {activeMenuId === user.id && (
                    <div className={css.dropdownMenu}>
                      <button
                        type="button"
                        className={css.menuItem}
                        onClick={() => {
                          setEditingUser(user)
                          setActiveMenuId(null)
                        }}
                      >
                        <Icon name="edit" size={15} />
                        <span>Изменить</span>
                      </button>
                      <button
                        type="button"
                        className={classNames(css.menuItem, css.dangerItem)}
                        onClick={() => {
                          deleteMutation.mutate(user.id)
                          setActiveMenuId(null)
                        }}
                      >
                        <Icon name="trash" size={15} />
                        <span>Удалить</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingUser && (
        <EditPermissionsModal
          user={editingUser}
          existingDepartments={availableDepartments}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            toast.success('Права доступа обновлены')
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            setEditingUser(null)
          }}
        />
      )}
    </div>
  )
})

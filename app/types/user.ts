export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  department: Department
}

export type UserRole = 'Admin' | 'User' | 'Manager' | 'Developer' | 'Designer'
export type UserStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended'
export type Department = 'Engineering' | 'Sales' | 'Marketing' | 'HR' | 'Finance' | 'Operations'

export const USER_ROLES: readonly UserRole[] = ['Admin', 'User', 'Manager', 'Developer', 'Designer'] as const
export const USER_STATUSES: readonly UserStatus[] = ['Active', 'Inactive', 'Pending', 'Suspended'] as const
export const DEPARTMENTS: readonly Department[] = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'] as const
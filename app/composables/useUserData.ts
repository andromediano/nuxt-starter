import type { User } from '~/types/user'

export const useUserData = () => {
  const users = useState<User[]>('users', () => [])
  const loading = useState<boolean>('usersLoading', () => false)
  const error = useState<string | null>('usersError', () => null)

  const fetchUsers = async (): Promise<void> => {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockUsers: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', department: 'Engineering' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', department: 'Sales' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Developer', status: 'Active', department: 'Engineering' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Designer', status: 'Pending', department: 'Marketing' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Inactive', department: 'HR' },
      ]
      
      users.value = mockUsers
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  const addUser = (user: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...user,
      id: Math.max(...users.value.map(u => u.id), 0) + 1
    }
    users.value.push(newUser)
    return newUser
  }

  const updateUser = (id: number, updates: Partial<Omit<User, 'id'>>): boolean => {
    const index = users.value.findIndex(u => u.id === id)
    if (index === -1) return false
    
    users.value[index] = { ...users.value[index], ...updates } as User
    return true
  }

  const deleteUser = (id: number): boolean => {
    const index = users.value.findIndex(u => u.id === id)
    if (index === -1) return false
    
    users.value.splice(index, 1)
    return true
  }

  const deleteUsers = (ids: number[]): number => {
    const initialLength = users.value.length
    users.value = users.value.filter(user => !ids.includes(user.id))
    return initialLength - users.value.length
  }

  return {
    users: readonly(users),
    loading: readonly(loading),
    error: readonly(error),
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    deleteUsers
  }
}
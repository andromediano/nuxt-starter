<template>
  <div style="height: 500px; width: 100%;">
    <AgGridVue
      style="height: 500px; width: 100%;"
      :row-data="rowData"
      :column-defs="columnDefs"
      :default-col-def="defaultColDef"
      :theme="theme"
      :row-selection="rowSelectionOptions"
      @grid-ready="onGridReady"
      @cell-value-changed="onCellValueChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import type { 
  GridApi, 
  ColDef, 
  CellValueChangedEvent, 
  GridReadyEvent,
  CellClassParams,
  ValueFormatterParams,
  RowSelectionOptions
} from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import type { User, UserStatus } from '~/types/user'
import { USER_ROLES, USER_STATUSES, DEPARTMENTS } from '~/types/user'

const gridApi = ref<GridApi | undefined>()
const rowData = ref<User[]>([])
const theme = themeQuartz
const rowSelectionOptions: RowSelectionOptions<User> = { 
  mode: 'multiRow' as const,
  checkboxes: true,
  headerCheckbox: true
}

const getStatusCellClass = (params: CellClassParams<User>): string => {
  const statusClasses: Record<UserStatus, string> = {
    'Active': 'text-green-600',
    'Suspended': 'text-red-600',
    'Pending': 'text-yellow-600',
    'Inactive': 'text-gray-600'
  }
  return statusClasses[params.value as UserStatus] || ''
}

const columnDefs = computed<ColDef<User>[]>(() => [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 70,
    editable: false,
    sortable: true,
    filter: 'agNumberColumnFilter'
  },
  { 
    field: 'name', 
    headerName: 'Name',
    editable: true,
    width: 150,
    filter: 'agTextColumnFilter'
  },
  { 
    field: 'email', 
    headerName: 'Email',
    editable: true,
    width: 200,
    filter: 'agTextColumnFilter',
    valueFormatter: (params: ValueFormatterParams<User>) => {
      return params.value?.toLowerCase() || ''
    }
  },
  { 
    field: 'role', 
    headerName: 'Role',
    editable: true,
    width: 130,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: USER_ROLES
    },
    filter: 'agTextColumnFilter',
    filterParams: {
      textCustomComparator: (filter: string, value: string, filterText: string) => {
        return value.toLowerCase().includes(filterText.toLowerCase())
      }
    }
  },
  { 
    field: 'status', 
    headerName: 'Status',
    editable: true,
    width: 120,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: USER_STATUSES
    },
    cellClass: getStatusCellClass,
    filter: 'agTextColumnFilter',
    filterParams: {
      textCustomComparator: (filter: string, value: string, filterText: string) => {
        return value.toLowerCase().includes(filterText.toLowerCase())
      }
    }
  },
  { 
    field: 'department', 
    headerName: 'Department',
    editable: true,
    width: 150,
    cellEditor: 'agSelectCellEditor',
    cellEditorParams: {
      values: DEPARTMENTS
    },
    filter: 'agTextColumnFilter',
    filterParams: {
      textCustomComparator: (filter: string, value: string, filterText: string) => {
        return value.toLowerCase().includes(filterText.toLowerCase())
      }
    }
  }
])

const defaultColDef = computed<ColDef>(() => ({
  sortable: true,
  filter: true,
  resizable: true,
  floatingFilter: false
}))

const onGridReady = (params: GridReadyEvent<User>): void => {
  gridApi.value = params.api
  loadInitialData()
}

const onCellValueChanged = (event: CellValueChangedEvent<User>): void => {
  if (!event.colDef?.field) return
  
  console.log('Cell value changed:', {
    field: event.colDef.field,
    oldValue: event.oldValue,
    newValue: event.newValue,
    rowIndex: event.rowIndex,
    data: event.data
  })
  
  handleDataUpdate(event.data)
}

const handleDataUpdate = (updatedUser: User | undefined): void => {
  if (!updatedUser) return
  
  console.log('Updating user:', updatedUser)
}

const loadInitialData = (): void => {
  const mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active', department: 'Sales' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Developer', status: 'Active', department: 'Engineering' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Designer', status: 'Pending', department: 'Marketing' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Inactive', department: 'HR' },
    { id: 6, name: 'Diana Martinez', email: 'diana@example.com', role: 'Developer', status: 'Active', department: 'Engineering' },
    { id: 7, name: 'Edward Lee', email: 'edward@example.com', role: 'Manager', status: 'Active', department: 'Finance' },
    { id: 8, name: 'Fiona Clark', email: 'fiona@example.com', role: 'Admin', status: 'Suspended', department: 'Operations' },
    { id: 9, name: 'George Adams', email: 'george@example.com', role: 'User', status: 'Active', department: 'Sales' },
    { id: 10, name: 'Helen Taylor', email: 'helen@example.com', role: 'Designer', status: 'Active', department: 'Marketing' }
  ]
  
  rowData.value = mockUsers
}

const addNewUser = (): void => {
  const newUser: User = {
    id: rowData.value.length + 1,
    name: 'New User',
    email: 'newuser@example.com',
    role: 'User',
    status: 'Pending',
    department: 'HR'
  }
  
  rowData.value = [...rowData.value, newUser]
}

const deleteSelectedRows = (): void => {
  if (!gridApi.value) return
  
  const selectedRows = gridApi.value.getSelectedRows()
  if (selectedRows.length === 0) {
    alert('Please select rows to delete')
    return
  }
  
  rowData.value = rowData.value.filter(user => 
    !selectedRows.some(selected => selected.id === user.id)
  )
}

const exportToCSV = (): void => {
  if (!gridApi.value) return
  
  gridApi.value.exportDataAsCsv({
    fileName: `users_${new Date().toISOString().split('T')[0]}.csv`
  })
}

defineExpose({
  addNewUser,
  deleteSelectedRows,
  exportToCSV
})

onMounted(() => {
  console.log('UserGrid component mounted')
})
</script>

<style scoped>
.text-green-600 {
  color: #16a34a;
  font-weight: 600;
}

.text-red-600 {
  color: #dc2626;
  font-weight: 600;
}

.text-yellow-600 {
  color: #ca8a04;
  font-weight: 600;
}

.text-gray-600 {
  color: #4b5563;
  font-weight: 600;
}
</style>
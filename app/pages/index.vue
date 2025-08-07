<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">사용자 목록 - AG Grid Example</h1>
    
    <div class="mb-4 p-4 bg-blue-50 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">기능 설명:</h2>
      <ul class="list-disc list-inside space-y-1 text-sm">
        <li>셀을 더블클릭하여 편집 모드로 전환</li>
        <li>Role, Status, Department 컬럼은 SelectBox로 선택 가능</li>
        <li>Status에 따라 색상이 다르게 표시됨 (Active: 초록, Suspended: 빨강, Pending: 노랑, Inactive: 회색)</li>
        <li>모든 컬럼은 정렬, 필터링, 크기 조절 가능</li>
        <li>컬럼 헤더 메뉴에서 필터링 가능</li>
      </ul>
    </div>

    <div class="mb-4 flex gap-2">
      <button 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        @click="handleAddUser"
      >
        사용자 추가
      </button>
      <button 
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        @click="handleDeleteSelected"
      >
        선택 삭제
      </button>
      <button 
        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        @click="handleExportCSV"
      >
        CSV 내보내기
      </button>
    </div>

    <UserGrid ref="userGridRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

interface UserGridMethods {
  addNewUser: () => void
  deleteSelectedRows: () => void
  exportToCSV: () => void
}

const userGridRef = ref<ComponentPublicInstance & UserGridMethods>()

const handleAddUser = (): void => {
  if (userGridRef.value) {
    userGridRef.value.addNewUser()
  }
}

const handleDeleteSelected = (): void => {
  if (userGridRef.value) {
    userGridRef.value.deleteSelectedRows()
  }
}

const handleExportCSV = (): void => {
  if (userGridRef.value) {
    userGridRef.value.exportToCSV()
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
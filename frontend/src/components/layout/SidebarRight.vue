<script setup lang="ts">
// 定义 task 类型
type Task = {
  id: number
  title: string
  status: string
  description?: string
  dueDate?: string
}

// 接收父组件传来的当前选中任务
defineProps<{
  selectedTask: Task | null
}>()
</script>

<template>
  <!-- 右侧详情区域 -->
  <aside class="w-72 border-l bg-white p-6">
    <h2 class="text-xl font-bold">Task Detail</h2>

    <!-- 没有选中任务时 -->
    <div v-if="!selectedTask" class="mt-6 text-gray-400">
      请选择一个任务查看详情
    </div>

    <!-- 有选中任务时 -->
    <div v-else class="mt-6 space-y-4">
      <!-- 任务标题 -->
      <div>
        <p class="text-sm text-gray-500">Title</p>
        <p class="mt-1 font-medium">{{ selectedTask.title }}</p>
      </div>

      <!-- 任务状态 -->
      <div>
        <p class="text-sm text-gray-500">Status</p>
        <p class="mt-1">{{ selectedTask.status }}</p>
      </div>

      <!-- 任务描述 -->
      <div>
        <p class="text-sm text-gray-500">Description</p>
        <p class="mt-1">
          {{ selectedTask.description || 'No description' }}
        </p>
      </div>

      <!-- 截止日期 -->
      <div>
        <p class="text-sm text-gray-500">Due date</p>
        <p class="mt-1">
          {{ selectedTask.dueDate || 'No due date' }}
        </p>
      </div>
    </div>
  </aside>
</template>
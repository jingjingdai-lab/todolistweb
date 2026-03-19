<script setup lang="ts">
import { computed, ref } from 'vue'
import SidebarLeft from '@/components/layout/SidebarLeft.vue'
import MainContent from '@/components/layout/MainContent.vue'
import SidebarRight from '@/components/layout/SidebarRight.vue'

// list 类型
type TaskList = {
  id: number
  name: string
}

// task 類型
type Task = {
  id: number
  title: string
  status: 'TODO' | 'DONE'
  description?: string
  dueDate: string
}

// 所有 task 資料放在 MainView
// 用 listId 當 key，對應每個 list 的 task
const taskMap = ref<Record<number, Task[]>>({
  1: [
    {
      id: 1,
      title: 'Finish technical test',
      status: 'TODO',
      description: 'Complete the main page and interactions',
      dueDate: '2026-03-20',
    },
    {
      id: 2,
      title: 'Prepare meeting notes',
      status: 'DONE',
      description: 'Summarize key discussion points',
      dueDate: '2026-03-18',
    },
  ],
  2: [
    {
      id: 3,
      title: 'Buy groceries',
      status: 'TODO',
      description: 'Milk, eggs, bread and vegetables',
      dueDate: '2026-03-19',
    },
    {
      id: 4,
      title: 'Clean the room',
      status: 'TODO',
      description: 'Organize desk and vacuum the floor',
      dueDate: '2026-03-21',
    },
  ],
  3: [
    {
      id: 5,
      title: 'Review Vue basics',
      status: 'DONE',
      description: 'Go through props, emits and computed',
      dueDate: '2026-03-17',
    },
    {
      id: 6,
      title: 'Practice TypeScript',
      status: 'TODO',
      description: 'Define component prop types clearly',
      dueDate: '2026-03-22',
    },
  ],
})

// 左侧假数据
const lists = ref<TaskList[]>([
  { id: 1, name: 'Work' },
  { id: 2, name: 'Personal' },
  { id: 3, name: 'Study' },
])

// 當前選中的 list id
const selectedListId = ref<number | null>(null)

// 當前選中的 task
const selectedTask = ref<Task | null>(null)

// 根據 id 算出目前選中的 list
const selectedList = computed(() => {
  return lists.value.find((list) => list.id === selectedListId.value) ?? null
})

// 根據目前選中的 list，算出它的 tasks
const currentTasks = computed(() => {
  if (!selectedListId.value) return []
  return taskMap.value[selectedListId.value] ?? []
})


// 点击左侧 list
function handleSelectList(listId: number) {
  selectedListId.value = listId

  // 切换 list 时，右侧 task detail 要清空
  selectedTask.value = null
}

// 点击中间 task
function handleSelectTask(task: Task) {
  selectedTask.value = task
}

function handleToggleTaskStatus(taskId: number) {
  // 沒選 list 時，不做任何事
  if (!selectedListId.value) return

  // 取出當前 list 的 task 陣列
  const tasks = taskMap.value[selectedListId.value]
  if (!tasks) return

  // 找到被點擊的 task
  const targetTask = tasks.find((task) => task.id === taskId)
  if (!targetTask) return

  // TODO <-> DONE 切換
  targetTask.status = targetTask.status === 'TODO' ? 'DONE' : 'TODO'

  // 如果右側正在顯示這個 task，也同步更新 selectedTask
  if (selectedTask.value && selectedTask.value.id === taskId) {
    selectedTask.value = { ...targetTask }
  }
}




</script>



<template>
  <!-- 三栏整体布局 -->
  <div class="flex h-screen bg-white text-black">
    <!-- 左侧 -->
    <SidebarLeft
      :lists="lists"
      :selected-list-id="selectedListId"
      @select-list="handleSelectList"
    />

    <!-- 中间 -->
    <MainContent
      :selected-list="selectedList"
      :tasks="currentTasks"
      :selected-task-id="selectedTask?.id ?? null"
      @select-task="handleSelectTask"
      @toggle-task-status="handleToggleTaskStatus"
    />
    <!-- 右侧 -->
    <SidebarRight :selected-task="selectedTask" />
  </div>
</template>
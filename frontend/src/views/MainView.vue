<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SidebarLeft from '@/components/layout/SidebarLeft.vue'
import MainContent from '@/components/layout/MainContent.vue'
import SidebarRight from '@/components/layout/SidebarRight.vue'
import axios from 'axios'

onMounted(async () => {
  const tasksRes = await axios.get('http://localhost:3000/tasks')
  taskMap.value = tasksRes.data

  const listsRes = await axios.get('http://localhost:3000/lists')
  lists.value = listsRes.data
})


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

const taskMap = ref([])
const lists = ref([])
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

async function createList() {
  const name = prompt('List name?')
  if (!name) return

  await axios.post('http://localhost:3000/lists', {
    name,
  })

  // 重新加载 lists
  const res = await axios.get('http://localhost:3000/lists')
  lists.value = res.data
}

async function deleteList(listId: number) {
  await axios.delete(`http://localhost:3000/lists/${listId}`)

  const res = await axios.get('http://localhost:3000/lists')
  lists.value = res.data

  // 可选：如果删的是当前选中的 list
  if (selectedListId.value === listId) {
    selectedListId.value = null
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
      @create-list="createList"
      @delete-list="deleteList"
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
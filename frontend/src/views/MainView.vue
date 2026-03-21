<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SidebarLeft from '@/components/layout/SidebarLeft.vue'
import MainContent from '@/components/layout/MainContent.vue'
import SidebarRight from '@/components/layout/SidebarRight.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

onMounted(async () => {
  try {
    console.log('准备获取 lists')
    console.log('headers =', getAuthHeaders())

    const res = await axios.get('http://localhost:3000/lists', {
      headers: getAuthHeaders(),
    })

    console.log('lists res =', res.data)
    lists.value = res.data

    if (lists.value.length > 0) {
      selectedListId.value = lists.value[0].id
    }

    await fetchTasks()
  } catch (error) {
    console.error('获取 lists 失败：', error)
  }
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
  dueDate?: string
  taskList?: {
    id: number
  }
  createdAt?: string   // 加这一行
}

const tasks = ref<Task[]>([])
const lists = ref<TaskList[]>([])
const newTaskTitle = ref('')
const newTaskShortDescription = ref('')
const newTaskDescription = ref('')
const newTaskDueDate = ref('')

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
  if (selectedListId.value === null) return []

  return tasks.value.filter(task => task.taskList?.id === selectedListId.value)
})


//logout
const router = useRouter()

//绑定
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')

  return {
    Authorization: `Bearer ${token}`,
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

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

async function handleToggleTaskStatus(taskId: number) {
  try {
    await axios.patch(`http://localhost:3000/tasks/${taskId}/toggle`)
    await fetchTasks()

    if (selectedTask.value && selectedTask.value.id === taskId) {
      const updatedTask = tasks.value.find(task => task.id === taskId) ?? null
      selectedTask.value = updatedTask
    }
  } catch (error) {
    console.error('Failed to toggle task status:', error)
    alert('Failed to update task status.')
  }
}

async function createList() {
  const name = prompt('List name?')
  if (!name) return

  await axios.post(
  'http://localhost:3000/lists',
      {
        name,
      },
      {
        headers: getAuthHeaders(),
      }
    )

    const res = await axios.get('http://localhost:3000/lists', {
      headers: getAuthHeaders(),
    })
    lists.value = res.data
}

async function fetchTasks() {
  const res = await axios.get('http://localhost:3000/tasks', {
    headers: getAuthHeaders(),
  })
  tasks.value = res.data
}

async function addTask() {
  console.log('addTask triggered')
  console.log('newTaskTitle =', newTaskTitle.value)
  console.log('selectedListId =', selectedListId.value)

  if (!newTaskTitle.value.trim() || selectedListId.value === null) {
    console.log('blocked by validation')
    return
  }

  try {
    const res = await axios.post('http://localhost:3000/tasks', {
      title: newTaskTitle.value,
      shortDescription: newTaskShortDescription.value,
      description: newTaskDescription.value,
      dueDate: newTaskDueDate.value,
      taskListId: selectedListId.value,
    })

    console.log('POST success:', res.data)

    newTaskTitle.value = ''
    newTaskShortDescription.value = ''
    newTaskDescription.value = ''
    newTaskDueDate.value = ''

    await fetchTasks()
    console.log('tasks after refresh:', tasks.value)
  } catch (error) {
    console.error('Failed to add task:', error)
    alert('Failed to add task.')
  }
}



async function deleteList(listId: number) {
  const confirmed = window.confirm('Are you sure you want to delete this list?')
  if (!confirmed) return

  try {
    await axios.delete(`http://localhost:3000/lists/${listId}`, {
      headers: getAuthHeaders(),
    })

    const res = await axios.get('http://localhost:3000/lists', {
      headers: getAuthHeaders(),
    })
    lists.value = res.data

    if (selectedListId.value === listId) {
      selectedListId.value = null
      selectedTask.value = null
    }
  } catch (error) {
    console.error('Failed to delete list:', error)
    alert('Failed to delete the list.')
  }
}

async function deleteTask(taskId: number) {
  const confirmed = window.confirm('Are you sure you want to delete this task?')
  if (!confirmed) return

  try {
    await axios.delete(`http://localhost:3000/tasks/${taskId}`)
    await fetchTasks()

    if (selectedTask.value && selectedTask.value.id === taskId) {
      selectedTask.value = null
    }
  } catch (error) {
    console.error('Failed to delete task:', error)
    alert('Failed to delete task.')
  }
}

function handleNewTaskTitle(value: string) {
  console.log('parent received:', value)
  newTaskTitle.value = value
}

function handleNewTaskShortDescription(value: string) {
  newTaskShortDescription.value = value
}

function handleNewTaskDescription(value: string) {
  newTaskDescription.value = value
}

function handleNewTaskDueDate(value: string) {
  newTaskDueDate.value = value
}

</script>



<template>
  <!-- 三栏整体布局 -->
  <div class="flex h-screen bg-white text-black">

    <button
      @click="handleLogout"
      class="absolute right-6 top-6 z-50 rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-90"
    >
      Logout
    </button>

      <!-- 左侧 -->
    <SidebarLeft
      :lists="lists"
      :selected-list-id="selectedListId"
      @select-list="handleSelectList"
      @create-list="createList"
      @delete-list="deleteList"
    />

    <MainContent
      :selected-list="selectedList"
      :tasks="currentTasks"
      :selected-task-id="selectedTask?.id ?? null"
      :new-task-title="newTaskTitle"
      :new-task-short-description="newTaskShortDescription"
      :new-task-description="newTaskDescription"
      :new-task-due-date="newTaskDueDate"
      @select-task="handleSelectTask"
      @toggle-task-status="handleToggleTaskStatus"
      @update:new-task-title="handleNewTaskTitle"
      @update:new-task-short-description="handleNewTaskShortDescription"
      @update:new-task-description="handleNewTaskDescription"
      @update:new-task-due-date="handleNewTaskDueDate"
      @add-task="addTask"
      @delete-task="deleteTask"
    />
    <!-- 右侧 -->
    <SidebarRight :selected-task="selectedTask" />
  </div>
</template>
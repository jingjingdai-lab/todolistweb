<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SidebarLeft from '@/components/layout/SidebarLeft.vue'
import MainContent from '@/components/layout/MainContent.vue'
import SidebarRight from '@/components/layout/SidebarRight.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'


// ---------- Types ----------
// Type for a task list (left sidebar)
type TaskList = {
  id: number
  name: string
}

// Type for a task (main content + detail panel)
type Task = {
  id: number
  title: string
  shortDescription?: string
  description?: string | null
  dueDate?: string
  status: 'TODO' | 'DONE'
  taskList?: {
    id: number
  }
  createdAt?: string
}


// ---------- Reactive state (ref) ----------
// Modal state for creating a new list
const showCreateListModal = ref(false)  // Controls whether the modal is visible
const newListName = ref('')             // Input value for the new list name
const listModalError = ref('')          // Error message displayed in the modal

// Data fetched from backend
const tasks = ref<Task[]>([])           // All tasks returned from API
const lists = ref<TaskList[]>([])       // All task lists

// Form state for creating a new task
const newTaskTitle = ref('')             
const newTaskShortDescription = ref('')
const newTaskDescription = ref('')
const newTaskDueDate = ref('')

// Current selection state
const selectedListId = ref<number | null>(null)
const selectedTask = ref<Task | null>(null)



// ---------- Computed ----------
// The currently selected list object
const selectedList = computed(() => {
  return lists.value.find((list) => list.id === selectedListId.value) ?? null
})

// Tasks that belong to the currently selected list
const currentTasks = computed(() => {
  if (selectedListId.value === null) return []
  return tasks.value.filter(task => task.taskList?.id === selectedListId.value)
})


// ---------- Lifecycle ----------
// Fetch initial data when the page is mounted
onMounted(async () => {
  try {
    // Load all lists
    await fetchLists()

    // Select the first list by default if available
    if (lists.value.length > 0 && lists.value[0]) {
      selectedListId.value = lists.value[0].id
    }

    // Load tasks after initialization
    await fetchTasks()
  } catch (error) {
    console.error('Failed to fetch initial data:', error)
  }
})

// ---------- Auth / Session ----------
const router = useRouter()   // Router instance for navigation

// Helper function to generate Authorization headers for API requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')

  return {
    Authorization: `Bearer ${token}`,
  }
}
// Logout handler: remove token and redirect user to login page
const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

// Current user information stored in localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}')

// Current user information stored in localStorage
const userInitial = computed(() => {
  const first = user.firstName?.charAt(0)?.toUpperCase() || ''
  const last = user.lastName?.charAt(0)?.toUpperCase() || ''
  return first + last || 'U'
})



// ---------- Data fetching ----------
// Fetch all lists from backend
async function fetchLists() {
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/lists`, {
  headers: getAuthHeaders(),
})
  lists.value = res.data
}
// Fetch all tasks from backend
async function fetchTasks() {
const res = await axios.get(
  `${import.meta.env.VITE_API_BASE_URL}/tasks`,
  {
    headers: getAuthHeaders(),
  })
  tasks.value = res.data
}


// ---------- List actions ----------
// Update the currently selected list
function handleSelectList(listId: number) {
  selectedListId.value = listId
  selectedTask.value = null  // Clear selected task when switching to another list
}

// Open the modal for creating a new list
function createList() {
  newListName.value = ''
  listModalError.value = ''
  showCreateListModal.value = true
}

// Submit a new list to the backend
async function submitCreateList() {
  // Prevent empty list name
  if (!newListName.value.trim()) {
    listModalError.value = 'Please enter a list name.'
    return
  }

  try {
    // Create the new list
    await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/lists`,
        {
          name: newListName.value.trim(),
        },
        {
          headers: getAuthHeaders(),
        }
      )
    // Refresh list data after creation
    await fetchLists()
    
    // Reset modal state
    showCreateListModal.value = false
    newListName.value = ''
    listModalError.value = ''

  } catch (error: any) {
    console.error('Create list error:', error)
    listModalError.value =
      error?.response?.data?.message || 'Failed to create list'
  }
}

// Delete a list after confirmation
async function deleteList(listId: number) {
  const confirmed = window.confirm('Are you sure you want to delete this list?')
  if (!confirmed) return

  try {
    await axios.delete(
  `${import.meta.env.VITE_API_BASE_URL}/lists/${listId}`,
  {
      headers: getAuthHeaders(),
    })
    
    // Refresh lists after deletion
    await fetchLists()

    // Clear selection if the deleted list was selected
    if (selectedListId.value === listId) {
      selectedListId.value = null
      selectedTask.value = null
    }
  } catch (error) {
    console.error('Failed to delete list:', error)
    alert('Failed to delete the list.')
  }
}

// ---------- Task actions ----------
// Update the currently selected task
function handleSelectTask(task: Task) {
  selectedTask.value = task
}

// Create a new task
async function addTask() {
  
  // Prevent empty title or missing list selection
  if (!newTaskTitle.value.trim() || selectedListId.value === null) {
    console.log('blocked by validation')
    return
  }

  try {
     // Send new task data to backend
    const res = await axios.post(
  `${import.meta.env.VITE_API_BASE_URL}/tasks`,
  {
      title: newTaskTitle.value,
      shortDescription: newTaskShortDescription.value,
      description: newTaskDescription.value,
      dueDate: newTaskDueDate.value,
      taskListId: selectedListId.value,
    })

    // Reset form fields after creation
    newTaskTitle.value = ''
    newTaskShortDescription.value = ''
    newTaskDescription.value = ''
    newTaskDueDate.value = ''

    await fetchTasks()
  } catch (error) {
    console.error('Failed to add task:', error)
    alert('Failed to add task.')
  }
}

// Delete a task after confirmation
async function deleteTask(taskId: number) {
  const confirmed = window.confirm('Are you sure you want to delete this task?')
  if (!confirmed) return

  try {
    await axios.delete(
  `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`
)
    await fetchTasks()
    
     // Clear selected task if needed
    if (selectedTask.value && selectedTask.value.id === taskId) {
      selectedTask.value = null
    }
  } catch (error) {
    console.error('Failed to delete task:', error)
    alert('Failed to delete task.')
  }
}


// Toggle task status between TODO and DONE
async function handleToggleTaskStatus(taskId: number) {
  try {
    await axios.patch(
  `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}/toggle`
)
    await fetchTasks()
    
    // Update selected task if it is the one being modified
    if (selectedTask.value && selectedTask.value.id === taskId) {
      const updatedTask = tasks.value.find(task => task.id === taskId) ?? null
      selectedTask.value = updatedTask
    }
  } catch (error) {
    console.error('Failed to toggle task status:', error)
    alert('Failed to update task status.')
  }
}


// Computed initials for user avatar (e.g., "JD")
// ---------- Form handlers ----------
function handleNewTaskTitle(value: string) {
  console.log('parent received:', value)
  newTaskTitle.value = value
}

// Update short description input
function handleNewTaskShortDescription(value: string) {
  newTaskShortDescription.value = value
}

// Update short description input
function handleNewTaskDescription(value: string) {
  newTaskDescription.value = value
}

// Update detailed description input
function handleNewTaskDueDate(value: string) {
  newTaskDueDate.value = value
}
</script>



<template>
  <div class="flex h-screen bg-gray-50 text-black overflow-hidden">
    <!-- LEFT -->
    <SidebarLeft
      :lists="lists"
      :selected-list-id="selectedListId"
      @select-list="handleSelectList"
      @create-list="createList"
      @delete-list="deleteList"
    />

    <!-- MIDDLE -->
    <div class="flex-1 overflow-auto bg-white px-8 py-6">
      <h1 class="mb-6 text-3xl font-bold">My Tasks</h1>

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
    </div>

    <!-- RIGHT -->
    <div class="flex w-80 flex-col border-l bg-white">
      <!-- Area of user -->
      <div class="flex items-center justify-end gap-3 border-b px-4 py-4">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white"
        >
          {{ userInitial }}
        </div>

        <button
          @click="handleLogout"
          class="rounded-md bg-black px-4 py-2 text-sm text-white hover:opacity-90"
        >
          Logout
        </button>
      </div>

      <!-- Area of discription -->
      <div class="flex-1 overflow-hidden">
        <SidebarRight
          :selected-task="selectedTask"
          @delete-task="deleteTask"
        />
      </div>
    </div>

    <!-- Create List Modal -->
    <div
      v-if="showCreateListModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
    >
      <div class="w-[400px] rounded-lg bg-white p-6 shadow-lg">
        <h3 class="mb-4 text-lg font-bold">New List</h3>

        <form class="space-y-3" @submit.prevent="submitCreateList">
          <p v-if="listModalError" class="text-sm text-red-500">
            {{ listModalError }}
          </p>

          <input
            v-model="newListName"
            type="text"
            placeholder="List name"
            class="w-full rounded-md border px-3 py-2"
          />

          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="rounded-md border px-3 py-1"
              @click="showCreateListModal = false"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="rounded-md bg-black px-4 py-2 text-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
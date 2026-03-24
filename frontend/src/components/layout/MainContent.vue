<script setup lang="ts">
import { computed, ref } from 'vue'


// ---------- Types ---------

// Type for a task list
type TaskList = {
  id: number
  name: string
}

// Type for a task
type Task = {
  id: number
  title: string
  shortDescription?: string | null
  description?: string | null
  dueDate?: string | null
  status: 'TODO' | 'DONE'
  taskList?: {
    id: number
  }
}

// ---------- Props ----------
const props = defineProps<{
  selectedList: TaskList | null
  tasks: Task[]
  selectedTaskId: number | null
  newTaskTitle: string
  newTaskShortDescription: string
  newTaskDescription: string
  newTaskDueDate: string
}>()

// ---------- Emits ----------
const emit = defineEmits<{
  (e: 'select-task', task: Task): void
  (e: 'toggle-task-status', taskId: number): void
  (e: 'update:new-task-title', value: string): void
  (e: 'update:new-task-short-description', value: string): void
  (e: 'update:new-task-description', value: string): void
  (e: 'update:new-task-due-date', value: string): void
  (e: 'add-task'): void
  (e: 'delete-task', taskId: number): void
}>()



// ---------- Local state ----------

// Controls whether the completed tasks section is expanded
const showCompleted = ref(false)

// Controls whether the task creation form is visible
const showForm = ref(false)

// Local error message for task form validation
const formError = ref('')

// Minimum allowed due date (today)
const minDueDate = new Date().toISOString().split('T')[0]


// ---------- Computed ----------
// Tasks that are still in TODO status
const todoTasks = computed(() => {
  return props.tasks.filter((task) => task.status === 'TODO')
})

// Tasks that are still in TODO status
const doneTasks = computed(() => {
  return props.tasks.filter((task) => task.status === 'DONE')
})



// ---------- Handlers ----------
function handleTaskClick(task: Task) {
  emit('select-task', task)
}

// Notify parent to toggle task status
function handleToggleStatus(taskId: number) {
  emit('toggle-task-status', taskId)
}

// Validate form and notify parent to create a task
function handleAddTask() {
    const title = props.newTaskTitle.trim()
    const shortDescription = props.newTaskShortDescription.trim()
    const dueDate = props.newTaskDueDate

    formError.value = ''

    if (!title) {
      formError.value = 'Title is required.'
      return
    }

    if (!shortDescription) {
      formError.value = 'Short description is required.'
      return
    }

    if (!dueDate) {
      formError.value = 'Due date is required.'
      return
    }

    if (minDueDate && dueDate < minDueDate) {
      formError.value = 'Due date cannot be earlier than today.'
      return
    }

    emit('add-task')
    showForm.value = false
  }

// Toggle the visibility of completed tasks
function toggleCompleted() {
  showCompleted.value = !showCompleted.value
}

</script>



<template>
  <main class="flex-1 p-6">
    <div v-if="!selectedList" class="mt-10 text-center text-gray-400">
      No items to display
    </div>

    <!-- Content displayed when a list is selected -->
    <div v-else>
      <h2 class="mb-4 text-2xl font-bold">
        {{ selectedList.name }}
      </h2>
      
      <!-- Button to open the task creation form -->
      <div class="mb-6">
        <button
          class="rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
          @click="showForm = true"
        >
          + Add Task
        </button>
      </div>

      <!-- TODO tasks section -->
      <ul class="space-y-3">
        <li
          v-for="task in todoTasks"
          :key="task.id"
          class="rounded-md border p-4 transition"
          :class="
            selectedTaskId === task.id
              ? 'border-black bg-gray-100'
              : 'border-gray-200'
          "
        >
          <div class="flex items-center justify-between gap-4">
            <div
              class="flex-1 cursor-pointer"
              @click="handleTaskClick(task)"
            >
              <p class="font-medium">{{ task.title }}</p>
              <p class="mt-1 text-sm text-gray-500">
                {{ task.status }}
              </p>
            </div>

            <!-- Right side: action buttons -->
            <div class="flex gap-2">
              <button
                type="button"
                class="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                @click="handleToggleStatus(task.id)"
              >
                Mark Done
              </button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Header for completed tasks section -->
      <div class="mt-6 border-t pt-4">
        <button
          class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
          @click="toggleCompleted"
        >
          <span>{{ showCompleted ? '▼' : '▶' }}</span>
          <span>My completed tasks ({{ doneTasks.length }})</span>
        </button>
      </div>

      <!-- Completed tasks section (collapsed by default) -->
      <ul v-if="showCompleted" class="mt-3 space-y-3">
        <li
          v-for="task in doneTasks"
          :key="task.id"
          class="rounded-md border p-4 transition opacity-70"
          :class="
            selectedTaskId === task.id
              ? 'border-black bg-gray-100'
              : 'border-gray-200'
          "
        >
          <div class="flex items-center justify-between gap-4">
            <div
              class="flex-1 cursor-pointer"
              @click="handleTaskClick(task)"
            >
              <p class="font-medium line-through">{{ task.title }}</p>
              <p class="mt-1 text-sm text-gray-500">
                {{ task.status }}
              </p>
            </div>

            <div class="flex gap-2">
              <button
                type="button"
                class="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                @click="handleToggleStatus(task.id)"
              >
                Mark Todo
              </button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Modal for creating a new task -->
      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      >
        <div class="w-[400px] rounded-lg bg-white p-6 shadow-lg">
          <h3 class="mb-4 text-lg font-bold">New Task</h3>

          <form class="space-y-3" @submit.prevent="handleAddTask">
            <p v-if="formError" class="text-sm text-red-500">
              {{ formError }}
            </p>

            <input
              :value="props.newTaskTitle"
              type="text"
              placeholder="Title"
              class="w-full rounded-md border px-3 py-2"
              required
              @input="emit('update:new-task-title', ($event.target as HTMLInputElement).value)"
            />

            <input
              :value="props.newTaskShortDescription"
              type="text"
              placeholder="Short description"
              class="w-full rounded-md border px-3 py-2"
              required
              @input="emit('update:new-task-short-description', ($event.target as HTMLInputElement).value)"
            />

            <textarea
              :value="props.newTaskDescription"
              placeholder="Long description"
              rows="3"
              class="w-full rounded-md border px-3 py-2"
              @input="emit('update:new-task-description', ($event.target as HTMLTextAreaElement).value)"
            />

            <input
              :value="props.newTaskDueDate"
              type="date"
              :min="minDueDate"
              class="w-full rounded-md border px-3 py-2"
              required
              @input="emit('update:new-task-due-date', ($event.target as HTMLInputElement).value)"
            />

            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="rounded-md border px-3 py-1"
                @click="showForm = false"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="rounded-md bg-black px-4 py-2 text-white"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
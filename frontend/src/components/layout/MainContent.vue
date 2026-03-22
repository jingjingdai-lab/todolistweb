<script setup lang="ts">
import { computed, ref } from 'vue'


// 定义 list 类型
type TaskList = {
  id: number
  name: string
}

// 定义 task 类型
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

// 接收父組件傳來的資料
const props = defineProps<{
  selectedList: TaskList | null
  tasks: Task[]
  selectedTaskId: number | null
  newTaskTitle: string
  newTaskShortDescription: string
  newTaskDescription: string
  newTaskDueDate: string
}>()

// 向父組件發送事件
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



// 控制已完成区是否展开（默认收起）
const showCompleted = ref(false)


// TODO 任务
const todoTasks = computed(() => {
  return props.tasks.filter((task) => task.status === 'TODO')
})

// DONE 任务
const doneTasks = computed(() => {
  return props.tasks.filter((task) => task.status === 'DONE')
})

//是否显示增加表单
const showForm = ref(false)

const formError = ref('')

const minDueDate = new Date().toISOString().split('T')[0]

// 点击任务时，通知父组件
function handleTaskClick(task: Task) {
  emit('select-task', task)
}

// 點擊狀態按鈕：切換 TODO / DONE
function handleToggleStatus(taskId: number) {
  emit('toggle-task-status', taskId)
}



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

    if (dueDate < minDueDate) {
      formError.value = 'Due date cannot be earlier than today.'
      return
    }

    emit('add-task')
    showForm.value = false
  }


function toggleCompleted() {
  showCompleted.value = !showCompleted.value
}

function handleDeleteTask(taskId: number) {
  emit('delete-task', taskId)
}

</script>

<template>
  <main class="flex-1 p-6">
    <!-- 沒選 list 時 -->
    <div v-if="!selectedList" class="mt-10 text-center text-gray-400">
      No items to display
    </div>

    <!-- 有選 list 時 -->
    <div v-else>
      <h2 class="mb-4 text-2xl font-bold">
        {{ selectedList.name }}
      </h2>

      <div class="mb-6">
        <button
          class="rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
          @click="showForm = true"
        >
          + Add Task
        </button>
      </div>

      <!-- TODO 區 -->
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
            <!-- 左邊區塊：點擊後選中 task -->
            <div
              class="flex-1 cursor-pointer"
              @click="handleTaskClick(task)"
            >
              <p class="font-medium">{{ task.title }}</p>
              <p class="mt-1 text-sm text-gray-500">
                {{ task.status }}
              </p>
            </div>

            <!-- 右邊按鈕 -->
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

      <!-- DONE 區標題 -->
      <div class="mt-6 border-t pt-4">
        <button
          class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
          @click="toggleCompleted"
        >
          <span>{{ showCompleted ? '▼' : '▶' }}</span>
          <span>Mes tâches terminées ({{ doneTasks.length }})</span>
        </button>
      </div>

      <!-- DONE 區內容（默認收起） -->
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
            <!-- 左邊區塊：點擊後選中 task -->
            <div
              class="flex-1 cursor-pointer"
              @click="handleTaskClick(task)"
            >
              <p class="font-medium line-through">{{ task.title }}</p>
              <p class="mt-1 text-sm text-gray-500">
                {{ task.status }}
              </p>
            </div>

            <!-- 右邊按鈕 -->
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

      <!-- 弹窗 -->
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
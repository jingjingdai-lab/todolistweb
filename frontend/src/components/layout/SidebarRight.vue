<script setup lang="ts">
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

const props = defineProps<{
  selectedTask: Task | null
}>()

const emit = defineEmits<{
  (e: 'delete-task', taskId: number): void
}>()

function formatDate(date?: string) {
  if (!date) return '—'
  return new Date(date).toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function handleDeleteTask() {
  if (!props.selectedTask) return
  emit('delete-task', props.selectedTask.id)
}
</script>

<template>
  <aside v-if="selectedTask" class="w-72 border-l bg-white p-6">
    <h2 class="text-xl font-bold">Task Detail</h2>

    <div class="mt-6 space-y-4">
      <div>
        <p class="text-sm text-gray-500">Title</p>
        <p class="mt-1 font-medium">{{ selectedTask.title }}</p>
      </div>

      <div>
        <p class="text-sm text-gray-500">Status</p>
        <p class="mt-1">{{ selectedTask.status }}</p>
      </div>

      <div>
        <p class="text-sm text-gray-500">Short description</p>
        <p class="mt-1">{{ selectedTask.shortDescription }}</p>
      </div>

      <div>
        <p class="text-sm text-gray-500">Long description</p>
        <p class="mt-1">
          {{ selectedTask.description || 'No long description' }}
        </p>
      </div>

      <div>
        <p class="text-sm text-gray-500">Due date</p>
        <p class="mt-1">
          {{ formatDate(selectedTask.dueDate) }}
        </p>
      </div>

      <div>
        <p class="text-sm text-gray-500">Created at</p>
        <p class="mt-1">
          {{ formatDate(selectedTask.createdAt) }}
        </p>
      </div>

      <div class="pt-4">
        <button
          type="button"
          class="w-full rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          @click="handleDeleteTask"
        >
          Delete Task
        </button>
      </div>
    </div>
  </aside>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// ---------- Types ---------

// Type for a task list
type TaskList = {
  id: number
  name: string
}

// ---------- Props ----------

// Data received from parent component
defineProps<{
  lists: TaskList[]
  selectedListId: number | null
}>()

// ---------- Emits ----------
// Events sent to parent component
const emit = defineEmits<{
  (e: 'select-list', listId: number): void
  (e: 'create-list'): void
  (e: 'delete-list', listId: number): void 
}>()


// ---------- Local state ----------
// UI state for sidebar (open/close)
const isSidebarOpen = ref(false)


// ---------- Handlers ----------
function handleCreateList() {
  emit('create-list') 
}

function handleClick(listId: number) {
  emit('select-list', listId)
}

function handleDelete(listId: number) {
  emit('delete-list', listId)
}

</script>




<template>
  <aside
    class="border-r bg-white p-4 transition-all duration-300"
    :class="isSidebarOpen ? 'w-72' : 'w-20'"
  >
    <div
      class="mb-6 flex items-center"
      :class="isSidebarOpen ? 'justify-between' : 'justify-center'"
    >
      <h2 v-if="isSidebarOpen" class="text-xl font-bold">My Lists</h2>

      <button
        class="rounded-md px-2 py-1 text-2xl text-black hover:bg-gray-100"
        @click="isSidebarOpen = !isSidebarOpen"
      >
        ☰
      </button>
    </div>

    <div v-if="isSidebarOpen" class="mb-4">
      <button
        class="w-full rounded-md bg-black px-3 py-1 text-sm text-white hover:opacity-90"
        @click="handleCreateList"
      >
        + New
      </button>
    </div>

    <ul class="space-y-2">
      <li
        v-for="list in lists"
        :key="list.id"
        class="flex items-center justify-between rounded-md border px-3 py-2 transition"
        :class="
          selectedListId === list.id
            ? 'bg-black text-white'
            : 'bg-white text-black hover:bg-gray-100'
        "
      >
        <span
          @click="handleClick(list.id)"
          class="flex-1 cursor-pointer"
        >
          <span v-if="isSidebarOpen">
            {{ list.name }}
          </span>
          <span v-else>
            {{ list.name.charAt(0).toUpperCase() }}
          </span>
        </span>

        <button
          v-if="isSidebarOpen"
          class="ml-2 text-red-500"
          @click.stop="handleDelete(list.id)"
        >
          ✕
        </button>
      </li>
    </ul>
  </aside>
</template>
<script setup lang="ts">
// 定义接收的数据类型
type TaskList = {
  id: number
  name: string
}

// props：父组件传进来的数据
defineProps<{
  lists: TaskList[]
  selectedListId: number | null
}>()

// emit：点击某个 list 时，通知父组件
const emit = defineEmits<{
  (e: 'select-list', listId: number): void
  (e: 'create-list'): void
  (e: 'delete-list', listId: number): void   // ⭐ 加这个
}>()

function handleCreateList() {
  emit('create-list') // ⭐ 通知父组件
}

// 点击某个 list
function handleClick(listId: number) {
  emit('select-list', listId)
}

//处理删除的函数
function handleDelete(listId: number) {
  emit('delete-list', listId)
}

</script>

<template>
  <aside class="w-72 border-r bg-white p-4">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-bold">My Lists</h2>

      <button
        class="rounded-md bg-black px-3 py-1 text-sm text-white hover:opacity-90"
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
          {{ list.name }}
        </span>

        <button
          class="ml-2 text-red-500"
          @click.stop="handleDelete(list.id)"
        >
          ✕
        </button>
      </li>
    </ul>
  </aside>
</template>
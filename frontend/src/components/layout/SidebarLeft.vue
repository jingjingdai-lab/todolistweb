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
}>()

// 点击某个 list
function handleClick(listId: number) {
  emit('select-list', listId)
}
</script>

<template>
  <!-- 左侧栏 -->
  <aside class="w-72 border-r bg-white p-4">
    <!-- 标题 + 新建按钮 -->
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-bold">My Lists</h2>

      <!-- 这个按钮先保留，后面再接创建功能 -->
      <button
        class="rounded-md bg-black px-3 py-1 text-sm text-white hover:opacity-90"
      >
        + New
      </button>
    </div>

    <!-- 列表 -->
    <ul class="space-y-2">
      <li
        v-for="list in lists"
        :key="list.id"
        @click="handleClick(list.id)"
        class="cursor-pointer rounded-md border px-3 py-2 transition"
        :class="
          selectedListId === list.id
            ? 'bg-black text-white'
            : 'bg-white text-black hover:bg-gray-100'
        "
      >
        {{ list.name }}
      </li>
    </ul>
  </aside>
</template>
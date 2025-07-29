<template>
  <div class="p-6 max-w-3xl mx-auto space-y-6">
    <h1 class="text-3xl font-bold">Импорт плейлиста</h1>

    <input
      type="file"
      accept=".txt"
      @change="handleFile"
      class="block border p-2 w-full"
    />

    <div v-if="parsed" class="bg-gray-100 p-4 rounded shadow">
      <h2 class="text-xl font-semibold mb-2">Плейлист на {{ parsed.date }}</h2>

      <div v-for="block in parsed.blocks" :key="block.datetime" class="mb-4">
        <h3 class="font-semibold text-lg text-purple-700">
          {{ block.datetime }}
        </h3>
        <ul class="pl-4 list-disc text-sm">
          <li v-for="rolik in block.roliki" :key="rolik.filename">
            {{ rolik.filename }}
          </li>
        </ul>
      </div>

      <button
        class="bg-green-600 text-white px-6 py-2 rounded mt-4"
        @click="submit"
      >
        Импортировать в Directus
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileContent = ref('')
const fileName = ref('')
const parsed = ref(null)

function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return

  fileName.value = file.name

  const reader = new FileReader()

reader.onload = async (ev) => {
  const decoder = new TextDecoder('windows-1251')
  fileContent.value = decoder.decode(ev.target.result)

  const res = await fetch('/api/reclama/parse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: fileName.value,
      content: fileContent.value
    })
  })

  parsed.value = await res.json()
}
  reader.readAsArrayBuffer(file)
}

async function submit() {
  const res = await fetch('/api/reclama/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.value)
  })

  const result = await res.json()
  console.log('Импорт завершён:', result)
  alert('Импорт завершён!')
}
</script>

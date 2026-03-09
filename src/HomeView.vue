<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted } from 'vue'

interface Repo {
  id: number
  name: string
  html_url: string
  description: string | null
}

const repos = ref<Repo[]>([])
const user = ref<string>('ideaguy3d')

async function getUserRepo() {
  const res = await axios.get<Repo[]>(`https://api.github.com/users/${user.value}/repos`)
  repos.value = res.data
}

onMounted(async () => {
  await getUserRepo()
})
</script>

<template>
  <div class="container">
    <h1 class="text-3xl my-4 text-center">{{ user }}'s Repos</h1>
    <ul class="flex flex-col gap-2">
      <li
        v-for="(repo, i) in repos"
        :key="repo.id"
        class="font-semibold border-b border-b-gray-400 pb-4"
      >
        <div class="flex items-center">
          <div class="w-1/12 text-center">{{ i + 1 }}.</div>
          <div class="flex flex-col gap-2 w-full">
            <div>
              Title: <span>{{ repo.name }}</span>
            </div>
            <span>Description: {{ repo.description ?? 'No Description' }}</span>
            <span
              >RepoLink:
              <a
                class="text-blue-700 hover:underline"
                :href="repo.html_url"
                target="_blank"
                rel="noopener"
                >{{ repo.html_url }}</a
              ></span
            >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>

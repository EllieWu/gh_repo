<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface Repo {
  id: number
  name: string
  html_url: string
  description: string | null
}

interface UserInfo {
  html_url: string
  public_repos: number
  avatar_url: string
}

const PER_PAGE = 10

const TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string
const authHeaders = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}

const repos = ref<Repo[]>([])
const user = ref<string>('ideaguy3d')
const totalRepos = ref<number | null>(null)
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)

//get user's all public repos length
const getUserInfo = async () => {
  const res = await axios.get<UserInfo>(`https://api.github.com/users/${user.value}`, {
    headers: authHeaders,
  })
  totalRepos.value = res.data.public_repos
}

const getUserRepos = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  try {
    const res = await axios.get<Repo[]>(`https://api.github.com/users/${user.value}/repos`, {
      headers: authHeaders,
      params: { per_page: PER_PAGE, page: page.value },
    })
    repos.value.push(...res.data)

    if (res.data.length < PER_PAGE) {
      hasMore.value = false
    } else {
      page.value++
    }
  } finally {
    loading.value = false
  }
}

function onScroll() {
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const docHeight = document.documentElement.scrollHeight

  if (scrollTop + windowHeight >= docHeight - 100) {
    getUserRepos()
  }
}

onMounted(async () => {
  await getUserInfo()
  await getUserRepos()
  await nextTick()
  //if repo's length not enougth to scroll
  while (hasMore.value && document.documentElement.scrollHeight <= window.innerHeight) {
    await getUserRepos()
    await nextTick()
  }

  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="container">
    <div class="flex gap-4 w-full justify-center items-end my-4">
      <h1 class="text-3xl">{{ user }}'s Repos</h1>
      <span class="text-lg">Total Repo's length: {{ totalRepos }}</span>
    </div>
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
    <div v-if="!hasMore" class="text-3xl text-gray text-center w-full my-4">
      ------ No more repo ------
    </div>
  </div>
</template>

<style scoped></style>

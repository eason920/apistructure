<template>
  <br />
  <n-result status="404" title="404 Not Found" description="You know life is always ridiculous.">
    <template #footer>
      <router-link to="/home">
        <n-button type="tertiary">Return to Home</n-button>
      </router-link>
    </template>
  </n-result>
</template>

<script></script>

<style scoped>
a {
  text-decoration: none;
}
</style>

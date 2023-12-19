<template>
    <li class="nav-item">
        <div class="nav-link">
            <router-link :disabled="props.diabled" style="display: flex; text-decoration: none; color: white" :to='props.link'>
                <CIcon customClassName="nav-icon" :icon="props.icon" />
                {{ props.name }}
            </router-link>
        </div>
    </li>
</template>
    
<script setup>
const props = defineProps({
    link: String,
    icon: String,
    name: String,
    disabled: {type: Boolean, default: false}
})
</script>
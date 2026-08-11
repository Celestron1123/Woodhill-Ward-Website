<template>
    <div class="recent-announcements-wrapper">
        <h2 class="section-header">Recent Announcements</h2>

        <div v-if="recentAnnouncement" class="recent-card">
            <h3 class="title">{{ recentAnnouncement.title }}</h3>
            <span class="date">{{ formatDate(recentAnnouncement.created) }}</span>
            <p class="content">{{ recentAnnouncement.content }}</p>
        </div>
        <div v-else class="empty-state">
            <p>No recent announcements</p>
        </div>

        <div class="action-buttons">
            <PastAnnouncements />
            <CreateAnnouncement v-if="canCreateAnnouncement" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCollection, useFirestore } from 'vuefire';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import PastAnnouncements from './PastAnnouncements.vue';
import CreateAnnouncement from './CreateAnnouncement.vue';
import { useUserRole } from '../composables/useUserRole';

const { canCreateAnnouncement } = useUserRole();

const db = useFirestore();

const announcementsQuery = query(
    collection(db, 'announcements'),
    orderBy('created', 'desc'),
    limit(1)
);

const announcements = useCollection(announcementsQuery);

const recentAnnouncement = computed(() => {
    return announcements.value.length > 0 ? announcements.value[0] : null;
});

const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const dateObj = timestamp.toDate();
    return dateObj.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};
</script>

<style scoped>
.recent-announcements-wrapper {
    /* Using max-width matching the upcoming events or home content */
    max-width: 600px;
    margin: 2.5rem auto 2.5rem auto;
    padding: 1rem;
    /* Optional visual grouping, though simple works best */
}

.section-header {
    font-size: 1.25rem;
    font-weight: bold;
    border-bottom: 2px solid #eaeaea;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
    color: #2c3e50;
    margin-top: 0;
}

.empty-state {
    color: #666;
    font-style: italic;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
}

.recent-card {
    background: #f9f9f9;
    border: 1px solid #eaeaea;
    border-left: 4px solid #007bff;
    padding: 1.5rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
}

.title {
    font-size: 1.3rem;
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
}

.date {
    display: block;
    color: #7f8c8d;
    font-size: 0.95rem;
    margin-bottom: 1rem;
}

.content {
    margin: 0;
    color: #4a4a4a;
    line-height: 1.6;
    white-space: pre-wrap;
}

.action-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: flex-start;
}
</style>

<template>
  <div class="upcoming-events-wrapper">
    <h2 class="events-header">Upcoming events</h2>

    <div v-if="upcomingEvents.length === 0" class="empty-state">
      <p>No upcoming events</p>
    </div>

    <div v-else class="event-list">
      <div v-for="event in upcomingEvents" :key="event.id" class="event-item">
        <div class="col-date">
          <div class="event-date-text">{{ formatDate(event['date']) }}</div>
          <div class="event-time-text">{{ formatTime(event['date']) }}</div>
        </div>
        <div class="col-details">
          <strong class="event-title">{{ event.title }}</strong>
          <div class="event-tags" v-if="event.tags && event.tags.length">
            <span
              v-for="tag in event.tags"
              :key="tag"
              class="tag-pill"
              :style="{ backgroundColor: getTagColor(tag) }"
            >
              {{ tag === 'all' ? 'All' : tag }}
            </span>
          </div>
          <div v-if="event.description" class="event-description">
            {{ event.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import { collection, query, where, orderBy } from 'firebase/firestore'

const props = defineProps({
  filterTag: {
    type: String,
    default: '',
  },
})

const db = useFirestore()

// Get the start of today (midnight) to ensure we include today's events
const today = new Date()
today.setHours(0, 0, 0, 0)

// Query the events collection:
// 1. On or after today
// 2. Ordered chronologically
const eventsQuery = query(
  collection(db, 'events'),
  where('date', '>=', today),
  orderBy('date', 'asc'),
)

const allUpcomingEvents = useCollection(eventsQuery)

const upcomingEvents = computed(() => {
  let filtered = allUpcomingEvents.value
  if (props.filterTag) {
    filtered = filtered.filter((event) => event.tags && event.tags.includes(props.filterTag))
  }
  return filtered.slice(0, 3)
})

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const dateObj = timestamp.toDate()
  return dateObj.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const dateObj = timestamp.toDate()
  return dateObj.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

const PASTEL_COLORS = {
  'Young Women': '#ffa6da',
  'Young Men': '#bae1ff',
  'Relief Society': '#d5baff',
  'Elders Quorum': '#baffc9',
  Primary: '#ffd8b1',
  'Sunday School': '#ffffba',
  all: '#ffb3b3',
}

const getTagColor = (tag) => {
  return PASTEL_COLORS[tag] || '#eee'
}
</script>

<style scoped>
.upcoming-events-wrapper {
  margin: 2rem auto 0 auto;
}

.events-header {
  font-size: 1.5rem;
  font-weight: 700;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

.empty-state {
  color: var(--text-secondary);
  font-style: italic;
  font-size: 1.1rem;
  padding: 1rem 0;
}

.event-list {
  display: flex;
  flex-direction: column;
}

.event-item {
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border-color);
  gap: 1rem;
}

.event-item:last-child {
  border-bottom: none;
}

@media (min-width: 600px) {
  .event-item {
    flex-direction: row;
    gap: 2rem;
  }
}

.col-date {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@media (min-width: 600px) {
  .col-date {
    width: 25%;
    flex-shrink: 0;
  }
}

.event-date-text {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.event-time-text {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.col-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-title {
  font-size: 1.3rem;
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1.3;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  color: #1e293b;
  font-weight: 500;
}

.event-description {
  font-size: 1.05rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-top: 0.25rem;
}
</style>

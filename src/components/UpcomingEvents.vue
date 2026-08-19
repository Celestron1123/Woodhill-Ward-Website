<template>
  <div class="upcoming-events-wrapper cyber-panel">
    <h2 class="events-header chrome-text">Upcoming events</h2>

    <div v-if="upcomingEvents.length === 0" class="empty-state lcd-screen">
      <p>[NO_DATA] No upcoming events</p>
    </div>

    <table v-else class="events-table">
      <thead>
        <tr>
          <th class="col-date digital-label" style="background: none; border: none; padding-bottom: 10px;">DATE</th>
          <th class="col-details digital-label" style="background: none; border: none; padding-bottom: 10px;">ACTIVITY</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in upcomingEvents" :key="event.id">
          <td class="col-date">
            <div class="event-date-text" style="color: var(--liquid-cyan);">{{ formatDate(event['date']) }}</div>
            <div class="event-time-text">{{ formatTime(event['date']) }}</div>
          </td>
          <td class="col-details">
            <strong class="event-title" style="color: #eee;">{{ event.title }}</strong>
            <div class="event-tags" v-if="event.tags && event.tags.length">
              <span
                v-for="tag in event.tags"
                :key="tag"
                class="jumper-pill"
                :style="{ borderTopColor: getTagColor(tag), borderLeftColor: getTagColor(tag) }"
              >
                {{ tag === 'all' ? 'All' : tag }}
              </span>
            </div>
            <div v-if="event.description" class="event-description">
              {{ event.description }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import { collection, query, where, orderBy } from 'firebase/firestore'

const props = defineProps({
  filterTag: {
    type: String,
    default: ''
  }
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
  orderBy('date', 'asc')
)

const allUpcomingEvents = useCollection(eventsQuery)

const upcomingEvents = computed(() => {
  let filtered = allUpcomingEvents.value;
  if (props.filterTag) {
    filtered = filtered.filter(event => event.tags && event.tags.includes(props.filterTag));
  }
  return filtered.slice(0, 3);
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
  'Young Women': '#ff52c5',
  'Young Men': '#52a3ff',
  'Relief Society': '#9e52ff',
  'Elders Quorum': '#52ff88',
  Primary: '#ffa452',
  'Sunday School': '#ffea52',
  all: '#ff5252',
}

const getTagColor = (tag) => {
  return PASTEL_COLORS[tag] || '#eee'
}
</script>

<style scoped>
/* PDA Aesthetic */
.upcoming-events-wrapper {
  max-width: 600px;
  margin: 2rem auto 0 auto;
}

.events-header {
  font-size: 1.25rem;
  border-bottom: 2px solid #555;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.empty-state {
  color: var(--crt-orange-1);
  font-family: 'Lucida Console', monospace;
  font-size: 1.1rem;
  padding: 10px;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th,
.events-table td {
  text-align: left;
  padding: 1rem 0;
  border-bottom: 1px solid #444;
}

.events-table th {
  font-size: 1.1rem;
  color: #888;
}

.col-date {
  width: 30%;
  vertical-align: top;
  padding-right: 1rem;
}

.event-date-text {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.event-time-text {
  font-size: 0.9rem;
  color: #888;
  font-family: 'Lucida Console', monospace;
}

.col-details {
  vertical-align: top;
}

.event-title {
  font-size: 1.2rem;
  display: block;
  margin-bottom: 0.25rem;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.event-description {
  font-size: 1rem;
  color: #ccc;
  line-height: 1.4;
}
</style>

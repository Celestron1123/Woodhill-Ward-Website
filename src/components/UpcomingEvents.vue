<template>
  <div class="upcoming-events-wrapper">
    <h2 class="events-header">Upcoming events</h2>

    <div v-if="upcomingEvents.length === 0" class="empty-state">
      <p>No upcoming events</p>
    </div>

    <table v-else class="events-table">
      <thead>
        <tr>
          <th class="col-date">Date</th>
          <th class="col-details">Activity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in upcomingEvents" :key="event.id">
          <td class="col-date">
            <div class="event-date-text">{{ formatDate(event['date']) }}</div>
            <div class="event-time-text">{{ formatTime(event['date']) }}</div>
          </td>
          <td class="col-details">
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
  'Young Women': '#ffb3ba',
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
/* Mobile-first, plain, and readable styling adhering to the Design Document */
.upcoming-events-wrapper {
  max-width: 600px;
  margin: 2rem auto 0 auto;
  padding: 1rem;
}

.events-header {
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 2px solid rgba(255, 255, 255, 0.6);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  color: #0056b3;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

.empty-state {
  color: #3b7496;
  font-style: italic;
  font-size: 1.1rem;
}

.events-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.events-table th {
  text-align: left;
  padding: 0.5rem 1rem;
  font-size: 1.1rem;
  color: #0b3d59;
  font-weight: bold;
  border-bottom: 2px solid rgba(255, 255, 255, 0.6);
}

.events-table td {
  text-align: left;
  padding: 1rem;
}

.events-table tbody tr {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(220, 240, 255, 0.4) 100%);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05), inset 0 2px 5px rgba(255, 255, 255, 0.8);
  transition: transform 0.2s;
}

.events-table tbody tr:hover {
  transform: scale(1.01);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1), inset 0 2px 5px rgba(255, 255, 255, 1);
}

.events-table td:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.events-table td:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.col-date {
  width: 30%;
  vertical-align: top;
}

.event-date-text {
  font-weight: bold;
  color: #0056b3;
  margin-bottom: 0.25rem;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

.event-time-text {
  font-size: 0.9rem;
  color: #446b85;
}

.col-details {
  vertical-align: top;
}

.event-title {
  font-size: 1.2rem;
  display: block;
  color: #0b3d59;
  margin-bottom: 0.4rem;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.tag-pill {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #0b3d59;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 4px rgba(0, 0, 0, 0.1);
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
  font-weight: bold;
}

.event-description {
  font-size: 1rem;
  color: #446b85;
  line-height: 1.4;
}
</style>

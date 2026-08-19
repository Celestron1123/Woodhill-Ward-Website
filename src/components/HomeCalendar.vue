<template>
  <div class="calendar-wrapper cyber-panel">
    <div style="background: #111; padding: 10px; border: 2px solid #444; border-bottom-color: #eee; border-right-color: #eee;">
      <v-calendar
        expanded
        title-position="left"
        :attributes="calendarAttributes"
        @dayclick="onDayClick"
        class="lcd-screen"
        style="background: transparent; border: none; box-shadow: none;"
      />
    </div>

    <div class="event-list">
      <h2 class="date-header chrome-text">SYS_DATE: {{ formattedSelectedDate }}</h2>

      <div v-if="selectedEvents.length === 0" class="empty-state lcd-screen">
        <p>[NO_DATA] No activities scheduled for this day.</p>
      </div>

      <div v-else v-for="(event, index) in selectedEvents" :key="event.id" class="event-card cyber-panel">
        <div class="event-header">
          <h3 class="event-title" style="color: var(--liquid-cyan);">{{ event.title }}</h3>
          <span class="event-time digital-label">{{ formatTime(event['date']) }}</span>
        </div>
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
        <p class="event-description">{{ event.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'

const props = defineProps({
  filterTag: {
    type: String,
    default: ''
  }
})

// 1. Fetch Events from Firestore
const db = useFirestore()
const allEvents = useCollection(collection(db, 'events'))

const events = computed(() => {
  if (!props.filterTag) return allEvents.value;
  return allEvents.value.filter(event => event.tags && event.tags.includes(props.filterTag));
})

// 2. State for the currently selected date (defaults to today)
const selectedDate = ref(new Date())

const TAG_COLORS = {
  'Young Women': 'pink',
  'Young Men': 'blue',
  'Relief Society': 'purple',
  'Elders Quorum': 'green',
  Primary: 'orange',
  'Sunday School': 'yellow',
  all: 'red',
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

// 3. Map Firestore data to VCalendar Attributes
const calendarAttributes = computed(() => {
  // Always show a highlight on the currently selected day
  const attributes = [
    {
      key: 'selected',
      highlight: {
        color: 'blue',
        fillMode: 'solid',
      },
      dates: selectedDate.value,
    },
  ]

  // Add a dot for each tag the event has
  events.value.forEach((event) => {
    if (event['date']) {
      const tags = event.tags && event.tags.length > 0 ? event.tags : ['all']
      tags.forEach((tag, idx) => {
        attributes.push({
          key: `${event.id}-${tag}-${idx}`,
          dot: TAG_COLORS[tag] || 'gray',
          dates: event['date'].toDate(),
        })
      })
    }
  })

  return attributes
})

// 4. Filter events to only show those matching the selected day
const selectedEvents = computed(() => {
  return events.value.filter((event) => {
    if (!event['date']) return false

    const eventDate = event['date'].toDate()
    // Compare just the date portion (ignoring the exact time)
    return eventDate.toDateString() === selectedDate.value.toDateString()
  })
})

// 5. Handle user clicks on the calendar
const onDayClick = (day) => {
  selectedDate.value = day.date
}

// 6. Format the date for the elderly-friendly header lol (e.g., "Monday, October 12")
const formattedSelectedDate = computed(() => {
  return selectedDate.value.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
})

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return timestamp.toDate().toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

const getTagColor = (tag) => {
  return PASTEL_COLORS[tag] || '#eee'
}
</script>

<style scoped>
/* PDA Aesthetic */
.calendar-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.event-list {
  margin-top: 2rem;
}

.date-header {
  font-size: 1.25rem;
  font-weight: bold;
  border-bottom: 2px solid #555;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.empty-state {
  color: var(--crt-orange-1);
  font-family: 'Lucida Console', monospace;
  font-size: 1.1rem;
}

.event-card {
  margin-bottom: 1rem;
  padding: 1.25rem;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid #444;
  padding-bottom: 5px;
}

.event-title {
  font-size: 1.3rem;
  margin: 0;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.event-description {
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;
  color: #eee;
}
</style>

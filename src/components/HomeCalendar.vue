<template>
  <div class="calendar-wrapper">
    <v-calendar
      expanded
      title-position="left"
      :attributes="calendarAttributes"
      @dayclick="onDayClick"
    />

    <div class="event-list">
      <h2 class="date-header">Activities for {{ formattedSelectedDate }}</h2>

      <div v-if="selectedEvents.length === 0" class="empty-state">
        <p>No activities scheduled for this day.</p>
      </div>

      <div v-else v-for="event in selectedEvents" :key="event.id" class="event-card">
        <div class="event-header">
          <h3 class="event-title">{{ event.title }}</h3>
          <span class="event-time">{{ formatTime(event['date']) }}</span>
        </div>
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
        <p class="event-description">{{ event.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'

// 1. Fetch Events from Firestore
const db = useFirestore()
const events = useCollection(collection(db, 'events'))

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
  'Young Women': '#ffa6da',
  'Young Men': '#bae1ff',
  'Relief Society': '#d5baff',
  'Elders Quorum': '#baffc9',
  Primary: '#ffd8b1',
  'Sunday School': '#ffffba',
  all: '#ffb3b3',
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
/* Mobile-first, readable styles adhering to the Design Document */
.calendar-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.event-list {
  margin-top: 2rem;
}

.date-header {
  font-size: 1.25rem;
  font-weight: bold;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.empty-state {
  color: #666;
  font-style: italic;
  font-size: 1.1rem;
}

.event-card {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.event-title {
  font-size: 1.3rem;
  margin: 0;
  color: #2c3e50;
}

.event-time {
  font-size: 1rem;
  font-weight: bold;
  color: #666;
}

.event-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tag-pill {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.85rem;
  color: #333;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.event-description {
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;
  color: #4a4a4a;
}
</style>

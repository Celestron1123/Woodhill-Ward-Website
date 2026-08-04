<template>
    <div class="calendar-wrapper">
        <v-calendar expanded title-position="left" :attributes="calendarAttributes" @dayclick="onDayClick" />

        <div class="event-list">
            <h2 class="date-header">Activities for {{ formattedSelectedDate }}</h2>

            <div v-if="selectedEvents.length === 0" class="empty-state">
                <p>No activities scheduled for this day.</p>
            </div>

            <div v-else v-for="event in selectedEvents" :key="event.id" class="event-card">
                <h3 class="event-title">{{ event.Title }}</h3>
                <p class="event-description">{{ event.Description }}</p>
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

// 3. Map Firestore data to VCalendar Attributes
const calendarAttributes = computed(() => {
    // Always show a highlight on the currently selected day
    const attributes = [
        {
            key: 'selected',
            highlight: {
                color: 'blue',
                fillMode: 'solid'
            },
            dates: selectedDate.value,
        }
    ]

    // Add a simple dot to any day that has an event
    events.value.forEach(event => {
        // Ensure the Event Date exists before trying to parse it
        if (event['Event Date']) {
            attributes.push({
                key: event.id,
                dot: 'blue',
                dates: event['Event Date'].toDate(), // Convert Firestore Timestamp to JS Date
            })
        }
    })

    return attributes
})

// 4. Filter events to only show those matching the selected day
const selectedEvents = computed(() => {
    return events.value.filter(event => {
        if (!event['Event Date']) return false;

        const eventDate = event['Event Date'].toDate()
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
        day: 'numeric'
    })
})
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

.event-title {
    font-size: 1.3rem;
    /* Large text for readability */
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
}

.event-description {
    font-size: 1.1rem;
    line-height: 1.5;
    margin: 0;
    color: #4a4a4a;
}
</style>
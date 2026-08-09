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
                        {{ formatDate(event['date']) }}
                    </td>
                    <td class="col-details">
                        <strong class="event-title">{{ event.title }}</strong>
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
import { useCollection, useFirestore } from 'vuefire'
import { collection, query, where, orderBy, limit } from 'firebase/firestore'

const db = useFirestore()

// Get the start of today (midnight) to ensure we include today's events
const today = new Date()
today.setHours(0, 0, 0, 0)

// Query the events collection: 
// 1. On or after today
// 2. Ordered chronologically 
// 3. Limited to the next 3
const eventsQuery = query(
    collection(db, 'events'),
    where('date', '>=', today),
    orderBy('date', 'asc'),
    limit(3)
)

const upcomingEvents = useCollection(eventsQuery)

// Format the date to be easily readable
const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const dateObj = timestamp.toDate()
    return dateObj.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    })
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
    font-size: 1.25rem;
    font-weight: bold;
    border-bottom: 2px solid #eaeaea;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    color: #2c3e50;
}

.empty-state {
    color: #666;
    font-style: italic;
    font-size: 1.1rem;
}

.events-table {
    width: 100%;
    border-collapse: collapse;
}

.events-table th,
.events-table td {
    text-align: left;
    padding: 1rem 0;
    border-bottom: 1px solid #e0e0e0;
}

.events-table th {
    font-size: 1.1rem;
    color: #4a4a4a;
    font-weight: bold;
}

.col-date {
    width: 30%;
    vertical-align: top;
    font-weight: bold;
    color: #2c3e50;
    padding-right: 1rem;
}

.col-details {
    vertical-align: top;
}

.event-title {
    font-size: 1.2rem;
    display: block;
    color: #2c3e50;
}

.event-description {
    font-size: 1rem;
    color: #4a4a4a;
    margin-top: 0.25rem;
    line-height: 1.4;
}
</style>
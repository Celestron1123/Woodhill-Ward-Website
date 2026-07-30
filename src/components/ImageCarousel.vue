<template>
    <div class="carousel-wrapper" v-if="images && images.length > 0">

        <div class="carousel-badge" v-if="images.length > 1">
            {{ currentIndex + 1 }} / {{ images.length }}
        </div>

        <div class="carousel-track" ref="track" @scroll="handleScroll">
            <img v-for="(img, index) in images" :key="index" :src="img" class="carousel-image"
                alt="Ward activity photo" />
        </div>

        <div class="carousel-dots" v-if="images.length > 1">
            <span v-for="(_, index) in images" :key="index" class="dot"
                :class="{ active: currentIndex === index }"></span>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';

// Accept the imageUrls array from the parent post
const props = defineProps({
    images: {
        type: Array,
        required: true
    }
});

const currentIndex = ref(0);
const track = ref(null);

// Update the current index based on how far the user has scrolled
const handleScroll = () => {
    if (!track.value) return;

    const scrollPosition = track.value.scrollLeft;
    const imageWidth = track.value.clientWidth;

    // Math.round ensures the index updates when the user is halfway to the next image
    currentIndex.value = Math.round(scrollPosition / imageWidth);
};
</script>

<style scoped>
.carousel-wrapper {
    position: relative;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
}

/* CSS Scroll Snapping Magic */
.carousel-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

    /* Hide the ugly default scrollbar but keep functionality */
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.carousel-track::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}

.carousel-image {
    flex: 0 0 100%;
    /* Force image to take full width of container */
    width: 100%;
    height: 300px;
    /* Fixed height for uniformity, adjust as needed */
    object-fit: cover;
    /* Prevents stretching */
    scroll-snap-align: center;
    /* Snaps the image to the center */
    border-radius: 8px;
}

/* High contrast, readable badge */
.carousel-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 10px;
    border-radius: 15px;
    font-size: 0.85em;
    font-weight: bold;
    z-index: 10;
    pointer-events: none;
}

.carousel-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 8px;
}

.dot {
    width: 8px;
    height: 8px;
    background-color: #ccc;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.dot.active {
    background-color: #333;
}
</style>
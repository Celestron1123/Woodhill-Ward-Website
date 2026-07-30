<template>
    <div class="carousel-wrapper" v-if="images && images.length > 0">

        <div class="carousel-badge" v-if="images.length > 1">
            {{ currentIndex + 1 }} / {{ images.length }}
        </div>

        <button v-if="images.length > 1" class="nav-btn prev-btn" @click.stop="scrollPrev" aria-label="Previous image">
            &#10094;
        </button>

        <div class="carousel-track" ref="track" @scroll="handleScroll">
            <img v-for="(img, index) in images" :key="index" :src="img" class="carousel-image"
                alt="Ward activity photo" />
        </div>

        <button v-if="images.length > 1" class="nav-btn next-btn" @click.stop="scrollNext" aria-label="Next image">
            &#10095;
        </button>

        <div class="carousel-dots" v-if="images.length > 1">
            <span v-for="(_, index) in images" :key="index" class="dot"
                :class="{ active: currentIndex === index }"></span>
        </div>

    </div>
</template>

<script setup>
// TODO: Cloudinary actually has a feature that automatically 
// pads the image using a blurred version of the photo itself...
// look into that for a more elegant solution than just a gray background
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

// Button Scroll Logic
const scrollPrev = () => {
    if (track.value) {
        const imageWidth = track.value.clientWidth;
        track.value.scrollBy({ left: -imageWidth, behavior: 'smooth' });
    }
};

const scrollNext = () => {
    if (track.value) {
        const imageWidth = track.value.clientWidth;
        track.value.scrollBy({ left: imageWidth, behavior: 'smooth' });
    }
};
</script>

<style scoped>
.carousel-wrapper {
    position: relative;
    width: 100%;
    /* Restricts width on desktop to a phone-sized column */
    max-width: 450px;
    /* Centers the whole carousel horizontally */
    margin: 10px auto;
}

/* CSS Scroll Snapping Magic */
.carousel-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

    /* Hide the ugly default scrollbar but keep functionality */
    /* IE and Edge */
    -ms-overflow-style: none;
    /* Firefox */
    scrollbar-width: none;
}

.carousel-track::-webkit-scrollbar {
    /* Chrome, Safari and Opera */
    display: none;
}

.carousel-image {
    flex: 0 0 100%;
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: contain;
    background-color: #f4f4f4;
    scroll-snap-align: center;
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

.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    font-size: 1.2em;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background-color 0.2s;
}

.nav-btn:hover {
    background-color: rgba(0, 0, 0, 0.8);
}

.prev-btn {
    left: 5px;
}

.next-btn {
    right: 5px;
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
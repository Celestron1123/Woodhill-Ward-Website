<template>
    <header class="site-header">
        <div class="header-left">
            <router-link to="/homefeed">
                <img src="../assets/header_icon.svg" alt="Home" class="logo-icon" />
            </router-link>
        </div>

        <nav class="header-right">
            <router-link to="/young-women" class="nav-link">Young Women</router-link>
            <router-link to="/young-men" class="nav-link">Young Men</router-link>
            <router-link to="/relief-society" class="nav-link">Relief Society</router-link>
            <router-link to="/elders-quorum" class="nav-link">Elders Quorum</router-link>
            <router-link to="/primary" class="nav-link">Primary</router-link>
            <router-link to="/sunday-school" class="nav-link">Sunday School</router-link>
            <router-link to="/feed" class="nav-link">Social</router-link>

            <router-link to="/login" class="login-button">
                <img src="../assets/login.svg" alt="Login" class="login-icon" />
            </router-link>
        </nav>
    </header>
</template>

<style scoped>
/* Basic layout styling */
.site-header {
    display: flex;
    /* Pushes left and right sections apart */
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #ffffff;
    /* Light border to separate from content */
    border-bottom: 1px solid #eaeaea;
}

/* Adjust icon sizes */
.logo-icon {
    height: 45px;
    width: auto;
}

.login-icon {
    height: 35px;
    width: auto;
}

/* Right navigation flex container */
.header-right {
    display: flex;
    align-items: center;
    /* Space between each text button */
    gap: 1.5rem;
}

/* Text link styling */
.nav-link {
    text-decoration: none;
    color: #333333;
    font-weight: 500;
    font-size: 0.95rem;
    transition: color 0.2s ease;
}

.nav-link:hover {
    /* A generic highlight color, adjust as needed */
    color: #5b8fb9;
}

/* Remove default link styling from the image wrapper */
.login-button {
    display: flex;
    align-items: center;
    /* Extra space before the login icon */
    margin-left: 1rem;
}
</style>
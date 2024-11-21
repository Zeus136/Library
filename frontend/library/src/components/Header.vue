<template>
    <header v-if="isLoggedIn">
        <div class="header-content">
            <h1 class="system-name">Quản Lí Thư Viện</h1>
            <div class="right-header">
                <button @click="toggleNav" class="menu-button">☰</button>

                <nav v-if="isNavOpen" class="sidebar" @click.self="closeNav">
                    <template v-if="ChucVu === 'Quản lý'">
                        <!-- <router-link to="/home-admin" class="nav-link" @click="closeNav">Trang Chủ</router-link> -->
                        <router-link to="/manage-staffs" class="nav-link" @click="closeNav">Quản Lí Nhân
                            Viên</router-link>
                        <router-link to="/manage-muontra" class="nav-link" @click="closeNav">Quản Lí Mượn
                            Trả</router-link>
                        <router-link to="/manage-books" class="nav-link" @click="closeNav">Quản Lí Sách</router-link>
                        <router-link to="/manage-readers" class="nav-link" @click="closeNav">Quản Lí Độc
                            Giả</router-link>
                        <router-link to="/manage-nxb" class="nav-link" @click="closeNav">Quản Lí Nhà Xuất
                            Bản</router-link>
                    </template>
                    <template v-else-if="ChucVu === 'Thủ thư'">
                        <router-link to="/manage-muontra" class="nav-link" @click="closeNav">Quản Lí Mượn
                            Trả</router-link>
                        <router-link to="/manage-books" class="nav-link" @click="closeNav">Quản Lí Sách</router-link>
                        <router-link to="/manage-readers" class="nav-link" @click="closeNav">Quản Lí Độc
                            Giả</router-link>
                        <router-link to="/manage-nxb" class="nav-link" @click="closeNav">Quản Lí Nhà Xuất
                            Bản</router-link>
                    </template>
                    <template v-else-if="ChucVu === 'Kế toán'">
                        <router-link to="/home-accountant" class="nav-link" @click="closeNav">Trang Chủ</router-link>
                        <router-link to="/sales-report" class="nav-link" @click="closeNav">Thống kê doanh
                            số</router-link>
                    </template>
                </nav>

                <div class="user-profile" @click="toggleUserMenu">
                    <p class="welcome-message">Chào mừng, {{ HoTenNV }}</p>
                    <div v-if="isUserMenuOpen" class="user-menu">
                        <p>{{ ChucVu }}</p>
                        <p>{{ MSNV }}</p>
                        <router-link to="/Infor" @click="closeNav">Thông Tin Cá Nhân</router-link>
                        <button @click="logout" class="logout-button">Đăng Xuất</button>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            isNavOpen: false,
            isUserMenuOpen: false,
        };
    },
    computed: {
        ...mapGetters(["isLoggedIn", "_id", "MSNV", "HoTenNV", "ChucVu", "DiaChi", "SoDienThoai"]),
    },
    methods: {
        toggleNav() {
            this.isNavOpen = !this.isNavOpen;
            this.isUserMenuOpen = false;
        },
        closeNav() {
            this.isNavOpen = false;
        },
        toggleUserMenu() {
            this.isUserMenuOpen = !this.isUserMenuOpen;
            this.isNavOpen = false;
        },
        logout() {
            this.$store.dispatch("logout");
            this.$router.push("/");
        },
    },
};
</script>

<style scoped>
/* Header styling */
header {
    width: 100%;
    padding: 20px;
    background: rgba(0, 0, 0, 0.6);
    color: #e99000;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    border-radius: 20px;
}

.header-content {
    display: flex;
    min-width: 900px;
    justify-content: space-between;
    align-items: center;
}

.system-name {
    font-size: 1.8rem;
    font-weight: bold;
    color: #e99000;
    margin: 0;
}

.menu-button {
    font-size: 30px;
    color: #f0f0f0;
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
}

/* Sidebar styling */
.sidebar {
    position: absolute;
    top: 110px;
    right: 350px;
    background-color: rgba(0, 0, 0, 0.9);
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1000;
    width: 200px;
}

.nav-link {
    color: #ffffff;
    text-decoration: none;
    font-size: 1rem;
    padding: 10px;
    border-radius: 5px;
    transition: background 0.3s;
}

.nav-link:hover {
    background-color: #2a4162;
    color: #e99000;
}

/* User profile dropdown */
.user-profile {
    position: relative;
    cursor: pointer;
    outline: none;
    align-items: center;
    text-align: center;
    display: flex;
}

.welcome-message {
    color: #ffffff;
    /* Changed color */
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
    padding: 0;
    text-align: center;
    /* Center-align text */
    width: 100%;
    /* Ensure full width for centering */
}

.user-menu {
    position: absolute;
    top: 70px;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    text-align: center;
}

.logout-button {
    background-color: #dc3545;
    color: #ffffff;
    padding: 8px;
    width: 100%;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

.logout-button:hover {
    background-color: #c82333;
}

.right-header {
    display: flex;
    gap: 20px;
}
</style>

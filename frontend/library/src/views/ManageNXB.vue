<template>
    <div class="manage-nxb">
        <h1 class="title">Quản Lí Nhà Xuất Bản</h1>
        <div class="form-card">
            <h2>{{ editNXB ? "Chỉnh Sửa Nhà Xuất Bản" : "Thêm Nhà Xuất Bản" }}</h2>
            <form @submit.prevent="editNXB ? updateNXB() : createNXB()">
                <input v-model="currentNXB.MaNXB" placeholder="Mã NXB" />
                <input v-model="currentNXB.TenNXB" placeholder="Tên NXB" required />
                <input v-model="currentNXB.DiaChi" placeholder="Địa Chỉ" required />
                <button type="submit">{{ editNXB ? "Lưu" : "Thêm" }}</button>
                <button type="button" @click="resetForm">Hủy</button>
            </form>
        </div>
        <div class="search-add">
            <input v-model="searchQuery" placeholder="Tìm kiếm nhà xuất bản..." />
        </div>
        <div v-if="notification.message" :class="['notification', notification.type]">
            {{ notification.message }}
        </div>
        <table>
            <thead>
                <tr>
                    <th>Mã NXB</th>
                    <th>Tên NXB</th>
                    <th>Địa Chỉ</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="nxb in filteredNXBs" :key="nxb._id">
                    <td>{{ nxb.MaNXB }}</td>
                    <td>{{ nxb.TenNXB }}</td>
                    <td>{{ nxb.DiaChi }}</td>
                    <td>
                        <button @click="handleAction('edit', nxb)">Chỉnh Sửa</button>
                        <button class="delete-button" @click="handleAction('delete', nxb._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import nxbService from "@/services/nxb.service";

export default {
    data() {
        return {
            searchQuery: "",
            currentNXB: {
                MaNXB: "",
                TenNXB: "",
                DiaChi: ""
            },
            editNXB: null,
            nxbs: [],
            notification: {
                message: "",
                type: ""
            }
        };
    },
    computed: {
        filteredNXBs() {
            return this.nxbs.filter((nxb) => {
                const searchQuery = this.searchQuery.toLowerCase();
                return (
                    nxb.MaNXB.toLowerCase().includes(searchQuery) ||
                    nxb.TenNXB.toLowerCase().includes(searchQuery)
                );
            });
        },
    },
    methods: {
        async fetchNXBs() {
            try {
                const nxbs = await nxbService.getNXBs();
                this.nxbs = nxbs;
            } catch (error) {
                this.showNotification("Lỗi khi tải danh sách nhà xuất bản: " + error.message, "error");
            }
        },
        async createNXB() {
            try {
                await nxbService.createNXB(this.currentNXB);
                this.resetForm();
                this.showNotification("Thêm nhà xuất bản thành công!", "success");
                await this.fetchNXBs(); // Refresh data after create
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    this.showNotification("Lỗi khi thêm nhà xuất bản: " + error.response.data.message, "error");
                } else {
                    this.showNotification("Lỗi khi thêm nhà xuất bản: " + error.message, "error");
                }
            }
        },
        async updateNXB() {
            try {
                await nxbService.updateNXB(this.editNXB._id, this.currentNXB);
                this.resetForm();
                this.showNotification("Cập nhật nhà xuất bản thành công!", "success");
                await this.fetchNXBs(); // Refresh data after update
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    this.showNotification("Lỗi khi cập nhật nhà xuất bản: " + error.response.data.message, "error");
                } else if (error.message) {
                    this.showNotification("Lỗi khi cập nhật nhà xuất bản: " + error.message, "error");
                } else {
                    this.showNotification("Lỗi không xác định khi cập nhật nhà xuất bản.", "error");
                }
            }
        },
        async deleteNXB(id) {
            if (confirm("Bạn có chắc chắn muốn xóa nhà xuất bản này không?")) {
                try {
                    await nxbService.deleteNXB(id);
                    this.nxbs = this.nxbs.filter((nxb) => nxb._id !== id);
                    this.showNotification("Xóa nhà xuất bản thành công!", "success");
                    await this.fetchNXBs(); // Fetch updated list
                } catch (error) {
                    this.showNotification("Lỗi khi xóa nhà xuất bản: " + error.message, "error");
                }
            }
        },
        handleAction(action, payload) {
            if (action === "edit") {
                this.editNXB = payload;
                this.currentNXB = { ...payload };
            } else if (action === "delete") {
                this.deleteNXB(payload);
            }
        },
        resetForm() {
            this.currentNXB = {
                MaNXB: "",
                TenNXB: "",
                DiaChi: ""
            };
            this.editNXB = null;
        },
        showNotification(message, type) {
            this.notification.message = message;
            this.notification.type = type;
            setTimeout(() => {
                this.notification.message = "";
                this.notification.type = "";
            }, 3000);
        }
    },
    created() {
        this.fetchNXBs();
    },
};
</script>

<style scoped>
.manage-nxb {
    padding: 20px;
}

.title {
    color: #e99000;
    background-color: #090909aa;
}

.form-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.search-add {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

input {
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.delete-button {
    background-color: #dc3545;
    margin-left: 10px;
}

.delete-button:hover {
    background-color: #c82333;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #f9f9f9;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th:first-child,
td:first-child {
    text-align: center;
}

th {
    background-color: #f2f2f2;
    text-align: left;
}

form {
    display: flex;
    flex-direction: column;
}

form input {
    margin-bottom: 10px;
}

form button {
    margin-top: 10px;
}

.notification {
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    text-align: center;
}

.notification.success {
    background-color: #d4edda;
    color: #155724;
}

.notification.error {
    background-color: #f8d7da;
    color: #721c24;
}
</style>

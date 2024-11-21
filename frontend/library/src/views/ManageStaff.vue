<template>
    <div class="manage-staff">
        <h1 class="title">Quản Lí Nhân Viên</h1>
        <div class="form-card">
            <h2>{{ editNhanVien ? "Chỉnh Sửa Nhân Viên" : "Thêm Nhân Viên" }}</h2>
            <form @submit.prevent="editNhanVien ? updateNhanVien() : createNhanVien()">
                <input v-model="currentNhanVien.MSNV" placeholder="Mã Số Nhân Viên" />
                <input v-model="currentNhanVien.HoTenNV" placeholder="Họ Tên" required />
                <select v-model="currentNhanVien.ChucVu" required>
                    <option value="" disabled>Chọn Chức Vụ</option>
                    <option value="Thủ thư">Thủ thư</option>
                    <option value="Quản lý">Quản lý</option>
                    <option value="Kế toán">Kế toán</option>
                </select>
                <input v-model="currentNhanVien.DiaChi" placeholder="Địa Chỉ" required />
                <input v-model="currentNhanVien.SoDienThoai" placeholder="Số Điện Thoại" required />
                <div class="password-container">
                    <input :type="showPassword ? 'text' : 'password'" v-model="currentNhanVien.Password"
                        placeholder="Mật Khẩu" />
                    <button type="button" @click="togglePasswordVisibility">{{ showPassword ? "Ẩn" : "Hiện" }}</button>
                </div>
                <button type="submit">{{ editNhanVien ? "Lưu" : "Thêm" }}</button>
                <button type="button" @click="resetForm">Hủy</button>
            </form>
        </div>
        <div class="search-add">
            <input v-model="searchQuery" placeholder="Tìm kiếm nhân viên..." />
        </div>
        <div v-if="notification.message" :class="['notification', notification.type]">
            {{ notification.message }}
        </div>
        <table>
            <thead>
                <tr>
                    <th>Mã Số Nhân Viên</th>
                    <th>Họ Tên</th>
                    <th>Chức Vụ</th>
                    <th>Địa Chỉ</th>
                    <th>Số Điện Thoại</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="nhanVien in filteredNhanViens" :key="nhanVien._id">
                    <td>{{ nhanVien.MSNV }}</td>
                    <td>{{ nhanVien.HoTenNV }}</td>
                    <td>{{ nhanVien.ChucVu }}</td>
                    <td>{{ nhanVien.DiaChi }}</td>
                    <td>{{ nhanVien.SoDienThoai }}</td>
                    <td>
                        <button @click="handleAction('edit', nhanVien)">Chỉnh Sửa</button>
                        <button class="delete-button" @click="handleAction('delete', nhanVien._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import nhanvienService from "@/services/nhanvien.service";

export default {
    data() {
        return {
            searchQuery: "",
            currentNhanVien: {
                MSNV: "",
                HoTenNV: "",
                ChucVu: "",
                DiaChi: "",
                SoDienThoai: "",
                Password: "",
            },
            editNhanVien: null,
            nhanViens: [],
            showPassword: false,
            notification: {
                message: "",
                type: ""
            }
        };
    },
    computed: {
        filteredNhanViens() {
            return this.nhanViens.filter((nv) => {
                const searchQuery = this.searchQuery.toLowerCase();
                return (
                    nv.MSNV.toLowerCase().includes(searchQuery) ||
                    nv.HoTenNV.toLowerCase().includes(searchQuery) ||
                    nv.ChucVu.toLowerCase().includes(searchQuery) ||
                    nv.DiaChi.toLowerCase().includes(searchQuery) ||
                    nv.SoDienThoai.toLowerCase().includes(searchQuery)
                );
            });
        },
    },
    methods: {
        async fetchNhanViens() {
            try {
                const nhanViens = await nhanvienService.getNhanVien();
                this.nhanViens = nhanViens;
            } catch (error) {
                this.showNotification("Lỗi khi tải danh sách nhân viên: " + error.message, "error");
            }
        },
        async createNhanVien() {
            try {
                await nhanvienService.createNhanVien(this.currentNhanVien);
                this.resetForm();
                this.showNotification("Thêm nhân viên thành công!", "success");
                await this.fetchNhanViens(); // Refresh data after create
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    this.showNotification("Lỗi khi thêm nhân viên: " + error.response.data.message, "error");
                } else {
                    this.showNotification("Lỗi khi thêm nhân viên: " + error.message, "error");
                }
            }
        },
        async updateNhanVien() {
            try {
                await nhanvienService.updateNhanVien(this.editNhanVien._id, this.currentNhanVien);
                this.resetForm();
                this.showNotification("Cập nhật nhân viên thành công!", "success");
                await this.fetchNhanViens(); // Refresh data after update
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    this.showNotification("Lỗi khi cập nhật nhân viên: " + error.response.data.message, "error");
                } else if (error.message === "No information has been updated") {
                    this.showNotification("Không có thông tin nào được cập nhật.", "error");
                } else {
                    this.showNotification("Lỗi khi cập nhật nhân viên: " + error.message, "error");
                }
            }
        },
        async deleteNhanVien(id) {
            if (confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
                try {
                    await nhanvienService.deleteNhanVien(id);
                    this.nhanViens = this.nhanViens.filter((nv) => nv._id !== id);
                    this.showNotification("Xóa nhân viên thành công!", "success");
                    await this.fetchNhanViens(); // Fetch updated list
                } catch (error) {
                    this.showNotification("Lỗi khi xóa nhân viên: " + error.message, "error");
                }
            }
        },
        handleAction(action, payload) {
            if (action === "edit") {
                this.editNhanVien = payload;
                this.currentNhanVien = { ...payload };
            } else if (action === "delete") {
                this.deleteNhanVien(payload);
            }
        },
        resetForm() {
            this.currentNhanVien = {
                MSNV: "",
                HoTenNV: "",
                ChucVu: "",
                DiaChi: "",
                SoDienThoai: "",
                Password: "",
            };
            this.editNhanVien = null;
            this.showPassword = false;
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
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
        this.fetchNhanViens();
    },
};
</script>

<style scoped>
.manage-staff {
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

input,
select {
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

form input,
form select {
    margin-bottom: 10px;
}

form button {
    margin-top: 10px;
}

.password-container {
    display: flex;
    align-items: center;
}

password-container input {
    flex: 1;
}

.password-container button {
    background-color: #6c757d;
    height: 38px;
    padding: 0 10px;
    margin-bottom: 10px;
    margin-top: 0px;
    width: 50px;
    /* Adjust height to match input field */
}

.password-container button:hover {
    background-color: #5a6268;
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

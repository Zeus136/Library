<template>
    <div class="manage-dg">
        <h1 class="title">Quản Lí Độc Giả</h1>
        <div class="form-card">
            <h2>{{ editDocGia ? "Chỉnh Sửa Độc Giả" : "Thêm Độc Giả" }}</h2>
            <form @submit.prevent="editDocGia ? updateDocGia() : createDocGia()">
                <input v-model="currentDocGia.MaDocGia" placeholder="Mã Độc Giả" />
                <input v-model="currentDocGia.HoLot" placeholder="Họ Lót" required />
                <input v-model="currentDocGia.Ten" placeholder="Tên" required />
                <input v-model="currentDocGia.NgaySinh" type="date" placeholder="Ngày Sinh" required />
                <select v-model="currentDocGia.Phai" required>
                    <option value="" disabled>Chọn Giới Tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
                <input v-model="currentDocGia.DiaChi" placeholder="Địa Chỉ" required />
                <input v-model="currentDocGia.DienThoai" placeholder="Điện Thoại" required />
                <button type="submit">{{ editDocGia ? "Lưu" : "Thêm" }}</button>
                <button type="button" @click="resetForm">Hủy</button>
            </form>
        </div>
        <div class="search-add">
            <input v-model="searchQuery" placeholder="Tìm kiếm độc giả..." />
        </div>
        <div v-if="notification.message" :class="['notification', notification.type]">
            {{ notification.message }}
        </div>
        <table>
            <thead>
                <tr>
                    <th>Mã Độc Giả</th>
                    <th>Họ Lót</th>
                    <th>Tên</th>
                    <th>Ngày Sinh</th>
                    <th>Giới Tính</th>
                    <th>Địa Chỉ</th>
                    <th>Điện Thoại</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="docGia in filteredDocGias" :key="docGia._id">
                    <td>{{ docGia.MaDocGia }}</td>
                    <td>{{ docGia.HoLot }}</td>
                    <td>{{ docGia.Ten }}</td>
                    <td>{{ docGia.NgaySinh }}</td>
                    <td>{{ docGia.Phai }}</td>
                    <td>{{ docGia.DiaChi }}</td>
                    <td>{{ docGia.DienThoai }}</td>
                    <td>
                        <button @click="handleAction('edit', docGia)">Chỉnh Sửa</button>
                        <button class="delete-button" @click="handleAction('delete', docGia._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import docgiaService from "@/services/docgia.service";

export default {
    data() {
        return {
            searchQuery: "",
            currentDocGia: {
                MaDocGia: "",
                HoLot: "",
                Ten: "",
                NgaySinh: "",
                Phai: "",
                DiaChi: "",
                DienThoai: "",
            },
            editDocGia: null,
            docGias: [],
            notification: {
                message: "",
                type: ""
            }
        };
    },
    computed: {
        filteredDocGias() {
            return this.docGias.filter((dg) => {
                const searchQuery = this.searchQuery.toLowerCase();
                return (
                    dg.MaDocGia.toLowerCase().includes(searchQuery) ||
                    dg.HoLot.toLowerCase().includes(searchQuery) ||
                    dg.Ten.toLowerCase().includes(searchQuery) ||
                    dg.NgaySinh.toLowerCase().includes(searchQuery) ||
                    dg.Phai.toLowerCase().includes(searchQuery) ||
                    dg.DiaChi.toLowerCase().includes(searchQuery) ||
                    dg.DienThoai.toLowerCase().includes(searchQuery)
                );
            });
        },
    },
    methods: {
        async fetchDocGias() {
            try {
                const docGias = await docgiaService.getDocGia();
                this.docGias = docGias;
            } catch (error) {
                this.showNotification("Lỗi khi tải danh sách độc giả: " + error.message, "error");
            }
        },
        async createDocGia() {
            try {
                await docgiaService.createDocGia(this.currentDocGia);
                this.resetForm();
                this.showNotification("Thêm độc giả thành công!", "success");
                await this.fetchDocGias(); // Refresh data after create
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    this.showNotification("Lỗi khi thêm độc giả: " + error.response.data.message, "error");
                } else {
                    this.showNotification("Lỗi khi thêm độc giả: " + error.message, "error");
                }
            }
        },
        async updateDocGia() {
            try {
                await docgiaService.updateDocGia(this.editDocGia._id, this.currentDocGia);
                this.resetForm();
                this.showNotification("Cập nhật độc giả thành công!", "success");
                await this.fetchDocGias(); // Refresh data after update
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    this.showNotification("Lỗi khi cập nhật độc giả: " + error.response.data.message, "error");
                } else if (error.message === "No information has been updated") {
                    this.showNotification("Không có thông tin nào được cập nhật.", "error");
                } else {
                    this.showNotification("Lỗi khi cập nhật độc giả: " + error.message, "error");
                }
            }
        },
        async deleteDocGia(id) {
            if (confirm("Bạn có chắc chắn muốn xóa độc giả này không?")) {
                try {
                    await docgiaService.deleteDocGia(id);
                    this.docGias = this.docGias.filter((dg) => dg._id !== id);
                    this.showNotification("Xóa độc giả thành công!", "success");
                    await this.fetchDocGias(); // Fetch updated list
                } catch (error) {
                    this.showNotification("Lỗi khi xóa độc giả: " + error.message, "error");
                }
            }
        },
        handleAction(action, payload) {
            if (action === "edit") {
                this.editDocGia = payload;
                this.currentDocGia = { ...payload };
            } else if (action === "delete") {
                this.deleteDocGia(payload);
            }
        },
        resetForm() {
            this.currentDocGia = {
                MaDocGia: "",
                HoLot: "",
                Ten: "",
                NgaySinh: "",
                Phai: "",
                DiaChi: "",
                DienThoai: "",
            };
            this.editDocGia = null;
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
        this.fetchDocGias();
    },
};
</script>

<style scoped>
.manage-dg {
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

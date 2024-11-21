<template>
    <div class="manage-muontra">
        <h1 class="title">Quản lý mượn trả</h1>
        <div class="form-card">
            <h2>{{ editMuonTra ? "Chỉnh Sửa Mượn Trả" : "Thêm Mượn Trả" }}</h2>
            <form @submit.prevent="editMuonTra ? updateMuonTra() : createMuonTra()">
                <select v-model="currentMuonTra.MaDocGia" required>
                    <option disabled value="">Chọn Mã Độc Giả</option>
                    <option v-for="docGia in docGias" :key="docGia.MaDocGia" :value="docGia.MaDocGia">
                        {{ docGia.MaDocGia }} - {{ docGia.HoLot }} {{ docGia.Ten }}
                    </option>
                </select>
                <select v-model="currentMuonTra.MaSach" required>
                    <option disabled value="">Chọn Mã Sách</option>
                    <option v-for="sach in sachs" :key="sach.MaSach" :value="sach.MaSach">
                        {{ sach.MaSach }} - {{ sach.TenSach }}
                    </option>
                </select>
                <input v-model="currentMuonTra.NgayMuon" type="date" placeholder="Ngày Mượn" required />
                <input v-model="currentMuonTra.NgayTra" type="date" placeholder="Ngày Trả" />
                <button type="submit">{{ editMuonTra ? "Lưu" : "Thêm" }}</button>
                <button type="button" @click="resetForm">Hủy</button>
            </form>
        </div>
        <div class="search-add">
            <input v-model="searchQuery" placeholder="Tìm kiếm mượn trả..." />
            <button @click="exportToExcel">Xuất Excel</button>
        </div>
        <div v-if="notification.message" :class="['notification', notification.type]">
            {{ notification.message }}
        </div>
        <table>
            <thead>
                <tr>
                    <th @click="sortTable('MaDocGia')">Mã Độc Giả <span v-if="sortKey === 'MaDocGia'">{{ sortOrder === 1
                        ? '▲' : '▼' }}</span></th>
                    <th @click="sortTable('MaSach')">Mã Sách <span v-if="sortKey === 'MaSach'">{{ sortOrder === 1 ? '▲'
                        : '▼' }}</span></th>
                    <th @click="sortTable('NgayMuon')">Ngày Mượn <span v-if="sortKey === 'NgayMuon'">{{ sortOrder === 1
                        ? '▲' : '▼' }}</span></th>
                    <th @click="sortTable('NgayTra')">Ngày Trả <span v-if="sortKey === 'NgayTra'">{{ sortOrder === 1 ?
                        '▲' : '▼' }}</span></th>
                    <th @click="sortTable('TrangThai')">Trạng Thái <span v-if="sortKey === 'TrangThai'">{{ sortOrder ===
                        1 ? '▲' : '▼' }}</span></th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="muonTra in sortedMuonTras" :key="muonTra._id">
                    <td>{{ muonTra.MaDocGia }}</td>
                    <td>{{ muonTra.MaSach }}</td>
                    <td>{{ muonTra.NgayMuon }}</td>
                    <td>{{ muonTra.NgayTra }}</td>
                    <td :class="{ 'status-returned': muonTra.NgayTra, 'status-borrowed': !muonTra.NgayTra }">
                        {{ muonTra.NgayTra ? "Đã Trả" : "Đang Mượn" }}
                    </td>
                    <td>
                        <button @click="handleAction('edit', muonTra)">Chỉnh Sửa</button>
                        <button class="delete-button" @click="handleAction('delete', muonTra._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import theodoimuontraService from "@/services/theodoimuontra.service";
import docGiaService from "@/services/docgia.service";
import sachService from "@/services/sach.service";
import * as XLSX from "xlsx";

export default {
    data() {
        return {
            searchQuery: "",
            currentMuonTra: {
                MaDocGia: "",
                MaSach: "",
                NgayMuon: "",
                NgayTra: "",
            },
            editMuonTra: null,
            muonTras: [],
            docGias: [],
            sachs: [],
            notification: {
                message: "",
                type: ""
            },
            sortKey: '',
            sortOrder: 1
        };
    },
    computed: {
        filteredMuonTras() {
            return this.muonTras.filter((muonTra) => {
                const searchQuery = this.searchQuery.toLowerCase();
                return (
                    muonTra.MaDocGia.toLowerCase().includes(searchQuery) ||
                    muonTra.MaSach.toLowerCase().includes(searchQuery)
                );
            });
        },
        sortedMuonTras() {
            return this.filteredMuonTras.sort((a, b) => {
                let modifier = this.sortOrder;
                if (this.sortKey === 'TrangThai') {
                    const aStatus = a.NgayTra ? "Đã Trả" : "Đang Mượn";
                    const bStatus = b.NgayTra ? "Đã Trả" : "Đang Mượn";
                    if (aStatus < bStatus) return -1 * modifier;
                    if (aStatus > bStatus) return 1 * modifier;
                    return 0;
                } else {
                    if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
                    if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
                    return 0;
                }
            });
        }
    },
    methods: {
        async fetchMuonTras() {
            try {
                const muonTras = await theodoimuontraService.getTheodoimuontra();
                this.muonTras = muonTras;
            } catch (error) {
                this.showNotification("Lỗi khi tải danh sách mượn trả: " + error.message, "error");
            }
        },
        async fetchDocGias() {
            try {
                const docGias = await docGiaService.getDocGia();
                this.docGias = docGias;
            } catch (error) {
                this.showNotification("Lỗi khi tải danh sách độc giả: " + error.message, "error");
            }
        },
        async fetchSachs() {
            try {
                const sachs = await sachService.getBooks();
                this.sachs = sachs;
            } catch (error) {
                this.showNotification("Lỗi khi tải danh sách sách: " + error.message, "error");
            }
        },
        async createMuonTra() {
            try {
                await theodoimuontraService.createTheodoimuontra(this.currentMuonTra);
                this.resetForm();
                this.showNotification("Thêm mượn trả thành công!", "success");
                await this.fetchMuonTras(); // Refresh data after create
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    this.showNotification("Lỗi khi thêm mượn trả: " + error.response.data.message, "error");
                } else {
                    this.showNotification("Lỗi khi thêm mượn trả: " + error.message, "error");
                }
            }
        },
        async updateMuonTra() {
            try {
                await theodoimuontraService.updateTheodoimuontra(this.editMuonTra._id, this.currentMuonTra);
                this.resetForm();
                this.showNotification("Cập nhật mượn trả thành công!", "success");
                await this.fetchMuonTras(); // Refresh data after update
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    this.showNotification("Lỗi khi cập nhật mượn trả: " + error.response.data.message, "error");
                } else if (error.message) {
                    this.showNotification("Lỗi khi cập nhật mượn trả: " + error.message, "error");
                } else {
                    this.showNotification("Lỗi không xác định khi cập nhật mượn trả.", "error");
                }
            }
        },
        async deleteMuonTra(id) {
            if (confirm("Bạn có chắc chắn muốn xóa mượn trả này không?")) {
                try {
                    await theodoimuontraService.deleteTheodoimuontra(id);
                    this.muonTras = this.muonTras.filter((muonTra) => muonTra._id !== id);
                    this.showNotification("Xóa mượn trả thành công!", "success");
                    await this.fetchMuonTras(); // Fetch updated list
                } catch (error) {
                    this.showNotification("Lỗi khi xóa mượn trả: " + error.message, "error");
                }
            }
        },
        handleAction(action, payload) {
            if (action === "edit") {
                this.editMuonTra = payload;
                this.currentMuonTra = { ...payload };
            } else if (action === "delete") {
                this.deleteMuonTra(payload);
            }
        },
        resetForm() {
            this.currentMuonTra = {
                MaDocGia: "",
                MaSach: "",
                NgayMuon: "",
                NgayTra: "",
            };
            this.editMuonTra = null;
        },
        showNotification(message, type) {
            this.notification.message = message;
            this.notification.type = type;
            setTimeout(() => {
                this.notification.message = "";
                this.notification.type = "";
            }, 3000);
        },
        sortTable(key) {
            if (this.sortKey === key) {
                this.sortOrder *= -1;
            } else {
                this.sortKey = key;
                this.sortOrder = 1;
            }
        },
        exportToExcel() {
            const data = this.muonTras.map(muonTra => ({
                "Mã Độc Giả": muonTra.MaDocGia,
                "Mã Sách": muonTra.MaSach,
                "Ngày Mượn": muonTra.NgayMuon,
                "Ngày Trả": muonTra.NgayTra || "Chưa trả",
                "Trạng Thái": muonTra.NgayTra ? "Đã Trả" : "Đang Mượn",
                "Tổng Số Lượt Mượn": this.calculateTotalBorrowCount(muonTra.MaSach),
                "Tổng Số Lượt Trả": this.calculateTotalReturnCount(muonTra.MaSach)
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Thống Kê Mượn Trả");

            XLSX.writeFile(workbook, "ThongKeMuonTra.xlsx");
        },
        calculateTotalBorrowCount(maSach) {
            return this.muonTras.filter(muonTra => muonTra.MaSach === maSach).length;
        },
        calculateTotalReturnCount(maSach) {
            return this.muonTras.filter(muonTra => muonTra.MaSach === maSach && muonTra.NgayTra).length;
        },
    },
    created() {
        this.fetchMuonTras();
        this.fetchDocGias();
        this.fetchSachs();
    },
};
</script>

<style scoped>
.manage-muontra {
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
    text-align: center;
    /* Center align all columns */
}

th {
    background-color: #f2f2f2;
    cursor: pointer;
    /* Indicate that columns are sortable */
}

.status-returned {
    background-color: #d4edda;
    color: #155724;
}

.status-borrowed {
    background-color: #cce5ff;
    color: #004085;
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

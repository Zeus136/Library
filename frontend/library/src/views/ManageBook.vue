<template>
    <div class="manage-book">
        <h1 class="title">Quản Lí Sách</h1>
        <div class="form-card">
            <h2>{{ editBook ? "Chỉnh Sửa Sách" : "Thêm Sách" }}</h2>
            <form @submit.prevent="editBook ? updateBook() : createBook()">
                <input v-model="currentBook.MaSach" placeholder="Mã Sách" required />
                <input v-model="currentBook.TenSach" placeholder="Tên Sách" required />
                <input v-model.number="currentBook.DonGia" placeholder="Đơn Giá" type="number" required />
                <input v-model.number="currentBook.SoQuyen" placeholder="Số Quyển" type="number" required />
                <input v-model.number="currentBook.NamXuatBan" placeholder="Năm Xuất Bản" type="year" required />
                <select v-model="currentBook.MaNXB" required>
                    <option value="" disabled>Chọn Nhà Xuất Bản</option>
                    <option v-for="nxb in nxbs" :key="nxb.MaNXB" :value="nxb.MaNXB">{{ nxb.TenNXB }} - {{ nxb.MaNXB }}
                    </option>
                </select>
                <input v-model="currentBook.NguonGoc" placeholder="Nguồn Gốc" required />
                <button type="submit">{{ editBook ? "Lưu" : "Thêm" }}</button>
                <button type="button" @click="resetForm">Hủy</button>
            </form>
        </div>
        <div class="search-add">
            <input v-model="searchQuery" placeholder="Tìm kiếm sách..." />
        </div>
        <div v-if="notification.message" :class="['notification', notification.type]">
            {{ notification.message }}
        </div>
        <table>
            <thead>
                <tr>
                    <th>Mã Sách</th>
                    <th>Tên Sách</th>
                    <th class="center">Đơn Giá</th>
                    <th class="center">Số Quyển</th>
                    <th class="center">Năm Xuất Bản</th>
                    <th>Mã NXB</th>
                    <th>Nguồn Gốc</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in filteredBooks" :key="book._id">
                    <td>{{ book.MaSach }}</td>
                    <td>{{ book.TenSach }}</td>
                    <td class="center">{{ book.DonGia }}</td>
                    <td class="center">{{ book.SoQuyen }}</td>
                    <td class="center">{{ book.NamXuatBan }}</td>
                    <td>{{ book.MaNXB }}</td>
                    <td>{{ book.NguonGoc }}</td>
                    <td>
                        <button @click="handleAction('edit', book)">Chỉnh Sửa</button>
                        <button class="delete-button" @click="handleAction('delete', book._id)">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import bookService from "@/services/sach.service";
import nxbService from "@/services/nxb.service";

export default {
    data() {
        return {
            searchQuery: "",
            currentBook: {
                MaSach: "",
                TenSach: "",
                DonGia: "",
                SoQuyen: "",
                NamXuatBan: "",
                MaNXB: "",
                NguonGoc: "",
            },
            editBook: null,
            books: [],
            nxbs: [],
            notification: {
                message: "",
                type: ""
            }
        };
    },
    computed: {
        filteredBooks() {
            return this.books.filter((book) => {
                const searchQuery = this.searchQuery.toLowerCase();
                return (
                    book.MaSach.toLowerCase().includes(searchQuery) ||
                    book.TenSach.toLowerCase().includes(searchQuery) ||
                    book.DonGia.toString().toLowerCase().includes(searchQuery) ||
                    book.SoQuyen.toString().toLowerCase().includes(searchQuery) ||
                    book.NamXuatBan.toString().toLowerCase().includes(searchQuery) ||
                    book.MaNXB.toLowerCase().includes(searchQuery) ||
                    book.NguonGoc.toLowerCase().includes(searchQuery)
                );
            });
        },
    },
    methods: {
        async fetchBooks() {
            try {
                const books = await bookService.getBooks();
                this.books = books;
            } catch (error) {
                this.showNotification("Lỗi khi tải danh sách sách: " + error.message, "error");
            }
        },
        async fetchNXBs() {
            try {
                const nxbs = await nxbService.getNXBs();
                this.nxbs = nxbs;
            } catch (error) {
                this.showNotification("Lỗi khi tải danh sách nhà xuất bản: " + error.message, "error");
            }
        },
        async createBook() {
            try {
                await bookService.createBook(this.currentBook);
                this.resetForm();
                this.showNotification("Thêm sách thành công!", "success");
                await this.fetchBooks(); // Refresh data after create
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    this.showNotification("Lỗi khi thêm sách: " + error.response.data.message, "error");
                } else {
                    this.showNotification("Lỗi khi thêm sách: " + error.message, "error");
                }
            }
        },
        async updateBook() {
            try {
                await bookService.updateBook(this.editBook._id, this.currentBook);
                this.resetForm();
                this.showNotification("Cập nhật sách thành công!", "success");
                await this.fetchBooks(); // Refresh data after update
            } catch (error) {
                const errorMessage = error.response?.data?.message || error.message;
                this.showNotification("Lỗi khi cập nhật sách: " + errorMessage, "error");
            }
        },
        async deleteBook(id) {
            if (confirm("Bạn có chắc chắn muốn xóa sách này không?")) {
                try {
                    await bookService.deleteBook(id);
                    this.books = this.books.filter((book) => book._id !== id);
                    this.showNotification("Xóa sách thành công!", "success");
                    await this.fetchBooks(); // Fetch updated list
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message;
                    this.showNotification("Lỗi khi xóa sách: " + errorMessage, "error");
                }
            }
        },
        handleAction(action, payload) {
            if (action === "edit") {
                this.editBook = payload;
                this.currentBook = { ...payload };
            } else if (action === "delete") {
                this.deleteBook(payload);
            }
        },
        resetForm() {
            this.currentBook = {
                MaSach: "",
                TenSach: "",
                DonGia: "",
                SoQuyen: "",
                NamXuatBan: "",
                MaNXB: "",
                NguonGoc: "",
            };
            this.editBook = null;
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
        this.fetchBooks();
        this.fetchNXBs();
    },
};
</script>

<style scoped>
.manage-book {
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

th.center,
td.center {
    text-align: center;
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

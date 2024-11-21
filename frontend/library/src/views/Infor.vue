<template>
    <div class="infor-page">
        <div class="infor-container">
            <h1 class="infor-title">Thông tin cá nhân</h1>
            <div class="infor-details">
                <div class="infor-row">
                    <strong>Mã số nhân viên:</strong>
                    <span>{{ nhanVien.MSNV }}</span>
                </div>
                <div class="infor-row">
                    <strong>Tên:</strong>
                    <input v-if="isEditing" v-model="editData.HoTenNV" />
                    <span v-else>{{ nhanVien.HoTenNV }}</span>
                </div>
                <div class="infor-row">
                    <strong>Chức vụ:</strong>
                    <span>{{ nhanVien.ChucVu }}</span>
                </div>
                <div class="infor-row">
                    <strong>Địa chỉ:</strong>
                    <input v-if="isEditing" v-model="editData.DiaChi" />
                    <span v-else>{{ nhanVien.DiaChi }}</span>
                </div>
                <div class="infor-row">
                    <strong>Số điện thoại:</strong>
                    <input v-if="isEditing" v-model="editData.SoDienThoai" />
                    <span v-else>{{ nhanVien.SoDienThoai }}</span>
                </div>
                <div class="button-group">
                    <button v-if="!isEditing" @click="startEditing">Chỉnh sửa</button>
                    <div v-else>
                        <button @click="saveChanges" :disabled="!editData.HoTenNV">Lưu</button>
                        <button @click="cancelEditing">Hủy</button>
                    </div>
                    <button @click="openPasswordModal">Đổi mật khẩu</button>
                </div>
                <p v-if="message" :class="{ 'message': true, 'error': isError }">{{ message }}</p>
            </div>
        </div>

        <div v-if="isPasswordModalOpen" class="modal">
            <div class="modal-content">
                <h2>Đổi mật khẩu</h2>
                <input type="password" v-model="newPassword" placeholder="Mật khẩu mới" />
                <div class="modal-buttons">
                    <button @click="changePassword">Lưu</button>
                    <button @click="closePasswordModal">Hủy</button>
                </div>
                <p v-if="passwordMessage" :class="{ 'message': true, 'error': isPasswordError }">{{ passwordMessage }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import nhanvienService from '@/services/nhanvien.service';

export default {
    data() {
        return {
            isEditing: false,
            editData: {},
            message: '',
            isError: false,
            isPasswordModalOpen: false,
            newPassword: '',
            passwordMessage: '',
            isPasswordError: false
        };
    },
    computed: {
        ...mapState(['_id', 'MSNV', 'HoTenNV', 'ChucVu', 'DiaChi', 'SoDienThoai']),
        nhanVien() {
            return {
                _id: this._id,
                MSNV: this.MSNV,
                HoTenNV: this.HoTenNV,
                ChucVu: this.ChucVu,
                DiaChi: this.DiaChi,
                SoDienThoai: this.SoDienThoai
            };
        }
    },
    created() {
        this.fetchNhanVien();
    },
    methods: {
        async fetchNhanVien() {
            try {
                const response = await nhanvienService.getNhanVienByMSNV(this.MSNV);
                this.$store.commit('setUserData', response);
            } catch (error) {
                console.error('Error fetching nhan vien data:', error);
            }
        },
        startEditing() {
            this.isEditing = true;
            this.editData = { ...this.nhanVien };
        },
        async saveChanges() {
            if (!this.editData.HoTenNV) {
                this.message = 'Tên không được bỏ trống.';
                this.isError = true;
                return;
            }
            if (JSON.stringify(this.editData) === JSON.stringify(this.nhanVien)) {
                this.message = 'Không có thay đổi nào để lưu.';
                this.isError = true;
                return;
            }
            try {
                await nhanvienService.updateNhanVienByMSNV(this.MSNV, this.editData);
                this.$store.commit('setUserData', this.editData);
                this.isEditing = false;
                this.message = 'Cập nhật thành công!';
                this.isError = false;
            } catch (error) {
                console.error('Error updating nhan vien data:', error);
                this.message = `Cập nhật thất bại. Lỗi: ${error.message}`;
                this.isError = true;
            }
        },
        cancelEditing() {
            this.isEditing = false;
            this.editData = {};
            this.message = '';
            this.isError = false;
        },
        openPasswordModal() {
            this.isPasswordModalOpen = true;
        },
        closePasswordModal() {
            this.isPasswordModalOpen = false;
            this.newPassword = '';
            this.passwordMessage = '';
            this.isPasswordError = false;
        },
        async changePassword() {
            if (!this.newPassword) {
                this.passwordMessage = 'Mật khẩu không được bỏ trống.';
                this.isPasswordError = true;
                return;
            }
            try {
                await nhanvienService.updatePasswordById(this._id, this.newPassword);
                this.passwordMessage = 'Đổi mật khẩu thành công!';
                this.isPasswordError = false;
                this.closePasswordModal();
            } catch (error) {
                console.error('Error changing password:', error);
                if (error.response && error.response.data.message) {
                    this.passwordMessage = `Đổi mật khẩu thất bại. Lỗi: ${error.response.data.message}`;
                } else {
                    this.passwordMessage = `Đổi mật khẩu thất bại. Lỗi: ${error.message}`;
                }
                this.isPasswordError = true;
            }
        }
    }
};
</script>

<style scoped>
.infor-page {
    display: flex;
    justify-content: center;
    align-items: center;
}

.infor-container {
    background-color: #ffffff;
    padding: 50px;
    border-radius: 12px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    width: 450px;
    text-align: center;
}

.infor-title {
    font-size: 28px;
    color: #333;
    margin-bottom: 25px;
    font-weight: bold;
}

.infor-details {
    text-align: left;
}

.infor-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0;
}

.infor-row strong {
    flex: 1;
    text-align: left;
    color: #333;
}

.infor-row span,
.infor-row input {
    flex: 2;
    text-align: center;
}

input {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}

button {
    padding: 10px 20px;
    background-color: #1877f2;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #166fe5;
}

button+button {
    margin-left: 20px;
    background-color: #dc3545;
}

button+button:hover {
    background-color: #c82333;
}

.message {
    margin-top: 20px;
    font-size: 16px;
    color: #28a745;
}

.error {
    color: #dc3545;
}

/* Modal styling */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    width: 300px;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.modal-buttons button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.modal-buttons button:first-child {
    background-color: #1877f2;
    color: #fff;
}

.modal-buttons button:first-child:hover {
    background-color: #166fe5;
}

.modal-buttons button:last-child {
    background-color: #dc3545;
    color: #fff;
}

.modal-buttons button:last-child:hover {
    background-color: #c82333;
}
</style>

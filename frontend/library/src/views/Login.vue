<template>
    <div class="login-page">
        <div class="login-form-container">
            <h2 class="login-title">Đăng nhập</h2>

            <form @submit.prevent="handleLogin" class="login-form">
                <div class="input-group">
                    <label for="msnv" class="form-label">Mã số nhân viên</label>
                    <input type="text" v-model="msnv" id="msnv" class="form-control" required @input="clearError" />
                </div>
                <div class="input-group">
                    <label for="password" class="form-label">Mật khẩu</label>
                    <input type="password" v-model="password" id="password" class="form-control" required
                        @input="clearError" />
                </div>
                <button type="submit" class="btn btn-primary" :disabled="isLoading">
                    <span v-if="isLoading">Đang đăng nhập...</span>
                    <span v-else>Đăng nhập</span>
                </button>
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </form>
        </div>
    </div>
</template>

<script>
import nhanvienService from "@/services/nhanvien.service";

export default {
    data() {
        return {
            msnv: "",
            password: "",
            errorMessage: "",
            isLoading: false,
        };
    },
    methods: {
        async handleLogin() {
            this.isLoading = true;
            try {
                const response = await nhanvienService.login({ msnv: this.msnv, password: this.password });
                const userData = {
                    _id: response._id,
                    MSNV: response.MSNV,
                    HoTenNV: response.HoTenNV,
                    ChucVu: response.ChucVu,
                    DiaChi: response.DiaChi,
                    SoDienThoai: response.SoDienThoai,
                    Password: this.password,
                };
                // Gọi action login để lưu thông tin vào Vuex store
                this.$store.dispatch("login", userData);
                // Chuyển hướng theo role
                if (userData.ChucVu === "Thủ thư") {
                    this.$router.push("/manage-books");
                } else {
                    this.$router.push("/manage-staffs");
                }
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
                } else {
                    this.errorMessage = "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
                }
            } finally {
                this.isLoading = false;
            }
        },
        clearError() {
            this.errorMessage = "";
        },
        goToRegister() {
            this.$router.push("/register");
        },
    },
};
</script>

<style scoped>
/* Outer container for the login page, centering the form */
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 350px;
}

/* Container for the login form */
.login-form-container {
    width: 100%;
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.789);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    text-align: center;
}

/* Title style */
.login-title {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    font-weight: bold;
}

/* Form styling */
.login-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
}

/* Input group styling */
.input-group {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.form-label {
    font-weight: 500;
    color: #000000;
    font-size: 14px;
    margin-bottom: 5px;
}

/* Input field styling */
input.form-control {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #dddfe2;
    border-radius: 10px !important;
    box-sizing: border-box;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:hover {
    border-color: #1877f2;
}

.form-control:focus {
    border-color: #1877f2;
    outline: none;
    box-shadow: 0 0 4px rgba(24, 119, 242, 0.3);
}

/* Error message styling */
.error-message {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 10px;
}

/* Primary button for login */
.btn-primary {
    width: 50%;
    padding: 10px;
    background-color: #1877f2;
    color: #fff;
    border: none;
    border-radius: 20px;
    font-size: 17px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-primary:disabled {
    background-color: #a0c4f2;
    cursor: not-allowed;
}

.btn-primary:hover:not(:disabled) {
    background-color: #166fe5;
}

/* Styles for register link and secondary button */
.register-link {
    margin-top: 20px;
    text-align: center;
}

.register-link p {
    margin-bottom: 10px;
    font-size: 14px;
    color: #606770;
}

.btn-secondary {
    width: 50%;
    padding: 10px;
    background-color: #42b72a;
    color: #fff;
    border: none;
    border-radius: 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-secondary:hover {
    background-color: #36a420;
}
</style>

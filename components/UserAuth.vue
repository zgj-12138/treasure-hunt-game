<template>
  <div class="user-auth">
    <!-- 登录模态框 -->
    <div v-if="showLogin" class="modal-layer">
      <div class="modal">
        <div class="modal-header">
          <h3>登录</h3>
          <button @click="closeLogin" class="btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="loginForm.username" type="text" placeholder="请输入用户名">
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="loginForm.password" type="password" placeholder="请输入密码">
          </div>
        </div>
        <div class="modal-footer">
          <button @click="login" class="btn btn-primary">登录</button>
        </div>
      </div>
    </div>

    <!-- 注册模态框 -->
    <div v-if="showRegister" class="modal-layer">
      <div class="modal">
        <div class="modal-header">
          <h3>注册</h3>
          <button @click="closeRegister" class="btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="registerForm.username" type="text" placeholder="请输入用户名">
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="registerForm.password" type="password" placeholder="请输入密码">
          </div>
          <div class="form-group">
            <label>确认密码</label>
            <input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码">
          </div>
        </div>
        <div class="modal-footer">
          <button @click="register" class="btn btn-primary">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserAuth',
  props: {
    showLogin: {
      type: Boolean,
      default: false
    },
    showRegister: {
      type: Boolean,
      default: false
    }
  },
  emits: ['login', 'register', 'close-login', 'close-register'],
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    login() {
      this.$emit('login', this.loginForm);
      this.resetLoginForm();
    },
    
    register() {
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        alert('两次输入的密码不一致');
        return;
      }
      this.$emit('register', this.registerForm);
      this.resetRegisterForm();
    },
    
    closeLogin() {
      this.$emit('close-login');
      this.resetLoginForm();
    },
    
    closeRegister() {
      this.$emit('close-register');
      this.resetRegisterForm();
    },
    
    resetLoginForm() {
      this.loginForm = { username: '', password: '' };
    },
    
    resetRegisterForm() {
      this.registerForm = { username: '', password: '', confirmPassword: '' };
    }
  }
}
</script>

<style scoped>
.modal-layer {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
  z-index: 20;
  padding: 16px;
}

.modal {
  width: min(92vw, 720px);
  max-height: 88vh;
  background: #11161e;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.55);
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0));
}

.modal-body {
  padding: 12px;
  overflow: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 6px;
  background: #1a2230;
  color: #fff;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #63b2ff;
}

.btn {
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.25);
  background: #1a2230;
  color: #fff;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}

.btn:hover { 
  transform: translateY(-1px); 
  background: #243049; 
  box-shadow: 0 6px 18px rgba(0,0,0,0.35); 
}

.btn-primary { 
  border-color: rgba(99,178,255,0.5); 
  background: #215795; 
}

.btn-primary:hover { 
  background: #2a6fbf; 
}
</style>

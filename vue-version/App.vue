<template>
  <div id="app">
    <div class="app">
      <h1 class="title">寻宝小游戏 - Vue版</h1>
      
      <!-- 导航栏 -->
      <div class="nav">
        <button @click="showLogin = true" v-if="!currentUser" class="btn">登录</button>
        <button @click="showRegister = true" v-if="!currentUser" class="btn">注册</button>
        
        <div v-if="currentUser" class="user-info">
          <img :src="currentUser.avatar" :alt="currentUser.username" class="user-avatar">
          <span>{{ currentUser.username }}</span>
          <button @click="logout" class="btn">退出</button>
        </div>
        
        <button @click="showCollection = true" class="btn">收藏室</button>
        <button @click="showLeaderboard = true" class="btn">排行榜</button>
      </div>

      <!-- 游戏地图 -->
      <GameMap 
        v-if="currentUser"
        :is-exploring="isExploring"
        @enter-region="enterRegion"
      />

      <!-- 用户认证组件 -->
      <UserAuth
        :show-login="showLogin"
        :show-register="showRegister"
        @login="handleLogin"
        @register="handleRegister"
        @close-login="showLogin = false"
        @close-register="showRegister = false"
      />

      <!-- 区域详情模态框 -->
      <div v-if="showRegionDetail" class="modal-layer">
        <div class="modal">
          <div class="modal-header">
            <h3>区域：{{ currentRegion }}</h3>
            <button @click="closeRegionDetail" class="btn">✕</button>
          </div>
          <div class="modal-body">
            <img :src="`/图片/地图/${currentRegion}.jpg`" :alt="currentRegion" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px;">
            <p style="margin-top: 12px; text-align: center;">点击"开始探索"后将触发事件</p>
          </div>
          <div class="modal-footer">
            <button @click="closeRegionDetail" class="btn">返回地图</button>
            <button @click="startExplore" class="btn btn-primary">开始探索</button>
          </div>
        </div>
      </div>

      <!-- 事件模态框 -->
      <div v-if="showEvent" class="modal-layer">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ eventData.title }}</h3>
            <button @click="closeEvent" class="btn">✕</button>
          </div>
          <div class="modal-body">
            <img v-if="eventData.imgSrc" :src="eventData.imgSrc" :alt="eventData.title" style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px;">
            <p style="margin-top: 12px;">{{ eventData.text }}</p>
          </div>
          <div class="modal-footer">
            <button v-if="eventData.secondaryText" @click="handleEventAction('secondary')" class="btn">{{ eventData.secondaryText }}</button>
            <button @click="handleEventAction('primary')" class="btn btn-primary">{{ eventData.primaryText }}</button>
          </div>
        </div>
      </div>

      <!-- 收藏室组件 -->
      <CollectionRoom
        :visible="showCollection"
        :collected-items="collectedItems"
        @close="showCollection = false"
        @clear-collection="clearCollection"
      />

      <!-- 排行榜组件 -->
      <Leaderboard
        :visible="showLeaderboard"
        :leaderboard="leaderboard"
        @close="showLeaderboard = false"
        @refresh="refreshLeaderboard"
      />
    </div>
  </div>
</template>

<script>
import GameMap from './components/GameMap.vue'
import UserAuth from './components/UserAuth.vue'
import CollectionRoom from './components/CollectionRoom.vue'
import Leaderboard from './components/Leaderboard.vue'

export default {
  name: 'App',
  components: {
    GameMap,
    UserAuth,
    CollectionRoom,
    Leaderboard
  },
  data() {
    return {
      // 用户相关
      currentUser: null,
      showLogin: false,
      showRegister: false,
      
      // 游戏相关
      showRegionDetail: false,
      showEvent: false,
      showCollection: false,
      showLeaderboard: false,
      isExploring: false,
      
      // 游戏数据
      currentRegion: '',
      eventData: {},
      collectedItems: new Set(),
      // 强制更新排行榜的响应式数据
      leaderboardUpdateTrigger: 0,
      
      // 音乐相关
      bgm: null,
      battleTracks: ["战斗小曲_01.mp4", "战斗小曲_02.mp4"],
      treasureTracks: ["得吃小曲_01.mp4"],
      failTracks: ["失败小曲_01.mp4", "失败小曲_02.mp4"],
      homeTracks: [
        "鼠鼠小曲_01.mp4", "鼠鼠小曲_02.mp4", "鼠鼠小曲_03.mp4",
        "鼠鼠小曲_04.mp4", "鼠鼠小曲_05.mp4", "鼠鼠小曲_06.mp4", "鼠鼠小曲_07.mp4"
      ]
    }
  },
  
  computed: {
    leaderboard() {
      // 使用响应式触发器强制更新
      this.leaderboardUpdateTrigger;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users
        .map(user => ({
          ...user,
          treasureCount: this.getUserTreasureCount(user.username)
        }))
        .sort((a, b) => b.treasureCount - a.treasureCount)
        .slice(0, 10);
    }
  },
  
  mounted() {
    this.initBGM();
    this.loadUserData();
    this.loadCollection();
  },
  
  methods: {
    // 用户管理
    handleLogin(loginData) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.username === loginData.username && u.password === loginData.password);
      
      if (user) {
        this.currentUser = user;
        this.showLogin = false;
        this.loadCollection();
        this.playHomeBGM();
      } else {
        alert('用户名或密码错误');
      }
    },
    
    handleRegister(registerData) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.username === registerData.username)) {
        alert('用户名已存在');
        return;
      }
      
      const newUser = {
        username: registerData.username,
        password: registerData.password,
        avatar: '/图片/鼠鼠/跑刀鼠鼠.jpg',
        registerTime: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      this.currentUser = newUser;
      this.showRegister = false;
      this.playHomeBGM();
    },
    
    logout() {
      this.currentUser = null;
      this.collectedItems.clear();
      this.showCollection = false;
      this.showLeaderboard = false;
    },
    
    loadUserData() {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        this.loadCollection();
      }
    },
    
    // 游戏逻辑
    enterRegion(regionName) {
      this.currentRegion = regionName;
      this.showRegionDetail = true;
    },
    
    closeRegionDetail() {
      this.showRegionDetail = false;
      this.currentRegion = '';
    },
    
    async startExplore() {
      this.showRegionDetail = false;
      this.isExploring = true;
      
      // 模拟探索过程
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      this.isExploring = false;
      this.triggerRandomEvent();
    },
    
    triggerRandomEvent() {
      const events = ["找到宝藏", "遭遇敌人", "无功而返"];
      const eventText = events[Math.floor(Math.random() * events.length)];
      
      if (eventText === '遭遇敌人') {
        this.showBattleEvent();
      } else if (eventText === '找到宝藏') {
        this.showTreasureEvent();
      } else {
        this.showFailEvent();
      }
    },
    
    showBattleEvent() {
      this.eventData = {
        title: '遭遇战斗',
        imgSrc: '/图片/事件/遭遇战斗.jpg',
        text: '你遭遇了敌人，选择你的行动。',
        primaryText: '猛攻',
        secondaryText: '逃跑',
        onPrimary: () => {
          const success = Math.random() < 0.5;
          if (success) {
            this.showTreasureEvent();
          } else {
            this.showFailEvent('battle_fail');
          }
        },
        onSecondary: () => {
          this.showFailEvent('escape');
        }
      };
      this.showEvent = true;
      this.playEventMusic('遭遇敌人');
    },
    
    showTreasureEvent() {
      const itemImages = [
        "便捷军用雷达.jpg", "超算单元.jpg", "微型反应炉.jpg", "主战坦克模型.jpg", 
        "纵横.jpg", "万金泪冠.jpg", "碳纤维板.jpg", "扫拖一体机器人.jpg", 
        "绝密服务器.jpg", "复苏呼吸机.jpg", "非洲之心.jpg"
      ];
      const chosenItem = itemImages[Math.floor(Math.random() * itemImages.length)];
      this.collectedItems.add(chosenItem);
      this.saveCollection();
      
      this.eventData = {
        title: '找到宝藏',
        imgSrc: `/图片/物品/${chosenItem}`,
        text: '恭喜，你找到了宝藏！',
        primaryText: '收下宝藏并返回地图',
        onPrimary: () => {
          this.closeEvent();
          this.playHomeBGM();
        }
      };
      this.showEvent = true;
      this.playEventMusic('找到宝藏');
    },
    
    showFailEvent(reason) {
      let text = '你本次探索无功而返';
      if (reason === 'battle_fail') text = '你遭遇六套护航双子星，拼尽全力无法战胜';
      if (reason === 'escape') text = '你选择仓皇撤退';
      
      this.eventData = {
        title: '无功而返',
        imgSrc: '',
        text: text,
        primaryText: '返回地图',
        onPrimary: () => {
          this.closeEvent();
          this.playHomeBGM();
        }
      };
      this.showEvent = true;
      this.playEventMusic('无功而返');
    },
    
    handleEventAction(action) {
      if (action === 'primary' && this.eventData.onPrimary) {
        this.eventData.onPrimary();
      } else if (action === 'secondary' && this.eventData.onSecondary) {
        this.eventData.onSecondary();
      }
      this.closeEvent();
    },
    
    closeEvent() {
      this.showEvent = false;
      this.eventData = {};
    },
    
    // 收藏室
    loadCollection() {
      if (this.currentUser) {
        const key = `collection_${this.currentUser.username}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          this.collectedItems = new Set(JSON.parse(saved));
        }
      }
    },
    
    saveCollection() {
      if (this.currentUser) {
        const key = `collection_${this.currentUser.username}`;
        localStorage.setItem(key, JSON.stringify([...this.collectedItems]));
        // 触发排行榜更新
        this.leaderboardUpdateTrigger++;
      }
    },
    
    clearCollection() {
      this.collectedItems.clear();
      this.saveCollection();
      // 触发排行榜更新
      this.leaderboardUpdateTrigger++;
    },
    
    getUserTreasureCount(username) {
      const key = `collection_${username}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved).length : 0;
    },
    
    refreshLeaderboard() {
      // 强制触发排行榜重新计算
      this.leaderboardUpdateTrigger++;
    },
    
    // 音乐系统
    initBGM() {
      this.bgm = new Audio();
      this.bgm.loop = true;
    },
    
    playEventMusic(eventText) {
      let tracks = [];
      if (eventText === '遭遇敌人') tracks = this.battleTracks;
      else if (eventText === '找到宝藏') tracks = this.treasureTracks;
      else if (eventText === '无功而返') tracks = this.failTracks;
      
      if (tracks.length > 0) {
        const track = tracks[Math.floor(Math.random() * tracks.length)];
        this.bgm.src = `/音乐/${track}`;
        this.bgm.play().catch(() => {});
      }
    },
    
    playHomeBGM() {
      const track = this.homeTracks[Math.floor(Math.random() * this.homeTracks.length)];
      this.bgm.src = `/音乐/${track}`;
      this.bgm.play().catch(() => {});
    }
  }
}
</script>

<style>
/* 基础样式 */
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", Arial, "Microsoft YaHei", sans-serif;
  background: #0c0f14;
  color: #f5f6f8;
}

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  min-height: 100vh;
}

.title {
  font-size: 20px;
  letter-spacing: 2px;
}

.nav {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
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
.btn:hover { transform: translateY(-1px); background: #243049; box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
.btn-primary { border-color: rgba(99,178,255,0.5); background: #215795; }
.btn-primary:hover { background: #2a6fbf; }

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

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
</style>

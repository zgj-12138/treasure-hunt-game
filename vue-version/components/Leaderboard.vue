<template>
  <div v-if="visible" class="modal-layer">
    <div class="modal">
      <div class="modal-header">
        <h3>排行榜</h3>
        <button @click="$emit('close')" class="btn">✕</button>
      </div>
      <div class="modal-body">
        <div v-for="(player, index) in leaderboard" :key="player.username" class="leaderboard-item">
          <div :class="['rank', `rank-${index + 1}`]">{{ index + 1 }}</div>
          <img :src="player.avatar" :alt="player.username" class="user-avatar">
          <div class="player-info">
            <div class="player-name">{{ player.username }}</div>
            <div class="treasure-count">收集宝藏：{{ player.treasureCount }} 个</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="$emit('refresh')" class="btn">刷新</button>
        <button @click="$emit('close')" class="btn btn-primary">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Leaderboard',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    leaderboard: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'refresh']
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

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  margin-bottom: 8px;
  background: #0f141b;
}

.rank {
  font-weight: bold;
  font-size: 18px;
  min-width: 30px;
}

.rank-1 { color: #ffd700; }
.rank-2 { color: #c0c0c0; }
.rank-3 { color: #cd7f32; }

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.player-info {
  flex: 1;
}

.player-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.treasure-count {
  font-size: 14px;
  opacity: 0.8;
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

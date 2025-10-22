<template>
  <div class="map-wrap">
    <img class="map-bg" src="/图片/地图/航天基地.jpg" alt="航天基地">
    <img class="player" src="/图片/鼠鼠/跑刀鼠鼠.jpg" alt="玩家头像">

    <!-- 区域热点 -->
    <button 
      v-for="region in regions" 
      :key="region.name"
      class="hotspot"
      :style="{ left: region.x + '%', top: region.y + '%' }"
      @click="$emit('enter-region', region.name)"
    >
      {{ region.name }}
    </button>

    <!-- 探索中动画 -->
    <div v-if="isExploring" class="exploring-mask">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameMap',
  props: {
    isExploring: {
      type: Boolean,
      default: false
    }
  },
  emits: ['enter-region'],
  data() {
    return {
      regions: [
        { name: '浮力室', x: 40, y: 22 },
        { name: '工业区', x: 74, y: 15 },
        { name: '黑室', x: 61, y: 40 },
        { name: '花园', x: 78, y: 30 },
        { name: '蓝室', x: 62, y: 22 },
        { name: '离心机室', x: 35, y: 50 },
        { name: '水平试车间', x: 65, y: 80 },
        { name: '宿舍楼', x: 18, y: 18 },
        { name: '中控楼', x: 50, y: 5 },
        { name: '总裁室', x: 48, y: 38 }
      ]
    }
  }
}
</script>

<style scoped>
.map-wrap {
  position: relative;
  width: min(92vw, 1100px);
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  background: #111;
  user-select: none;
}

.map-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(1.05) contrast(1.05) brightness(0.95);
  transform: scale(1.001);
}

.player {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  box-shadow: 0 6px 16px rgba(0,0,0,0.45);
  border: 2px solid rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.05);
  object-fit: cover;
  z-index: 2;
}

.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.5);
  background: rgba(22, 26, 34, 0.55);
  color: #fff;
  backdrop-filter: blur(6px);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  white-space: nowrap;
  z-index: 3;
}

.hotspot:hover {
  transform: translate(-50%, -50%) scale(1.05);
  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  background: rgba(36, 42, 56, 0.65);
}

.exploring-mask {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 6;
}

.spinner {
  width: 56px;
  height: 56px;
  border: 6px solid rgba(255,255,255,0.25);
  border-top-color: #63b2ff;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin { 
  to { transform: rotate(360deg); } 
}
</style>

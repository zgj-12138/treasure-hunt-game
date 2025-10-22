<template>
  <div v-if="visible" class="modal-layer">
    <div class="modal">
      <div class="modal-header">
        <h3>收藏室</h3>
        <button @click="$emit('close')" class="btn">✕</button>
      </div>
      <div class="modal-body">
        <div class="collection-grid">
          <div 
            v-for="item in itemImages" 
            :key="item"
            :class="['collection-item', { locked: !collectedItems.has(item) }]"
          >
            <img :src="`/图片/物品/${item}`" :alt="item">
            <div class="collection-name">{{ item.replace(/\.[^.]+$/, '') }}</div>
            <div v-if="collectedItems.has(item)" class="collection-badge">已获得</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="clearCollection" class="btn">清空记录</button>
        <button @click="$emit('close')" class="btn btn-primary">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectionRoom',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    collectedItems: {
      type: Set,
      required: true
    }
  },
  emits: ['close', 'clear-collection'],
  data() {
    return {
      itemImages: [
        "便捷军用雷达.jpg", "超算单元.jpg", "微型反应炉.jpg", "主战坦克模型.jpg", 
        "纵横.jpg", "万金泪冠.jpg", "碳纤维板.jpg", "扫拖一体机器人.jpg", 
        "绝密服务器.jpg", "复苏呼吸机.jpg", "非洲之心.jpg"
      ]
    }
  },
  methods: {
    clearCollection() {
      this.$emit('clear-collection');
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

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.collection-item {
  position: relative;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  overflow: hidden;
  background: #0f141b;
}

.collection-item img {
  width: 100%;
  height: 110px;
  object-fit: cover;
  display: block;
}

.collection-name {
  font-size: 12px;
  padding: 6px 8px;
  opacity: 0.85;
}

.collection-item.locked img {
  filter: grayscale(100%);
  opacity: 0.55;
}

.collection-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 999px;
  background: #215795;
  border: 1px solid rgba(99,178,255,0.5);
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

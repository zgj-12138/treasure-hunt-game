#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建 public 目录
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 源目录和目标目录映射
const assetMappings = [
  {
    source: path.join(__dirname, '..', '图片'),
    target: path.join(publicDir, '图片')
  },
  {
    source: path.join(__dirname, '..', '音乐'),
    target: path.join(publicDir, '音乐')
  }
];

// 复制目录函数
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  源目录不存在: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ 复制文件: ${entry.name}`);
    }
  }
}

console.log('🚀 开始设置静态资源...');

// 复制所有资源
assetMappings.forEach(({ source, target }) => {
  console.log(`📁 复制目录: ${source} -> ${target}`);
  copyDir(source, target);
});

console.log('✨ 静态资源设置完成！');
console.log('📝 请确保在 public/ 目录下有 图片/ 和 音乐/ 文件夹');

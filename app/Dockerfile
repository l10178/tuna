FROM node:18-alpine AS base

# 安装 wasp-lang CLI
FROM base AS wasp-builder
RUN apk add --no-cache curl bash
RUN curl -sSL https://get.wasp-lang.dev/installer.sh | bash -s -- -v 0.16.0
ENV PATH="/root/.local/bin:${PATH}"

# 构建阶段
FROM wasp-builder AS builder
WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖并构建项目
RUN npm ci
RUN wasp build

# 运行阶段
FROM base AS runner
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production

# 复制构建产物
COPY --from=builder /app/.wasp/build/. .

# 安装生产依赖
RUN cd server && npm ci --only=production
RUN cd client && npm ci --only=production

# 暴露端口
EXPOSE 3001
EXPOSE 3000

# 启动脚本
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"] 
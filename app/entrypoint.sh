#!/bin/sh
set -e

# 等待数据库准备就绪（如果使用外部数据库）
# 取消注释以下行并修改为您的数据库连接检查
# until nc -z -v -w30 $DB_HOST $DB_PORT; do
#   echo "等待数据库连接..."
#   sleep 2
# done
# echo "数据库已就绪!"

# 运行数据库迁移
echo "运行数据库迁移..."
cd server && npx prisma migrate deploy

# 启动服务器和客户端
echo "启动应用..."
cd /app
node server/server.js & 
cd client && npm run start

# 保持容器运行
exec "$@" 
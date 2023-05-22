cd /home/proj
cd PP/backend
npm i
npm build
pm2 start npm --name "backend" -- start
cd ../frontend
npm i
pm2 start npm --name "frontend" -- start
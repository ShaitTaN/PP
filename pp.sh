yum update n
yum install git -y
mkdir /home/proj
cd /home/proj
git clone https://github.com/ShaitTaN/PP.git
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash - 
source ~/.bashrc
nvm install v16.19.0
npm install -g npm@9.3.0
npm install pm2 -g
cd PP/backend
npm i
npm build
pm2 start npm --name "backend" -- start
cd ../frontend
npm i
pm2 start npm --name "frontend" -- start
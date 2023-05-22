yum update
# nvm install
yum install curl -y 
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash - 
source ~/.bashrc
nvm install 16
nvm use 16
# redis install
yum install epel-release
yum install redis -y
systemctl start redis.service
systemctl enable redis
# git install
yum install git -y
mkdir /home/proj
cd /home/proj
git clone https://github.com/ShaitTaN/PP.git
npm install -g npm@9.3.0
npm install pm2 -g
pm2 update

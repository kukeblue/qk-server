ssh root@42.51.41.129 "cd ~/project/qk-server/; git pull; yarn build-sql; pm2 stop 0 1; yarn server;"
# ssh root@42.51.41.129 "cd ~/project/qk-server2/; git pull; yarn build-sql; pm2 stop 2; yarn server2;"


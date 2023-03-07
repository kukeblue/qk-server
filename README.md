# qk-server

## 服务器地址
http://192.168.31.226


## 注册挖图角色
url: /api/client/check_account_and_role3
请求方式: get
header 'Content-Type: application/json' 
json
```
{
    "gameId": "295141191",   // 游戏id
    "groupId": 1,            // 联动码
    "level": 87,             // 角色等级
    "name": "角色名称",       // 角色名称
    "gameServer": "小梅沙"    // 角色服务器
}
```


## 呼叫给图
url /api/client/update_game_watu_role_status
请求方式: get
header 'Content-Type: application/json' 
json
```
{
    "gameId": "295141191", // 角色id
    "status": "空闲",       // 状态写空闲为呼叫发图
    "order": 1   // order 0-根据等级派发最多地方的   1-只挖麒麟山   2-挖北俱芦洲    3-只挖麒麟和北具
}


# 接口
> 接口路径均为`/api`开头，文档中省略`/api`  
  返回值均为`{ s, data }`形式，s为1表示接口成功返回数据，为0表示接口异常，文档中只列出data中的内容（具体以返回为准）

## GET /getRingList
### 榜单/专题内容列表

#### 参数
参数名|类型|描述|默认值
---|---|---|---
pid|int|榜单id（特殊id -1：最新，-2：最热，-3：背景音，-4：DIY素材）|-
start|int|起始读取记录位置|0
records|int|读取记录数，设为-1时为读取所有记录|20
#### 返回
返回值|类型|描述
---|---|---
list|array|列表
list_count|int|当前数量
total_count|int|总量

## GET /getParts
### 榜单/专题列表

#### 参数
参数名|类型|描述|默认值
---|---|---|---
type|int|类型（支持多选以","分隔）:1-专题,2-榜单,3-分类,4-在线素材;|-
pid|int|专题id（此参数不为空时，参数type不起作用）|空
picwide|int|图片高度,可缺省|-
pichigh|int|图片宽度,可缺省|-
start|int|起始读取记录位置|0
records|int|读取记录数，设为-1时为读取所有记录|20
#### 返回
返回值|类型|描述
---|---|---
list|array|列表
list_count|int|当前数量
total_count|int|总量

## GET /getSearch
### 铃音搜索

#### 参数
参数名|类型|描述|默认值
---|---|---|---
key|string|关键字|-
type|int|搜索范围，多选用“,”分隔，-1 所有，2-电信，3-移动，4-联通，6-个推|4
start|int|起始读取记录位置|0
records|int|读取记录数，设为-1时为读取所有记录|10
#### 返回
返回值|类型|描述
---|---|---
list|array|列表
list_count|int|当前数量
total_count|int|总量

## GET /getReceiveNum
### 获取领取礼包的人数

#### 参数
无
#### 返回
number

## POST /feedback
### 意见反馈

#### 参数
参数名|类型|描述|默认值
---|---|---|---
content|string|反馈内容|-
user|string|用户标识|-
ver|string|spinfocode|-
#### 返回
无

## POST /getLottery
### 抽奖

#### 参数
参数名|类型|描述|默认值
---|---|---|---
lid|string|活动id|-
phone|string|手机号码|-
#### 返回
返回值|类型|描述
---|---|---
code|int|状态 1正常 -1抽奖机会已用完 -3去升级会员 其他。。。 
msg|string|提示信息
data|object|code为1时才有，{ res_str: 抽奖结果, valid_count: 可用抽奖次数 }

## GET /getLotteryNum
### 查询抽奖机会

#### 参数
参数名|类型|描述|默认值
---|---|---|---
lid|string|活动id|-
phone|string|手机号码|-
#### 返回
返回值|类型|描述
---|---|---
code|int|状态 1正常 -3去升级会员 其他。。。 
msg|string|提示信息
data|object|code为1时才有，{ valid_count: 可用次数, valid_count2: 猜铃后抽奖次数 }

## GET /getLotteryLog
### 获奖列表

#### 参数
参数名|类型|描述|默认值
---|---|---|---
lid|string|活动id|-
phone|string|手机号码，无手机号码时返回整个活动的中奖列表，有手机号码时返回该号码的抽奖记录|-
start|int|起始读取记录|0
records|int|读取记录数|20
#### 返回
返回值|类型|描述
---|---|---
list|array|列表
list_count|int|当前数量
total_count|int|总量

## POST /login
### 登录

#### 参数
参数名|类型|描述|默认值
---|---|---|---
phone|string|手机号码|-
checkcode|string|验证码|-
single|boolean|只开会员/彩铃|-
#### 返回
返回值|类型|描述
---|---|---
type|int|登录类型 1普通登录 2登录开会员 3登录开彩铃
user|object|用户信息
order|object|{ code: 1已开通 20开通成功 -21开通失败 -24不支持的开通方式 }
crbt|object|{ code: 1已开通 31开通中 30开通成功 -31开通失败 -33该手机号暂不能参加 -34不支持的开通方式 }

## GET /checkOrder
### 检查会员状态

#### 参数
参数名|类型|描述|默认值
---|---|---|---
phone|string|手机号码|-
#### 返回
boolean

## POST /getCheckCode
### 获取验证码

#### 参数
参数名|类型|描述|默认值
---|---|---|---
phone|string|手机号码|-
dir|int|??|-
type|int|0(默认)-绑定手机;1-订购;2-退订;3-预付费;4-集团炫铃;5-母亲节活动|-
#### 返回
无

## GET /checkCrbt
### 检查彩铃状态

#### 参数
参数名|类型|描述|默认值
---|---|---|---
phone|string|手机号码|-
#### 返回
返回值|类型|描述
---|---|---
code|int|1是彩铃 31正在开通 0未开通

## GET /checkOnFreeCrbt
### 检查能否参加0元彩铃

#### 参数
参数名|类型|描述|默认值
---|---|---|---
phone|string|手机号码|-
#### 返回
boolean

## GET /checkServe
### 检查会员、彩铃业务状态

#### 参数
参数名|类型|描述|默认值
---|---|---|---
phone|string|手机号码|-
#### 返回
返回值|类型|描述
---|---|---
code|int|1会员彩铃 -20非会员 -30非彩铃

## POST /openOrder
### 开会员 只用于普通、短信回复方式开通，验证码方式通过loginOrder方法

#### 参数
无
#### 返回
返回值|类型|描述
---|---|---
user|object|用户信息
crbt|object|{code}
order|object|{code}

## POST /openCrbt
### 开彩铃 只用于普通、短信回复方式开通，验证码方式通过loginCrbt方法

#### 参数
参数名|类型|描述|默认值
---|---|---|---
single|int|??|-
#### 返回
返回值|类型|描述
---|---|---
code|int| 31开通中 1开通成功
order|object|{code} code: 1已经是会员了 20开通成功 -21开通失败 -24'不支持的会员开通方式！'
user|object|用户信息

## POST /setServe
### 会员、彩铃服务设置

#### 参数
无
#### 返回
返回值|类型|描述
---|---|---
code|int|
msg|string|提示信息
order|object|{code}
user|object|用户信息

## POST /setRing
### 彩铃设置

#### 参数
参数名|类型|描述|默认值
---|---|---|---
rid|int|铃音id|-
confirm|boolean|客户端信息提示是否已确认|-
#### 返回
返回值|类型|描述
---|---|---
code|int|0设置彩铃未找到！-32是否确认设置该首彩铃... 1设置成功 31彩铃功能开通中，请耐心等待！ -31开通失败 14彩铃开通短信已下发 -20尚未开通会员服务！ -21开会员失败 15会员开通短信已下发 其他。。
msg|string|提示信息
user|object|用户信息

## GET /getRingDownUrl
### 获取下载地址

#### 参数
参数名|类型|描述|默认值
---|---|---|---
rid|int|铃音id|-
source|int|??|1
type|int|??|1
#### 返回
返回值|类型|描述
---|---|---
code|int|
data|string|铃音url
msg|string|错误信息

## POST /offOrder
### 退订会员

#### 参数
参数名|类型|描述|默认值
---|---|---|---
phone|string|手机号码|-
checkcode|string|验证码|-
#### 返回
返回值|类型|描述
---|---|---
user|object|用户信息
msg|string|提示信息

## GET /comkey
### 获取手机号、且返回当前用户状态

#### 参数
参数名|类型|描述|默认值
---|---|---|---
unikey|string|识别码|-
a|string|链接参数a|-
test_mobile|string|??|-
#### 返回
用户信息

## POST /log
### 日志

#### 参数
参数名|类型|描述|默认值
---|---|---|---
type|string|类型 'visit' 'event' 'error'|'other'
name|string|type为event时用到|-
#### 返回
访问密度

## GET /audition
### 播放地址

#### 参数
参数名|类型|描述|默认值
---|---|---|---
rid|int|类型 'visit' 'event' 'error'|'other'
type|int||1
source|int||1
only|int||1
#### 返回
url

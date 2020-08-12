## IPアドレス
http://linemodoki.herokuapp.com/

アプリの仕様は以下にまとめてあります。
動作確認を行う場合は、お手数ですがリンク先から使用方法をご確認ください。
https://qiita.com/ysda/private/39c2380db060bd321986


-------------テーブル定義-------------
## groupsテーブル

|Column|Type|Options|
|------|----|-------|
|name|string|null: false|

### Association
- has_many :messages
- has_many :users, through: :groups_users
- has_many :groups_users

## usersテーブル

|Column|Type|Options|
|------|----|-------|
|name|string|null: false, index: true|
|email|string|null: false|

### Association
- has_many :messages
- has_many :groups, through: :groups_users
- has_many :groups_users

## messagesテーブル

|Column|Type|Options|
|------|----|-------|
|body|text|null: false|
|image|string|
|user|references|null: false, foreign_key: true|
|group|references|null: false, foreign_key: true|

### Association
- belongs_to :user
- belongs_to :group

## groups_usersテーブル

|Column|Type|Options|
|------|----|-------|
|user|references|null: false, foreign_key: true|
|group|references|null: false, foreign_key: true|

### Association
belongs_to :user
belongs_to :group

# epcyp
[![Build Status](https://travis-ci.org/mrhorin/epcyp.svg?branch=master)](https://travis-ci.org/mrhorin/epcyp)
MacやLinux環境でも動作するpeercastチャンネルビューア  

## 特徴
- クロスプラットフォーム
- リレー管理機能
- その他標準的なチャンネルビューア機能

## 推奨環境
- [PeerCastStation](http://www.pecastation.org/) 2.2.0 以上
- [mono](http://www.mono-project.com/) 4.6 以上
- `mono`で実行ファイルへのパスが通っていること

## 設定
### プレイヤー引数
基本はPecaRecorderに準拠しています。  
変数名は""(ダブルクォーテーション)で囲います。
- $x: プレイリストURL
- $0: チャンネル名
- $1: ID
- $2: TIP
- $3: コンタクトURL
- $4: ジャンル
- $5: 詳細
- $6: リスナー
- $7: リレー
- $8: ビットレート
- $9: タイプ

## 開発
- ビルド: `npm run build`
- パッケージ化(OSX): `npm run release:darwin`
- パッケージ化(Linux): `npm run release:linux`

## License
[GPL-2.0](https://opensource.org/licenses/GPL-2.0)

## Author
[mrhorin](https://github.com/mrhorin)

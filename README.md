# epcyp
[![Build Status](https://travis-ci.org/mrhorin/epcyp.svg?branch=master)](https://travis-ci.org/mrhorin/epcyp)
[![GitHub license](https://img.shields.io/badge/license-GPLv2-blue.svg)](https://raw.githubusercontent.com/mrhorin/epcyp/master/LICENSE)  
  
macOSやLinux環境でも動作するpeercastチャンネルビューワー  
<img src="https://user-images.githubusercontent.com/6502717/58602945-c2d09e00-82c9-11e9-9671-bc871ea0ff36.png" width="600px" height="atuo" />
## ダウンロード
[epcyp v1.3.0 for macOS](https://github.com/mrhorin/epcyp/releases/download/v1.3.0/epcyp_v1.3.0_macos.zip)  
[epcyp v1.3.0 for Linux](https://github.com/mrhorin/epcyp/releases/download/v1.3.0/epcyp_v1.3.0_linux.zip)

## 特徴
- クロスプラットフォーム
- リレー管理機能
- ダーク/ライトテーマの切り替え機能
- その他標準的なチャンネルビューワー機能

## macOSでpeercastを視聴する方法
1. [PeerCastStation](http://www.pecastation.org/)のZIP版をダウンロードして任意のフォルダに展開
1. [PeerCastStation](http://www.pecastation.org/)をmacOS環境で動かす為に[mono](https://www.mono-project.com/download/stable/)をインストール
1. 7144番のポートを開放 __[[^1]](#1)__
1. epcypの環境設定を開きPeerCastタブに移動する
1. 「PeerCast本体」でPeerCastStation.exeを指定
1. 「monoを使用して起動する」にチェックを入れる
1. プレイヤータブに移動する
1. 「再生プレイヤー」でお好みのプレイヤーを指定（おすすめは[VLC](https://www.videolan.org/vlc/index.ja.html) ）__[[^2]](#2)__
1. OKを押して設定を保存してからepcypを再起動  
  
BBSブラウザに[epcviewer](https://github.com/mrhorin/epcviewer)を使用すると掲示板の閲覧や書き込みがしやすくなります。  
  
<small id="1">[^1]: PeerCastStationのポート自動開放機能で開放できる場合はこの手順は不要です。</small>  
<small id="2">[^2]: VLCを使用する場合は「引数」に`"$x" --input-title-format "$0"`を指定するとプレイヤータイトルにチャンネル名が表示されるようになります。</small>
## 開発
- パッケージ化(macOS): `npm run release:darwin`
- パッケージ化(Linux): `npm run release:linux`

## License
[GPL-2.0](https://opensource.org/licenses/GPL-2.0)

## Author
[mrhorin](https://github.com/mrhorin)

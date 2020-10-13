# epcyp
[![Build Status](https://travis-ci.org/mrhorin/epcyp.svg?branch=master)](https://travis-ci.org/mrhorin/epcyp)
[![GitHub license](https://img.shields.io/badge/license-GPLv2-blue.svg)](https://raw.githubusercontent.com/mrhorin/epcyp/master/LICENSE)

macOSやLinux環境でも動作するpeercastチャンネルビューワー
<img src="https://user-images.githubusercontent.com/6502717/58675620-173e5100-8390-11e9-8d81-ee112bf2490e.png" width="600px" height="atuo" />
## ダウンロード
[epcyp v1.5.1 for macOS](https://github.com/mrhorin/epcyp/releases/download/v1.5.1/epcyp_1.5.1_mac.dmg)

## 特徴
- クロスプラットフォーム
- リレー管理機能
- ダーク/ライトテーマの切り替え機能
- その他標準的なチャンネルビューワー機能

## macOSでpeercastを視聴する方法
1. [PeerCastStation](http://www.pecastation.org/)のZIP版をダウンロードして任意のフォルダに展開
1. [PeerCastStation](http://www.pecastation.org/)をmacOS環境で動かす為に[mono](https://www.mono-project.com/download/stable/)をインストール
1. 7144番のポートを開放 __[[^1]](#1)__
1. epcypの環境設定を開き「PeerCast」タブに移動する
1. 「PeerCast本体」でPeerCastStation.exeを指定
1. 「monoを使用して起動する」にチェックを入れる
1. 「プレイヤー」タブに移動する
1. 「再生プレイヤー」でお好みのプレイヤーを指定（おすすめは[IINA](https://iina.io/)__[[^2]](#2)__、または[VLC](https://www.videolan.org/vlc/index.ja.html)__[[^3]](#3)__ ）
1. 保存を押して設定を保存してからepcypを再起動

BBSブラウザに[epcviewer](https://github.com/mrhorin/epcviewer)を使用すると掲示板の閲覧や書き込みがしやすくなります。

<small id="1">[^1]: PeerCastStationのポート自動開放機能で開放できる場合はこの手順は不要です。</small>

<small id="2">[^2]: IINAを使用する場合は「再生プレイヤー」に`/your_app_path/IINA.app/Contents/MacOS/iina-cli`、「引数」に`"$x" --mpv-force-media-title="$0"`を指定するとプレイヤータイトルにチャンネル名が表示されるようになります。</small>

<small id="3">[^3]: VLCを使用する場合は「引数」に`"$x" --input-title-format "$0"`を指定するとプレイヤータイトルにチャンネル名が表示されるようになります。</small>

## License
[GPL-2.0](https://opensource.org/licenses/GPL-2.0)

## Author
[mrhorin](https://github.com/mrhorin)

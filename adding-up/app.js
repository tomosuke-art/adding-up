'use strict'; //strictモード

const fs = require('fs');
const readline = require('readline');
// node.jaに搭載されたモジュールの呼び出し
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
//Streamを生成

// rl.on('line', lineString => {
//   console.log(lineString);
// });

      //  データから「集計年」「都道府県」「人口」を抜き出すため
      //   ↓無名関数の中身を実装
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {

    const columns = lineString.split(','); //文字列をカンマで分割
    
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    // perseINt = 文字列を整数値に変換する関数
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0, //人口変化を表すプロパティ
                change: null //変化率
            };
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});

rl.on('close', () => {   //closeイベントは全ての処理が終わった後に呼び出される
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    //console.log(prefectureDataMap);
    // 変化率ごとに並び替え
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => { 
        // Array.from(prefectureDataMap) の部分で、連想配列を普通の配列に変換
        return pair2[1].change - pair1[1].change;
    });
      //console.log(rankingArray);
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
          key +
          ': ' +
          value.popu10 +
          '=>' +
          value.popu15 +
          ' 変化率:' +
          value.change
        );
     });
    console.log(rankingStrings);
});
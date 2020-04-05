/**
 *
 * @author atuk0r0
 * @since 2020/04/05
 *
 */

'use strict';

{
  /**
   *
   * @class Panel
   * 【クラスの概要】
   * インスタンス生成後、section要素を作成してimg要素とdiv要素を子要素として取り込む。
   * section要素は、mainの子要素として追加される。
   * 画像をランダムに取得する関数やパネルチェックの関数、
   * ゲームスタート後に画像とボタンの透明のスタイルを取り除く関数が定義されている。
   */
  class Panel {
    /**
     *Creates an instance of Panel.
     * @memberof Panel
     */
    constructor() {
      // section要素を作成し、panelクラスを追加
      const section = document.createElement('section');
      section.classList.add('panel');

      // image要素を作成し、ランダムに取得した画像を代入
      this.img = document.createElement('img');
      // スロットマシンのイメージをランダムに取得
      this.img.src = this.getRandomImage();

      this.timeoutId = undefined;

      // div要素を作成し、テキスト表示させてボタン押下時のスタイルを適用
      this.stop = document.createElement('div');
      this.stop.textContent = 'STOP';
      this.stop.classList.add('stop', 'inactive');

      // クリックイベント実施
      this.stop.addEventListener('click', () => {
        // ボタン押下時のスタイルが適用されていたら処理終了
        if (this.stop.classList.contains('inactive')) {
          return;
        }
        // ボタン押下時のスタイルを適用
        this.stop.classList.add('inactive');

        clearTimeout(this.timeoutId);

        panelsLeft--;

        // 残パネル数が0の時、パネルが揃っているかを検証する
        if (panelsLeft === 0) {
          checkResult();

          // spinボタンのボタンを押下時のスタイルを取り除く
          spin.classList.remove('inactive');

          // パネル数の初期化
          panelsLeft = 3;
        }
      });

      // sectionの子要素に画像とストップボタンを追加
      section.appendChild(this.img);
      section.appendChild(this.stop);

      // main要素を取得後、section要素を子要素に追加
      const main = document.querySelector('main');
      main.appendChild(section);
    }

    /**
     *
     * @returns
     * @memberof Panel
     * 【処理の内容】
     * スロットマシンのイメージ画像をランダムに取得する
     */
    getRandomImage() {
      // スロットマシンのイメージを格納する配列を初期化
      const images = ['img/seven.png', 'img/bell.png', 'img/cherry.png'];
      // 配列からランダムに取得する
      return images[Math.floor(Math.random() * images.length)];
    }

    /**
     *
     * @memberof Panel
     * 【処理の内容】
     * 画像をランダムに取得する処理を再帰的に行う。
     */
    spin() {
      // 画像をランダムに取得
      this.img.src = this.getRandomImage();
      this.timeoutId = setTimeout(() => {
        this.spin();
      }, 50);
    }

    /**
     *
     * @param {*} comparePanel1
     * @param {*} comparePanel2
     * @returns
     * @memberof Panel
     * 【処理の内容】
     * パネルが保持して画像を他のパネルと比較して、異なる場合にtrueを返す。
     */
    isUnmatched(comparePanel1, comparePanel2) {
      // パネルが保持している画像を比較する
      return (
        this.img.src !== comparePanel1.img.src &&
        this.img.src !== comparePanel2.img.src
      );
    }

    /**
     *
     * @memberof Panel
     * 【処理の内容】
     * パネルが保持している画像があっていない時のスタイルを追加する。
     */
    unmatch() {
      // パネルがあっていない時のスタイルを追加
      this.img.classList.add('unmatched');
    }

    /**
     *
     * @memberof Panel
     * 【処理の内容】
     * 画像を透明にするスタイルとストップボタンのボタン押下時のスタイルを除去
     */
    activate() {
      // 画像を透明にするスタイルを除去
      this.img.classList.remove('unmatched');
      // ストップボタンのボタン押下時のスタイルを除去
      this.stop.classList.remove('inactive');
    }
  }

  /**
   *
   *【処理の内容】
   * パネルを他のパネルと比較し、状況に応じてパネルが異なる時のスタイルを適用させる。
   */
  function checkResult() {
    // パネルを1つずつ比較して、パネルが異なる時はパネルが異なる時のスタイルを適用する
    if (panels[0].isUnmatched(panels[1], panels[2])) {
      panels[0].unmatch();
    }
    if (panels[1].isUnmatched(panels[0], panels[2])) {
      panels[1].unmatch();
    }
    if (panels[2].isUnmatched(panels[0], panels[1])) {
      panels[2].unmatch();
    }
  }

  // パネルクラスのインスタンスの生成
  const panels = [new Panel(), new Panel(), new Panel()];

  // パネル数の初期化
  let panelsLeft = 3;

  const spin = document.getElementById('spin');
  // スピンボタンのクリックイベント実施
  spin.addEventListener('click', () => {
    // スピンボタンがボタン押下時のスタイルの場合、処理終了
    if (spin.classList.contains('inactive')) {
      return;
    }

    // スピンボタンにボタン押下時のスタイルを適用
    spin.classList.add('inactive');

    panels.forEach((panel) => {
      // パネルとストップボタンに適用している透明のスタイルを除去
      panel.activate();
      // パネルの画像をランダムに取得
      panel.spin();
    });
  });
}

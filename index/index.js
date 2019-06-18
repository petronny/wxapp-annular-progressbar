const app = getApp()

Page({
  data: {
    left_transform: -180,
    left_transition: 0,
    right_transform: -180,
    right_transition: 0,
    button_text: 'ANP',
  },

  /**
   * 传入进度条比例，自动计算动画过度角度和时间
   * @param {number} target 进度条的比例，支持 0-100
   */
  setProgressbar: function(target) {
    let _this = this;
    if (target > 100) target = target % 100
    let speed = 1; //改变50%进度所需的时间，单位秒   
    let time = 0; //进度条改变的时间
    // 计算历史数据
    let old_left_deg = this.data.left_transform; //左半圆已转动的角度
    let old_right_deg = this.data.right_transform; //右半圆已转动的角度
    let remain_deg = 360 - (Math.abs(old_left_deg) + Math.abs(old_right_deg));
    let old_percent = (remain_deg / 360) * 100;
    //计算变化时间和角度
    time = Math.abs(target - old_percent) / 50 * speed;
    let new_deg = Math.abs(target) / 100 * 360;
    // let change_deg = Math.abs(old_percent - target) / 100 * 360;
    let change_deg = Math.abs(new_deg - remain_deg) //本次需要变化的角度

    if (new_deg <= 180) {
      /**右侧半圆变化 */
      let left_time = 0;
      let left_change = Math.abs(180 + old_left_deg)
      //右侧进度条改变之前，清空左侧
      if (old_left_deg > -180) {
        left_time = Math.abs(50 - old_percent) / 50 * speed;

        _this.setData({
          left_transform: old_left_deg - left_change,
          left_transition: left_time
        })
      }
      time -= left_time;
      change_deg -= left_change;
      // 右侧进度条增加
      if (old_percent <= target) {
        _this.setData({
          right_transform: old_right_deg + change_deg,
          right_transition: time
        })
      } else {
        // 右侧进度条减小
        setTimeout(function() {
          _this.setData({
            right_transform: old_right_deg - change_deg,
            right_transition: time
          })
        }, left_time * 1000)
      }
    } else if (new_deg <= 360) {
      /**左侧半圆变化 */
      let right_time = 0;
      let right_change = Math.abs(0 - old_right_deg)
      //左侧进度条改变之前，填满右侧
      if (old_right_deg < 0) {
        right_time = Math.abs(50 - old_percent) / 50 * speed;
        _this.setData({
          right_transform: old_right_deg + right_change,
          right_transition: right_time
        })
      }
      time -= right_time;
      if (old_percent <= target) {
        // 左侧进度条增加 
        let left_deg = change_deg - right_change;
        if (change_deg >= 180) {
          left_deg -= 180;
        } else {
          left_deg = old_left_deg + change_deg;
        }
        setTimeout(function() {
          _this.setData({
            left_transform: left_deg,
            left_transition: time
          });
        }, right_time * 1000)
      } else {
        // 左侧进度条减小
        setTimeout(function() {
          _this.setData({
            left_transform: old_left_deg - change_deg,
            left_transition: time
          });
        }, time * 1000)
      }
    } else {
      console.error('Progress over range')
    }
  },

  onReady: function() {
    let _this = this;
    _this.setProgressbar(40)
    setTimeout(function() {
      _this.setProgressbar(60)
      setTimeout(function() {
        _this.setProgressbar(40)
        setTimeout(function() {
          _this.setProgressbar(0)
        }, 1500)
      }, 1500)
    }, 1500)
  },
})
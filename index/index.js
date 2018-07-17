const app = getApp()

Page({
  data: {
    left_circle_transform: -180,
    left_circle_transition: 0.5,
    right_circle_transform: -180,
    right_circle_transition: 0.5,
    message: '归还',
  },
  unlock: function() {
    let _this = this;
    _this.setData({
      message: '请投袋'
    })
    _this.setProgressbar(100);

    setTimeout(function(){
      _this.setData({
        message: '完成'
      })
    },2000)
  },
  /**
   *设置进度条的变化
   *@param {number} oldPercent    进度条改变之前的半分比
   *@param {number} curPercent    进度条当前要设置的值 
   */
  setProgressbar: function(curPercent) {
    console.log('---------------------')
    let speed = 1; //改变50%进度所需的时间，单位秒   
    let time = 0; //进度条改变的时间
    let _this = this;
    let old_left_deg = this.data.left_circle_transform;
    let old_right_deg = this.data.right_circle_transform;

    let old_deg = 0; //

    old_deg += 360 - (Math.abs(old_left_deg) + Math.abs(old_right_deg));

    let oldPercent = (old_deg / 360) * 100;

    console.log('from ' + oldPercent + ' deg to ' + curPercent + ' deg!')

    console.log('old百分比 === ' + oldPercent)
    console.log('new百分比 === ' + curPercent)
    console.log('old_deg (0-360) === ' + old_deg)
    console.log('old_left_deg === ' + old_left_deg)
    console.log('old_right_deg === ' + old_right_deg)
    //计算变化时间和角度
    time = Math.abs(curPercent - oldPercent) / 50 * speed;

    console.log('old用时 === ' + time)
    let new_deg = Math.abs(curPercent) / 100 * 360;

    console.log('new_deg === ' + new_deg)
    let change_deg = Math.abs(new_deg - old_deg)


    console.log('change_deg === ' + change_deg)



    /*判断是左半圆还是右半圆的变化*/
    if (new_deg <= 180) {



      let left_time = 0;
      let left_change = Math.abs(180 + old_left_deg)

      console.log('left_change ===' + left_change)
      //右边进度条改变之前，清空左边。
      if (old_left_deg > -180) {
        left_time = Math.abs(50 - oldPercent) / 50 * speed;
        console.log('left_time ===' + left_time)
        _this.setData({
          left_circle_transform: old_left_deg - left_change,
          left_circle_transition: left_time
        })
      }
      time -= left_time;

      console.log('time ===' + time)
      console.log('left_time ===' + left_time)





      change_deg -= left_change;
      console.log('new_deg <= 180 ===' + new_deg)
      // 右半圆
      if (oldPercent <= curPercent) {
        console.log('右边进度条增加。')
        _this.setData({
          right_circle_transform: old_right_deg + change_deg,
          right_circle_transition: time
        })
      } else {

        console.log('右边进度条减小。')

        setTimeout(function() {


          _this.setData({
            right_circle_transform: old_right_deg - change_deg,
            right_circle_transition: time
          })
        }, left_time * 1000)
      }
    } else if (new_deg <= 360) {
      console.log('new_deg <= 360 and new_deg > 180 ===' + new_deg)
      let right_time = 0;
      let right_change = Math.abs(0 - old_right_deg)

      console.log('right_change ===' + right_change)
      //左边进度条改变之前，填满右边。
      if (old_right_deg < 0) {
        right_time = Math.abs(50 - oldPercent) / 50 * speed;
        console.log('right_time ===' + right_time)
        _this.setData({
          right_circle_transform: old_right_deg + right_change,
          right_circle_transition: right_time
        })
      }
      time -= right_time;

      console.log('time ===' + time)
      console.log('right_time ===' + right_time)
      if (oldPercent <= curPercent) {

        console.log('左边进度条增加。')
        let left_deg = change_deg - right_change;
        if (change_deg > 180) {
          left_deg -= 180;
        } else {
          left_deg = old_left_deg + change_deg;
        }

        console.log('*********left_deg ===' + left_deg)
        setTimeout(function() {
          _this.setData({
            left_circle_transform: left_deg,
            left_circle_transition: time
          });
        }, right_time * 1000)
      } else {
        console.log('左边进度条减小。')
        setTimeout(function() {
          _this.setData({
            left_circle_transform: old_left_deg - change_deg,
            left_circle_transition: time
          });
        }, time * 1000)
      }
    } else {
      console.log('超过进度条实际范围。')
    }
  },
  onReady: function() {
    let _this = this;
    setTimeout(function() {
      _this.setProgressbar(100)
      setTimeout(function() {
        _this.setProgressbar(20)
        setTimeout(function() {
          // _this.setProgressbar(100)
          setTimeout(function() {
            // _this.setProgressbar(80)
          }, 1000)
        }, 2000)
      }, 2000)
    }, 2000)
  },
})
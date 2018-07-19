const app = getApp()

Page({
    data: {
        left_circle_transform: -180,
        left_circle_transition: 0,
        right_circle_transform: -180,
        right_circle_transition: 0,
        button_text: '点我开启',
        progressbar_opacity: 0.5,
        message: '点击按钮开始归还',
        message_color: 'dodgerblue',
    },
    setOpacity: function(cur_opacity) {
        let _this = this;
        let old_opacity = _this.data.progressbar_opacity;
        cur_opacity = old_opacity + (1 - old_opacity) * cur_opacity / 100;
        _this.setData({
            progressbar_opacity: cur_opacity,
        })
    },
    give_back: function() {
        let _this = this;
        /**检测是否已经发生转动 */
        let right_transform = _this.data.right_circle_transform;
        if (right_transform > -180) {
            return;
        }


        /**定时开箱检测 */
        let open_bucket = setInterval(function() {
            let is_open_bucket = _this.openBucket(20);
            if (is_open_bucket) { //开箱成功
                clearInterval(open_bucket);
                /**定时投袋检测 */
                let put_in = setInterval(function() {
                    let is_put_in = _this.putInCheck(50);
                    if (is_put_in) { //投袋成功
                        clearInterval(put_in);
						/**设置投袋成功状态 */
                        setTimeout(function() {
                            _this.giveBackOk()
                            /**恢复初始状态 */
                            setTimeout(function() {
                                _this.giveBackInit();
                            }, 2000)
                        }, 1000)
                    }
                }, 1000)
            }
        }, 100)
    },
    /**打开回收桶 */
    openBucket: function(progress) {

        let _this = this;
        _this.setProgressbar(progress)
        _this.setOpacity(progress)
        _this.setData({
            button_text: '开启中',
            message: '请勿关闭小程序',
            message_color: 'rgba(248, 37, 90, 0.884)',
        })
        // 调用开桶接口，并检测结果。
        return true;
    },
    putInCheck: function(progress) {

        let _this = this;
        _this.setProgressbar(progress)
        _this.setOpacity(progress)
        console.log('--- 放入袋子 === ' + progress);
        _this.setData({
            button_text: '请投袋',
            message: '请勿关闭小程序',
            message_color: 'rgba(248, 37, 90, 0.884)',
        })

        // 调用投袋接口，并检测结果。
        return true;
    },
    giveBackOk: function() {
        let _this = this;
        _this.setProgressbar(100)
        _this.setOpacity(100)
        _this.setData({
            button_text: '归还完成',
			message: '归还成功，环保值(+1)',
			message_color: 'dodgerblue',
        })
    },
    giveBackInit: function() {
        let _this = this;
        setTimeout(function() {
			_this.setData({
				left_circle_transform: -180,
				left_circle_transition: 0,
				right_circle_transform: -180,
				right_circle_transition: 0,
				button_text: '点我开启',
				progressbar_opacity: 0.5,
				message: '点击按钮开始归还',
				message_color: 'dodgerblue',
            })
        }, 600)
    },
    /**
     *设置进度条的变化
     *@param {number} curPercent    进度条当前要设置的值 
     */
    setProgressbar: function(curPercent) {
        if (curPercent < 0) {
            curPercent = 0;
        }
        let speed = 1; //改变50%进度所需的时间，单位秒   
        let time = 0; //进度条改变的时间
        let _this = this;
        // 计算历史数据
        let old_left_deg = this.data.left_circle_transform; //左半圆已转动的角度
        let old_right_deg = this.data.right_circle_transform; //右半圆已转动的角度
        let old_deg = 0;
        old_deg += 360 - (Math.abs(old_left_deg) + Math.abs(old_right_deg));
        let oldPercent = (old_deg / 360) * 100;
        //计算变化时间和角度
        time = Math.abs(curPercent - oldPercent) / 50 * speed;
        let new_deg = Math.abs(curPercent) / 100 * 360;
        let change_deg = Math.abs(new_deg - old_deg) //本次需要变化的角度

        if (new_deg <= 180) {
            /**右侧半圆变化 */
            let left_time = 0;
            let left_change = Math.abs(180 + old_left_deg)
            //右边进度条改变之前，清空左边。
            if (old_left_deg > -180) {
                left_time = Math.abs(50 - oldPercent) / 50 * speed;
                _this.setData({
                    left_circle_transform: old_left_deg - left_change,
                    left_circle_transition: left_time
                })
            }
            time -= left_time;
            change_deg -= left_change;
            // 右边进度条增加
            if (oldPercent <= curPercent) {
                _this.setData({
                    right_circle_transform: old_right_deg + change_deg,
                    right_circle_transition: time
                })
            } else {
                // 右边进度条减小
                setTimeout(function() {
                    _this.setData({
                        right_circle_transform: old_right_deg - change_deg,
                        right_circle_transition: time
                    })
                }, left_time * 1000)
            }
        } else if (new_deg <= 360) {
            /**左侧半圆变化 */
            let right_time = 0;
            let right_change = Math.abs(0 - old_right_deg)
            //左边进度条改变之前，填满右边。
            if (old_right_deg < 0) {
                right_time = Math.abs(50 - oldPercent) / 50 * speed;
                _this.setData({
                    right_circle_transform: old_right_deg + right_change,
                    right_circle_transition: right_time
                })
            }
            time -= right_time;
            if (oldPercent <= curPercent) {
                // 左边进度条增加
                let left_deg = change_deg - right_change;
                if (change_deg > 180) {
                    left_deg -= 180;
                } else {
                    left_deg = old_left_deg + change_deg;
                }
                setTimeout(function() {
                    _this.setData({
                        left_circle_transform: left_deg,
                        left_circle_transition: time
                    });
                }, right_time * 1000)
            } else {
                // 左边进度条减小
                setTimeout(function() {
                    _this.setData({
                        left_circle_transform: old_left_deg - change_deg,
                        left_circle_transition: time
                    });
                }, time * 1000)
            }
        } else {
            console.log('进度百分比 ' + 101 + '% 超过范围。')
        }
    },
    onReady: function() {
        // let _this = this;
        // setTimeout(function() {
        //     _this.setProgressbar(40)
        //     setTimeout(function() {
        //         // _this.setProgressbar(60)
        //         setTimeout(function() {
        //             // _this.setProgressbar(40)
        //             setTimeout(function() {
        //                 // _this.setProgressbar(0)
        //             }, 1000)
        //         }, 1000)
        //     }, 1000)
        // }, 1000)
    },
})
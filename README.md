# 微信小程序圆形进度条

通过 css 实现的圆形进度条，仅需传入进度百分比即可看到进度动画。

* 代码片段

[https://developers.weixin.qq.com/s/Fqlln4mt7f99](https://developers.weixin.qq.com/s/Fqlln4mt7f99)

* 效果图

![img](https://github.com/laobingm/wxapp-annular-progressbar/blob/master/screenshot.gif)

## 使用

将进度调整为 40%

```JavaScript

  onReady: function() {
    this.setProgressbar(40)
  }

```

## 结构介绍

* wxml

界面主要 view 有五个，分别是：左右容器，左右圆以及中间的空白部分

* wxss

通过 clip 属性对超出容器的圆圈进行切割

* js

通过调整 transform 和 transition 值控制左右圆圈旋转

## 主要函数

* setProgressbar: (target)

target：进度条进度，支持传入一个大于 0 的数，如果比例大于 100，则用余数代替。

setProgressbar 是控制进度条变化的唯一函数；

函数内部通过传入的目标百分比计算出进度条旋转的方向、角度以及时长；

支持正向和反向调整进度；

左半圆变化时，会先填充右半圆；

右半圆变化时，也会先清空左半圆。

## 参考

* https://www.xiabingbao.com/css/2015/07/27/css3-animation-circle.html
* https://juejin.im/entry/58c6066b2f301e006bc67251

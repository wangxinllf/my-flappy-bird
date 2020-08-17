// 用对象收编变量

var bird = {
    skyPosition: 0,
    skyStep: 2,
    birdTop: 235,
    // birdX: 0,
    startColor: 'blue',
    init: function (){
        bird.initDate();
        bird.animates();
    },

    initDate: function () {
        // this ?  bird
        //  bird. 
        this.el = document.getElementById('game');
        this.obird = this.el.getElementsByClassName('bird')[0];
        this.ostart = this.el.getElementsByClassName('start')[0];
    },
    animates: function () {
        var count = 0;
        var self = this;

        // 使用定时器
        setInterval(function (){
            self.skyMove();

            if (++ count % 10 === 0){
                self.birdJump();
                self.birdFly(count);
                self.startBound();
            }

        }, 30)
       
    },

    // 天空移动 
    skyMove: function () {
        var self = this; // bird
        self.skyPosition -= self.skyStep;
        self.el.style.backgroundPosition = self.skyPosition + 'px';
    },

    // 小鸟上下跳动
    birdJump: function () {
        this.birdTop = this.birdTop === 220 ? 260: 220;
        this.obird.style.top = this.birdTop + 'px';
    },

    // 小鸟翅膀煽动-> 使用移动背景图来实现
    birdFly: function (count) {
        // this.birdX -= 30;
        // this.obird.style.backgroundPositionX = this.birdX + 'px';
        this.obird.style.backgroundPositionX = count % 3 * -30 + 'px'
    },

    // 开始按钮的颜色和大小转换
    startBound: function () {
        var prevColor = this.startColor;
        this.startColor = this.startColor === 'blue' ? 'white' : 'blue';
        this.ostart.classList.remove('start-' + prevColor );
        this.ostart.classList.add('start-' + this.startColor);
    },
};
bird.init();


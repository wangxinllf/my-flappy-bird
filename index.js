// 用对象收编变量

var bird = {
    skyPosition: 0,
    skyStep: 2,
    birdTop: 235,
    birdStepY: 0,
    mintop: 0,
    maxtop: 570,
    // birdX: 0,
    startColor: 'blue',
    startFlag: false, // 是否点击按钮
    pipeLength: 7,
    pipeArr: [],



    init: function (){
        this.initDate();
        this.animates();

        this.handleStart();
        this.handleClick();
    },



    initDate: function () {
        // this ?  bird
        //  bird. 
        this.el = document.getElementById('game');
        this.obird = this.el.getElementsByClassName('bird')[0];
        this.ostart = this.el.getElementsByClassName('start')[0];
        this.oscore = this.el.getElementsByClassName('score')[0];
    },



    animates: function () {
        var count = 0;
        var self = this;

        // 使用定时器
        this.timer = setInterval(function (){
            self.skyMove();

            if(self.startFlag){
                self.birdDrop();
                self.pipeMove();
            }
            

            if (++ count % 10 === 0){
                
                self.birdFly(count);
                if(!self.startFlag){
                    self.startBound();
                    self.birdJump();  // 2 开始按钮消失，停止按钮动画和小鸟跳动
                }
                
            }

        }, 30);
       
    },

    // 开始游戏前天空移动 
    skyMove: function () {
        var self = this; // bird
        self.skyPosition -= self.skyStep;
        self.el.style.backgroundPosition = self.skyPosition + 'px';
    },

    // 开始游戏前小鸟上下跳动
    birdJump: function () {
        this.birdTop = this.birdTop === 220 ? 260: 220;
        this.obird.style.top = this.birdTop + 'px';
    },

     // 3. 小鸟下落
     birdDrop: function () {
        this.birdTop += ++ this.birdStepY;
        this.obird.style.top = this.birdTop + 'px';
        // 碰撞检测
        this.judgeKnock();

    },
    // 碰撞检测,包括边界和柱子
    judgeKnock: function () {
        this.judgeBoundary();
        this.judgePipe();
        
    },

    judgeBoundary: function () {
        if(this.birdTop <= this.mintop || this.birdTop >= this.maxtop){
            this.failGame();
        }
    },

    judgePipe: function () {

    },
    
    // 生成柱子
    creatPipe: function (x) {

        var upHeight = 50 + Math.floor(Math.random() * 175);
        var downHeight = 450 - upHeight;

        var oupPipe = createEle('div',['pipe','pipe-up'],{
            height: upHeight + 'px',
            left: x + 'px',
        });

        var odownPipe = createEle('div',['pipe','pipe-down'],{
            height: downHeight + 'px',
            left: x + 'px',
        });

        this.el.appendChild(oupPipe);
        this.el.appendChild(odownPipe);
        this.pipeArr.push({
            up: oupPipe,
            down: odownPipe,
        });


        // var upHeight = 50 + Math.floor(Math.random() * 175);
        // var downHeight = 450 - upHeight;
        // // Math.random() 0-1   0-100   50-150   50-225
        // // 上下距离相等 150
        // // (600-150)/2 = 225
        // var oDiv = document.createElement('div');
        // oDiv.classList.add('pipe');
        // oDiv.classList.add('pipe-up');
        // oDiv.style.height = upHeight + 'px';
        // oDiv.style.left = x + 'px';

        // var oDiv1 = document.createElement('div');
        // oDiv1.classList.add('pipe');
        // oDiv1.classList.add('pipe-down');
        // oDiv1.style.height = downHeight + 'px';
        // oDiv1.style.left = x + 'px';

        
        // this.el.appendChild(oDiv);
        // this.el.appendChild(oDiv1);
    },

    //以上代码过于重复，封装一个生成元素的函数,在 utils.js 里面（工具函数）

    
    // 柱子移动
    pipeMove: function () {
        
        for(var i = 0; i < this.pipeLength; i ++){
            var oupPipe = this.pipeArr[i].up;
            var odownPipe = this.pipeArr[i].down;
            var x = oupPipe.offsetLeft - this.skyStep;
            
            oupPipe.style.left = x + 'px';
            odownPipe.style.left = x + 'px';
        }
    },



    // 游戏结束，所有动画停止
    failGame: function () {
        console.log('end');
        clearInterval(this.timer);
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


    // 监听点击开始按钮,接下来的一切变化
    handleStart: function () {
        self = this; 
        this.ostart.onclick = function () {       // 1.点击开始按钮
            self.startFlag = true;
            self.ostart.style.display = 'none';   // 2.开始按钮消失，接下来要停止按钮动画和小鸟跳动
            self.oscore.style.display = 'block';  //4. 出现分数显示
            self.skyStep = 5;                     //5.天空移动更快
            self.obird.style.left = '80px';       // 3.小鸟停止跳动紧接着固定在左侧，接着下落，加速下落
            self.obird.style.transition = 'none';  // 3.取消300ms高度改变一次的过渡
            for(var i = 0; i < self.pipeLength; i ++) {
                self.creatPipe((i + 1) * 300);
            }
            
        };
    },

    //监听父元素被点击事件，如果父元素被点击，小鸟往上飞，但是此时要注意，由于事件冒泡，点击开始游戏这个事件也会导致，所以要排除这种情况
    handleClick: function (){
        self = this; 
        this.el.onclick = function (e){
             var dom = e.target;
             var isStart = dom.classList.contains('start');
             if(!isStart){
                self.birdStepY = -10;
              
             } 
           
           
        };
    },


};

bird.init();


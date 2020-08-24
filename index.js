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
    lastPipeIndex: 6,
    score: 0,
    arrScoreTime: [],



    init: function (){
        this.initDate();
        this.animates();

        this.handleStart();
        this.handleClick();
        this.handleRestart();

         if(sessionStorage.getItem('play')){
              this.start();
          }

    },



    initDate: function () {
        // this ?  bird
        //  bird. 
        this.el = document.getElementById('game');
        this.obird = this.el.getElementsByClassName('bird')[0];
        this.ostart = this.el.getElementsByClassName('start')[0];
        this.oscore = this.el.getElementsByClassName('score')[0];
        this.omask = this.el.getElementsByClassName('mask')[0];
        this.oend =  this.el.getElementsByClassName('end')[0];
        this.ofinalscore = this.el.getElementsByClassName('final-score')[0];
        this.oranklist = this.el.getElementsByClassName('rank-list')[0];
        this.orestart = this.el.getElementsByClassName('restart')[0];


        // this.arrScoreTime = getLocal('score');
        this.arrScoreTime = this.getScore();
    },

    getScore: function () {
        var arrScoreTime = this.getLocal('score');
        return arrScoreTime ? arrScoreTime : [];
    },

    // 从本地中取出数据,取出后在初始化时使用
    getLocal: function (key) {
        var value = localStorage.getItem(key); 
        if(value === null){
            return null;
        }
        if(value[0] === '[' || value[0] === '{') {
            value = JSON.parse(value);
            return value;
        }
        
        return value;
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
        this.addScore();
        
    },  
    // 碰撞到边界
    judgeBoundary: function () {
        if(this.birdTop <= this.mintop || this.birdTop >= this.maxtop){
            this.failGame();
        }
    },
    // 碰撞到柱子
    judgePipe: function () {
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        var pipeY = this.pipeArr[index].y;
        var birdY = this.birdTop;

        if((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1]) ) {
            this.failGame();
        }
    },

    // 分数增加
    addScore: function () {
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        if(pipeX < 13){
            // this.score ++;
            this.oscore.innerText = ++ this.score;

        }

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
            y: [upHeight,upHeight + 120],
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

            // 让柱子循环接上
            if(x < -52 ) {
                var lastPipeLeft = this.pipeArr[this.lastPipeIndex].up.offsetLeft;
                oupPipe.style.left = lastPipeLeft + 300 + 'px';
                odownPipe.style.left = lastPipeLeft + 300 + 'px';
                this.lastPipeIndex = i;
            }
           
        }
    },




    // 游戏结束，所有动画停止
    failGame: function () {
        clearInterval(this.timer);
        this.setScoreTime();
        this.omask.style.display = 'block';
        this.oend.style.display = 'block';
        this.oscore.style.display = 'none';
        this.obird.style.display = 'none';
        this.ofinalscore.innerText = this.oscore.innerText;
        this.renderRankList();
       
    },

    setScoreTime: function (){
        this.arrScoreTime.push({
            score: this.score,
            time: this.getDate()
        })

        this.arrScoreTime.sort(function (a, b){ // 排序
            return b.score - a.score;
        })

        // 最多展示8个
        // this.arrScoreTime.length > 8 ? 8 : this.arrScoreTime.length;
         var scoreLength = this.arrScoreTime.length;
        this.arrScoreTime.length = scoreLength > 8 ? 8 : scoreLength;

     // 将分数和时间存在本地
        setLocal('score',this.arrScoreTime);// 函数函数封装在utils.js

    },

   
    
    getDate: function(){
        var date = new Date();
        console.log(date);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return `${year}.${month}.${day} ${hours}:${minute}:${second}`;
    },   
    // 生成排行表列表

    renderRankList: function () {
        var template = '';
        for(var i = 0; i < this.arrScoreTime.length ; i++){
            var degreeClass = '';
            switch(i){
                case 0 :
                    degreeClass = 'first';
                    break;
                case 1 :
                    degreeClass = 'second';
                    break;
                case 2 :
                    degreeClass = 'third';
                    break;
            }
            template  += `<li class="rank-item">
            <span class="rank-degree ${degreeClass}">${i+1}</span>
            <span class="rank-score">${this.arrScoreTime[i].score}</span>
            <span class="rank-time">${this.arrScoreTime[i].time}</span>
        </li>`;
        }
        this.oranklist.innerHTML = template;

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
        
       this.ostart.onclick = this.start.bind(this);      // 1.点击开始按钮
    },

    start: function () {
        var self = this;
        self.startFlag = true;
        self.ostart.style.display = 'none';   // 2.开始按钮消失，接下来要停止按钮动画和小鸟跳动
        self.oscore.style.display = 'block';  //4. 出现分数显示
        self.skyStep = 5;                     //5.天空移动更快
        self.obird.style.left = '80px';       // 3.小鸟停止跳动紧接着固定在左侧，接着下落，加速下落
        self.obird.style.transition = 'none';  // 3.取消300ms高度改变一次的过渡
        for(var i = 0; i < self.pipeLength; i ++) {
            self.creatPipe((i + 1) * 300);
        }

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

    // 重新开始按钮
    handleRestart: function() {
        this.orestart.onclick = function (){
            sessionStorage.setItem('play', true);
            window.location.reload();  // 刷新
        };
    },

};

bird.init();


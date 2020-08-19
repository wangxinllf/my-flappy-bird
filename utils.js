

// 生成dom元素
function createEle(eleName, classArr,styleObj){
    var dom = document.createElement(eleName);
    for(var i = 0; i < classArr.length; i ++){
        dom.classList.add(classArr[i]);
    }

    for(var key in styleObj){
        dom.style[key] = styleObj[key];
    }
    return dom;
}


// 将数据存入本地
function setLocal(key,value) {
    if(typeof(value) === 'object' && value != null) {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key,value); //存入
}




## JS数据类型

##### 基本类型：

​			数值number，	

​			字符串string，	

​			undefined	(空的值，没有值的默认值)，	

​			布尔Boolean

##### 引用类型：

​			对象object	(数组Array，纯对象Object，函数function)，

​			null	(不存在的对象)，

​			(es6新增symbol)



## 值等和全等

==			判断两个操作数的数值是否相等，会进行隐式类型转换。相等返回true。

===		判断两个操作数的数值与数据类型是否相等。相等返回true。

！==		判断两个操作数的数值与数据类型是否相等，如果值和类型都一致返回false，否则返回true。



## 隐式转换

false : 0,	NaN,	null,	undefined,	'',	false。( [ ],{ },空数组与空对象都为true )。



## 运算符的优先级

( ) => 	逻辑非=>	自增、自减=>	算术运算符（乘除取余加减）=>	比较运算符=>	逻辑与=>	逻辑或	=>三目=>	赋值=>	，（逗号运算符）



## 继承

#### 构造函数继承(类继承)

用.call()和.apply()将父类构造函数引入子类函数

```javascript
function Animal (animal,color){
    this.animal = animal;
    this.color = color;
}
function Cat(){
    this.val = '猫'
    this.name = 'cat'
    Animal.call(this,'动物','草绿');
}
let ani = new Cat();   
//ani=>   ani:{val:'猫',name:'cat',animal:'动物',color:'草绿'}
```

特点：

- ​	只能继承父类的属性与方法，不能继承父类原型上的属性与方法。
- ​	可以继承多个构造函数属性（call多个）。
- ​	在子实例中可向父实例传参。
- ​    每个新实例都有父类构造函数的副本



#### 原型继承

将子类的原型指向父类的实例

```javascript
function Animal (value,nature){
    this.value = value;
    this.nature = nature;
    this.special = 'father';
}
function Cat(name,hobby){
    this.name = name;
    this.hobby = hobby;
    this.spe = 'son';
}
//子类实例的构造函数将会指向Animal，导致继承的紊乱。
Cat.prototype = new Animal('miao,miao,miao','cool');	
//将Cat原型对象上的构造函数重新指回Cat
Cat.prototype.constructor = Cat;
let ani = new Cat('cat','mouse');
//ani	{name:'cat',hobby:'mouse',spe:'son'};
//ani.__proto__.value = 'miao,miao,miao'
```

子类实例通过__proto__访问父类的私有方法与属性。即将父类的私有属性与方法作为子类实例的公有属性与方法。

特点：

- ​	父类新增的原型方法与属性，子类都可以访问到。

- ​	无法实现多继承。

- ​	来自原型对象的属性被所有实例共享。

- ​	创建子类实例时，无法向父类构造函数传参。

  

#### 组合继承

通过调用父类构造函数,并通过将父类实例作为子类原型，实现函数复用。

```javascript
function Animal (val,tem){
     this.val = val;
     this.tem = tem;
     this.special = 'father';
}

function Cat (name,hobby,val,tem){
    this.name = name;
    this.hobby = hobby;
    this.spe = 'son';
    Animal.call(this,val,tem);
}

Cat.prototype = new Animal('proto,miao-miao','proto,cool');
Cat.prototype.constructor = Cat;

let cat = new Cat('cat','mouse','miao,miao','cool');
/*cat 	{
	name;'cat',hobby:'mouse',spe:'son',
    val:'miao,miao',tem:'cool',special:'father'
}	*/
//  cat.__proto__.val = 'proto,miao-miao'
```

特点:

- 可以继承实例属性/方法，也可以继承原型属性/方法

- 既是子类的实例，也是父类的实例

- 不存在引用属性共享问题

- 可传参

- 函数可复用

- 调用了两次父类构造函数，生成了两份实例（子类实例将子类原型上的那份屏蔽了）

  

#### 实例继承

为父类实例添加新特性，作为子类实例返回。

```javascript
function Animal(val, tem) {
    this.val = val;
    this.tem = tem;
    this.special = 'father';
}
function Cat(name, hobby, val, tem) {
    var ani = new Animal(val,tem);
    ani.name = name;
    ani.hobby = hobby;
    ani.spe = 'son';
    return ani;
}
let cat = new Cat('cat','mouse','miao,miao','cool');
let ca = Cat('cat','mouse','miao,miao','cool');
/*
cat	{
	name;'cat',hobby:'mouse',spe:'son',
    val:'miao,miao',tem:'cool',special:'father'
}
*/
//	cat.__proto__.constructor === Animal     true
```

特点:

- 可以通过new Cat（），也可以通过直接调用构造函数Cat（）创建实例。
- 实例的构造函数指向父类,是父类的实例，不是子类的。
- 不支持多继承。



#### 拷贝继承

```javascript
function Animal(val, tem) {
    this.val = val;
    this.tem = tem;
    this.special = 'father';
}

function Cat(name, hobby, val, tem) {
    var ani = new Animal(val, tem);
    for (let prop in ani) {
    	//将父类的私有属性作为子类实例的共有属性
    	Cat.prototype[prop] = ani[prop];
    	//将父类的私有属性作为子类实例的私有属性
    	//this[prop] = ani[prop]
    }
    this.name = name;
    this.hobby = hobby;
    this.spe = 'son';
}
let cat = new Cat('cat', 'mouse', 'miao,miao', 'cool');
/*
cat	{
	name;'cat',hobby:'mouse',spe:'son',
    val:'miao,miao',tem:'cool',special:'father'
}
*/
```

特点:

- 支持多继承，
- 可以继承父类的私有属性与共有属性
- 无法获取父类的不可枚举方法（for in不能访问方法）
- 性能不好



#### 寄生组合继承

通过寄生方式(利用空对象做中介)，砍掉父类的实例属性，这样，在调用两次父类的构造的时候，就不会初始化两次实例方法/属性，避免的组合继承的缺点

```javascript
function Animal(val, tem) {
    this.val = val;
    this.tem = tem;
    this.special = 'father';
}
Animal.prototype.age = 22;
    function Cat(name, hobby, val, tem) {
    Animal.call(this,val,tem);
    this.name = name;
    this.hobby = hobby;
    this.spe = 'son';
}
var F = function(){};
F.prototype =  Animal.prototype;
Cat.prototype = new F('proto,miao-miao','proto,cool');
Cat.prototype.constructor = Cat;
let cat = new Cat('cat','mouse','miao,miao','cool');
/*
cat	{
	name;'cat',hobby:'mouse',spe:'son',
    val:'miao,miao',tem:'cool',special:'father'
}
*/
```

特点：代码复杂



## this的理解

在浏览器里，在全局范围内this 指向window对象；

在函数中，this永远指向调用他的那个对象；

构造函数中，this指向new出来的那个新的对象；

call、apply、bind中的this被强绑定在指定的那个对象上；（bind的优先级最高）

箭头函数中this为函数所在作用域中的this，



## call,apply和bind方法的异同

#### 相同：

作用都是改变函数运行时this的指向，第一个参数都是this要指向的对象。

#### 不同：	

1. 返回值不同：函数调用call和apply，会立即执行，返回此函数的返回值。bind会创建一个新的函数，并将新的函数里的this指向bind的第一个参数。
2. 传参方式不同：call与bind都是把参数按顺序传递下去，可传递多个参数。apply是将需要传递的参数放入一个数组内，将这个数组作为apply的第二个参数进行传参。



## cookie 、sessionStorage和localStorage的区别

#### 相同：

都是保存在浏览器端，且同源的。

#### 不同：

###### 存储大小限制不同：

​	因为每次发送服务器请求都会携带cookie，cookie的数据不超过4kb，只适合保存很小的数据。

​	sessionStorage和localStorage不会自动把数据发送给服务器，仅在本地保存，可以达到5Mb。

###### 数据有效期不同：

​	sessionStorage：仅在当前浏览器窗口关闭前有效，自然也就不可能持久保持；

​	localStorage：始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；

​	cookie只在设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭。如果没有设置cookie过期时间，浏览器关闭则cookie失效。

###### 作用域不同：

​	localStorage 与cookied在所有同源窗口中都是共享的。

​	sessionStorage无法在不同的浏览器窗口中共享，即使是同一个页面。



## 常见的http状态码

- ​    200： 请求已成功,请求所希望的响应头或数据体将随此响应返回 
- ​    302： 请求的资源临时从不同的URL响应请求.
- ​    304： 发送了请求且被允许，但文档内容没有改变，不会重新加载，返回304
- ​    403： 服务器已经理解请求,但是拒绝执行它. 
- ​    404： 请求失败,请求所希望得到的资源未被在在服务器上发现.
- ​    500： 服务器遇到了一个未曾预料的状况，一般是服务器源代码出错



## new操作符做了什么?

1. 让构造函数内的this指向实例对象。
2. 将属性和方法添加到 实例对象中，并继承类的原型。
3. 让构造函数返回实例对象。



## let、const与var的区别

let、const可以识别块级作用域，var不能识别块级作用域。

let、const声明的变量没有变量提升不能在声明之前调用（暂时性死区），

var声明的变量有变量提升，可以在声明之前调用。

var声明的变量会变成window对象的属性，而let和const声明的变量不会。

let、const不允许在相同的作用域内重复声明相同的变量，var可以在相同作用域内重复声明同一个变量的。

const声明一个只读的变量，一旦声明，不能修改值，声明时需要立即初始化，否则会报错。

const只能保证变量的地址不变，不能保证所在地址的数据不变化。



## 作用域

作用域：每一个函数、变量都有其作用的范围，超出这个作用范围不得使用。

##### 全局作用域：

在代码中任何地方都能访问到的对象拥有全局作用域，在整个程序生命周期内有效。

拥有全局作用域的情形：

- 定义在最外层的变量与函数，
- 没有先声明直接赋值的变量，
- 在浏览器环境下定义在window对象上的属性。

##### 函数作用域：

在函数内部声明的变量或函数拥有函数作用域。只能被该函数的语句访问，函数外部是不可访问的。

在函数内声明的变量在函数开始执行时创建，函数执行完后局部变量会自动销毁。

##### 块级作用域：

ES6新增的块级作用域，通过关键字let和var来声明。let声明的变量拥有块级作用域，var没有，在for，if等代码块的{}内拥有块级作用域。



## 作用域链与原型链

作用域链用于查找变量。访问一个变量时，会先在自己的变量范围内查找，如果找不到，会沿着作用域链逐层向上查找。

内部环境可以通过作用域链访问所有外部环境，但外部环境不能访问内部环境的任何变量和函数。

原型链是针对构造函数的，查找对象自身的属性，没有则查找构造他的函数的原型中是否有这个属性，如果查找到则停止搜索，否则一直查找到原型链的顶层Object.prototype的过程，就是原型链。

javascript中作用域链是变量的查找机制，而原型链是对象属性的查找机制。



## 闭包

##### 什么是闭包？

闭包是指有权访问另一个函数作用域内变量的函数。

闭包滥用会导致内存泄漏.(无法释放的内存)。



## 函数声明与函数表达式

函数声明必须带一个标识符，即函数名。函数表达式可以没有。

函数声明预解析提升时，整个函数体都会提升。函数表达式只会提升变量名，而赋值表达式不会。

```javascript
function foo(){
    function bar() {
        return 3;
    }
    return bar();
    function bar() {
        return 8;
    }
}
console.log(foo());   //8
```



```javascript
function foo(){
    var bar = function() {
        return 3;
    };
    return bar();
    var bar = function() {
        return 8;
    };
}
console.log(foo()); 	//3
```



```javascript
console.log(foo());		//3
function foo(){
    var bar = function() {
        return 3;
    };
    return bar();
    var bar = function() {
        return 8;
    };
}
```



```javascript
function foo(){
    return bar();
    var bar = function() {
        return 3;
    };
    var bar = function() {
        return 8;
    };
}
alert(foo());   //TypeError : foo is not a function
```



## 变量提升

js在执行代码前会进行预编译，预编译期间会将var声明的变量与函数声明提升到所在作用域的顶端。

函数提升会覆盖变量的提升，后提升的覆盖前面提升的。



## 事件循环（EventLoop）

首先JS是单线程执行的，每个线程至少有一个宏任务队列，以及一个微任务队列，常见的宏任务有script标签、定时器等，常见的微任务promise的回调函数，await后面的代码。

但代码的执行顺序有同步与异步之分，具体的执行顺序是先执行同步代码，执行过程中有微任务依次推入微任务队列，有宏任务依次推入宏任务队列，当同步任务执行完，检查微任务队列是否有微任务，有则依次执行微任务。当执行完所有的微任务，就开始一轮的事件循环，执行宏任务的异步代码。



## 数组的操作方法

##### 会修改原数组的方法 :

push:可接受任意数量的参数，并把他们逐个添加到数组的末尾，并返回修改后数组的长度。

pop:从数组末尾移除最后一项，并返回移除的项。

unshift: 在数组前端添加任意个项并返回修改后数组的长度。

shift:移除数组的第一项，并返回移除的项。

splice:

- 第一个参数为要删除的第一项的位置，第二个参数为要删除的项数。
- 若只有单独第一个参数，则移除数组中从起始下标开始到数组末尾之间的元素。 
- 第三个参数为向指定位置插入任意数量的项。
- splice()方法始终都会返回一个数组，该数组中包含从原始数组中删除的项（如果没有删除任何项，则返回一个空数组）。

reverse()方法：反转数组项的顺序。

sort()方法：

```javascript
//升序
arr.sort(function(a,b){
    return a-b;
})
arr.sort((a,b)=>a-b)
```





##### 会创建新数组的方法(不会修改原数组):

slice()方法

- ​	基于当前数组中的一个或多个项创建一个新数组。
- ​	在只有一个参数的情况下，slice()方法返回从该参数指定位置开始到当前数组末尾的所有项。
- ​	如果有两个参数，该方法返回起始和结束位置之间的项，但不包括结束位置的项。
- ​	如果 slice()方法的参数中有一个负数，则用数组长度加上该数来确定相应的位置。

concat()方法

- 基于当前数组中的所有项创建一个新数组。
- 将接受到的参数添加到数组的末尾，返回新构建的数组。
- 如果传递给 concat()方法的是一或多个数组，则该方法会将这些数组中的每一项都添加到结果数组中。
- 如果传递的值不是数组，这些值就会被简单地添加到结果数组的末尾。



## 数组的遍历方法

every()：对数组中的每一项运行给定函数，如果该函数对每一项都返回 true，则返回 true。

filter()：对数组中的每一项运行给定函数，返回该函数会返回 true 的项组成的数组。

forEach()：对数组中的每一项运行给定函数。这个方法没有返回值。

```javascript
//forEach 操作基本类型不会生效，操作引用类型会改变原数组
let arr = [1,2,3,4];
//只改变基本数据类型item的值
arr.forEach((item)=>{
    item++;
})
//arr [1,2,3,4];
//直接修改数组
arr.forEach((item,index,arr)=>{
    arr[index]++;
})
//arr[2,3,4,5];
```



map()：对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组。

some()：对数组中的每一项运行给定函数，如果该函数对任一项返回 true，则返回 true。

reduce()：

迭代数组的所有项，然后构建一个最终返回的值。

接受两个参数：一个在每一项上调用的函数和（可选的）作为归并基础的初始值。

回调函数接收4个参数：前一个值、当前值、项的索引和数组对象。

```javascript
var arr = [1, 2, 3, 4];
var sum = arr.reduce((prev, cur, index, arr) =>(prev + cur));//reduce求和
var mul = arr.reduce((pre,cur)=>(pre*cur));//求积
```



## 事件代理

事件代理利用事件冒泡的机制把原本需要绑定在子元素的响应事件委托给父元素，让父元素监听子元素事件的触发。

优点：

1. 减少事件注册，节省内存。
2. 动态绑定事件：可以实现当新增子对象时无需再次对其绑定。



## 如何解决跨域

1 . 修改请求头：{  Access - Control - Allow - Orign : *  }

2 . JSONP动态改变script标签里的src属性，缺点：JSONP只支持get请求。

3 . webscoket协议跨域

4 . 代理与反代理

5 . 跨域资源共享cors



## get与post的区别

gei存储的内容小，不超过2kb；文件的上传用post

get传输数据会在url上显示；post传输数据时不需要在url上显示

get从服务器请求数据，post发送数据给服务器；





## js的深浅拷贝

#### 浅拷贝

拷贝原始对象的所有可枚举属性到一个新的对象中，当修改新对象的属性是基本类型时，不会影响原始对象，当修改新对象的属性是引用类型时，也会修改原始数据中的这个属性。

#### 深拷贝

从一个对象中完整的拷贝一份出来,且修改新对象不会影响原始对象。



```javascript
function deepClone(obj) {
    var newObj;
    //判断obj是否为基本类型或者null
    if (typeof obj !== 'object' || obj === null) {
        return obj
    }
    //判断obj是否为数组
    else if (Object.prototype.toString.call(obj) === '[object Array]') {
        newObj = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            //判断obj的每个元素是否为引用类型
            if (typeof obj[i] === 'object' && obj[i] !== null) {
                newObj[i] = deepClone(obj[i]);
            }
            else {
                newObj[i] = obj[i];
            }
        }
    }
    //判断obj是否为对象
    else if (Object.prototype.toString.call(obj) === '[object Object]') {
        newObj = {};
        for (let prop in obj) {
            //判断obj的每个元素是否为引用类型
            if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                newObj[prop] = deepClone(obj[prop]);
            }
            else {
                newObj[prop] = obj[prop];
            }
        }
    }
    return newObj;
}
```







## 数组去重的方法

```javascript
function noRepeated(arr){
    let newArr = [];
    for(let i=0,len=arr.length; i<len; i++){
        if(newArr.indexOf(arr[i])===-1){
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
```

```javascript
function noRepeated(arr){
    let newArr = [];
    arr.forEach((item)=>{
        if(newArr.indexOf(item)===-1){
            newArr.push(item);
        }
    })
    return newArr;
}
```

##### 用下标判断

```javascript
function noRepeated(arr){
    let newArr = [];
    for(let i=0,len=arr.length; i<len; i++){
        if(arr.indexOf(arr[i])===i){
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
```

```javascript
function noRepeated(arr){
	return arr.filter((item,index)=>(
        arr.indexOf(item)===index
    ));
}
```

##### ES6 set去重

```javascript
function noRepeated(arr){
    return Array.from(new Set(arr));
}
```





## 取10个10~100中不重复的随机数

```javascript
var arr = [];
var randNum ;
while(true){
    randNum = getRandNumber(100,10);
    if(arr.indexOf(randNum) === -1){
        arr.push(randNum);
    }
    if(arr.length === 10){
        break;
    }
}
function getRandNumber(a,b){
    return Math.floor(Math.random()*(a-b)+b);
}
```

递归方法

```javascript
let arr = [];
function getRandArr(newArr){
    let num = getRandNumber(100,10);
    if(newArr.length===10){
        return ;
    }
    if(newArr.indexOf(num)===-1){
        newArr.push(num);
    }
    getRandArr(newArr);
}
getRandArr(arr);
function getRandNumber(a,b){
    return Math.floor(Math.random()*(a-b)+b);
}
```



 

## 函数防抖与节流

#### 防抖

当持续触发同一个事件的时候，函数不执行。等最后一次触发结束，并经过一段时间，再去执行函数。

```javascript
//立即执行
function debounce(func,delay){
    let timerId = null;
    return function(){
        let context = this;
        let args = arguments;
        if(timerId){
            clearTimeout(timerId);
        }
        timerId = setTimerout(()=>{
            func.apply(context,args);
        },delay)
    }
}
```

```javascript
function debounce(func,delay){
    let timerId = null;
    return function(){
        let context = this;
        let args = arguments;
        if(timerId){
            clearTimerout(timerId);
        }
        else {
            func.apply(context,args);
        }
        timerId = setTimeout(()=>{
            timerId = null;
        })
    }
}
```



#### 节流

当持续触发同一个事件的时候，让函数每间隔一定的时间去执行一次。

```javascript
//时间戳
function throttle(func,delay){
    let previous = 0;
    return function(){
        let now = Date.now();
        let context = this;
        let args = arguments;
        if(now - previous >=delay){
            func.apply(context,args);
            previous = now;
        }
    }
}
```



```javascript
//定时器
function throttle(func,delay){
    let timerId = null;
    return function(){
        let context = this;
        let args = arguments;
        if(!timerId){
            timerId = setTimeout(()=>{
                func.apply(context,args);
                timerId = null;
            },delay)
        }
    }
}
```



## ES6语言新特性

- 块作用域
- Class类
- 箭头函数
- 模板字符串
- 对象解构
- Promise
- 函数默认参数
- 扩展运算符

## git指令

git add    添加文件到缓存区

git rm   <文件名>   删除文件

git commit -m '注释'      将暂存区的文件提交到本地仓库

git pull	拉取代码

git push	提交到远程仓库

git   status      查看git库的状态

git log  查看日志

git reset --hard  HEAD 	回退到上一个版本

git分支管理

git branch <分支名>	创建分支

git checkout  切换分支

git push origin <分支名> 	将分支提前到远程仓库

git merge  合并某分支的内容到当前分支

git branch -d  <分支名>  删除本地分支

git push origin  --delete	删除远程分支

git branch -r	查看远程仓库的分支

git branch  -a   查看当前所有的分支

git rebase -i    合并多次提交


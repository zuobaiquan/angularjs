---
title: angularjs学习笔记—工具方法
date: 2017-05-09 11:01:49
tags: AngularJS
---

## 1.angular.bind(self, fn, args)

- **作用：返回一个新的函数，绑定这个函数的this指向self**

- **参数：**
  self：新函数的上下文对象

  fn：需要绑定的函数

  args：传递给函数的参数

- **返回值：this指向self的新函数**    <!--more-->

```javascript
var obj = {
  name: 'xxx',
  print: function (country) {
  	  console.log(this.name + ' is from ' + country);
  }
};

var self = {
	name: 'yyy'
};

var bindFn = angular.bind(self, obj.print, 'China');
//var bindFn = angular.bind(self, obj.print, ['China']);

obj.print('American'); //xxx is from American
bindFn();//yyy is from China
```

> 注意：bind会根据你的参数类型来决定调用call或apply，所以args可以是一个个数据，也可以是一个数组。



## 2.angular.copy(source, [destination])

- **作用：对象的深拷贝**

- **参数：**
  source：源对象

  destination：拷贝的对象

- **返回值：拷贝的对象**

```javascript
var obj = {
  name: 'zuobaiquan',
  age: 20
};
var copyObj = angular.copy(obj);
console.log(copyObj); //Object {name: "zuobaiquan", age: 20}
```



## 3.angular.equals(o1, o2)

- **作用：正常比较和对象的深比较**

- **参数：**
  o1：比较的对象

  o2：比较的对象

- **返回值：boolean**

  ```javascript
  angular.equals(3, 3); //true
  angular.equals(NaN,NaN); //true
  angular.equals({name:'xxx'},{name:'xxx'}); //true
  angular.equals({name:'xxx'},{name:'yyy'}); //false
  ```



## 4.angular.extend(dst, src)

- **作用：对象的拓展**

- **参数：**
  dst：拓展的对象

  src：源对象

- **返回值：拓展的对象**

```javascript
var dst = {name: 'xxx', country: 'China'};
var src = {name: 'yyy', age: 10};

angular.extend(dst, src);

console.log(src); //Object {name: "yyy", age: 10}
console.log(dst); //Object {name: "yyy", country: "China", age: 10}
//注意这里的name此时变成了 "yyy"
```


## 5.angular.forEach(obj, iterator, [context])

- **作用：对象的遍历**

- **参数：**
  obj：对象

  iterator：迭代函数

  context：迭代函数中上下文

- **返回值：obj**

  ```javascript
  var obj = {name: 'xxx', country: 'China'};
  angular.forEach(obj, function (value, key) {
  	console.log(key + ':' + value);
  });
  //name:xxx
  //country:China

  var array = ['xxx', 'yyy'];
  angular.forEach(array, function (item, index) {
  	console.log(index + ':' + item + ' from ' + this.country);
  }, obj);
  //0:xxx from China
  //1:yyy from China
  ```



## 6.angular.fromJson(string)

- **作用：字符串转json对象**
- **参数：**
   string：字符串
- **返回值：json对象**

```javascript
var json = angular.fromJson('{"name":"xxx","age":34}');
console.log(json); //Object {name: "xxx", age: 34}
```



## 7.angular.toJson(json,pretty)

- **作用：json对象转字符串**

- **参数：**
  json：json

  pretty：boolean number 控制字符串输出格式

- **返回值：字符串**

```javascript
angular.toJson({name:'xxx'});
// "{"name":"xxx"}"

angular.toJson({name:'xxx'},true);
// "{
//    "name": "xxx"
// }"

angular.toJson({name:'xxx'},10);
// "{
//            "name": "xxx"
// }"
```



## 8.angular.identity(value)

- **作用：返回这个函数的第一个参数**
- **参数：**
  value：参数
- **返回值：第一个参数**

```javascript
console.log(angular.identity('xxx','yyy')); // xxx
```



## 9.angular.isArray(value)

- **作用：判断一个数据是否是数组**
- **参数：**
  value：数据
- **返回值：boolean**

```javascript
angular.isArray(3); // false
angular.isArray([]); // true
angular.isArray([1, 2, 3]); // true
angular.isArray({name: 'xxx'}); // false
```

## 10.angular.isDate(value)

- **作用：判断一个数据是否是Date类型**

- **参数：**
  value：数据

- **返回值：boolean**

  ```javascript
  angular.isDate('2012-12-02'); // false
  angular.isDate(new Date()); // true
  ```

## 11.angular.isDefined(value)

- **作用：判断一个数据是否是defined类型**

- **参数：**
  value：数据

- **返回值：boolean**

  ```javascript
  angular.isDefined(undefined) // false
  angular.isDefined([]); // true
  ```

## 12.angular.isUndefined(value)

- **作用：判断一个数据是否是undefined类型**

- **参数：**
  value：数据

- **返回值：boolean**

  ```javascript
  angular.isUndefined(undefined) // true
  angular.isUndefined([]); // false
  ```

## 13.angular.isFunction(value)

- **作用：判断一个数据是否是函数**
- **参数：**
  value：数据
- **返回值：boolean**

```javascript
angular.isFunction(function(){}); // true
angular.isFunction(3); // false
```

## 14.angular.isNumber(value)

- **作用：判断一个数据是否是Number类型**
- **参数：**
  value：数据
- **返回值：boolean**

```javascript
angular.isNumber(4); // true
angular.isNumber('xxx'); // false
angular.isNumber(new Number(4)); // false
angular.isNumber(Number(4)); // true
```

## 15.angular.isObject(value)

- **作用：判断一个数据是否是对象**

- **参数：**
  value：数据

- **返回值：boolean**

  ```javascript
  angular.isObject('xxx'); // false      
  angular.isObject(null); // false
  angular.isObject([]); // true
  angular.isObject(function(){}); // false
  angular.isObject({name:'xxx'}); // true
  ```

## 16.angular.isString(value)

- **作用：判断一个数据是否是字符串**

- **参数：**
  value：数据

- **返回值：boolean**

  ```javascript
  angular.isString(4); // false
  angular.isString('xxx'); // true
  angular.isString(new String('xxx')); // false
  angular.isString(String('xxx')); // true
  ```

## 17.angular.lowercase(string)

- **作用：将字符串大写字母变小写**

- **参数：**
  string：字符串

- **返回值：改变后的新字符串**

  ```javascript
  var newString = angular.lowercase('XXyyZZ');
  console.log(newString); // xxyyzz
  ```

## 18.angular.uppercase(string)

- **作用：将字符串小写字母变大写**

- **参数：**
  string：字符串

- **返回值：改变后的新字符串**

  ```javascript
  var newString = angular.uppercase('XXyyZZ');
  console.log(newString); // XXYYZZ
  ```

## 19.angular.noop()

**作用：空函数**

```javascript
var flag = false;    
flag ? console.log('xxx') : angular.noop();
```






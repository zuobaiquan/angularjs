### **angularjs中插值语法和ng-bind以及ng-model的区别**



插值语法也就是 {{ }} 和 ng-bind 基本上是没有区别的。

主要区别在于，使用花括号语法时，在AngularJS使用数据替换模板中的花括号时，第一个加载的页面，通常是应用中的index.html，其未被渲染的模板可能会被用户看到。而使用ng-bind方法不会遇到这种问题。

原因是，浏览器需要首先加载index.html页面，渲染它，然后AngularJS才能把它解析成你期望看到的内容。

所以，对于index.html页面中的数据绑定操作，建议采用ng-bind。那么在数据加载完成之前用户就不会看到任何内容。

总结：ng-model和ng-bind的区别就在于

ng-bind 是从$scope -> view的单向绑定  ，其未被渲染的模板用户不会被看到；

ng-modle 是$scope <-> view的双向绑定，第一个加载的页面，通常是应用中的index.html，其未被渲染的模板可能会被用户看到。

#### 












//var baseApiUrl="http://192.168.1.46:8080";
//var domain="http://localhost:5000";
// $.ajax({
//     url: baseApiUrl + "/admin/login",
//     data: {
//         username: 'root',
//         password: '63a9f0ea7bb98050796b649e85481845'
//     },
//     method: "POST",
//     statusCode: {
//         401: function() {
//             alert("Username or Password mistake");
//         },
//         404: function() {
//             alert("Page not found");
//         }
//     },
//     success: function(data, status, xhr) {
//         console.log('get ipzoe_sidebar_list from server');
//         ipzoe_init();
//         getTreeData();
//     },
//     error: function() {
//         console.error("API Error");
//     }
// });

var ipzoe_init = function(callback) {

      if (ipzoe_lang == 'EN') {
          ipzoe_sidebar = [{
              name: 'Dashboard',
              order: 0,
              submenu: []
          }, {
              name: 'Components',
              order: 100,
              submenu: [{
                  name: 'Mail',
                  order: 0,
              }, {
                  name: 'Timeline',
                  order: 100,
              }, {
                  name: 'Tree View',
                  order: 200,
              }]
          }, {
              name: 'Chart',
              order: 150,
              submenu: [{
                  name: 'amCharts',
                  order: 0,
              }, {
                  name: 'Chartist',
                  order: 100,
              }, {
                  name: 'Chart.js',
                  order: 200,
              }, {
                  name: 'Morris',
                  order: 300,
              }, {
                  name: 'Echarts',
                  order: 400,
              }]
          }, {
              name: 'UI Features',
              order: 200,
              submenu: [{
                  name: 'Typography',
                  order: 0,
              }, {
                  name: 'Buttons',
                  order: 100,
              }, {
                  name: 'Icons',
                  order: 200,
              }, {
                  name: 'Modals',
                  order: 300,
              }, {
                  name: 'Grid',
                  order: 400,
              }, {
                  name: 'Alerts',
                  order: 500,
              }, {
                  name: 'Progress Bars',
                  order: 600,
              }, {
                  name: 'Notifications',
                  order: 700,
              }, {
                  name: 'Tabs & Accordions',
                  order: 800,
              }, {
                  name: 'Sliders',
                  order: 900,
              }, {
                  name: 'Panels',
                  order: 1000,
              }]
          }, {
              name: 'Form',
              order: 250,
              submenu: [{
                  name: 'Form Inputs',
                  order: 0,
              }, {
                  name: 'Form Layouts',
                  order: 100,
              }, {
                  name: 'Form Wizard',
                  order: 200,
              }, {
                  name: 'Form validation',
                  order: 300,
              }, {
                  name: 'Date Picker',
                  order: 400,
              }]
          }, {
              name: 'Tables',
              order: 300,
              submenu: [{
                  name: 'Basic Tables',
                  order: 0,
              }, {
                  name: 'Smart Tables',
                  order: 100,
              }, {
                  name: 'Ajax Tables',
                  order: 200,
              }]
          }, {
              name: 'Maps',
              order: 500,
              submenu: [{
                  name: 'Google Maps',
                  order: 0,
              }, {
                  name: 'Leaflet Maps',
                  order: 100,
              }, {
                  name: 'Bubble Maps',
                  order: 200,
              }, {
                  name: 'Line Maps',
                  order: 300,
              }]
          }, {
              name: 'auth',
              order: 700,
              submenu: [{
                  name: 'menu',
                  order: 0,
              }]
          }];
      } else {
          ipzoe_sidebar = [{
              name: '仪表板',
              order: 0,
              submenu: []
          }, {
              name: '组件',
              order: 100,
              submenu: [{
                  name: '邮件',
                  order: 0,
              }, {
                  name: '时间表',
                  order: 100,
              }, {
                  name: '树视图',
                  order: 200,
              }]
          }, {
              name: '图表',
              order: 200,
              submenu: [{
                  name: 'amCharts',
                  order: 0,
              }, {
                  name: 'Chartist',
                  order: 100,
              }, {
                  name: 'Chart.js',
                  order: 200,
              }, {
                  name: 'Morris',
                  order: 300,
              }, {
                  name: 'Echarts',
                  order: 400,
              }]
          }, {
              name: '用户界面功能',
              order: 300,
              submenu: [{
                  name: '排版',
                  order: 0,
              }, {
                  name: '按钮',
                  order: 100,
              }, {
                  name: '图标',
                  order: 200,
              }, {
                  name: '弹出框',
                  order: 300,
              }, {
                  name: '网格',
                  order: 400,
              }, {
                  name: '警告',
                  order: 500,
              }, {
                  name: '进度条',
                  order: 600,
              }, {
                  name: '通知',
                  order: 700,
              }, {
                  name: 'tab切换',
                  order: 800,
              }, {
                  name: '滑块',
                  order: 900,
              }, {
                  name: '面板',
                  order: 1000,
              }]
          }, {
              name: '表单',
              order: 400,
              submenu: [{
                  name: '表单输入框',
                  order: 0,
              }, {
                  name: '表单布局',
                  order: 100,
              }, {
                  name: '表单向导',
                  order: 200,
              }, {
                  name: '表单验证',
                  order: 300,
              }, {
                  name: '日期选择',
                  order: 400,
              }, {
                  name: '图片上传预览',
                  order: 500,
              }, {
                  name: '其他插件',
                  order: 600,
              }, {
                  name: '常用表单样式',
                  order: 700,
              }]
          }, {
              name: '表格',
              order: 500,
              submenu: [{
                  name: '基础表格',
                  order: 0,
              }, {
                  name: '智能表格',
                  order: 100,
              }, {
                  name: '服务器表格',
                  order: 200,
              }, {
                  name: '其他服务器表格',
                  order: 300,
              },{
                  name: '测试表格',
                  order: 400,
              },]
          }, {
              name: '地图',
              order: 600,
              submenu: [{
                  name: 'Google 地图',
                  order: 0,
              }, {
                  name: 'Leaflet 地图',
                  order: 100,
              }, {
                  name: 'Bubble 地图',
                  order: 200,
              }, {
                  name: 'Line 地图',
                  order: 300,
              }]
          }, {
              name: '权限管理',
              order: 700,
              submenu: [{
                  name: '菜单管理',
                  order: 0,
              }]
          }];
      }
};
var ipzoe_sidebar = [];
var ipzoe_user_sidebar = ['n1', 'n8', 'n9', 'n10'];
// var ipzoe_lang = 'EN';
var ipzoe_lang = 'ZH';

var ipzoe_sidebar_list;
//获取菜单列表
var getTreeData = function() {
    ipzoe_sidebar_list = [];
    var index;
    for (var i = 0; i < ipzoe_sidebar.length; i++) {
        ipzoe_sidebar_list[i] = {};
        ipzoe_sidebar_list[i].id = "n" + i;
        ipzoe_sidebar_list[i].parent = '#';
        ipzoe_sidebar_list[i].text = ipzoe_sidebar[i].name;
        ipzoe_sidebar_list[i].type = "folder";
        ipzoe_sidebar[i].id = "n" + i;
        ipzoe_sidebar_list[i].state = {};
        ipzoe_sidebar_list[i].state.selected = true;
    }
    index = ipzoe_sidebar.length;
    for (var j = 0; j < ipzoe_sidebar.length; j++) {
        if (ipzoe_sidebar[j].submenu.length !== 0) {
            for (var k = 0; k < ipzoe_sidebar[j].submenu.length; k++) {
                ipzoe_sidebar_list[index] = {};
                ipzoe_sidebar_list[index].id = "n" + index;
                ipzoe_sidebar_list[index].parent = ipzoe_sidebar_list[j].id;
                ipzoe_sidebar_list[index].text = ipzoe_sidebar[j].submenu[k].name;
                ipzoe_sidebar[j].submenu[k].id = "n" + index;
                ipzoe_sidebar_list[index].state = {};
                ipzoe_sidebar_list[index].state.selected = true;
                index++;
            }
        }
    }
};
ipzoe_init();
getTreeData();

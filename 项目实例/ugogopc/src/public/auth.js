//var baseApiUrl = "http://service.ugogo.net:15038";
var baseApiUrl = "http://121.41.90.22:15038";
var domain = "http://test.shixing.me:8080/ugogo/pc";
//var domain = "http://localhost:5000";
//var domain = "http://merchant.ugogo.net";
var signIn = function () {
    var name = $('#inputAccount').val();
    var pwd = $('#inputPassword').val();
    if(name==''){
        alert("账号不能为空");
        return false;
    }
    if(pwd==''){
        alert("密码不能为空");
        return false;
    }
    $.ajax({
        url: baseApiUrl + "/shopAdmin/Account/sign-in",
        data: {
            phone: name,
            password: md5(pwd)
        },
        method: "POST",
        statusCode: {
            401: function () {
                alert("Username or Password mistake");
            },
            404: function () {
                alert("Page not found");
            }
        },
        success: function (data, status, xhr) {
            if (data.code == 200) {
                var token=data.data.account.token;
                // cleanSubMenu(data.data.menus);
                window.sessionStorage.setItem('X-Auth-Token', token);
                window.sessionStorage.setItem('ADMIN', JSON.stringify(data.data));
                window.location.href = domain + "#/index";
            } else {
                alert(data.message);
            }
        },
        error: function (err) {
            alert('无法连接服务器');
        }
    });

    return false;
};

/**
 * 由于服务器端返回的subMenu为空数组,
 * 而插件要求没有子菜单时subMenu为null,
 * 所以这里进行临时处理
 *
 * @param menus
 */
function cleanSubMenu(menus) {
    console.log(new Date());
    console.log(menus);
    for (var i = 0; i < menus.length; ++i) {
        if (menus[i].subMenu.length === 0) {
            menus[i].subMenu = null;
        } else {
            cleanSubMenu(menus[i].subMenu);
        }
    }
}

function appendSchoolPath(school, menus) {
    for (var i = 0; i < menus.length; ++i) {
        menus[i].schoolId = school.id;
    }
}

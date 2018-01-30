(function() {
    'use strict';

    angular
        .module('util.constant', [])
        //.constant('API_URL', 'http://service.ugogo.net:15038')
		    .constant('API_URL', 'http://121.41.90.22:15038')
        //.constant('API_URL', 'http://192.168.1.51:15038')
        //.constant('DOMAIN', 'http://localhost:3000')
        .constant('DOMAIN', 'http://test.shixing.me:8080/ugogo/admin')
        //.constant('DOMAIN', 'http://admin.ugogo.net')
        .constant('ROLE_ROOT', 'ADMIN_ROOT')
        .constant('ROLE_SCHOOL', 'ADMIN_SCHOOL')
        .constant('QINIU_HOST', 'upload-z2.qiniu.com')
        .constant('QINIU_LINK', 'https://res.ugogo.net/')
        .constant('IMAGE_UPLOAD',{
            url:'http://up-z0.qiniu.com',
            baseUrl:'http://upload-z2.qiniu.com/putb64/-1',
            link:'https://res.ugogo.net/',
            token:'GPe0W-G7lC70RpkD-GxIl7h_BXbLLq9XaQ0qnbje:-8vJk_m8jkavbIEfJpUTkvvMuNw=:eyJzY29wZSI6InVnb2dvIiwiZGVhZGxpbmUiOjE1MDA0ODQ3MzcwMDAwMDAwMH0='
        });
})();

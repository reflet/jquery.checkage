/**
 * User-Agent check Plugin
 * User: Tenderfeel
 * Date: 2011/06/20
 * LastModified: 2011/06/22
 *
 */
(function($){
    /**
     * jQuery function 'checkAgent'
     * @param method {string|object|undefined}
     *
     * $(document.body).checkAgent({});
     */
    $.fn.checkAgent = function(method){

        var ua = navigator.userAgent;
        var ws = $(window).width();
        var sw  = screen.width;

        var TYPE = 'PC';
        var OS = null;
        var APPLE = false;
        var ANDROID = false;
        var GARAPAGOS = false;
        var DEVICE_NAME = null;
        var VERSION = null;
        var LOCALE = null;
        var LANG = null;
        var COUNTRY = null;
        var SMARTPHONE = false;
        
        var _doLocale = function(){
            LOCALE = window.navigator.language || $('html').attr('lang');
            if(LOCALE && LOCALE.indexOf('-') !== -1){
                var ls = LOCALE.split('-');
                LANG = ls[0];
                COUNTRY = ls[1];
            }else{
                LANG = LOCALE;
                COUNTRY = 'unknown';
            }
        };

        var _doOS = function(){
            if(ua.indexOf('Win') !== -1){
                OS = 'win';
            }else if(ua.indexOf('Mac') !== -1){
                OS = 'mac';
            }else{
                OS = 'unknown';
            }
        };

        var _doGarapagos = function(){

            _doLocale();
            var m;
            
            if(ua.indexOf('DoCoMo') !== -1||ua.indexOf('FOMA') !== -1){
                OS = 'docomo';
                TYPE = 'garapagos';
                m = ua.match(/Mozilla\/[\d\.]+\s\(([\d\w]+);\w+;([\w\d]+);\w+\)/i);
                if(m){
                    VERSION = m[2];
                    DEVICE_NAME = m[1];
                }
                GARAPAGOS = true;
                return true;
                
            }else if(ua.indexOf('KDDI') !== -1){
                //auはOperaMiniらしい
                OS = 'au';
                TYPE = 'garapagos';
                m = ua.match(/^Mozilla\/[\d\.]+\s*\(.+;\s*KDDI-([\w\d]+)\)/i);

                if(m){
                    VERSION = $.browser.version;
                    DEVICE_NAME = m[1];
                }
                GARAPAGOS = true;
                return true;

            }else if(ua.indexOf('SoftBank') !== -1){
                //SoftBankはNetFrontらしい
                OS = 'softbank';
                TYPE = 'garapagos';
                m = ua.match(/Mozilla\/[\d\.]+\s\(([\d\w]+);SoftBank;*([\d\w]+)*\).+?(\d\.\d)$/i);
                DEVICE_NAME = m[1];
                VERSION = m[3];
                GARAPAGOS = true;
                return true;
            }
            return false;
        };
        
        var _doAndroid = function(){
            ANDROID = true;
            SMARTPHONE = true;
            OS = 'android';
           var m = ua.match(/Android (\d\.\d(?:[^;]+)*); (\w{2,3})\-(\w{2,3});\s([^\/]+)\sBuild/i);
            VERSION = m[1];
            LANG = m[2];
            COUNTRY = m[3];
            DEVICE_NAME = m[4].replace(/\s/ig, '');
            return true;
        };

        var _doApple = function(){
             var m = ua.match(/\((\w+); U;[\w\s]+? OS (\d_\d(?:_\d)*)/i);
             APPLE = true;
             DEVICE_NAME = m[1];
             OS = 'apple';
             VERSION = m[2].replace(/_/g, '.');
             SMARTPHONE = true;
             return true;
        };

        var _doWebkit = function(){
            var m = ua.match(/(?:(\w+)\/([\d\.\-\w]+)\s)*(?:(\w+)\/([\d\.\w]+))$/i);
            if(m[3] === 'Safari' && m[1] === 'Version'){
                VERSION = m[2];
                DEVICE_NAME = m[3];
            }else if(m[3] === 'Safari' && m[1]){
                VERSION = m[2];
                DEVICE_NAME = m[1];
            }else if(!m[1] && !m[2]){
                VERSION = m[4];
                DEVICE_NAME = m[3];
            }

            return true;
        };

        var _doTrident = function(){
            VERSION = $.browser.version;
            if(ua.indexOf('Nitro') !== -1){
                DEVICE_NAME = 'Nintendo DS';
                OS = 'nds';
            }else if(ua.indexOf('Lunascape') !== -1){
                DEVICE_NAME = 'Lunascape';
            }else if(ua.indexOf('Sleipnir') !== -1){
                DEVICE_NAME = 'Sleipnir';
            }else if(ua.indexOf('InettvBrowser') !== -1){
                DEVICE_NAME = 'InettvBrowser';
                var m  = ua.match(/InettvBrowser\/([\d\.]+) /);
                VERSION = m[1];
                OS = 'tv';
                TYPE = 'nettv';
            }else{
                DEVICE_NAME = 'InternetExplorer';
            }
            return true;
        };

        var _doGecko = function(){//
            var m = ua.match(/(?:(?:Mech\.)*([\w\d]+)\/([\d\.]+).*?)\s\(([^;\/\:]+)[;\/\:]?\s*([^;\/]*);?([^;]*);?([^;]*);?\s?([^;]*)\)[;\s]*(.*)/i);

            if(m){
                switch(m[3]){
                    case 'PSP PlayStation Portable':
                        OS = 'psp';
                        DEVICE_NAME = 'PlayStationPortable';
                        TYPE = 'game';
                    break;
                    case 'Nintendo GameBoy':
                        OS = 'ngb';
                        TYPE = 'game';
                        DEVICE_NAME = 'GameBoy';
                        VERSION = m[2];
                    break;
                    case 'PS2':
                        OS = 'ps2';
                        DEVICE_NAME = 'PlayStation2';
                        TYPE = 'game';
                    break;
                    case 'PLAYSTATION 3':
                        OS = 'ps3';
                        DEVICE_NAME = 'PlayStation3';
                        TYPE = 'game';
                    break;
                    case 'DreamPassport':
                        DEVICE_NAME = 'DreamPassport';
                        TYPE = 'game';
                        VERSION = m[4];
                    break;
                    case 'PDA':
                        OS = 'pda';
                        TYPE = 'pda';
                        DEVICE_NAME = 'PDA';
                        VERSION = m[2];
                    break;
                    case 'DTV':
                        DEVICE_NAME = m[4];
                        TYPE = 'nettv';
                        OS = 'tv';
                        VERSION = m[8].replace(/^[^\s]+\s\w+\/([\d\.]+).+$/i,'$1');
                    break;
                    default:
                        m = ua.match(/(?:(\w+)\/([\d\.\-\w]+)\s)*(?:[^\s]*\s)?([^\/]+)\/([\d\.]+)(?:[^\/]*)$/i);

                        if(m[1] && m[1] === 'Gecko'){
                            DEVICE_NAME = m[3] ? m[3] : m[1];
                            VERSION = m[4] ? m[4] : m[1];
                        }else if(m[1] && m[1] !== 'Gecko'){
                            DEVICE_NAME = m[1];
                            VERSION = m[2];
                        }else{
                            if(m[3] === 'Mozilla'){
                                DEVICE_NAME = 'Mozilla';
                                VERSION = ($.browser.version==='0')? m[4] : $.browser.version;
                            }
                        }

                    break;
                }
            }
            return true;
        };
        
        var _doOpera = function(){
            var m = ua.match(/(\w+)\/([\d\.]+)\s\(([^;]+).+\)(?:\s\w{5}\s([\d\.]+))*/i);
            DEVICE_NAME = 'Opera';
            if(m[3] === 'Nintendo Wii'){
                OS = 'wii';
                TYPE = 'game';
            }else if(m[3] === 'Nintendo DSi'){
                OS = 'ndsi';
                TYPE = 'game';
            }else if(ua.indexOf('Nitro') !== -1){
                OS = 'nds';
                TYPE = 'game';
            }
            if(m[1] === 'Opera'){
                VERSION = m[2];
            }else if(m[4]){
                VERSION = m[4];
            }
            
            return true;
        };
        
        var _doPC = function(){
            _doOS();
            _doLocale();

            if($.browser.webkit){
                if(ua.indexOf('Android') !== -1){
                    return _doAndroid();
                }else if(ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1 || ua.indexOf('iPod') !== -1){
                    return _doApple();
                }else{//PC用ブラウザ
                    var m = ua.match(/\((\w+);*/i);
                    OS = m[1].toLowerCase().slice(0,3);
                    _doLocale();
                    return _doWebkit();
                }

            }else if($.browser.msie){
                return _doTrident();

            }else if($.browser.mozilla){
                return _doGecko();
            }else if($.browser.opera){
                return _doOpera();
            }else{
                
                VERSION = 0;
            }
        };

        //public methods
        var publics = {
            
            init:function(options){
                this.checkAgent.settings = $.extend({}, this.checkAgent.defaults, options);
                var settings = this.checkAgent.settings;

                if(! $.browser.agent){
                    var cn = [];
                    var v = 'v';
                    TYPE = 'pc';

                    if(! _doGarapagos()){//PCサイトビューアー携帯 or ゲーム or テレビ
                        if($.browser.version){
                            _doPC();
                        }
                    }

                    LOCALE = (!LOCALE && LANG) ? LANG + '-' + COUNTRY.toUpperCase() : LOCALE;

                    if((ANDROID || APPLE) && ( ws === sw) && (window.orientation >= 0)){
                        SMARTPHONE = true;
                        TYPE = 'smartphone';
                    }

                    $.extend($.browser, {'agent':{
                        'apple' : APPLE,
                        'android' : ANDROID,
                        'device' : DEVICE_NAME,
                        'version' : VERSION,
                        'locale' : LOCALE,
                        'lang' : LANG,
                        'country' : COUNTRY,
                        'type':TYPE,
                        'os':OS,
                        'smartphone':SMARTPHONE,
                        'garapagos':GARAPAGOS
                    }});
                    
                    $.each(settings, function(key, val){
                        if(val !== true) return;
                        switch(key){
                            case 'garapagos':
                                if($.browser.agent.garapagos) cn.push('garapagos');
                            break;
                            case 'smartphone':
                                if($.browser.agent.garapagos) cn.push('smartphone');
                            break;
                            case 'version':
                                if($.browser.agent.version){
                                    cn.push('v' + $.browser.agent.version.replace(/\./g, '_'));
                                }
                            break;
                            default:
                                    cn.push($.browser.agent[key]);
                            break;
                        }
                    });
                }
                
                return this.each(function(){
                    var $element = $(this), element = this;
                    $element.addClass(cn.join(' '));
                });
            },

            'add':function(type){
                if(! type) return;
                var txt = $.getAgent(type);
                switch(type){
                    case 'version':
                         txt =  'v' + txt;
                    break;
                    case 'garapagos':
                         if(txt===true) txt = 'garapagos';
                    break;
                    case 'smartphone':
                         if(txt===true) txt = 'smartphone';
                    break;
                }
                $(this).addClass(txt);
            }
        };

        $.extend({
            getAgent:function(type){
                if(! $.browser.agent) return null;
                if(type !== 'all' && typeof type === 'string'){
                    return $.browser.agent[type];
                }else if(!type || type === 'all'){
                    var str = '<ul>';
                    var s = arguments[1] || ' : ';
                    $.each($.browser.agent, function(key, val){
                        str += '<li>' + key + s + val + '</li>';
                    });
					str += '</li>';
                    return str;
                }
            }
        });

        if(publics[method]){
            return publics[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if(typeof method === 'object' || !method){
            return publics.init.apply(this, arguments);
        }else{
            $.error(method + ' はcheckAgentプラグインに定義されていません');
        }
    };

    $.fn.checkAgent.defaults = {
        'type':true,
        'os':false,
        'device':true,
        'version':false,
        'lang':false,
        'country':false,
        'locale':false,
        'smartphone':false,
        'garapagos':false
    };

    $.fn.checkAgent.settings = {};
    
})(jQuery);
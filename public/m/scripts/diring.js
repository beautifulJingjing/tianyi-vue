﻿if (typeof JSON !== "object") $.getScript("/javascripts/json2.min.js");
var mbox = (function() {
    var _box;
    var flag;
    function alert(div) {
        if (_box) {
            _box.style.display = 'none'
        };
        if (div) {
            _box = div;
            alertbox();
            $(window).on('resize scroll', alertbox)
        };
        if (!document.getElementById("EV_AlertMask")) {
            alertmask();
            $(window).on('resize scroll', alertmask);
        };
        if ($$.alertevent) $$.alertevent.call()
    };

    function close(box) {
        if (box && !box.preventDefault && box != _box) return;
        if (_box) {
            _box.style.display = 'none';
            $(window).off('resize scroll', alertbox)
        };
        if (document.getElementById("EV_AlertMask")) {
            closemask();
            $(window).off('resize scroll', alertmask)
        };
        if ($$.closeevent) $$.closeevent.call()
    };

    function alertbox() {
        _box.style.display = 'block';
        var _t = $(window).scrollTop() + Math.round(($(window).height() - _box.offsetHeight) / 2);
        var _l = $(window).scrollLeft() + Math.round(($(window).width() - _box.offsetWidth) / 2);
        with(_box) {
            style.top = (_t < 0 ? 0 : _t) + "px";
            style.left = (_l < 0 ? 0 : _l) + "px";
            style.position = "absolute";
            style.zIndex = "10001"
        }
    };

    function alertmask() {
        var mask = document.getElementById("EV_AlertMask");
        if (!mask) {
            mask = document.createElement("div");
            mask.setAttribute('id', 'EV_AlertMask');
            document.body.appendChild(mask)
        };
        with(mask) {
            style.position = "absolute";
            style.top = "0px";
            style.left = "0px";
            style.width = Math.max((document.documentElement.scrollWidth || document.body.scrollWidth || 0), $(window).width()) + "px";
            style.height = Math.max((document.documentElement.scrollHeight || document.body.scrollHeight || 0), $(window).height()) + "px";
            style.zIndex = "10000";
            style.background = "#231815";
            style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=50,finishOpacity=50);";
            style.opacity = "0.5"
        }
    };

    function closemask() {
        var mask = document.getElementById("EV_AlertMask");
        if (mask) document.body.removeChild(mask)
    };

    function alertslid(div, callback) {
        $(window).on('touchmove', function (e) { e.preventDefault(); });
        flag = true;
        if (!div) return;
        if (div instanceof Element) div = $(div);
        if(flag){
            var _w = $(window);
            div.css({
                'left': _w.width(),
                'height': _w.height()
            });
            div.css('opacity',1);
            flag = false;
            setTimeout(function() {
                div.animate({
                    'left': 0
                }, 300, function() {
                    if (callback) callback();
                    mplayer.doStop()
                })
            }, 10)
        } else  if (callback) callback()
    };

    function closeslid(div) {
        $(window).off('touchmove');
        if (!div || div instanceof Event) div = $$.setting;
        if (div instanceof Element) div = $(div);
        div.animate({
            'left': $(window).width()
        }, 300, function() {
            div.css('opacity',0);
            mplayer.doStop();
        })
    };

    function checking(option) {
        if (!option) option = {};
        var slid = $$.setting;
        slid.checking.show().siblings().hide();
        slid.title.html(option.title || '验证手机号');
        if (option.music) {
            slid.musics.html(option.music).show();
            with(slid.musics) {
                find('.btn-play').removeClass('btn-pause').click(app.doPlay);
                find('.name').find('em,i').remove();
                find('.set').remove()
            }
        } else if (!slid.musics.html() || slid.css("opacity")==0) slid.musics.hide();
        with(slid.checking) {
            phone.val(option.phone || '');
            code.val('');
            btn_code.off('click').click(function(e) {
                option.getcodeEvent(e, {
                    phone: phone.val().trim()
                });
                app.isclick = true;
            });
            btn_ok.html(option.check || '确定').off('click').click(function(e) {
                option.checkEvent(e, {
                    phone: phone.val().trim(),
                    checkcode: code.val().trim()
                })
            });
            msg.html((option.explain || '').toHtml())
        };
        alertslid(slid[0], function() {
            if (option.log) {
                option.log();
                delete option.log
            }
        });
        return slid[0];
    };

    function service(option) {
        if (!option) option = {};
        var slid = $$.setting;
        slid.service.show().siblings().hide();
        slid.title.html(option.title || '开通服务');
        if (option.music) {
            slid.musics.html(option.music).show();
            with(slid.musics) {
                find('.btn-play').removeClass('btn-pause').click(app.doPlay);
                find('.name').find('em,i').remove();
                find('.set').remove()
            }
        } else if (!slid.musics.html() || slid.css("opacity")==0) slid.musics.hide();
        with(slid.service) {
            if (option.phone) phone.text(option.phone).show();
            else phone.hide();
            if (option.changeEvent) btn_change.off('click').show().click(option.changeEvent);
            else btn_change.hide();
            if (option.confirmmsg) confirm.html(option.confirmmsg.toHtml()).show();
            else confirm.hide();
            btn_ok.html(option.confirm || '确认').off('click').click(option.confirmEvent);
            msg.html((option.explain || '').toHtml())
        };
        alertslid(slid[0], function() {
            if (option.log) {
                option.log();
                delete option.log
            }
        });
        return slid[0];
    };

    function explain(option) {
        if (!option) option = {};
        var slid = $$.setting;
        slid.explain.show().siblings().hide();
        slid.title.html(option.title || '提示');
        if (option.music) {
            slid.musics.html(option.music).show();
            with(slid.musics) {
                find('.btn-play').removeClass('btn-pause').click(app.doPlay);
                find('.name').find('em,i').remove();
                find('.set').remove()
            }
        } else if (!slid.musics.html() || slid.css("opacity")==0) slid.musics.hide();
        with(slid.explain) {
            if (option.icon) icon.removeClass().addClass('icon').addClass(option.icon).show();
            else icon.hide();
            msg.html(option.explain.toHtml());
            btn_ok.html(option.confirm || '我知道了~').off('click').click(option.confirmEvent || closeslid)
        };
        alertslid(slid, function() {
            if (option.log) {
                option.log();
                delete option.log
            }
        });
        return slid[0];
    };
    var $$ = {
        alert: alert,
        close: close,
        alertevent: null,
        closeevent: null,
        alertslid: alertslid,
        closeslid: closeslid,
        waiting: function(msg) {
            var dv = $('#pop-waiting-layer');
            dv.find('span').text(msg);
            alert(dv[0]);
            return dv[0]
        },
        weixinprompt: function() {
            var dv = document.getElementById('wxbrowse-prompt');
            alert(dv);
            return dv
        },
        setting: function() {
            var setting = $('#slid-layer');
            $.extend(setting, {
                title: setting.find('.t').find('span'),
                btn_back: setting.find('.btn-back'),
                musics: setting.find('.musics'),
                checking: setting.find('.checking'),
                service: setting.find('.service'),
                explain: setting.find('.explain')
            });
            with(setting) {
                btn_back.click(closeslid);
                $.extend(checking, {
                    phone: checking.find('.phone'),
                    code: checking.find('.code'),
                    btn_code: checking.find('.btn-code'),
                    btn_ok: checking.find('.btn-ok'),
                    msg: checking.find('.msg')
                });
                $.extend(service, {
                    phone: service.find('b'),
                    btn_change: service.find('.btn-change'),
                    confirm: service.find('.confirm'),
                    btn_ok: service.find('.btn-ok'),
                    msg: service.find('.msg')
                });
                $.extend(explain, {
                    icon: explain.find('.icon'),
                    msg: explain.find('.msg'),
                    btn_ok: explain.find('.btn-ok')
                })
            };
            this.setting = setting;
            delete setting
        },
        checking: checking,
        service: service,
        explain: explain,
    };
    return $$
})();
var mplayer = (function() {
    var $$ = {
        audio: null,
        lasttarget: null,
        target: null,
        play: null,
        pause: null,
        loadstart: null,
        error: null,
        init: function(option) {
            $.extend($$, option);
            with(this.audio = new Audio()) {
                volume = 0.8;
                preload = 'metadata';
                autoPlay = false;
                addEventListener('loadstart', function() {
                    if ($$.loadstart) $$.loadstart()
                });
                addEventListener('error', function() {
                    setTimeout(function() {
                        if (paused || ended) {
                            pause();
                            if ($$.error) $$.error();
                            alert(error.code + '\r\n' + networkState + '\r\n' + readyState + '\r\n' + currentSrc)
                        }
                    }, 3000)
                });
                addEventListener('loadedmetadata', function() {
                    play()
                });
                addEventListener('play', function() {
                    if ($$.play) $$.play()
                });
                addEventListener('pause', function() {
                    if ($$.pause) $$.pause()
                });
                addEventListener('ended', function() {
                    if ($$.pause) $$.pause()
                })
            }
        },
        setCurrentTime: function(second) {
            this.audio.currentTime = second
        },
        doPlay: function(_src, _target) {
            with(this.audio) {
                if (src.indexOf(_src) > -1) {
                    if (!$$.target) $$.target = _target;
                    if (paused || ended) {
                        currentTime = 0;
                        play()
                    } else pause()
                } else if (_src) {
                    if ($$.target) {
                        if (!(paused || ended)) {
                            pause();
                            if ($$.pause) $$.pause()
                        };
                        $$.lasttarget = $$.target
                    };
                    $$.target = _target;
                    src = _src;
                    load()
                }
            }
        },
        doStop: function() {
            with(this.audio) {
                if (!(paused || ended)) {
                    var pauseEvent = function() {
                        $$.target = null;
                        removeEventListener('pause', pauseEvent)
                    };
                    addEventListener('pause', pauseEvent);
                    pause();
                    $$.lasttarget = $$.target
                } else {
                    $$.lasttarget = $$.target;
                    $$.target = null
                }
            }
        },
    };
    return $$
})();
var unicom = {
    regexPhone: new RegExp(/^((13[0-2])|145|(15[5|6])|(17[5|6])|(18[5|6]))\d{8}$/)
};
var telecom = {
    regexPhone: new RegExp(/^(133|153|177|173|(18[0|1|9]))\d{8}$/)
};
var app = (function() {
    var $$ = {
        spinfocode: '0',
        connection: navigator.connection || {
            type: ''
        },
        unikey: 0,
        isclick: false
    };
    var pushinfo = {};
    var user = {
        isorder: function() {
            if (typeof this.orderstate == 'number') return this.orderstate != 4;
            else return false
        },
        logined: function() {
            if (typeof this.phone != 'string' || this.phone == '' || typeof this.id != 'string' || this.id == '') return false;
            else if (!unicom.regexPhone.test(this.phone) && !(telecom.regexPhone.test(this.phone) && pushinfo.order.mode != 5 )) return this.isorder();
            else return true
        },
        get hidephone() {
            if (this.phone) return this.phone.substr(0, 3) + "****" + this.phone.substr(7);
            else return ''
        },
        get orderstatestr() {
            switch (this.orderstate) {
                case 0:
                case 1:
                case 2:
                    return "会员";
                case 3:
                    return "月底到期"
            };
            return "非会员"
        },
        change: []
    };
    var log = function(option) {
        $.ajax({
            url: "/proxy/v3/log.aspx",
            data: {
                spinfocode: $$.spinfocode,
                type: option.type || 'event',
                name: option.name,
                params: JSON.stringify(option.params),
                network: $$.connection.type,
                referer: option.referer || location.pathname,
                msg: option.msg || ''
            },
            dataType: 'json',
            cache: false,
            type: 'get'
        })
    };
    var doPlay = function(e) {
        if (e.type !== undefined) {
            e = this
        } else if (e.target || e.srcElement) e = e.target || e.srcElement;
        var sender = $(e);
        if (sender.data('rid') === undefined) {
            sender = sender.parents('.musics').find('.btn-play')
        };
        mplayer.doPlay('/proxy/v3/audition.aspx?rid={0}'.format(sender.data('rid')), sender)
    };
    var doDownload = function(e) {
        if (e.type !== undefined) {
            e = this
        } else if (e.target || e.srcElement) e = e.target || e.srcElement;
        var sender = $(e).off('click');
        var data = {
            spinfocode: $$.spinfocode,
            rid: sender.data('rid'),
            source: sender.data('source') || 1
        };
        if (/javascript:;|javascript:void\(0\);/g.test(sender.attr('href'))) {
            data.cmd = 'get-ringdownurl';
            var ajaxSettings = {
                sender: sender,
                url: "/proxy/v3/proxy.aspx",
                async: false,
                data: data,
                dataType: 'json',
                cache: false,
                type: 'post',
                beforeSend: function() {
                    mbox.waiting('获取地址中,请稍候……');
                    sender.click(doDownload)
                },
                success: function(r) {
                    mbox.close();
                    if (r.order) {
                        if (r.order.s == 1) {
                            $.extend(user, r.data);
                            user.change.forEach(function(func) {
                                func.call()
                            })
                        }
                    };
                    if (r.s == 1) {
                        sender.attr({
                            'href': r.data
                        });
                        location.href = r.data;
                        mbox.closeslid();
                    } else {
                        var option = {
                            music: sender.parents('.musics').html(),
                            callback: function() {
                                $.ajax(ajaxSettings)
                            }
                        };
                        if (r.s == -10) {
                            alertLoginOpen(option)
                        } else if (r.s == -20) {
                            if (pushinfo.order.pop.type == 2) mbox.explain({
                                title: pushinfo.order.pop.title,
                                explain: user.phone + pushinfo.order.pop.content
                            });
                            else if (telecom.regexPhone.test(user.phone)) {
                                if (pushinfo.order.mode == 903 && pushinfo.login.mode == 3) option.dir = 3;
                                else option.dir = 2;
                                if (pushinfo.order.mode == 903 && pushinfo.login.mode == 2) {
                                    option.confirmmsg = '　　下载该首铃声需升级VIP会员，是否确认升级并下载该首铃声？';
                                    alertOpenOrder(option);
                                }
                                else alertLoginOpen(option)
                            } else {
                                option.confirmmsg = '　　是否确认下载该首铃音？';
                                alertOpenOrder(option)
                            }
                        } else if (r.s == -30) {
                            if (pushinfo.crbt.pop.type == 2) mbox.explain({
                                title: pushinfo.crbt.pop.title,
                                explain: user.phone + pushinfo.crbt.pop.content
                            });
                            else if (telecom.regexPhone.test(user.phone)) {
                                if (pushinfo.order.mode == 903 && pushinfo.login.mode == 3) option.dir = 3;
                                else option.dir = 2;
                                if (pushinfo.order.mode == 903 && pushinfo.login.mode == 2) alertOpenOrder(option);
                                else alertLoginOpen(option)
                            } else {
                                option.confirmmsg = '　　是否确认下载该首铃音？';
                                alertOpenCrbt(option)
                            }
                        } else if (r.s == 14) {
                            mbox.explain({
                                title: pushinfo.crbt.succ.title,
                                icon: 'succ',
                                explain: user.phone + pushinfo.crbt.succ.content
                            })
                        } else if (r.s == 15) {
                            mbox.explain({
                                title: pushinfo.order.succ.title,
                                icon: 'succ',
                                explain: user.phone + pushinfo.order.succ.content
                            })
                        } else if (r.s == 31) {
                            if (pushinfo.crbt.asyncsucc.content) mbox.explain({
                                title: pushinfo.crbt.asyncsucc.title,
                                icon: 'fail',
                                explain: pushinfo.crbt.asyncsucc.content
                            });
                            else mbox.explain({
                                icon: 'fail',
                                explain: r.msg
                            })
                        } else {
                            mbox.explain({
                                icon: 'fail',
                                explain: r.msg
                            })
                        }
                    }
                }
            };
            var waittime = 8000;
            var wait = setInterval(function() {
                if ($$.unikey || waittime <= 0) {
                    clearInterval(wait);
                    $.ajax(ajaxSettings);
                    log({
                        name: sender.data('trace') || 'doDown',
                        params: data
                    })
                };
                waittime -= 500
            }, 500);
            return false
        };
        log({
            name: sender.data('trace') || 'doDown',
            params: data
        });
        return true
    };
    var doSetRing = function(e) {
        if (e.type !== undefined) {
            e = this
        } else if (e.target || e.srcElement) e = e.target || e.srcElement;
        var sender = $(e).off('click');
        var data = {
            cmd: 'set-ring',
            spinfocode: $$.spinfocode,
            rid: sender.data('rid'),
            type: sender.data('type') || 1,
            flag: sender.data('flag')
        };
        var ajaxSettings = {
            sender: sender,
            url: "/proxy/v3/proxy.aspx",
            data: data,
            dataType: 'json',
            cache: false,
            type: 'post',
            beforeSend: function() {
                mbox.waiting('设置中,请稍候……');
                sender.click(doSetRing)
            },
            success: function(r) {
                mbox.close();
                if (r.order) {
                    if (r.order.s == 1) {
                        $.extend(user, r.data);
                        user.change.forEach(function(func) {
                            func.call()
                        })
                    }
                }
                if (r.s == 1) {
                    var opt = {
                        title: pushinfo.ringset.singleset.succ.title,
                        music: sender.parents('.musics').html(),
                        icon: 'succ',
                        explain: pushinfo.ringset.singleset.succ.content
                    };
                    if (data.rid.toString().indexOf(',') > -1) {
                        opt.title = pushinfo.ringset.muchset.succ.title;
                        opt.explain = pushinfo.ringset.muchset.succ.content
                    }
                    if (ajaxSettings.plus) {
                        switch (ajaxSettings.plus.stack) {
                            case 'openorder':
                                opt.explain = pushinfo.order.succ.content + '\r\n' + opt.explain;
                                break;
                            case 'opencrbt':
                                opt.explain = pushinfo.crbt.succ.content + '\r\n' + opt.explain;
                                break
                        }
                    }
                    if (pushinfo.declare.message.content) opt.explain += '<br/><a href="{1}" class="uline">{0}</a>'.format(pushinfo.declare.message.content, pushinfo.declare.message.link);
                    mbox.explain(opt)
                } else {
                    var option = {
                        sender: sender,
                        music: sender.parents('.musics').html(),
                        callback: function(plus) {
                            if (ajaxSettings.plus) $.extend(ajaxSettings.plus, plus);
                            else ajaxSettings.plus = plus;
                            $.ajax(ajaxSettings)
                        }
                    };
                    if (r.s == -10) {
                        alertLoginOpen(option)
                    } else if (r.s == -20) {
                        if (pushinfo.crbt.pop.type == 2) mbox.explain({
                            title: pushinfo.crbt.pop.title,
                            music: sender.parents('.musics').html(),
                            explain: user.phone + pushinfo.crbt.pop.content
                        });
                        else if (telecom.regexPhone.test(user.phone)) {
                            //if (pushinfo.order.mode == 903 && pushinfo.login.mode == 3) option.dir = 3;
                            //else option.dir = 2;
                            //if (pushinfo.order.mode == 903 && pushinfo.login.mode == 2) {
                                option.confirmmsg = '　　设置该首彩铃需升级为VIP会员，是否确认升级并设置该首彩铃？';
                                alertOpenOrder(option);
                            //}
                            //else alertLoginOpen(option)
                        } else {
                            option.confirmmsg = '　　是否确认设置该首彩铃？';
                            alertOpenCrbt(option)
                        }
                    } else if (r.s == -30) {
                        if (pushinfo.crbt.pop.type == 2) mbox.explain({
                            title: pushinfo.crbt.pop.title,
                            music: sender.parents('.musics').html(),
                            explain: user.phone + pushinfo.crbt.pop.content
                        });
                        else if (telecom.regexPhone.test(user.phone)) {
                            if (pushinfo.order.mode == 903 && pushinfo.login.mode == 3) option.dir = 3;
                            else option.dir = 2;
                            if (pushinfo.order.mode == 903 && pushinfo.login.mode == 2) alertOpenOrder(option);
                            else alertLoginOpen(option)
                        } else {
                            option.confirmmsg = '　　是否确认设置该首彩铃？';
                            alertOpenCrbt(option)
                        }
                    } else if (r.s == -32) {
                        mbox.service({
                            title: pushinfo.crbt.pop.title,
                            music: sender.parents('.musics').html(),
                            phone: user.phone,
                            confirmmsg: r.msg,
                            confirmEvent: function(e) {
                                ajaxSettings.data.confirm = 1;
                                $.ajax(ajaxSettings)
                            }
                        })
                    } else if (r.s == -33) {
                        mbox.explain({
                            icon: 'fail',
                            explain: r.msg
                        })
                    } else if (r.s == 14) {
                        mbox.explain({
                            title: pushinfo.crbt.succ.title,
                            icon: 'succ',
                            explain: user.phone + pushinfo.crbt.succ.content
                        })
                    } else if (r.s == 15) {
                        mbox.explain({
                            title: pushinfo.order.succ.title,
                            icon: 'succ',
                            explain: user.phone + pushinfo.order.succ.content
                        })
                    } else if (r.s == 31) {
                        if (pushinfo.crbt.asyncsucc.content) mbox.explain({
                            title: pushinfo.crbt.asyncsucc.title,
                            icon: 'fail',
                            explain: pushinfo.crbt.asyncsucc.content
                        });
                        else mbox.explain({
                            icon: 'fail',
                            explain: r.msg
                        })
                    } else if (r.s == 1006) {
                        mbox.explain({
                            icon: 'fail',
                            explain: '彩铃正在设置中，预计24小时内生效。'
                        })
                    } else {
                        var opt = {
                            title: pushinfo.ringset.singleset.fail.title,
                            icon: 'fail',
                            explain: pushinfo.ringset.singleset.fail.content
                        };
                        if (data.rid.toString().indexOf(',') > -1) opt = {
                            title: pushinfo.ringset.muchset.fail.title,
                            icon: 'fail',
                            explain: pushinfo.ringset.muchset.fail.content
                        };
                        mbox.explain(opt)
                    }
                }
            }
        };
        var waittime = 8000;
        var wait = setInterval(function() {
            if ($$.unikey || waittime <= 0) {
                clearInterval(wait);
                $.ajax(ajaxSettings);
                log({
                    name: sender.data('trace') || 'doSetRing',
                    params: data
                })
            };
            waittime -= 500
        }, 500)
    };
    var doOnServe = function(e, option) {
        if (e.type === undefined) {
            option = e;
            e = this
        } else if (e.target || e.srcElement) e = e.target || e.srcElement;
        var sender = $(this).off('click');
        var ajaxSettings = {
            sender: sender,
            url: "/proxy/v3/proxy.aspx",
            data: {
                cmd: 'set-serve',
                spinfocode: $$.spinfocode
            },
            dataType: 'json',
            cache: false,
            type: 'post',
            beforeSend: function() {
                mbox.waiting('升级中,请稍候……');
                sender.click(doOnServe)
            },
            success: function(r) {
                mbox.close();
                if (r.s == 1) {
                    if(!ajaxSettings.plus)
                    {
                        log({
                            name: 'regularUser'
                        })
                    }
                    if (r.data) {
                        $.extend(user, r.data);
                        user.change.forEach(function(func) {
                            func.call()
                        })
                    };
                    var opt = {
                        title: pushinfo.order.succ.title,
                        icon: 'succ',
                        explain: pushinfo.order.succ.content
                    };
                    if (ajaxSettings.plus) {
                        switch (ajaxSettings.plus.stack) {
                            case 'opencrbt':
                                opt = {
                                    title: pushinfo.crbt.succ.title,
                                    explain: pushinfo.crbt.succ.content
                                };
                                break;
                            case 'openorder':
                                opt = {
                                    title: pushinfo.order.succ.title,
                                    explain: pushinfo.order.succ.content
                                };
                                break;
                        }
                    }
                    if (pushinfo.declare.message.content) opt.explain += '<br/><a href="{1}" class="uline">{0}</a>'.format(pushinfo.declare.message.content, pushinfo.declare.message.link);
                    opt.icon = 'succ';
                    if (opt.explain) {
                        if (option && option.callback) opt.confirmEvent = option.callback;
                        mbox.explain(opt);
                    } else {
                        if (option && option.callback) option.callback();
                        mbox.closeslid()
                    }
                }
                else {
                    var opt = {
                        callback: function(plus) {
                            if (ajaxSettings.plus) $.extend(ajaxSettings.plus, plus);
                            else ajaxSettings.plus = plus;
                            $.ajax(ajaxSettings)
                        }
                    };
                    if (r.s == -10) {
                        alertLoginOpen(opt)
                    } else if (r.s == -20) {
                        if (pushinfo.order.pop.type == 2) mbox.explain({
                            title: pushinfo.order.pop.title,
                            explain: user.phone + pushinfo.order.pop.content
                        });
                        else if (telecom.regexPhone.test(user.phone)) {
                            //if (pushinfo.order.mode == 903 && pushinfo.login.mode == 3) opt.dir = 3;
                            //else opt.dir = 2;
                            //if (pushinfo.order.mode == 903 && pushinfo.login.mode == 2) {
                                opt.confirmmsg = '　　是否确认领取VIP专属特权？';
                                alertOpenOrder(opt);
                            //}
                            //else alertLoginOpen(opt)
                        } else {
                            opt.confirmmsg = '　　是否确认领取VIP专属特权？';
                            alertOpenOrder(opt)
                        }
                    } else if (r.s == -30) {
                        if (pushinfo.crbt.pop.type == 2) mbox.explain({
                            title: pushinfo.crbt.pop.title,
                            explain: user.phone + pushinfo.crbt.pop.content
                        });
                        else if (telecom.regexPhone.test(user.phone)) {
                            opt.dir = 3;
                            alertLoginOpen(opt)
                        } else {
                            opt.confirmmsg = '　　是否确认领取VIP专属特权？';
                            alertOpenCrbt(opt)
                        }
                    } else if (r.s == -33) {
                        mbox.explain({
                            icon: 'fail',
                            explain: r.msg
                        })
                    } else if (r.s == 14) {
                        mbox.explain({
                            title: pushinfo.crbt.succ.title,
                            icon: 'succ',
                            explain: user.phone + pushinfo.crbt.succ.content
                        })
                    } else if (r.s == 15) {
                        mbox.explain({
                            title: pushinfo.order.succ.title,
                            icon: 'succ',
                            explain: user.phone + pushinfo.order.succ.content
                        })
                    } else if (r.s == 31) {
                        if (pushinfo.crbt.asyncsucc.content) mbox.explain({
                            title: pushinfo.crbt.asyncsucc.title,
                            icon: 'fail',
                            explain: pushinfo.crbt.asyncsucc.content
                        });
                        else mbox.explain({
                            icon: 'fail',
                            explain: r.msg
                        })
                    } else {
                        mbox.explain({
                            icon: 'fail',
                            explain: r.msg
                        })
                    }
                }
            }
        };
        var waittime = 8000;
        var wait = setInterval(function() {
            if (app.unikey || waittime <= 0) {
                clearInterval(wait);
                if (app.user.logined()) {
                    if (app.user.isorder()){
                        mbox.explain({
                            icon: 'succ',
                            explain: '您已经是VIP会员咯，不能重复参加活动哦！'
                        });
                    }
                    else{
                        $.ajax(ajaxSettings);
                    }
                }
                else {
                    $.ajax(ajaxSettings);
                }
                app.log({
                    name: sender.data('trace') || 'doOpenServe',
                    params: ajaxSettings.data
                })
                sender.off('click').click(doOnServe);
            };
            waittime -= 500
        }, 500)
    };
    var timeSendCodeTimeout, lastSendCodeOption;
    var timeSendCode = function(t, opt) {
        if (!opt) opt = {};
        var checking = opt.checking || mbox.setting.checking;
        if (t < 1) {
            clearTimeout(timeSendCodeTimeout);
            checking.btn_code.text('获取短信验证码').click(function(e) {
                opt.phone = checking.phone.val().trim();
                doSendCheckcode(e, opt)
            })
        } else {
            checking.btn_code.text('验证码已下发 (' + t + 's)');
            timeSendCodeTimeout = setTimeout(timeSendCode, 1000, --t, opt)
        }
    };
    var doSendCheckcode = function(e, option) {
        if (e.type === undefined) {
            option = e;
            e = this
        } else if (e.target || e.srcElement) e = e.target || e.srcElement;
        if (!option.phone) {
            alert('请输入您的手机号码。');
            return
        };
        var data = {
            cmd: 'get-checkcode',
            spinfocode: $$.spinfocode,
            phone: option.phone,
            dir: option.dir
        };
        if (option.type) data.type = option.type;
        if (option.passive) log({
            name: 'toSendCheckcode.Before',
            params: data
        });
        else log({
            name: 'doSendCheckcode.Before',
            params: data
        });
        if (!telecom.regexPhone.test(option.phone.trim())) {
            alert("亲，别闹了，搞个电信的手机号码再来！");
            return
        };
        var sender = $(e).off('click');
        $.ajax({
            sender: sender,
            url: "/proxy/v3/proxy.aspx",
            data: data,
            dataType: 'json',
            cache: false,
            type: 'post',
            beforeSend: function() {
                timeSendCode(60, option)
            },
            success: function(r) {
                if (r.s == 1) {
                    if (option.callback) option.callback()
                } else {
                    timeSendCode(0, option);
                    alert(r.msg)
                }
            },
            error: function() {
                timeSendCode(0, option)
            }
        });
        if (option.passive) {
            delete option.passive;
            log({
                name: 'toSendCheckcode',
                params: data
            })
        } else log({
            name: 'doSendCheckcode',
            params: data
        });
    };
    var doLogin = function(e, option) {
        if (e.type === undefined) {
            option = e;
            e = this
        } else if (e.target || e.srcElement) e = e.target || e.srcElement;
        if (!option.phone) {
            alert('请输入您的手机号码。');
            return
        };
        if (!telecom.regexPhone.test(option.phone.trim())) {
            alert("亲，别闹了，搞个电信的手机号码再来！");
            return
        };
        if (!/\d*/.test(option.phone.trim())) {
            if (option.checkcode.length != 4 && option.checkcode.length != 6) {
                alert('请输入手机短信收到的验证码，验证码为4或6位数字');
                return;
            }
        };
        if (!app.isclick) {
            alert('请点击获取短信验证码。');
            return;
        }
        if (!option.checkcode) {
            alert('请输入验证码。');
            return
        };
        var data = {
            cmd: option.cmd || 'login',
            spinfocode: $$.spinfocode,
            phone: option.phone,
            checkcode: option.checkcode
        };
        if (option.single) data.single = option.single;
        var sender = $(e).off('click');
        $.ajax({
            sender: sender,
            url: "/proxy/v3/proxy.aspx",
            data: data,
            dataType: 'json',
            cache: false,
            type: 'post',
            beforeSend: function() {
                mbox.waiting('用户验证,请稍候……');
                sender.click(function(e) {
                    doLogin(e, option)
                })
            },
            success: function(r) {
                mbox.close();
                if (r.s == 1) {
                    $.extend(user, r.data);
                    user.change.forEach(function(func) {
                        func.call()
                    });
                    if (r.crbt) {
                        if (r.crbt.s == 30) {
                            if (option.callback) option.callback({
                                stack: 'opencrbt'
                            })
                        } else if (r.crbt.s == 1) {
                            if (option.callback) option.callback({stack:'openorder'})
                        } else mbox.explain({
                            icon: 'fail',
                            explain: r.crbt.msg
                        });
                    } else if (r.order) {
                        if (r.order.s == 20) {
                            if (option.callback) option.callback({
                                stack: 'openorder'
                            })
                        } else if (r.order.s == 1) {
                            if (option.callback) option.callback({stack:'openserve'})
                        } else mbox.explain({
                            icon: 'fail',
                            explain: r.order.msg
                        });
                    } else if (option.callback) option.callback()
                } else {
                    mbox.explain({
                        icon: 'fail',
                        explain: r.msg
                    })
                }
            }
        });
        var opt = {
            name: 'alertLogin.doOK',
            params: data
        };
        if (option.cmd == 'login-order') opt.name = 'alertLoginOrder.doOK';
        else if (option.cmd == 'login-crbt') opt.name = 'alertLoginCrbt.doOK';
        log(opt)
    };
    var doLoginOpen = function(e, option) {
        if (pushinfo.order.mode == 5) option.cmd = 'login-order';
        else if (pushinfo.order.mode == 903) option.cmd = 'login-crbt';
        doLogin(e, option)
    };
    var doOpenOrder = function(e, option) {
        if (e.type === undefined) {
            option = e;
            e = this
        } else if (e.target || e.srcElement) e = e.target || e.srcElement;
        var sender = $(e);
        var data = {
            cmd: 'open-order',
            spinfocode: $$.spinfocode
        };
        if (option.single) data.single = option.single;
        $.ajax({
            sender: sender,
            url: "/proxy/v3/proxy.aspx",
            data: data,
            dataType: 'json',
            cache: false,
            type: 'get',
            beforeSend: function() {
                mbox.waiting('升级中,请稍候……')
            },
            success: function(r) {
                mbox.close();
                if (r.s == 1) {
                    $.extend(user, r.data);
                    user.change.forEach(function(func) {
                        func.call()
                    });
                    if (option.callback) option.callback({
                        stack: 'openorder'
                    })
                } else if (r.s == 15) {
                    mbox.explain({
                        title: pushinfo.order.succ.title,
                        icon: 'succ',
                        explain: user.phone + pushinfo.order.succ.content
                    })
                } else if (r.s == -97) {
                    option.title = '开通彩铃+会员';
                    option.explain = '亲爱的用户：海量彩铃免费不限次更换，需彩铃功能支持。系统检测到您未开通彩铃功能，我们将为您开通，具体资费请详询本地运营商。\r\n开通彩铃功能，需验证手机号。请点击【获取验证码】→输入验证码→点击【确定】，即可完成操作。';
                    alertLoginOpen(option)
                } else {
                    if (pushinfo.order.fail.content) mbox.explain({
                        title: pushinfo.order.fail.title,
                        icon: 'fail',
                        explain: pushinfo.order.fail.content
                    });
                    else mbox.explain({
                        icon: 'fail',
                        explain: r.msg
                    })
                }
            }
        });
        log({
            name: 'alertOpenOrder.doOK'
        })
    };
    var doOpenCrbt = function(e, option) {
        if (e.type === undefined) {
            option = e;
            e = this
        } else if (e.target || e.srcElement) e = e.target || e.srcElement;
        var sender = $(e);
        $.ajax({
            url: "/proxy/v3/proxy.aspx",
            data: {
                cmd: 'open-crbt',
                spinfocode: $$.spinfocode
            },
            dataType: 'json',
            cache: false,
            type: 'get',
            beforeSend: function() {
                mbox.waiting('处理中,请稍候……')
            },
            success: function(r) {
                mbox.close();
                if (r.s == 1) {
                    if (r.data) {
                        $.extend(user, r.data);
                        user.change.forEach(function(func) {
                            func.call()
                        })
                    };
                    if (option.callback) option.callback({
                        stack: 'opencrbt'
                    })
                } else if (r.s == 14) {
                    mbox.explain({
                        title: pushinfo.crbt.succ.title,
                        icon: 'succ',
                        explain: user.phone + pushinfo.crbt.succ.content
                    })
                } else if (r.s == 31) {
                    if (pushinfo.crbt.asyncsucc.content) mbox.explain({
                        title: pushinfo.crbt.asyncsucc.title,
                        icon: 'fail',
                        explain: pushinfo.crbt.asyncsucc.content
                    });
                    else mbox.explain({
                        icon: 'fail',
                        explain: r.msg
                    })
                } else if (r.s == -33) mbox.explain({
                    icon: 'fail',
                    explain: r.msg
                });
                else {
                    if (pushinfo.crbt.fail.content) mbox.explain({
                        title: pushinfo.crbt.fail.title,
                        icon: 'fail',
                        explain: pushinfo.crbt.fail.content
                    });
                    else mbox.explain({
                        icon: 'fail',
                        explain: r.msg
                    })
                }
            }
        });
        log({
            name: 'alertOpenCrbt.doOK'
        })
    };
    var doOutOrder = function(e, option) {
        if (e.type === undefined) {
            option = e;
            e = this
        } else if (e.target || e.srcElement) e = e.target || e.srcElement;
        if (!option.phone) {
            alert('请输入您的手机号码。');
            return
        };
        if (!telecom.regexPhone.test(option.phone.trim())) {
            alert("亲，别闹了，搞个电信的手机号码再来！");
            return
        };
        if (!app.isclick) {
            alert('请点击获取短信验证码。');
            return;
        };
        if (!option.checkcode) {
            alert('请输入验证码。');
            return
        };
        if (!/\d*/.test(option.phone.trim())) {
            if (option.checkcode.length != 4 && option.checkcode.length != 6) {
                alert('请输入手机短信收到的验证码，验证码为4或6位数字');
                return;
            }
        };
        var data = {
            cmd: 'off-order',
            spinfocode: $$.spinfocode,
            phone: option.phone,
            checkcode: option.checkcode
        };
        var sender = $(e).off('click');
        $.ajax({
            sender: sender,
            url: "/proxy/v3/proxy.aspx",
            data: data,
            dataType: 'json',
            cache: false,
            type: 'post',
            beforeSend: function() {
                mbox.waiting('处理中,请稍候……')
            },
            success: function(r) {
                mbox.close();
                if (r.s == 1) {
                    if (r.data) {
                        $.extend(user, r.data);
                        user.change.forEach(function(func) {
                            func.call()
                        })
                    };
                    if (option.callback) option.callback();
                    mbox.explain({
                        icon: 'succ',
                        explain: r.msg
                    })
                } else {
                    if (r.msg) mbox.explain({
                        icon: 'fail',
                        explain: r.msg
                    });
                    sender.click(function(e) {
                        doOutOrder(e, option)
                    })
                }
            }
        });
        var opt = {
            name: 'alertOutOrder.doOK',
            params: data
        };
        log(opt)
    };
    var alertLogin = function(r) {
        if (!r) r = {};
        timeSendCode(0);
        mbox.checking({
            title: r.title || "验证手机号",
            music: r.music,
            explain: r.explain || '欢迎登录彩铃用户系统，请输入手机号和验证码，完成登录操作。',
            phone: r.phone || user.phone,
            getcodeEvent: function(e, opt) {
                opt.loged = true;
                opt.dir = 1;
                doSendCheckcode(e, opt);
            },
            checkEvent: function(e, opt) {
                doLogin(e, $.extend(opt, r))
            },
            log: r.loged ? null : log({
                name: 'alertLogin'
            })
        })
    };
    var alertLoginOpen = function(r) {
        if (!r) r = {};
        timeSendCode(0);
        mbox.checking({
            title: r.title || pushinfo.login.pop.title,
            music: r.music,
            explain: r.explain || pushinfo.login.pop.content,
            phone: r.phone || user.phone || user.temp_phone,
            getcodeEvent: function(e, opt) {
                opt.loged = true;
                opt.type = 1;
                opt.dir = r.dir || pushinfo.login.mode;
                doSendCheckcode(e, opt)
            },
            checkEvent: function(e, opt) {
                doLoginOpen(e, $.extend(opt, r))
            },
            log: r.loged ? log({
                name: 'alertLoginOrder.'
            }) : log({
                name: pushinfo.login.mode == 2 ? 'alertLoginOrder' : pushinfo.login.mode == 3 ? 'alertLoginCrbt' : 'alertLogin'
            })
        })
    };
    var alertOpenOrder = function(r) {
        if (!r) r = {};
        mbox.service({
            title: r.title || pushinfo.order.pop.title,
            music: r.music,
            phone: user.phone,
            changeEvent: function(e) {
                r.loged=true;
                alertLoginOpen(r);
            },
            confirmmsg: r.confirmmsg,
            confirmEvent: function(e) {
                doOpenOrder(e, r)
            },
            explain: r.explain || pushinfo.order.pop.content,
            log: log({
                name: 'alertOpenOrder'
            })
        })
    };
    var alertOpenCrbt = function(r) {
        if (!r) r = {};
        mbox.service({
            title: r.title || pushinfo.crbt.pop.title,
            music: r.music,
            phone: user.phone,
            changeEvent: function(e) {
                alertLoginOpen(r)
            },
            confirmmsg: r.confirmmsg,
            confirmEvent: function(e) {
                doOpenCrbt(e, r)
            },
            explain: r.explain || pushinfo.crbt.pop.content,
            log: log({
                name: 'alertOpenCrbt'
            })
        })
    };
    var alertOutOrder = function(r) {
        if (!r) r = {};
        timeSendCode(0);
        mbox.checking({
            title: r.title || '退订VIP会员',
            phone: r.phone || user.phone,
            getcodeEvent: function(e, opt) {
                opt.loged = true;
                opt.type = 2;
                doSendCheckcode(e, opt)
            },
            checkEvent: function(e, opt) {
                doOutOrder(e, $.extend(opt, r))
            },
            log: r.loged ? null : log({
                name: 'alertOutOrder'
            })
        })
    };
    $.extend($$, {
        pushinfo: pushinfo,
        user: user,
        doPlay: doPlay,
        doDownload: doDownload,
        doSetRing: doSetRing,
        doOnServe: doOnServe,
        doSendCheckcode: doSendCheckcode,
        doLogin: doLogin,
        doLoginOpen: doLoginOpen,
        doOnOrder: doOpenOrder,
        doOutOrder: doOutOrder,
        doOnCrbt: doOpenCrbt,
        alertLogin: alertLogin,
        alertLoginOpen: alertLoginOpen,
        alertOpenOrder: alertOpenOrder,
        alertOpenCrbt: alertOpenCrbt,
        alertOutOrder: alertOutOrder,
        log: log,
        init: function() {
            var a = location.search.substr(1).match(/(^|&)a=([^&]*)(&|$)/i) || ['', '', ''];
            $.ajax({
                url: "/proxy/v3/comkey.aspx",
                data: {
                    network: $$.connection.type,
                    spinfocode: $$.spinfocode,
                    a: unescape(a[2])
                },
                dataType: 'json',
                cache: false,
                type: 'get',
                success: function(r) {
                    $$.unikey = 1;
                    if (r) {
                        $.extend(user, r);
                        user.change.forEach(function(func) {
                            func.call()
                        })
                    }
                }
            });
            user.change.push(function() {
                var curnum = $('.curnum');
                if (user.logined()) {
                    curnum.show().find('b').text(user.hidephone + '（' + user.orderstatestr + '）');
                    curnum.find('a').off('click').click(function() {
                        alertLogin()
                    })
                } else curnum.hide();
                $('.divholder').height($('header .curnum').height())
            })
        },
        link: function(link) {
            if (/\/|\./g.test(link)) {
                if (/(\.htm$)|(\.html$)/i.test(link.split('?')[0])) {
                    var reg = new RegExp($$.spinfocode);
                    if (!reg.test(link)) link = link.insert('&' + $$.spinfocode, link.lastIndexOf('.htm'))
                } else if (/(\/$)/.test(link.split('?')[0])) {
                    if (link.indexOf('?') > -1) link = link.split('?')[0] + $$.spinfocode + '.html?' + link.split('?')[1];
                    else link = link + $$.spinfocode + '.html'
                } else if (!/(\?|&)spinfocode=([^&]*)(&|$)/i.test(link)) {
                    if (link.indexOf('?') > -1) link += '&';
                    else link += '?';
                    link += 'spinfocode=' + app.spinfocode
                }
            };
            return link
        },
    });
    $$.staticsRequest = function() {
        var h = decodeURIComponent(location.href);
        if (h.endsWith('.html') || h.endsWith('.htm')) {
            if (h.indexOf(':') > 0) {
                h = h.substring(h.lastIndexOf('/') + 1);
                h = h.substring(h.indexOf(',') + 1);
                h = h.substring(0, h.lastIndexOf(','));
                h = h.replace(/=/g, ':');
                return eval('({' + h + '})')
            }
        };
        return null
    };
    return $$
})();
location.load = function(url) {
    location.href = app.link(url)
};
if (/\.html?/gi.test(location.href)) {
    $.request = function(name) {
        var reg = new RegExp("[,&]" + name + "=([^,\.&]*)", "i");
        var r = location.href;
        r = r.match(reg);
        if (r != null) return decodeURIComponent(r[1]);
        return null
    }
};
$(window).ready(function() {
    mbox.setting();
    if (!window.navigator.cookieEnabled) {
        mbox.explain({
            explain: '很不幸,目前您的浏览器并未开启对cookie的支持，将无法使用，请先开启cookie支持！'
        });
        return
    };
    mplayer.init({
        loadstart: function() {
            mbox.waiting('音频加载中……')
        },
        play: function() {
            mbox.close();
            mplayer.target.addClass('btn-pause')
        },
        pause: function() {
            mplayer.target.removeClass('btn-pause')
        },
        error: function() {
            mbox.close()
        }
    });
    app.init();
    $('a').each(function() {
        var link = $(this).attr('href');
        if ((new RegExp(location.host + '/')).test(link) || !/^http:\/\/|javascript:/i.test(link)) {
            $(this).attr('href', app.link(link))
        }
    })
});
$(window).unload(function(){  //针对某些浏览器（VIVO自带浏览器）页面跳转后铃声还在播放问题处理
    $('.controlbtn').removeClass('btn-play').addClass('btn-pause');
    mplayer.doStop();
})
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?a6174dd1fc90c111e6a1d037c7095fb4";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();
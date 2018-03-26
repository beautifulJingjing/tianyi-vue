/**
 * Created by XUER on 2016-3-6.
 * 登录并开通彩铃
 */
"use strict";

var business = require('../business-modules');

exports = module.exports = function(option) {
    var result = {};

    //验证码开通
    if ((config.login.mode == 3 && config.order.mode == 903) || parseInt(config.crbt.open) == 3){
        business.isCrbt({
            req:req,
            data: {phone: query.phone},
            callback:function(isCrbt){
                var openCrbt = function(isOrder){
                    business.openCrbt({
                        req: req,
                        data: {
                            userphone: query.phone,
                            key: query.checkcode
                        },
                        callback: function () {
                            result = {
                                s: 1,
                                data: current.user()
                            };
                            if (isCrbt) {
                                result.crbt = {s: 1};
                                if (isOrder != undefined)
                                    result.order = {s: isOrder ? 1 : 20};
                                res.send(result);
                            }
                            else {
                                business.isCrbtOpening({
                                    req: req,
                                    callback: function (isOpening) {
                                        if (isOpening) {
                                            result.crbt = {
                                                s: 31,
                                                msg: '彩铃功能开通中，请耐心等待！'
                                            };
                                            res.send(result);
                                        }
                                        else {
                                            result.crbt = {s: 30};
                                            if (isOrder != undefined)
                                                result.order = {s: isOrder ? 1 : 20};
                                            res.send(result);
                                        }
                                    }
                                });
                            }
                        },
                        error: function (err) {
                            result = {
                                s: 0,
                                msg: err.message
                            };
                            res.send(result);
                        }
                    });
                }

                if (parseInt(config.order.pop.pop) == 2)//合并弹窗=合并开通，检查会员状态
                    business.isOrder({
                        req: req,
                        data: {phone: query.phone},
                        callback: openCrbt
                    });
                else
                    openCrbt();
            }
        });
    }
    else {
        //正常开通
        business.checkCode.check({
            req: req,
            data: {
                phone: query.phone,
                checkcode: query.checkcode
            },
            callback: function () {
                business.login({
                    req: req,
                    data: {
                        userinfo: query.phone,
                        type: 2
                    },
                    callback: function () {
                        result = {
                            s: 1,
                            data: current.user()
                        };
                        var openCrbt = function(isOrder) {
                            business.isCrbt({
                                req: req,
                                callback: function (isCrbt) {
                                    if (isCrbt) {
                                        result.crbt = {s: 1};
                                        if (isOrder == undefined)
                                            result.order = {s: isOrder ? 1 : 20};
                                        res.send(result);
                                    }
                                    else {
                                        business.isCrbtOpening({
                                            req: req,
                                            callback: function (isOpening) {
                                                if (isOpening) {
                                                    result.crbt = {
                                                        s: 31,
                                                        msg: '彩铃功能开通中，请耐心等待！'
                                                    };
                                                    res.send(result);
                                                }
                                                else {
                                                    business.openCrbt({
                                                        req: req,
                                                        callback: function () {
                                                            business.isCrbtOpening({
                                                                req: req,
                                                                callback: function (isCrbtOpening) {
                                                                    if (isCrbtOpening) {
                                                                        result.crbt = {
                                                                            s: 31,
                                                                            msg: '彩铃功能开通中，请耐心等待！'
                                                                        };
                                                                    }
                                                                    else {
                                                                        result.crbt = {s: 30};
                                                                        if (isOrder == undefined)
                                                                            result.order = {s: isOrder ? 1 : 20};
                                                                    }
                                                                    res.send(result);
                                                                }
                                                            });
                                                        },
                                                        error: function (err) {
                                                            result.crbt = {
                                                                s: -31,
                                                                msg: err.message
                                                            };
                                                            res.send(result);
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        if (parseInt(config.order.pop.pop) == 2)//合并弹窗=合并开通，检查会员状态
                            business.isOrder({
                                req:req,
                                callback: openCrbt
                            });
                        else
                            openCrbt();
                    },
                    error: function (err) {
                        result = {
                            s: 0,
                            msg: err.message
                        };
                        res.send(result);
                    }
                });
            },
            error: function (err) {
                result = {
                    s: -40,
                    msg: err.message
                };
                res.send(result);
            }
        });
    }
};

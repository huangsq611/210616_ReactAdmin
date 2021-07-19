// 保存初始化时的templateField
var CtemplateField;
// 初始化契约锁合同相关按钮
function initQiyuesuoButton() {
    var workflowid = jQuery("input[name='workflowid']").val() * 1.0;
    var requestid = jQuery("input[name='requestid']").val() * 1.0;
    var nodeid = jQuery("input[name='nodeid']").val() * 1.0;
    var isE9 = false; // 是否是EM7
    var isprint=window.location.href.match(/(\?|\&)isprint=\d+/g); //打印页面不显示按钮
    if(isprint !=null && isprint !=undefined){
        if(isprint[0].split('=')[1] == "1"){
            return;
        }
    }
    try {
        if(isNaN(nodeid)) {
            if(isNaN(requestid)) {
                workflowid = window.wfform.getBaseInfo().workflowid;
                requestid = window.wfform.getBaseInfo().requestid;
                nodeid = window.wfform.getBaseInfo().nodeid;
                isE9 = true;
            }else {
                if(js_nodeid) {
                    nodeid = js_nodeid;
                }
            }
        }
    } catch(e) {

    }

    // 兼容一下老版本的E9,有的版本的E9没的wfform没有getBaseInfo
    try {
        var _commonParams = wfform.getGlobalStore().commonParam;
        if( _commonParams != undefined && (isNaN(nodeid) || isNaN(requestid) || isNaN(workflowid))) {
            nodeid = isNaN(nodeid) ? _commonParams.nodeid : nodeid;
            requestid = isNaN(requestid) ? _commonParams.requestid : requestid;
            workflowid = isNaN(workflowid) ? _commonParams.workflowid : workflowid;
            isE9 = true;
        }
    } catch (e) {

    }

    if (workflowid > 0 && nodeid > 0) {
        jQuery.ajax({
            type: "GET",
            url: "/mobile/plugin/qiyuesuo/wf_qiyuesuoAjax.jsp",
            data: {
                "method" : "initButton",
                "workflowid" : workflowid,
                "nodeid" : nodeid,
                "requestid" : requestid
            },
            async: false,
            dataType : "json",
            success: function(jo) {
                var documentField = jo.documentField;
                var templateField = jo.templateField;
                CtemplateField = jo.templateField;
                var templateField_allDetail = jo["templateField_allDetail"]; // 是否全是明细字段
                var documentField_allDetail = jo["documentField_allDetail"]; // 是否全是明细字段
                var documentField_main = jo["documentField_main"]; // 合同文件字段中的主表字段
                var documentDetailFirstFiled = jo["documentDetailFirstFiled"]; // 第一个存文档的明细字段
                var templateIds=jo.templateIds;
                var documentIds=jo.documentIds;
                var isremark=jo.isremark;
                var tabOpenURL = jo.tabOpenURL;
                var isAutoSave=jo.isAutoSave || requestid<=0;
                var documentField_0 = jo.documentField_0;
                window.qysGlobleConfig = {   //是否启用tab页打开合同页
                    tabOpenURL: tabOpenURL
                }
                var documentFirstFiled=jo.documentFirstFiled;
                if((templateField != null && templateField != "") || (documentField != null && documentField != "")) {
                    // var hasDoc = false;
                    // hasDoc = ((templateIds != null && templateIds !== "") || (documentIds != null && documentIds !== "")
                    //     || "1" === jo.isCreateByCategory || "3" === jo.currentNodeType || requestid <= 0);

                    if (documentField_0 === null || documentField_0 === undefined || documentField_0 === "") {
                        if (templateField != null && templateField != "" && !templateField_allDetail) {
                            documentField_0 = templateField;
                    }
                        if (!documentField_allDetail&& documentFirstFiled != null && documentFirstFiled !== "") {
                        documentField_0=documentFirstFiled; //为防止EM7获取不到表单值
                    }
                    }

                    window.QYSElectronicConfig = {
                        autoSubmitAfterSigned : jo.autoSubmitAfterSigned
                    }
                    jQuery("#qysButton").remove();

                        var isMobile = false;
                        var canSign =  "0"==isremark;

                        //次账号isremark拿不到
                        //新建页拿不到
                        if( isEm7ClientForQYS() || window.location.href.indexOf("/spa/workflow/static4mobileform") >0 || window.location.href.indexOf("/mobile/plugin/1") >0){
                                isMobile = true;
                        }else if(jQuery("input[name='module2']").length > 0) {
                            isMobile = true;
                        }

                        var buttonStyle = " margin-right: 5px; margin-top: 5px;  max-width: 150px; max-height: 30px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; ";
                        if (!isMobile) {
                            buttonStyle += " font-family: Microsoft YaHei !important; font-size: 12px !important; ";
                        }else{
                            buttonStyle += "color: #fff; background-color: #30b5ff; padding-left: 10px !important; padding-right: 10px !important;" +
                                " height: 30px; line-height: 29px; vertical-align: middle; border: 1px solid #30b5ff;"
                        }
                        var buttonHtml = "<div id='qysButton' style='float: left; margin-bottom: 2px;'>";
                        var showMessage = jo.showMessage;
                        var hideView = false;
                        if(canSign) {
                            if(jo.isPreSign && !isMobile) {
                                buttonHtml += "<input type='button' id='qysPreSignBtn' value='" + jo.preSignBtnName + "' title='" + jo.preSignBtnName + "' class='ant-btn ant-btn-primary e8_btn_top_first' "
                                    + " style='" + buttonStyle + "' "
                                    + " onclick=\"signOrViewContract(this,'preSign', " + isMobile + "," + isAutoSave + ")\" />";
                                if(window.WfForm && showMessage) {//e9
                                    if (jo.preSignMessage) {
                                        showMessage = false;
                                        WfForm.showMessage(jo.preSignMessage, 1, 5);
                                    }
                                }
                            }
                            if (jo.isSign && (requestid>0 || isE9ForQYS() || !isMobile) && ((jo.isSigner && (jo.hasSigned || jo.hasSigning)) || jo.contractId == "" || !jo.isEffective || jo.isDraft || (jo.addSignatoryWay==1 && !jo.hasAddSignatory))) {  //E8移动端新建页不显示按钮

                                buttonHtml += "<input type='button' id='qysSignBtn' value='" + jo.signBtnName + "' title='" + jo.signBtnName + "' class='ant-btn ant-btn-primary e8_btn_top_first' "
                                    + " style='" + buttonStyle + "' "
                                    + " onclick=\"signOrViewContract(this,'sign'," + isMobile + "," + isAutoSave + ")\" />";

                                hideView = true;
                                let showConfirm = true;
                                if(window.WfForm && showMessage) {//e9
                                    if (jo.contractId != "" && jo.isEffective && jo.isSigner && jo.signed && !jo.hasSigning && !jo.hasWaiting && !jo.isDraft
                                        && (jo.addSignatoryWay!=1 || (jo.addSignatoryWay==1 && jo.hasAddSignatory))) {//当前用户已签署完合同 并且没有等待中的
                                        if (jo.signedMessage) {
                                            WfForm.showMessage(jo.signedMessage, 4, 5);
                                        }
                                    }else if(((jo.contractId != "" && jo.isEffective && jo.isSigner && !jo.signed && jo.hasSigning) && (jo.addSignatoryWay!=1 || (jo.addSignatoryWay==1 && jo.hasAddSignatory)))
                                        || jo.contractId == "" || (jo.contractId != "" && jo.isEffective && jo.addSignatoryWay==1 && !jo.hasAddSignatory)) {//当前用户未完成签署合同
                                        if (jo.unSignedMessage) {
                                            WfForm.showMessage(jo.unSignedMessage, 1, 5);
                                        }
                                    } 
                                    //e9的【提交/批准】按钮变为【签署并提交/批准】的时候，点击签署并提交的时候 因为开启了必须签署，所以会校验是否签署，当没有签署的时候不进行提示直接跳到签署页面进行签署
                                    if(jo.autoSubmitAfterSigned == "1" && jo.isMustSign && jo.contractId && jo.isSigner && !jo.signed && jo.isEffective) {
                                        showConfirm = false;
                                    }
                                }

                                if(jo.isAutoSign) {//当前用户自动签署
                                    registerCheckSignEvent(isMobile, "signByCurrentOperator")
                                }
                                if(jo.isMustSign) {//校验当前用户是否已签署
                                    registerCheckSignEvent(isMobile, "checkCurrentOperatorSign", showConfirm);
                                }
                            }
                        }
                        if(jo.isView || (!jo.isSigner && jo.isSign && canSign )) {
                            buttonHtml += "<input type='button' id='qysViewBtn' value='" + jo.viewBtnName + "' title='" + jo.viewBtnName + "' class='ant-btn ant-btn-primary e8_btn_top_first' "
                                + " style='" + buttonStyle;
                            if("" == jo.contractId || hideView) {//签署合同按钮在的时候不显示查看按钮
                                buttonHtml += " display:none; ";
                            }
                            buttonHtml += "' onclick=\"signOrViewContract(this, 'view', " + isMobile + ")\" />";
                        }
                        if(jo.isDownload) {
                            buttonHtml += "<input type='button' id='qysDownloadBtn' value='" + jo.downloadBtnName + "' title='" + jo.downloadBtnName + "' class='ant-btn ant-btn-primary e8_btn_top_first' "
                                + " style='" + buttonStyle;
                            if("" == jo.contractId) {
                                buttonHtml += " display:none; ";
                            }
                            buttonHtml += "' onclick=\"downloadContract(this, " + isMobile + ")\" />";
                        }
                        if(jo.isPrint && !isMobile) {
                            buttonHtml += "<input type='button' id='qysPrintBtn' value='" + jo.printBtnName + "' title='" + jo.printBtnName + "' class='ant-btn ant-btn-primary e8_btn_top_first' "
                                + " style='" + buttonStyle;
                            if("" == jo.contractId) {
                                buttonHtml += " display:none; ";
                            }
                            buttonHtml += "' onclick=\"signOrViewContract(this, 'print', " + isMobile + ")\" />";
                        }
                        if(jo.isEditSignatory){
                            buttonHtml += "<input type='button' id='qysEditSignatoryBtn' value='" + jo.editSignatoryBtnName + "' title='" + jo.editSignatoryBtnName + "' class='ant-btn ant-btn-primary e8_btn_top_first' "
                                + " style='" + buttonStyle;
                            if("" == jo.contractId) {
                                buttonHtml += " display:none; ";
                            }
                            buttonHtml += "' onclick=\"editSignatory(this, " + isMobile + ", '" + jo.editSignatoryTitle + "')\" />";
                        }
                        buttonHtml += "</div>";

                            var prevObj = jQuery("#field" + documentField_0 + "_tab");
                            if(prevObj.length <= 0) {
                                prevObj = jQuery("#field" + documentField_0).closest("div");
                            }
                            if(prevObj.length <= 0) {
                                prevObj = jQuery("div[data-fieldmark='field" + documentField_0 + "']");
                            }
                            if(prevObj.length <= 0) {
                                prevObj = jQuery("span[data-fieldmark='field" + documentField_0 + "']").closest("div");
                            }
                            if(prevObj.length > 0) {
                                prevObj.after(buttonHtml);
                        }


                        var electronicSignBtn = {};
                        if(canSign && jo.isPreSign) {
                            electronicSignBtn.method = "preSign";
                            electronicSignBtn.firstBtn = jQuery("#qysPreSignBtn");
                        }else if(canSign && jo.isSign) {
                            electronicSignBtn.method = "sign";
                            electronicSignBtn.firstBtn = jQuery("#qysSignBtn");
                        }else if(jo.contractId != "" && jo.isView) {
                            electronicSignBtn.method = "view";
                            electronicSignBtn.firstBtn = jQuery("#qysViewBtn");
                        }else if(jo.contractId != "" && jo.isPrint) {
                            electronicSignBtn.method = "print";
                            electronicSignBtn.firstBtn = jQuery("#qysPrintBtn");
                        }
                        electronicSignBtn.isMoble = isMobile;
                        electronicSignBtn.isClick = false;
                        electronicSignBtn.clickFun = signOrViewContract;
						electronicSignBtn.source = "clickButton";
                        top.window.electronicSignBtn = electronicSignBtn;

                }
            }
        });
    }
}

jQuery(document).ready(function() {
    if(window.sessionStorage.getItem('saveFlag') === ''){
        window.sessionStorage.setItem('saveFlag',false);
    }
    initQiyuesuoButton();
    var method = window.sessionStorage.getItem("method");
    var isMobile = window.sessionStorage.getItem("isMobile");
    var isSignAfterSave = window.sessionStorage.getItem("isSignAfterSave");
    if(("sign" === method || "preSign" === method )  && isMobile !=null && isSignAfterSave==="true"){
        signOrViewContract(null,method,isMobile==="true")
    }
    var saveFlag = window.sessionStorage.getItem('saveFlag');
    if(saveFlag==="true"){
        signOrViewContract(this,method,isMobile);
    }
});

/**
 * 对象否是可调用的方法
 *
 * @param obj
 * @returns {boolean}
 */
function isFunctionForQYS( obj ) {
    return typeof obj === "function" && typeof obj.nodeType !== "number";
}

/**
 * 是否为EM7客户端
 *
 * @returns {boolean}
 */
function isEm7ClientForQYS() {
    try{
        if(window.em &&  isFunctionForQYS(window.em.checkJsApi)) {
            return true;
        }
    }catch (e) {
        return false;
    }
}

/**
 * 是否为E9环境
 *
 * @returns {boolean}
 */
function isE9ForQYS() {
    try {
        if(window.wfform && window.wfform.getGlobalStore()) {
            return true;
        }
    } catch (e) {
        return false;
    }
}

/**
 * 获取流程的请求id
 */
function getRequestIdForQYS() {
    var requestid = jQuery("input[name='requestid']").val() * 1.0;
    try{
        if(isNaN(requestid)) {
            requestid = window.wfform.getBaseInfo().requestid;
        }
    }catch (e) {
    }
    // 兼容一下老版本的E9,有的版本的E9没的wfform没有getBaseInfo
    try {
        var _commonParams = wfform.getGlobalStore().commonParam;
        if( _commonParams != undefined && isNaN(requestid)) {
            requestid = _commonParams.requestid ;
        }
    } catch (e) {
    }
    return requestid;
}

/**
 * 获取节点id
 */
function getNodeIdForQYS() {
    var nodeid = jQuery("input[name='nodeid']").val() * 1.0;
    try{
        if(isNaN(nodeid)) {
            nodeid = window.wfform.getBaseInfo().nodeid;
        }
    }catch (e) {
    }
    try {
        if(isNaN(nodeid) && js_nodeid) {
            nodeid = js_nodeid;
        }
    }catch (e) {
    }
    // 兼容一下老版本的E9,有的版本的E9没的wfform没有getBaseInfo
    try {
        var _commonParams = wfform.getGlobalStore().commonParam;
        if( _commonParams != undefined && isNaN(nodeid)) {
            nodeid = _commonParams.nodeid;
        }
    } catch (e) {
    }
    return nodeid;
}

/**
 * 校验是否存在EM7客户端jssdk的openLink方法
 *
 * @returns {boolean}
 */
function checkOpenLinkJsApiForQYS() {
    try{
        return window.em.checkJsApi("openLink")
    }catch (e) {
        return false;
    }
    return false;
}

/**
 * 获取客户端类型
 *
 * @returns {string}
 */
function getClienttypeForQYS() {
    try {
        if(isE9ForQYS()) {
            return isEm7ClientForQYS() ? "em7" : "Webclient";
        } else {
            return clienttype;
        }
    } catch (e) {
    }
    return "";
}

function saveForm(obj,isMobile) {
    if (isE9ForQYS()) { //e9保存
        try {
        if( !isMobile){
                window.wfform.doSave();
        }else{
            window.rightBtn.doSave_nNew();
        }
        window.sessionStorage.setItem('saveFlag', true);
        } catch (e) {
            window.sessionStorage.setItem('isSignAfterSave', false);
            alert("保存流程失败");
        }
    } else { //e8保存
        if(!isMobile){
            try {
                    alert('保存22')
                    doSave_nNew(obj);
                    window.sessionStorage.setItem('saveFlag', true);

            } catch (e) {
                window.sessionStorage.setItem('isSignAfterSave', false);
                alert("保存流程失败");
            }
        }
    }
}



// 签署、指定签署位置、查看合同
function signOrViewContract() {
    var obj = arguments[0];
    var method = arguments[1];
    var isMobile = arguments[2];
    var isAutoSave = false;//原来为false

    if (arguments.length == 4) {
        isAutoSave = arguments[3];
    }
    window.sessionStorage.setItem("method",method);
    window.sessionStorage.setItem("isMobile",isMobile);

    if (isAutoSave && (isE9ForQYS()|| !isMobile) ) {
            window.sessionStorage.setItem('isSignAfterSave', true);//原来为true
            if (isE9ForQYS()) { //e9保存

                try {
                if( !isMobile){
                        window.wfform.doSave();
                }else{
                    window.rightBtn.doSave_nNew();
                }
                } catch (e) {
                    window.sessionStorage.setItem('isSignAfterSave', false);
                    alert("保存流程失败");
                }
            } else { //e8保存
            if(!isMobile){
                try {
                        alert('保存11')
                        doSave_nNew(obj);

                } catch (e) {
                    window.sessionStorage.setItem('isSignAfterSave', false);
                    alert("保存流程失败");
                }
            }
        }
    } else {

    var url = "";
    var mobileUrl = "";
    var message = "";
    var requestid = jQuery("input[name='requestid']").val() * 1.0;
    var nodeid = jQuery("input[name='nodeid']").val() * 1.0;
    var saveFlag = window.sessionStorage.getItem('saveFlag', false);
    if(saveFlag === "false"){
        saveForm(obj,isMobile);
    }
    try {
        if(isNaN(nodeid)) {
            if(isNaN(requestid)) {
                requestid = window.wfform.getBaseInfo().requestid;
                nodeid = window.wfform.getBaseInfo().nodeid;
            }else {
                if(js_nodeid) {
                    nodeid = js_nodeid;
                }
            }
        }
    } catch(e) {

    }
    // 兼容一下老版本的E9
    if(isNaN(requestid) || isNaN(nodeid)) {
        requestid = getRequestIdForQYS();
        nodeid = getNodeIdForQYS();
    }

    if(jQuery("#field"+CtemplateField).val()=''){
        alert(CtemplateField);
        alert("标准合同文件字段值为空");
        return ;
    }
    jQuery.ajax({
        type: "GET",
        url: "/mobile/plugin/qiyuesuo/wf_qiyuesuoAjax.jsp",
        data: {
            "method" : method,
            "nodeid" : nodeid,
            "requestid" : requestid,
            "source" : top.window.electronicSignBtn.source
        },
        async: false,
        dataType: "json",
        success: function (jo) {
            message = jo.message;
            if (0 === jo.code) {
                url = jo.url;
                mobileUrl = jo.mobileUrl;
            }
        }
    });    
        window.sessionStorage.setItem('isSignAfterSave', false);
    if("" == url) {
        if ("" === message) {
            message = "打开合同页面失败！";
        }
        alert(message);
    }else {

        if(isMobile) {
            // 移动端打开的话就使用移动端签署的地址
            if(mobileUrl != undefined && mobileUrl != "") {
                url = mobileUrl;
            }
            if ("sign" === method ) { // 流程支持契约锁单点登录需添加参数
                url += "&em_client_type=mobile";
            }
            var signUrl = url;
            if(window.QYSElectronicConfig && window.QYSElectronicConfig.autoSubmitAfterSigned == 1) {//开启了签署合同自动提交
                signUrl = "/spa/qiyuesuo/static4mobile/index.html#/formSign?url=" + encodeURIComponent(url);
            }
            // 兼容EM7客户端集成登录的问题
            if(isEm7ClientForQYS() && checkOpenLinkJsApiForQYS()) {
                window.em.registerBroadcast({
                    "name": "qysSubmitWorkflowForm", "action": function(res) {
                        var data = res;
                        if (typeof res == "string") {
                            data = JSON.parse(res);
                        }
                        var code = data.text;
                        if (code == 0) {
                            window.rightBtn.doSubmitBack()
                        }
                    }
                });
                window.em.openLink({
                    url:signUrl,
                    openType: 2
                });
            } else if(window && window.showHoverWindow instanceof Function) { // EM7云桥
                window.showHoverWindow(signUrl);
            } else { // EM6
                url += "&t=mobile/plugin/1/showLocationTrack.jsp";
                location = url;
            }
        }else {
                var tabFunction = isE9ForQYS() ? window.wfform.customTabFunObj[window.wfform['OPEN_CUSTKEY']] : "";
                var tabOpenURL=window.qysGlobleConfig.tabOpenURL;
                if (isE9ForQYS() && tabOpenURL) { // E9tab页打开
                    if (tabFunction == undefined) {
                            var i=0;
                            var inter=setInterval(function () {
                            tabFunction = isE9ForQYS() ? window.wfform.customTabFunObj[window.wfform['OPEN_CUSTKEY']] : "";
                                i++;
                               tabFunction(url);
                                if(tabFunction != undefined || i===3){
                                    clearInterval(inter)
                                }
                            },1000);

                        }
                    showButton(method);
						 tabFunction(url);
            } else if(jQuery("#qysiframe", parent.document).length > 0) { // E8tab页打开
                jQuery("#qysTabUrl", parent.document).val(url);
                if(obj != null) {
                    var tab_qys = jQuery("#tab_qys", parent.document);
                    var tab_menu = tab_qys.parent();
                    tab_menu.find(".current").removeClass("current");
                    var navo = tab_menu.find(".magic-line");
                    navo.css("left", tab_qys.offset().left - (navo.width() - tab_qys.width())/2 - 5);
                    tab_qys.addClass("current");
                    tab_qys.find("a").click();
                }
            }else {
                if ("sign" === method) { // PC端打开签署页面兼容处理
                    if(isE9ForQYS()){
						var signUrl = url;
                        if(window.QYSElectronicConfig && window.QYSElectronicConfig.autoSubmitAfterSigned == 1) {//开启了签署合同自动提交
                            signUrl = "/spa/qiyuesuo/static/index.html#/main/qiyuesuo/formSign?url=" + encodeURIComponent(url);
							window.open(signUrl);
                        }else{
                            var qysSignLink = jQuery("#qysSignLink");
                            if (qysSignLink.length <= 0) {
                                jQuery("#qysButton").append("<a id='qysSignLink' style='display:none;' target='_blank'/>");
                                qysSignLink = jQuery("#qysSignLink");
                            }
                            qysSignLink.attr("href", url);
                            qysSignLink[0].click();
                        }
                    }else {
                        var qysSignLink = jQuery("#qysSignLink");
                        if (qysSignLink.length <= 0) {
                            jQuery("#qysButton").append("<a id='qysSignLink' style='display:none;' target='_blank'/>");
                            qysSignLink = jQuery("#qysSignLink");
                        }
                        qysSignLink.attr("href", url);
                        qysSignLink[0].click();
                    }
                } else {
                    window.open(url);
                }
            }
        }
            showButton(method);
        }
    }
}
function showButton(method) {
        if("sign" == method || "preSign" == method) {
            if("preSign" == method) {//查看按钮和签署合同按钮不同时存在
                var qysSignBtn = jQuery("#qysSignBtn");
                var showViewBtn = true;
                if(qysSignBtn){
                    showViewBtn = qysSignBtn.css('display')=="none" ? true : false;
                }
                if (jQuery("#qysViewBtn").length > 0 && showViewBtn) {
                    jQuery("#qysViewBtn").show();
                }
            }
            if(jQuery("#qysDownloadBtn").length > 0) {
                jQuery("#qysDownloadBtn").show();
            }
            if(jQuery("#qysPrintBtn").length > 0) {
                jQuery("#qysPrintBtn").show();
            }
            if(jQuery("#qysEditSignatoryBtn").length>0){
                jQuery("#qysEditSignatoryBtn").show();
    }
}
}

// 下载合同
function downloadContract(obj, isMobile) {
    jQuery("#qysDownloadBtn").attr("disabled", true);
    var response = {"code": 1, "message": ""};
    var requestid = jQuery("input[name='requestid']").val() * 1.0;
    // 解决E9表单里面没有clienttype这个变量导致无法下载的问题
    var clienttype = getClienttypeForQYS();
    try {
        if (isNaN(requestid)) {
            requestid = window.wfform.getBaseInfo().requestid;
        }
    } catch (e) {

    }
    // 兼容一下老版本的E9,有的版本的E9没的wfform没有getBaseInfo
    if(isNaN(requestid)) {
        requestid = getRequestIdForQYS();
    }
    jQuery.ajax({
        type: "GET",
        url: "/mobile/plugin/qiyuesuo/wf_qiyuesuoAjax.jsp",
        data: {
            "method": "download",
            "requestid": requestid
        },
        async: false,
        dataType: "json",
        success: function (jo) {
            response = jo;
        }
    });
    if (0 === response.code) {
        if ("" === response.downloadField) { // 下载合同到本地
            var imageFileId = response.imageFileId;
            if ("" === imageFileId) {
                alert("下载失败！");
            } else {
                var encodeImageFileId = response.encodeImageFileId;
                if ("" === encodeImageFileId) {
                    encodeImageFileId = imageFileId;
                }
                if (isMobile) {
                    var downloadUrl = "";
                    // E9系统
                    if(isE9ForQYS()) {
                        downloadUrl = "/weaver/weaver.file.FileDownload?download=1&fileid=" + encodeImageFileId;
                    } else {
                        // EM6或者云桥或者其他第三方app集成E8
                        downloadUrl = "/download.do?download=1&fileid=" + encodeImageFileId;
                        try {
                            downloadUrl += "&filename=" + encodeURIComponent(response.subject) + "&f_weaver_belongto_userid=" + f_weaver_belongto_userid + "&f_weaver_belongto_usertype=" + f_weaver_belongto_usertype;
                        } catch (e) {

                        }
                    }
                    if ("Webclient" === clienttype) {
                        if (window.navigator.userAgent.indexOf("wxwork")>-1) {//企业微信使用企业微信的jsapi下载
                            window.wx.previewFile({
                                url: downloadUrl,
                                name: response.subject,
                                size: response.filesize-0,
                            })
                        }else{
                        window.open(downloadUrl, "_blank");
                    }
                    } else {
                        if (window.navigator.userAgent.indexOf("wxwork")>-1) {//企业微信使用企业微信的jsapi下载
                            window.wx.previewFile({
                                url: downloadUrl,
                                name: response.subject,
                                size: response.filesize-0,
                            })
                        }else{
                            location.href = downloadUrl;
                        }
                    }
                } else {
                    var download4qysDiv = jQuery("#download4qysDiv");
                    if (download4qysDiv.length <= 0) {
                        jQuery("body").append("<div id='download4qysDiv' style='display:none;'></div>");
                        download4qysDiv = jQuery("#download4qysDiv");
                    }

                    var download4qysIframe = jQuery("#download4qysIframe");
                    if (download4qysIframe.length <= 0) {
                        download4qysDiv.append("<iframe id='download4qysIframe' name='download4qysIframe' style='display:none;'></iframe>");
                        download4qysIframe = jQuery("#download4qysIframe");
                    }

                    jQuery("body[id='flowbody']").attr("onbeforeunload", "");
                    download4qysIframe.attr("src", "/weaver/weaver.file.FileDownload?download=1&fileid=" + encodeImageFileId);
                }
            }
        } else { // 下载合同到流程表单
		  
            if (isMobile) {
				if(isE9ForQYS()){
                    var reloadUrl = "/spa/workflow/forwardMobileForm.html?requestid="+requestid;
                    window.location.href = reloadUrl;
				    return;
                }
                if ("Webclient" === clienttype) {
                    location.reload();
                } else {
                    location.href = "emobile:reOpenFlow";
                }
            } else {
                parent.location.href = "/workflow/request/ViewRequest.jsp?requestid=" + requestid;
            }
        }
    } else {
        var message = response.message;
        if ("" === message) {
            message = "下载失败！";
        }
        alert(message);
    }
    jQuery("#qysDownloadBtn").attr("disabled", false);
}

//修改签署方
function editSignatory(obj, isMobile, editSignatoryBtnName){
    var requestid = getRequestIdForQYS();
    var nodeid = getNodeIdForQYS();
    if(isMobile){
        mobileEditSignatory(requestid,nodeid);
    }else {

        var dialog = new window.top.Dialog();
        dialog.currentWindow = window;
        dialog.URL = "/workflow/qiyuesuo/wf_qiyuesuoEditSignatory.jsp?requestid=" + requestid + "&nodeid=" + nodeid;
        dialog.Title = editSignatoryBtnName;
        dialog.Width = 800;
        dialog.Height = 400;
        dialog.Drag = true;
        dialog.maxiumnable = true;
        dialog.show();
    }

}

var mobileEditSignatoryConfig = {
    'ifrmaeUrl' : '/mobile/plugin/qiyuesuo/wf_qiyuesuoEditSignatoryForMobile.jsp',
    'scrolltop':0,
};

/**
 * 手机端修改签署方信息
 * @param requestid
 */
function mobileEditSignatory(requestid,nodeid){
    var url = "/mobile/plugin/qiyuesuo/wf_qiyuesuoEditSignatoryForMobile.jsp?requestid=" + requestid + "&nodeid=" + nodeid;
    if(isEm7ClientForQYS() === true) {
        if(window.em.checkJsApi("openLink")) {
            url += "&fromEm7Client=true";
            window.em.openLink({
                url:url,
                openType: 2
            });
            return;
        }
    }
    var qiyuesuoEditSignatoryDiv = jQuery("#qiyuesuoEditSignatoryDiv");
    if(qiyuesuoEditSignatoryDiv.length == 0) {
        initQiyuesuoEditSignatoryPage(mobileEditSignatoryConfig.ifrmaeUrl);
        qiyuesuoEditSignatoryDiv = jQuery("#qiyuesuoEditSignatoryDiv");
    }
    if(qiyuesuoEditSignatoryDiv.length > 0) {
        var qiyuesuoEditSignatoryFrame = jQuery("#qiyuesuoEditSignatoryFrame");
        qiyuesuoEditSignatoryFrame.attr("src",url);
        mobileEditSignatoryConfig.scrolltop = jQuery(document).scrollTop();
        qiyuesuoEditSignatoryDiv.animate({ "left":"0" },300,null,function(){
            setTimeout(function(){
                //jQuery(document).scrollTop(0);
            },300);
        });
        qiyuesuoEditSignatoryDiv.show();
        hideClientToolbar4QYS();
    }
}


/**
 * 显示客户端tab栏
 */
function showClientToolbar4QYS() {
    try {
        if(js_clienttype != "Webclient") {
            location = "emobile:controlAllOperArea:show";
        }
    } catch (error) {
    }
}

/**
 * 隐藏客户端tab栏
 */
function hideClientToolbar4QYS() {
    try {
        if(js_clienttype != "Webclient") {
            location = "emobile:controlAllOperArea:hidden";
        }
    } catch (error) {
    }
}


/**
 * 生成显示修改签署方信息的iframe
 */
function initQiyuesuoEditSignatoryPage(url) {
    var divHtml = '<div id="qiyuesuoEditSignatoryDiv"'
        + '      style="width:100%;height:100%;position:fixed;left:8280px;top:0px;bottom:0px;right:0px;background:#fff;overflow:hidden;z-index:1000;-webkit-overflow-scrolling: touch;">'
        + '		 <iframe id="qiyuesuoEditSignatoryFrame" style="width:100%;height:100%;" src="' + url +'" frameborder="0" scrolling="no"></iframe>'
        + '</div>';
    jQuery("body").append(divHtml);
}

/**
 * 关闭修改签署方信息的弹出框iframe
 */
function closeQiyuesuoEditSignatoryPage() {
    var qiyuesuoEditSignatoryDiv = jQuery("#qiyuesuoEditSignatoryDiv");
    qiyuesuoEditSignatoryDiv.animate({ "left":"8280px" },300,null,function(){
        setTimeout(function(){
            // jQuery(document).scrollTop(0);
        },300);
    });
    showClientToolbar4QYS();
}

/**
 * 提交的时候注册事件
 * @param isMobile
 */
function registerCheckSignEvent(isMobile, method, showConfirm) {
    var requestid = getRequestIdForQYS();
    var nodeid = getNodeIdForQYS();
    if(requestid > 0 && nodeid > 0) {
        if(window.WfForm){//E9
            window.WfForm.registerCheckEvent(window.WfForm.OPER_SUBMIT, function (callback) {
                var retFlag = true;
                jQuery.ajax({
                    type: "GET",
                    url: "/mobile/plugin/qiyuesuo/wf_qiyuesuoAjax.jsp",
                    data: {
                        requestid: requestid,
                        nodeid: nodeid,
                        method: method
                    },
                    async: false,
                    cache: false,
                    dataType: 'json',
                    success: function(result) {
                        if (method === "checkCurrentOperatorSign") {
                            if (result && result.code == 0) {
                                var signed = result.signed;
                                var hasOtherSigner = result.hasOtherSigner;
                                if (!signed && !hasOtherSigner) {
                                    retFlag = false;
                                    if(showConfirm) {
                                        window.WfForm.showConfirm(result.message == "" ? "您还未完成签署，请完成签署后再提交流程。" : result.message, function () {
                                            signOrViewContract(jQuery("#qysSignBtn"), "sign", isMobile);
                                        }, function () {

                                        }, {
                                            title: "信息提示",       //弹确认框的title，仅PC端有效
                                            okText: "去签署",          //自定义确认按钮名称
                                            cancelText: "取消"     //自定义取消按钮名称
                                        });
                                    }else {
                                        signOrViewContract(jQuery("#qysSignBtn"), "sign", isMobile);
                                    }
                                }
                            } else {
                                retFlag = false;
                                window.WfForm.showMessage(result.message == "" ? "校验当前用户是否已签署失败" : result.message, 2, 3);
                            }
                        }else if(method === "signByCurrentOperator") {
                            if(result && result.code != 0) { //自动签署失败
                                retFlag = false;
                                if(result.message == "") {
                                    alert("当前用户自动签署合同失败");
                                }else {
                                    alert(result.message);
                                }
                            }
                        }
                    }
                });
                if(retFlag) {
                    callback();
                }
            });
        }else {
            try {
                var oldCheckCustomize = checkCustomize;
                checkCustomize = function () {
                    if (typeof oldCheckCustomize == "function") {
                        if (oldCheckCustomize() === false) {
                            return false;
                        }
                    }
                    var isSigned = true;
                    jQuery.ajax({
                        type: "GET",
                        url: "/mobile/plugin/qiyuesuo/wf_qiyuesuoAjax.jsp",
                        data: {
                            requestid: requestid,
                            nodeid: nodeid,
                            method: method
                        },
                        async: false,
                        cache: false,
                        dataType: 'json',
                        success: function (result) {
                            if (method === "checkCurrentOperatorSign") {
                                if (result && result.code == 0) {
                                    var signed = result.signed;
                                    var hasOtherSigner = result.hasOtherSigner;
                                    if (!signed && !hasOtherSigner) {
                                        isSigned = false;
                                        if (top.Dialog) {
                                            if (result.message != "") {
                                                top.Dialog.confirm(result.message, function () {
                                                    signOrViewContract(jQuery("#qysSignBtn"), "sign", isMobile);
                                                });
                                            } else {
                                                top.Dialog.confirm("您还未完成签署，请完成签署后再提交流程", function () {
                                                    signOrViewContract(jQuery("#qysSignBtn"), "sign", isMobile);
                                                });
                                            }
                                        } else {
                                            if (confirm(result.message == '' ? "您还未完成签署，请完成签署后再提交流程" : result.message)) {
                                                signOrViewContract(jQuery("#qysSignBtn"), "sign", isMobile);
                                            }
                                        }
                                    }
                                } else {
                                    isSigned = false;
                                    if (top.Dialog) {
                                        top.Dialog.alert(result.message ? result.message : "校验当前用户是否已签署失败");
                                    } else {
                                        alert(result.message ? result.message : "校验当前用户是否已签署失败");
                                    }
                                }
                            }else if(method === "signByCurrentOperator") {
                                if(result && result.code != 0) { //自动签署失败
                                    isSigned = false;
                                    if(result.message == "") {
                                        alert("当前用户自动签署合同失败");
                                    }else {
                                        alert(result.message);
                                    }
                                }
                            }
                        }
                    });
                    return isSigned;
                }
            }catch (e) {

            }
        }
    }
}


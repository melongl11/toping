"use strict";
/* global global: false */
/* global XMLHttpRequest: false */

var templateLoader = require('./template-loader.js');
var console = require("console");
var ko = require("knockout");
var $ = require("jquery");
require("./ko-bindings.js");
var performanceAwareCaller = require("./timed-call.js").timedCall;

var addUndoStackExtensionMaker = require("./undomanager/undomain.js");
var colorPlugin = require("./ext/color.js");
var utilPlugin = require("./ext/util.js");
var inlinerPlugin = require("./ext/inliner.js");

var localStorageLoader = require("./ext/localstorage.js");

if (typeof ko == 'undefined') throw "Cannot find knockout.js library!";
if (typeof $ == 'undefined') throw "Cannot find jquery library!";

function _canonicalize(url) {
  var div = global.document.createElement('div');
  div.innerHTML = "<a></a>";
  div.firstChild.href = url; // Ensures that the href is properly escaped
  div.innerHTML = div.innerHTML; // Run the current innerHTML back through the parser
  return div.firstChild.href;
}

function _appendUrlParameters(baseUrl, parameters) {
  var paramSeparator = baseUrl.indexOf('?') == -1 ? '?' : '&';
  var res = baseUrl;
  for (var param in parameters) if (parameters.hasOwnProperty(param)) {
    res += paramSeparator + param + "=" + encodeURIComponent(parameters[param]);
    paramSeparator = '&';
  }
  return res;
}

var applyBindingOptions = function(options, ko) {

  ko.bindingHandlers.wysiwygSrc.convertedUrl = function(src, method, width, height) {
    var queryParamSeparator;
    var imgProcessorBackend = options.imgProcessorBackend ? options.imgProcessorBackend : './upload';
    var backEndMatch = imgProcessorBackend.match(/^(https?:\/\/[^\/]*\/).*$/);
    var srcMatch = src.match(/^(https?:\/\/[^\/]*\/).*$/);
    if (backEndMatch === null || (srcMatch !== null && backEndMatch[1] == srcMatch[1])) {
      queryParamSeparator = imgProcessorBackend.indexOf('?') == -1 ? '?' : '&';
      return _appendUrlParameters(imgProcessorBackend, { src: src, method: method, params: width + "," + height });
    } else {
      console.log("Cannot apply backend image resizing to non-local resources ", src, method, width, height, backEndMatch, srcMatch);
      var params = { method: method, width: width };
      if (height !== null) params['height'] = height;
      return _appendUrlParameters(src, params);
    }
  };

  ko.bindingHandlers.wysiwygSrc.placeholderUrl = function(width, height, text) {
    var imgProcessorBackend = options.imgProcessorBackend ? options.imgProcessorBackend : './upload';
    return _appendUrlParameters(imgProcessorBackend, { method: 'placeholder', params: width + "," + height });
  };

  // pushes custom tinymce configurations from options to the binding
  if (options && options.tinymceConfig)
    ko.bindingHandlers.wysiwyg.standardOptions = options.tinymceConfig;
  if (options && options.tinymceConfigFull)
    ko.bindingHandlers.wysiwyg.fullOptions = options.tinymceConfigFull;
};

var start = function(options, templateFile, templateMetadata, jsorjson, customExtensions) {



  templateLoader.fixPageEvents();

  var fileUploadMessagesExtension = function(vm) {
    var fileuploadConfig = {
      messages: {
        unknownError: vm.t('Unknown error'),
        uploadedBytes: vm.t('Uploaded bytes exceed file size'),
        maxNumberOfFiles: vm.t('Maximum number of files exceeded'),
        acceptFileTypes: vm.t('File type not allowed'),
        maxFileSize: vm.t('File is too large'),
        minFileSize: vm.t('File is too small'),
        post_max_size: vm.t('The uploaded file exceeds the post_max_size directive in php.ini'),
        max_file_size: vm.t('File is too big'),
        min_file_size: vm.t('File is too small'),
        accept_file_types: vm.t('Filetype not allowed'),
        max_number_of_files: vm.t('Maximum number of files exceeded'),
        max_width: vm.t('Image exceeds maximum width'),
        min_width: vm.t('Image requires a minimum width'),
        max_height: vm.t('Image exceeds maximum height'),
        min_height: vm.t('Image requires a minimum height'),
        abort: vm.t('File upload aborted'),
        image_resize: vm.t('Failed to resize image'),
        generic: vm.t('Unexpected upload error')
      }
    };
    // fileUpload options.
    if (options && options.fileuploadConfig)
      fileuploadConfig = $.extend(true, fileuploadConfig, options.fileuploadConfig);

    ko.bindingHandlers['fileupload'].extendOptions = fileuploadConfig;

  };

  var simpleTranslationPlugin = function(vm) {
    if (options && options.strings) {
      var translation_ko = {
          "Download": "다운로드",
          "Test": "보내기",
          "Save": "저장하기",
          "Downloading...": "다운로드 중...",
          "Invalid email address": "이메일 주소를 확인하세요",
          "Test email sent...": "테스트 이메일 보내는 중 ...",
          "Unexpected error talking to server: contact us!": "예상치 못한 오류가 발생했습니다. 관리자에게 문의하세요.",
          "Insert here the recipient email address": "받는 사람의 이메일 주소를 적어주세요.",
          "Test email address": "테스트 이메일 주소",
          "Block removed: use undo button to restore it...": "블럭이 삭제 되었습니다. 복구하시려면 되돌리기 버튼을 눌러주세요.",
          "New block added after the selected one (__pos__)": "새 블럭이 추가되었습니다. (__pos__)",
          "New block added at the model bottom (__pos__)": "새 블럭이 추가되었습니다. (__pos__)",
          "Undo (#COUNT#)": "되돌리기 (#COUNT#)",
          "Redo": "다시실행",
          "Selected element has no editable properties": "선택된 블럭에는 수정가능한 부분이 없습니다.",
          "This style is specific for this block: click here to remove the custom style and revert to the theme value": "이 스타일은 이 블록에만 해당됩니다. 사용자 정의 스타일을 제거하고 테마 값으로 되돌리려면 여기를 클릭하십시오.",
          "Switch between global and block level styles editing": "전체 및 블럭 단위 편집 스타일간 전환",
          "Undo last operation": "마지막 작업 되돌리기",
          "Redo last operation": "마지막 작업 다시실행",
          "Show image gallery": "갤러리 보기",
          "Gallery": "갤러리",
          "Preview": "미리보기",
          "Show live preview": "미리보기 표시",
          "Large screen": "큰 화면",
          "Tablet": "타블렛",
          "Smartphone": "스마트폰",
          "Show preview and send test": "미리보기 표시 및 테스트 보내기",
          "Download template": "템플릿 다운로드",
          "Save template": "템플릿 저장",
          "Saved model is obsolete": "저장된 모델은 더이상 사용되지 않습니다.",
          "<p>The saved model has been created with a previous, non completely compatible version, of the template</p><p>Some content or style in the model <b>COULD BE LOST</b> if you will <b>save</b></p><p>Contact us for more informations!</p>": "<p>저장된 모델은 완전히 호환되지 않는 이전 버전의 템플릿으로 생성되었습니다.</p><p><b>저장</b>을 하면 모델에서의 몇몇 컨텐츠나 스타일이 <b>삭제될 수 있습니다.</b></p><p>관리자에게 문의하세요!</p>",
          "Blocks": "템플릿",
          "Blocks ready to be added to the template": "템플릿에 추가 할 준비가 된 블럭들입니다",
          "Content": "컨텐츠",
          "Edit content options": "컨텐츠 수정 옵션",
          "Style": "스타일",
          "Edit style options": "스타일 수정 옵션",
          "Block __name__": "블럭 __name__",
          "Click or drag to add this block to the template": "이 블록을 템플릿에 추가하려면 클릭하거나 드래그하십시오.",
          "Add": "추가",
          "By clicking on message parts you will select a block and content options, if any, will show here": "메시지 부분을 클릭하면 블록을 선택하고 내용 옵션이 있으면 여기에 표시됩니다.",
          "By clicking on message parts you will select a block and style options, if available, will show here": "메시지 부분을 클릭하면 블록 및 스타일 옵션을 선택할 수 있습니다 (사용 가능한 경우). 여기에 표시됩니다.",
          "Click or drag files here": "여기에서 파일을 클릭하거나 드래그하십시오.",
          "No images uploaded, yet": "업로드 된 이미지가 없습니다.",
          "Show images from the gallery": "갤러리로부터 이미지를 불러옵니다.",
          "Loading...": "로딩 중...",
          "Load gallery": "갤러리 불러오기",
          "Loading gallery...": "갤러리 불러오는 중...",
          "The gallery is empty": "갤러리가 비었습니다.",
          "Remove image": "이미지 삭제",
          "Open the image editing tool": "이미지 수정 툴 열기",
          "Upload a new image": "새로운 이미지를 업로드합니다.",
          "Drop an image here": "여기에 이미지를 놓으십시오",
          "Drop an image here or click the upload button": "여기에 이미지를 놓거나 업로드 버튼을 클릭하십시오.",
          "Drag this image and drop it on any template image placeholder": "이 이미지를 드래그하여 모든 템플릿 이미지 플레이스홀더 위에 놓습니다.",
          "Gallery:": "갤러리:",
          "Session images": "세션이미지",
          "Recents": "최근항목",
          "Remote gallery": "리모트 갤러리",
          "Customized block.<ul><li>In this status changes to properties will be specific to the current block (instead of being global to all blocks in the same section)</li><li>A <span class=\"customStyled\"><span>\"small cube\" </span></span> icon beside the property will mark the customization. By clicking this icon the property value will be reverted to the value defined for the section.</li></ul>": "커스터마이징된 블럭.<ul><li> 이 상태에서 속성에 대한 변경 사항은 (전역 적용되지 않고) 현재 블록에만 적용됩니다 </li><li>각 속성 옆의 <span class=\"customStyled\"><span>\"small cube\" </span></span> 아이콘은 커스터마이징을 나타냅니다. 각 속성 값 옆에 있는 아이콘을 클릭하시면, 초기상태로 복구됩니다.</li></ul>",
          "Drop here blocks from the \"Blocks\" tab": "\"블럭\" 탭으로부터 블럭을 가져와 여기에 두십시오.",
          "Drag this handle to move the block": "블럭을 움직이시려면 이 핸들을 드래그하십시오.",
          "Move this block upside": "블럭 위로 올리기",
          "Move this block downside": "블럭 아래로 내리기",
          "Delete block": "블럭 삭제",
          "Duplicate block": "블럭 복사",
          "Switch block variant": "블럭 변수 전환",
          "Theme Colors,Standard Colors,Web Colors,Theme Colors,Back to Palette,History,No history yet.": "테마 색상, 표준 색상, 웹 색상, 테마 색상, 팔레트로 돌아 가기, 기록, 아직 기록 없음",
          "Drop here": "여기에 두십시오.",
          "Unknown error": "에러 발생. 관리자에 문의하세요",
          "Uploaded bytes exceed file size": "파일 크기가 너무 큽니다.",
          "File type not allowed": "허용되지 않는 파일 유형",
          "File is too large": "파일 크기가 너무 큽니다.",
          "The uploaded file exceeds the post_max_size directive in php.ini": "파일 크기가 너무 큽니다.",
          "File is too big": "파일이 너무 큽니다.",
          "File is too small": "파일이 너무 작습니다.",
          "Filetype not allowed": "허용되지 않는 파일 유형",
          "Maximum number of files exceeded": "최대 파일 수 초과",
          "Image exceeds maximum width": "이미지가 최대 너비를 초과했습니다.",
          "Image requires a minimum width": "이미지의 최소 너비가 필요합니다.",
          "Image exceeds maximum height": "이미지가 최대 높이를 초과했습니다.",
          "Image requires a minimum height": "이미지의 최소 높이가 필요합니다.",
          "File upload aborted": "파일 업로드가 중단되었습니다.",
          "Failed to resize image": "이미지 크기를 조정하지 못했습니다.",
          "Unexpected upload error": "예기치 않은 업로드 오류가 발생했습니다. 관리자에게 문의하세요.",
          "Unexpected error listing files": "예기치 않은 오류 목록 파일",
          "__current__ of __total__": "__total__ 중 __current__",
          "Select from gallery": "갤러리에서 선택하십시오."
      };

      vm.t = function(key, objParam) {
        var res = translation_ko[key];
        if (typeof res == 'undefined') {
          console.warn("Missing translation string for",key,": using default string");
          res = key;
        }
        return vm.tt(res, objParam);
      };

    }
  };

  // simpleTranslationPlugin must be before the undoStack to translate undo/redo labels
  var extensions = [simpleTranslationPlugin, addUndoStackExtensionMaker(performanceAwareCaller), colorPlugin, utilPlugin, inlinerPlugin];
  if (typeof customExtensions !== 'undefined')
    for (var k = 0; k < customExtensions.length; k++) extensions.push(customExtensions[k]);
  extensions.push(fileUploadMessagesExtension);

  var galleryUrl = options.fileuploadConfig ? options.fileuploadConfig.url : '/upload/';
  applyBindingOptions(options, ko);

  // TODO what about appending to another element?
  $("<!-- ko template: 'main' --><!-- /ko -->").appendTo(global.document.body);

  // templateFile may override the template path in templateMetadata
  if (typeof templateFile == 'undefined' && typeof templateMetadata != 'undefined') {
    templateFile = templateMetadata.template;
  }
  // TODO canonicalize templateFile to absolute or relative depending on "relativeUrlsException" plugin

  templateLoader.load(performanceAwareCaller, templateFile, templateMetadata, jsorjson, extensions, galleryUrl);

};

var initFromLocalStorage = function(options, hash_key, customExtensions) {
  try {
    var lsData = localStorageLoader(hash_key, options.emailProcessorBackend);
    var extensions = typeof customExtensions !== 'undefined' ? customExtensions : [];
    extensions.push(lsData.extension);
    var template = _canonicalize(lsData.metadata.template);
    start(options, template, lsData.metadata, lsData.model, extensions);
  } catch (e) {
    console.error("TODO not found ", hash_key, e);
  }
};

var init = function(options, customExtensions) {

  var hash = global.location.hash ? global.location.href.split("#")[1] : undefined;

  // Loading from configured template or configured metadata
  if (options && (options.template || options.data)) {
    if (options.data) {
      var data = typeof data == 'string' ? JSON.parse(options.data) : options.data;
      start(options, undefined, data.metadata, data.content, customExtensions);
    } else {
      start(options, options.template, undefined, undefined, customExtensions);
    }
    // Loading from LocalStorage (if url hash has a 7chars key)
  } else if (hash && hash.length == 7) {
    initFromLocalStorage(options, hash, customExtensions);
    // Loading from template url as hash (if hash is not a valid localstorage key)
  } else if (hash) {
    start(options, _canonicalize(hash), undefined, undefined, customExtensions);
  } else {
    return false;
  }
  return true;
};

module.exports = {
  isCompatible: templateLoader.isCompatible,
  init: init,
  start: start
};

var templateSystem = require('../src/js/bindings/choose-template.js');
document.addEventListener('DOMContentLoaded', function(event) {
templateSystem.addTemplate("array", "<!-- ko foreach: $data --><!-- ko block: $data --><!-- /ko --><!-- /ko -->");
templateSystem.addTemplate("block-show", "<!-- ko block: $data, scrollIntoView: $root.selectedBlock() === $data --><!-- /ko -->");
templateSystem.addTemplate("block-wysiwyg", "<div class=\x22editable block\x22 data-drop-content=\x22\x22 data-bind=\x22attr: { 'data-drop-content': $root.t('') }, click: function(obj, evt) { $root.selectBlock(obj); return true }, clickBubble: false, css: { selected: $root.selectedBlock() === $data }, scrollIntoView: $root.selectedBlock() === $data\x22>  <div class=\x22mo-blockselectionhelper\x22></div>  <div class=\x22tools\x22 data-bind=\x22tooltips: {}\x22>    <!-- ko if: typeof $data.backgroundSrc != 'undefined' --> <div title=\x22Background Image\x22 class=\x22tool bgimage\x22 data-bind=\x22attr: { title: $root.t('Background Image') }, click: $root.backgroundImageTab.bind($element,$index,$parent)\x22><i class=\x22fa fa-fw fa-picture-o\x22></i></div> <!-- /ko -->    <!-- ko if: typeof $data.youtube_url != 'undefined' --> <div title=\x22Background Image\x22 class=\x22tool bgimage\x22 data-bind=\x22attr: { title: $root.t('Background Image') }, click: $root.backgroundImageTab.bind($element,$index,$parent)\x22><i class=\x22fa fa-fw fa-youtube-play\x22></i></div> <!-- /ko -->    <!-- ko if: typeof $index != 'undefined' -->    <div title=\x22Drag this handle to move the block\x22 data-bind=\x22attr: { title: $root.t('Drag this handle to move the block') }\x22 class=\x22tool handle\x22><i class=\x22fa fa-fw fa-arrows\x22></i></div>    <!-- ko if: $index() > 0 -->    <!--    <div title=\x22Move this block upside\x22 data-bind=\x22attr: { title: $root.t('Move this block upside') }\x22 class=\x22tool moveup\x22><i class=\x22fa fa-fw fa-sort-asc\x22 data-bind='click: $root.moveBlock.bind($element, $index, $parent, true)'></i></div>    -->    <!-- /ko -->    <!-- ko if: $index() < $parent.blocks().length -1 -->    <!--    <div title=\x22Move this block downside\x22 data-bind=\x22attr: { title: $root.t('Move this block downside') }\x22 class=\x22tool movedown\x22><i class=\x22fa fa-fw fa-sort-desc\x22 data-bind='click: $root.moveBlock.bind($element, $index, $parent, false)'></i></div>    -->    <!-- /ko -->    <div title=\x22Delete block\x22 class=\x22tool delete\x22 data-bind=\x22attr: { title: $root.t('Delete block') }, click: $root.removeBlock.bind($element, $rawData, $parent)\x22><i class=\x22fa fa-fw fa-trash-o\x22></i></div>    <div title=\x22Duplicate block\x22 class=\x22tool clone\x22 data-bind=\x22attr: { title: $root.t('Duplicate block') }, click: $root.duplicateBlock.bind($element, $index, $parent)\x22><i class=\x22fa fa-fw fa-files-o\x22></i></div>    <!-- /ko -->    <!-- ko if: typeof $data._nextVariant != 'undefined' --><div title=\x22Switch block variant\x22 class=\x22tool variant\x22 data-bind=\x22attr: { title: $root.t('Switch block variant') }, click: $data._nextVariant\x22><i class=\x22fa fa-fw fa-magic\x22></i></div><!-- /ko -->  </div>  <!-- ko block: $data --><!-- /ko --></div>");
templateSystem.addTemplate("blocks-show", "<!-- ko template: { name: 'block-show', foreach: blocks } --><!-- /ko -->");
templateSystem.addTemplate("blocks-wysiwyg", "<div class=\x22sortable-blocks-edit\x22 data-drop-content=\x22\x22 data-empty-content=\x22Drop here blocks from the Blocks tab\x22 data-bind=\x22attr: { 'data-drop-content': $root.t(''), 'data-empty-content': $root.t('Drop here blocks from the &quot;Blocks&quot; tab') }, css: { 'empty': ko.utils.unwrapObservable(blocks).length == 0 }, extsortable: { connectClass: 'sortable-blocks-edit', template: 'block-wysiwyg', data: blocks, dragging: $root.dragging, beforeMove: $root.startMultiple, afterMove: $root.stopMultiple, options: { handle: '.handle', placeholder: $root.placeholderHelper } }\x22></div>");
templateSystem.addTemplate("customstyle", "");
templateSystem.addTemplate("empty", "");
templateSystem.addTemplate("error", "[<div style=\x22background-color: #fff0f0\x22 data-bind=\x22text: ko.toJS($data)\x22></div>]");
templateSystem.addTemplate("gallery-images", "<div data-bind=\x22foreach: items.currentPageData\x22>  <div class=\x22draggable-item\x22 data-bind=\x22if: typeof thumbnailUrl != 'undefined'\x22>    <div class=\x22draggable image\x22 data-bind=\x22click: $root.addImage, extdraggable: { data: $data, dropContainer: '#main-wysiwyg-area', dragging: $root.draggingImage, 'options': { 'appendTo': '#page' } }, style: { backgroundImage: 'url(\\'' + thumbnailUrl + '\\')' }\x22>      <img title=\x22Drag this image and drop it on any template image placeholder\x22 style=\x22display: block;\x22 data-bind=\x22tooltips: {}, attr: { src: thumbnailUrl, 'title': $root.t('Drag this image and drop it on any template image placeholder') }\x22/>    </div>  </div></div><!-- ko if: items.pageCount() > 1 --><div class=\x22galleryPager\x22 style=\x22background: #2b2e33;\x22 data-bind=\x22buttonset: {}\x22>  <a href=\x22javascript:void(0)\x22 style=\x22width: 19%\x22 data-bind=\x22click: items.moveFirst, button: { disabled: items.currentPage() == 1, icons: { primary: 'fa fa-fast-backward' }, text: false }\x22>First</a>  <a href=\x22javascript:void(0)\x22 style=\x22width: 19%\x22 data-bind=\x22click: items.movePrevious, button: { disabled: items.currentPage() == 1, icons: { primary: 'fa fa-backward' }, text: false }\x22>Previous</a>  <span style=\x22width: 19%\x22 data-bind=\x22button: { disabled: true, text: true, label: ' '+$root.t('__current__ / __total__', { current: items.currentPage(), total: items.pageCount() })+' ' }\x22> X of Y </span>  <a href=\x22javascript:void(0)\x22 style=\x22width: 19%\x22 data-bind=\x22click: items.moveNext, button: { disabled: items.currentPage() == items.pageCount(), icons: { primary: 'fa fa-forward' }, text: false }\x22>Next</a>  <a href=\x22javascript:void(0)\x22 style=\x22width: 19%\x22 data-bind=\x22click: items.moveLast, button: { disabled: items.currentPage() == items.pageCount(), icons: { primary: 'fa fa-fast-forward' }, text: false }\x22>Last</a></div><!-- /ko -->");
templateSystem.addTemplate("img-wysiwyg", "<table tabfocus=\x220\x22 cellspacing=\x220\x22 cellpadding=\x220\x22 data-drop-content=\x22Drop here\x22 data-bind=\x22style: _stylebind, click: function(obj, evt) { $root.selectItem(_item, _data); return true; }, clickBubble: false, fudroppable: { activeClass: 'ui-state-highlight', hoverClass: 'ui-state-draghover' }, extdroppable: { options: { accept: '.image', activeClass: 'ui-state-highlight', hoverClass: 'ui-state-draghover' }, data: _src, dragged: $root.fileToImage }, css: { selecteditem: $root.isSelectedItem(_item) }, scrollIntoView: $root.isSelectedItem(_item), attr: { 'data-drop-content': $root.t('Drop here'), width: _width, height: _height, align: _align }\x22  class=\x22img-wysiwyg selectable-img\x22 style=\x22display: table;\x22><tr><td class=\x22uploadzone\x22>  <div class=\x22mo-imgselectionhelper\x22></div>  <div class=\x22mo-uploadzone\x22></div>  <div class=\x22img-size\x22 data-bind=\x22text: _size\x22>size</div>  <div class=\x22midtools\x22 data-bind=\x22tooltips: {}\x22>    <!-- ko if: _src() != '' -->    <div title=\x22Remove image\x22 class=\x22tool delete\x22 data-bind=\x22attr: { title: $root.t('Remove image') }, click: _src.bind(_src, ''), clickBubble: false\x22><i class=\x22fa fa-fw fa-trash-o\x22></i></div>    <!-- ko if: typeof $root.editImage !== 'undefined' -->    <div title=\x22Open the image editing tool\x22 class=\x22tool edit\x22 data-bind=\x22attr: { title: $root.t('Open the image editing tool') }, click: $root.editImage.bind($element, _src), clickBubble: false\x22><i class=\x22fa fa-fw fa-pencil\x22></i></div>    <!-- /ko -->    <!-- /ko -->    <!-- ko if: _src() == '' -->    <div title=\x22Upload a new image\x22 data-bind=\x22attr: { title: $root.t('Upload a new image') }\x22 class=\x22tool upload\x22 style=\x22position: relative; overflow: hidden;\x22><i class=\x22fa fa-fw fa-upload\x22></i>      <input class=\x22fileupload nofile\x22 type=\x22file\x22 name=\x22files[]\x22 data-bind=\x22fileupload: { data: _src, onerror: $root.notifier.error, onfile: $root.loadImage, canvasPreview: true }\x22 style=\x22z-index: 20; position: absolute; top: 0; left: 0; right: 0; bottom: 0; min-width: 100%; min-height: 100%; font-size: 999px; text-align: right; filter: alpha(opacity=0); opacity: 0; outline: none; cursor: inherit; display: block\x22>    </div>    <!-- ko if: typeof $root.selectImage !== 'undefined' -->    <div title=\x22Select from gallery\x22 class=\x22tool gallery\x22 data-bind=\x22attr: { title: $root.t('Select from gallery') }, click: $root.selectImage.bind($element, _src), clickBubble: true\x22><i class=\x22fa fa-fw fa-picture-o\x22></i></div>    <!-- /ko -->    <!-- /ko -->  </div>  <!-- ko template: _template --><!-- /ko -->  <!-- ko if: _src() == '' -->    <!--    <img style=\x22display: block;\x22 class=\x22imgplaceholder\x22 width=\x22200\x22 src=\x22\x22 alt=\x22Insert an image here\x22 data-bind=\x22wysiwygSrc: { src: _src.preloaded, placeholder: _placeholdersrc, width: _width, height: _height, method: _method }\x22 />    -->    <span class=\x22fileuploadtext\x22 style=\x22text-align: center; display: -ms-flexbox; display: flex; align-items: center; flex-align: center; justify-content: center; padding: 1em; position: absolute; top: 0; left: 0; right: 0; bottom: 0;\x22><span class=\x22textMiddle\x22 style=\x22 text-shadow: 1px 1px 0 #FFFFFF, 0 0 10px #FFFFFF; font-weight: bold;\x22 data-bind=\x22text: $root.t('Drop an image here')\x22>Drop an image here</span></span>  <!-- /ko -->  <!-- ko if: _src() != '' -->  <!--    <img style=\x22display: block;\x22 width=\x22200\x22 src=\x22\x22 data-bind=\x22preloader: _src, wysiwygSrc: { src: _src.preloaded, placeholder: _placeholdersrc, width: _width, height: _height, method: _method }\x22 />    -->  <!-- /ko -->  <!-- pulsante per la cancellazione -->  <div title=\x22Drop an image here or click the upload button\x22 data-bind=\x22attr: { title: $root.t('Drop an image here or click the upload button') }, tooltips: {}\x22 class=\x22workzone\x22 style=\x22position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;\x22>    <!-- ko if: _src.preloaded && _src() != _src.preloaded() -->PRELOADING....<!-- /ko -->    <!-- ko if: _src() != '' -->      <input class=\x22fileupload withfile\x22 type=\x22file\x22 name=\x22files[]\x22 data-bind=\x22fileupload: { data: _src, onerror: $root.notifier.error, onfile: $root.galleryRecent.unshift.bind($root.galleryRecent), canvasPreview: true }\x22 style=\x22z-index: -20; position: absolute; top: 0; left: 0; right: 0; bottom: 0; min-width: 100%; min-height: 100%; font-zie: 999px; text-align: right; filter: alpha(opacity=0); opacity: 0; outline: none; cursor: inherit; display: block\x22>    <!-- /ko -->    <div class=\x22progress\x22 style=\x22opacity: .5; width: 80%; margin-left: 10%; position: absolute; bottom: 30%; height: 20px; border: 2px solid black;\x22>      <div class=\x22progress-bar progress-bar-success\x22 style=\x22height: 20px; background-color: black; \x22></div>    </div>  </div></table>");
templateSystem.addTemplate("main", "<div  id=\x22page\x22  style=\x22display: none;\x22  data-bind=\x22visible: true, css: { withToolbox: $root.showToolbox, withPreviewFrame: showPreviewFrame }\x22>  <div    id=\x22main-edit-area\x22    data-bind=\x22click: function(obj, evt) { $root.selectBlock(null); return true; }, clickBubble: false\x22  >    <!-- ko withProperties: { templateMode: 'wysiwyg', templateModeFallback: 'show' } -->    <div      id=\x22main-wysiwyg-area\x22      data-bind=\x22wysiwygScrollfix: true, scrollable: true, fudroppable: { active: draggingImage }, css: { isdragging: dragging, isdraggingimg: draggingImage }, block: content\x22    ></div>    <!-- /ko -->  </div>  <!-- toolbar comment start -->  <!--<div id=\x22toolbar\x22 class=\x22mo\x22 data-bind=\x22tooltips: {}\x22>    <input id=\x22previewFrameToggle\x22 type=\x22checkbox\x22 data-bind=\x22checked: $root.showPreviewFrame, button: { refreshOn: $root.showPreviewFrame, icons: { primary: 'fa fa-fw fa-tablet', secondary: null }, text: false, label: $root.t('Preview') }\x22><label title=\x22Show live preview\x22 for=\x22previewFrameToggle\x22 data-bind=\x22attr: { title: $root.t('Show live preview') }\x22>PREVIEW</label></input>-->  <!-- ko if: $root.debug -->  <!--    <a href=\x22javascript:void(0)\x22 data-bind=\x22click: $root.export, clickBubble: false, button: { label: 'export', text: true }\x22>EXPORT</a>    <input type=\x22checkbox\x22 data-bind=\x22checked: $root.debug\x22 /> debug    <a href=\x22javascript:void(0)\x22 data-bind=\x22click: $root.loadDefaultBlocks, clickBubble: false, button: { icons: { primary: 'fa fa-fw fa-upload' }, label: 'Default', text: true }\x22>LOAD BLOCKS</a>    [<a id=\x22subscriptionsCount\x22 href=\x22javascript:viewModel.loopSubscriptionsCount()\x22>subs</a>]-->  <!-- /ko -->  <!--    <span data-bind=\x22visible: false\x22>    <input type=\x22checkbox\x22 data-bind=\x22checked: $root.showToolbox\x22 /> toolbox    </span>    <div class=\x22rightButtons\x22>    -->  <!-- ko if: typeof $root.save !== 'undefined' -->  <!--    <a title=\x22Save template\x22 href=\x22javascript:void(0)\x22 data-bind=\x22attr: { title: $root.t('Save template') }, click: $root.save.execute, clickBubble: false, button: { disabled: !$root.save.enabled(), icons: { primary: 'fa fa-fw fa-cloud-upload' }, label: $root.t($root.save.name), text: true }\x22>SALVA</a>    -->  <!-- /ko -->  <!-- ko if: typeof $root.test !== 'undefined' -->  <!--    <a title=\x22Show preview and send test\x22 href=\x22javascript:void(0)\x22 data-bind=\x22attr: { title: $root.t('Show preview and send test') }, click: $root.test.execute, clickBubble: false, button: { disabled: !$root.test.enabled(), icons: { primary: 'fa fa-fw fa-paper-plane' }, label: $root.t($root.test.name), text: true }\x22>TEST</a>    -->  <!-- /ko -->  <!-- ko if: typeof $root.download !== 'undefined' -->  <!--    <form id=\x22downloadForm\x22 action=\x22#\x22 method=\x22POST\x22>    <input type=\x22hidden\x22 name=\x22action\x22 value=\x22download\x22 />    <input type=\x22hidden\x22 name=\x22filename\x22 value=\x22email.html\x22 />    <input type=\x22hidden\x22 name=\x22html\x22 id=\x22downloadHtmlTextarea\x22 />    <a title=\x22Download template\x22 href=\x22javascript:void(0)\x22 data-bind=\x22attr: { title: $root.t('Download template') }, click: $root.download.execute, clickBubble: false, button: { disabled: !$root.download.enabled(), icons: { primary: 'fa fa-fw fa-download' }, label: $root.t($root.download.name), text: true }\x22>DOWNLOAD</a>    </form>    -->  <!-- /ko -->  <!--    </div>  </div>  -->  <!-- toolbar commnet end -->  <!-- ko if: $root.showToolbox -->  <div    id=\x22main-toolbox\x22    class=\x22mo\x22    data-bind=\x22scrollable: true, withProperties: { templateMode: 'edit' }\x22  >    <div data-bind=\x22template: { name: 'toolbox' }\x22></div>  </div>  <!-- /ko -->  <div    id=\x22main-preview\x22    class=\x22mo\x22    data-bind=\x22scrollable: true, if: $root.showPreviewFrame\x22  >    <div id=\x22preview-toolbar\x22>      <div        data-bind=\x22visible: $root.showPreviewFrame, buttonset: { }\x22        style=\x22display: inline-block\x22      >        <input          id=\x22previewLarge\x22          type=\x22radio\x22          name=\x22previewMode\x22          value=\x22large\x22          data-bind=\x22checked: $root.previewMode, button: { text: false, label: 'large', icons: { primary: 'fa fa-fw fa-desktop' } }\x22        />        <label          for=\x22previewLarge\x22          title=\x22Large screen\x22          data-bind=\x22attr: { title: $root.t('Large screen') }\x22          >Large screen</label        >        <input          id=\x22previewDesktop\x22          type=\x22radio\x22          name=\x22previewMode\x22          value=\x22desktop\x22          data-bind=\x22checked: $root.previewMode, button: { text: false, label: 'desktop', icons: { primary: 'fa fa-fw fa-tablet' } }\x22        />        <label          for=\x22previewDesktop\x22          title=\x22Tablet\x22          data-bind=\x22attr: { title: $root.t('Tablet') }\x22          >Tablet</label        >        <input          id=\x22previewMobile\x22          type=\x22radio\x22          name=\x22previewMode\x22          value=\x22mobile\x22          data-bind=\x22checked: $root.previewMode, button: { text: false, label: 'mobile', icons: { primary: 'fa fa-fw fa-mobile' } }\x22        />        <label          for=\x22previewMobile\x22          title=\x22Smartphone\x22          data-bind=\x22attr: { title: $root.t('Smartphone') }\x22          >Smartphone</label        >      </div>    </div>    <div      id=\x22frame-container\x22      data-bind=\x22css: { desktop: $root.previewMode() == 'desktop', mobile: $root.previewMode() == 'mobile', large: $root.previewMode() == 'large' }\x22    >      <iframe data-bind=\x22bindIframe: $data\x22></iframe>    </div>  </div>  <div class=\x22mo\x22 id=\x22mo-body\x22></div>  <div    id=\x22incompatible-template\x22    title=\x22Saved model is obsolete\x22    style=\x22display: none\x22    data-bind=\x22attr: { title: $root.t('Saved model is obsolete') }, html: $root.t('<p>The saved model has been created with a previous, non completely compatible version, of the template</p><p>Some content or style in the model <b>COULD BE LOST</b> if you will <b>save</b></p><p>Contact us for more informations!</p>')\x22  >    Incompatible template  </div>  <div    id=\x22fake-image-editor\x22    title=\x22Fake image editor\x22    style=\x22display: none\x22    data-bind=\x22attr: { title: $root.t('Fake image editor') }, html: $root.t('<p>Fake image editor</p>')\x22  >    <p>Fake image editor</p>  </div>  <div class=\x22wrapper-container\x22 style=\x22padding-top: 140px; background: #00000088; height: 100%; z-index: 5000; position:relative;\x22 data-bind=\x22css: {hidden:$root.mailboxLoaded() === false}\x22>        <div class=\x22row\x22>          <div class=\x22col-md-3\x22>      </div>          <div class=\x22col-md-6\x22 style=\x22z-index: 5001; padding: 0px; box-shadow: 0 0 9px 3px #cecece; background: #ffffff; height: 500px;\x22>              <h3 style=\x22text-align: center;background-color: #46374e;padding: 20px;color: #ffffff; margin: 0px;\x22>대량메일 보내기 Send E-Mail</h3>              <div style=\x22padding: 10px 50px 10px 50px;\x22>                  <div class=\x22row\x22>          <!-- 왼쪽 칼럼 -->            <div class=\x22form-group col-md-6\x22>                          <label for=\x22from\x22>                <b>보내는 사람</b>              </label>              <br>              <input id=\x22sourceEmail\x22 type=\x22email\x22 name=\x22from\x22 class=\x22form-control\x22 placeholder=\x22on@toping.io\x22>              <br>                          <label for=\x22to\x22>                <b>받는 사람</b>              </label>              <br>              <input id=\x22destEmail\x22 type=\x22email\x22 name=\x22to\x22 class=\x22form-control\x22>              <br>                          <label for=\x22title\x22>                <b>제목</b>              </label>              <br>              <input id=\x22emailTitle\x22 type=\x22text\x22 name=\x22title\x22 class=\x22form-control\x22>                          <div style=\x22margin-top: 20px;\x22>                            <span><b>주소록 파일첨부</b></span>                <br>                <br>                              <label for=\x22uploadBtn\x22 class=\x22btn_file\x22>찾아보기</label>                 <br>                              <input style=\x22font-size:13px;\x22 type=\x22file\x22 id=\x22uploadBtn\x22 name=\x22files\x22 accept=\x22.xlsx\x22>                              <div class=\x22text-left\x22 style=\x22margin-top: 8px;\x22>                                  <a>                    <input style=\x22font-size:13px;\x22 id=\x22getExcelFile\x22 type=\x22button\x22 value=\x22저장된 파일 불러오기\x22 data-bind=\x22click: $root.getExcelFile, button: { text: true, label: $root.t('불러오기')}\x22>                  </a>                              </div>                 <br/>                          </div>                      </div>          <!-- 오른쪽 칼럼 -->                      <div class=\x22form-group col-md-6\x22>                          <div class=\x22fileBox\x22>                              <div class=\x22\x22>                                  <label for=\x22list\x22><b>주소록 리스트</b></label>                              </div>                              <div style=\x22overflow: scroll; width: 100%; height: 300px; padding-top: 10px;\x22>                                  <div class=\x22table-responsive\x22>                                      <table class=\x22table table-striped\x22 id=\x22excel-table\x22>                                          <thead class=\x22text-center\x22>                                              <tr style=\x22font-size: 13px;\x22>                                                  <th style=\x22vertical-align: middle; padding: 0; width: 40%; font-weight: bold;\x22>이름</th>                                                  <th style=\x22vertical-align: middle; padding: 0; width: 60%; font-weight: bold;\x22>이메일</th>                                              </tr>                                          </thead>                                      </table>                                  </div>                              </div>                          </div>                          <br>                          <span style=\x22font-size: 13px;\x22>불러온 연락처                 <span id=\x22contact-n\x22 style=\x22color: #eb7331;\x22>00</span>건              </span>                          <div class=\x22form-group col-md-12 text-center\x22 style=\x22padding: 10px;\x22>                              <a title=\x22미리보기 표시 및 테스트 보내기\x22 href=\x22javascript:void(0)\x22 data-bind=\x22attr: { title: $root.t(\'Show preview and send test\') }, click: $root.test.execute, clickBubble: false, button: { disabled: !$root.test.enabled(), icons: { primary: \'fa fa-fw fa-paper-plane\' }, label: $root.t($root.test.name), text: true }\x22 class=\x22ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary\x22 role=\x22button\x22/>                              <label id=\x22sendClose\x22 data-bind=\x22click: $root.closeMailbox\x22><i style=\x22margin-right:-3px; font-size: 18px;\x22 class=\x22fa fa-fw fa-times\x22></i>닫기</label>                          </div>                      </div>                  </div>              </div>          </div>      </div>  </div></div>");
templateSystem.addTemplate("toolbox", "<div id=\x22tooltabs\x22 class=\x22tabs_horizontal button_color\x22 data-bind=\x22tabs: { active: $root.selectedTool }\x22><div style=\x22position: absolute; z-index: 300\x22>    <img style=\x22vertical-align:middle; margin-left:20px; margin-top:20px;\x22 src=\x22/img/footer-Agency/footer-logo_sm.png\x22 alt=\x22logo\x22 class=\x22img-fluid\x22></div><ul style=\x22padding-top: 114px; top: -57px;\x22>  <li data-bind=\x22tooltips: {}\x22><a title=\x22Blocks ready to be added to the template\x22 data-local=\x22true\x22 href=\x22#toolblocks\x22 data-bind=\x22attr: { title: $root.t('Blocks ready to be added to the template') }\x22><i class=\x22fa fa-fw fa-cubes\x22></i> <span style=\x22margin-left:-2px;\x22 data-bind=\x22html: $root.t('Blocks')\x22>Blocks</span></a></li>  <li data-bind=\x22tooltips: {}\x22><a title=\x22Edit content options\x22 href=\x22#toolcontents\x22 data-local=\x22true\x22 data-bind=\x22attr: { title: $root.t('Edit content options') }\x22> <span style=\x22margin-left:55px;\x22 data-bind=\x22html: $root.t('Content')\x22>Content</span></a></li>  <li data-bind=\x22tooltips: {}\x22><a title=\x22Edit style options\x22 href=\x22#toolstyles\x22 data-local=\x22true\x22 data-bind=\x22attr: { title: $root.t('Edit style options') }\x22> <span style=\x22margin-left:55px;\x22 data-bind=\x22html: $root.t('Style')\x22>Style</span></a></li>  <li><a><input id=\x22showGallery\x22 type=\x22checkbox\x22 data-bind=\x22checked: $root.showGallery, button: { refreshOn: $root.showGallery, icons: { primary: '', secondary: null }, text: true, label: $root.t('Gallery') }\x22><label title=\x22Show image gallery\x22 style=\x22width:100%; text-align:left; padding-left:54px;\x22  for=\x22showGallery\x22 data-bind=\x22attr: { title: $root.t('Show image gallery') }\x22>show gallery</label></input></a></li></ul><ul class=\x22ui-tabs-nav\x22 style=\x22top: 225px; height: 260px;\x22>  <li style=\x22height: 40px;\x22>  <!-- ko if: typeof $root.save !== 'undefined' -->  <a title=\x22Save template\x22 href=\x22javascript:void(0)\x22 data-bind=\x22attr: { title: $root.t('Save template') }, click: $root.save.execute, clickBubble: false, button: { disabled: !$root.save.enabled(), icons: { primary: 'fa fa-fw fa-cloud-upload' }, label: $root.t($root.save.name), text: true }\x22>SALVA</a>  <!-- /ko -->  </li>  <li style=\x22height: 40px;\x22><a><input id=\x22previewFrameToggle\x22 type=\x22checkbox\x22 data-bind=\x22checked: $root.showPreviewFrame, button: { refreshOn: $root.showPreviewFrame, icons: { primary: 'fa fa-fw fa-tablet', secondary: null }, text: true, label: $root.t('Preview') }\x22><label title=\x22Show live preview\x22 style=\x22text-align:left;\x22 for=\x22previewFrameToggle\x22 data-bind=\x22attr: { title: $root.t('Show live preview') }\x22>PREVIEW</label></input></a></li>  <li style=\x22height: 40px;\x22>  <!-- ko if: typeof $root.test !== 'undefined' -->  <a><input id=\x22mailboxLoaded\x22 type=\x22checkbox\x22 data-bind=\x22checked: $root.mailboxLoaded, button: { refreshOn: $root.mailboxLoaded, text: true, icons: { primary: \'fa fa-fw fa-paper-plane\' }, label: $root.t($root.test.name) }\x22><label title=\x22TEST\x22 style=\x22width:100%; text-align:left; \x22  for=\x22mailboxLoaded\x22 data-bind=\x22attr: { title: $root.t($root.test.name) }\x22>TEST</label></input></a>  <!-- /ko -->  </li>  <li style=\x22height: 40px;\x22>      <a title=\x22Download template\x22 href=\x22javascript:void(0)\x22 data-bind=\x22attr: { title: $root.t('Download template') }, clickBubble: false, button: { disabled: !$root.download.enabled(), icons: { primary: 'fa fa-fw fa-download' }, label: $root.t($root.download.name), text: true }\x22>DOWNLOAD</a>  </li>  <li style=\x22height: 40px;\x22>  <!-- ko if: typeof $root.download !== 'undefined' -->  <form id=\x22downloadForm\x22 action=\x22#\x22 method=\x22POST\x22>  <input type=\x22hidden\x22 name=\x22action\x22 value=\x22download\x22 />  <input type=\x22hidden\x22 name=\x22filename\x22 value=\x22email.html\x22 />  <input type=\x22hidden\x22 name=\x22html\x22 id=\x22downloadHtmlTextarea\x22 />  <a title=\x22\x22 style=\x22padding-left:55px;\x22 href=\x22javascript:void(0)\x22 data-bind=\x22attr: { title: $root.t('') }, click: $root.download.execute, clickBubble: false, button: { disabled: !$root.download.enabled(), icons: { primary: '' },  label: $root.t('html'), text: true }\x22>html</a>  </form>  <!-- /ko -->  </li>  <li style=\x22height: 40px;\x22>  <!-- ko if: typeof $root.downloadPdf !== 'undefined' -->  <form id=\x22downloadPdfForm\x22 action=\x22#\x22 method=\x22POST\x22>  <input type=\x22hidden\x22 name=\x22action\x22 value=\x22pdf\x22 />  <input type=\x22hidden\x22 name=\x22filename\x22 value=\x22email.pdf\x22 />  <input type=\x22hidden\x22 name=\x22html\x22 id=\x22downloadPdfTextarea\x22 />  <a title=\x22\x22 style=\x22padding-left:55px;\x22 href=\x22javascript:void(0)\x22 data-bind=\x22attr: { title: $root.t('') }, click: $root.downloadPdf.execute, clickBubble: false, button: { disabled: !$root.downloadPdf.enabled(), icons: { primary: '' },  label: $root.t('pdf'), text: true }\x22>pdf</a>  </form>  <!-- /ko -->  </li></ul><ul class=\x22ui-tabs-nav\x22 style=\x22top: 470px; height: 100%;\x22><hr style=\x22width: 80%; color: #f1f1f1; text-align: center; margin-left: 20px; border: 0.5px solid;\x22><span data-bind=\x22buttonset: { }\x22 class=\x22leftButtons\x22 ><a title=\x22Undo last operation\x22 style=\x22height:40px; text-align:left;\x22 href=\x22javascript:void(0)\x22 data-bind=\x22attr: { title: $root.t('Undo last operation') }, click: $root.undo.execute, clickBubble: false, button: { disabled: !$root.undo.enabled(), icons: { primary: 'fa fa-reply' }, label: $root.undo.name, text: true }\x22>UNDO</a></span><span data-bind=\x22buttonset: { }\x22 class=\x22leftButtons\x22 ><a title=\x22Redo last operation\x22 style=\x22height: 40px; text-align:left;\x22 href=\x22javascript:void(0)\x22 data-bind=\x22attr: { title: $root.t('Redo last operation') }, click: $root.redo.execute, clickBubble: false, button: { disabled: !$root.redo.enabled(), icons: { primary: 'fa fa-share' }, label: $root.redo.name, text: true }\x22>REDO</a></span></ul><div id=\x22toolblocks\x22 data-bind=\x22scrollable: true\x22 style=\x22height: 100%\x22>  <div class=\x22block-list\x22 data-bind=\x22foreach: blockDefs\x22>    <div class=\x22draggable-item\x22 data-bind=\x22withProperties: { templateMode: 'show' }\x22>      <div class=\x22block\x22 data-bind=\x22extdraggable: { connectClass: 'sortable-blocks-edit', data: $data, dropContainer: '#main-wysiwyg-area', dragging: $root.dragging, 'options': { handle: '.handle', distance: 10, 'appendTo': '#page' } }, click: $root.addBlock\x22 style=\x22position: relative;\x22>        <div title=\x22Click or drag to add this block to the template\x22 class=\x22handle\x22 data-bind=\x22attr: { title: $root.t('Click or drag to add this block to the template') }, tooltips: {}\x22></div>        <img data-bind=\x22attr: { alt: $root.t('Block __name__', { name: ko.utils.unwrapObservable(type) }), src: $root.templatePath('edres/'+ko.utils.unwrapObservable(type)+'.png') }\x22 alt=\x22Block __name__\x22 />      </div>      <a href=\x22javascript:void(0)\x22 class=\x22addblockbutton\x22 style=\x22background-color: transparent; height: 95%; opacity:0.0;\x22 data-bind=\x22click: $root.addBlock, button: { label: $root.t('') }\x22></a>    </div>  </div></div><div id=\x22toolcontents\x22 data-bind=\x22scrollable: true\x22 style=\x22height: 100%\x22>  <!-- ko if: $root.selectedBlock() !== null -->  <div data-bind=\x22block: $root.selectedBlock\x22></div>  <!-- /ko -->  <!-- ko if: $root.selectedBlock() == null -->  <div class=\x22noSelectedBlock\x22 data-bind=\x22text: $root.t('By clicking on message parts you will select a block and content options, if any, will show here')\x22>By clicking on message parts you will select a block and content options, if any, will show here</div>  <!-- /ko -->  <!-- ko block: content --><!-- /ko --></div><div id=\x22toolstyles\x22 data-bind=\x22scrollable: true, withProperties: { templateMode: 'styler' }\x22 style=\x22height: 100%\x22>  <!-- ko if: typeof $root.content().theme === 'undefined' || typeof $root.content().theme().scheme === 'undefined' || $root.content().theme().scheme() === 'custom' -->    <!-- ko if: $root.selectedBlock() !== null -->    <div data-bind=\x22block: $root.selectedBlock, css: { workLocal: $root.selectedBlock().customStyle, workGlobal: typeof $root.selectedBlock().customStyle === 'undefined' || !$root.selectedBlock().customStyle() }\x22></div>    <!-- /ko -->    <!-- ko if: $root.selectedBlock() == null -->    <div class=\x22noSelectedBlock\x22 data-bind=\x22text: $root.t('By clicking on message parts you will select a block and style options, if available, will show here')\x22>By clicking on message parts you will select a block and style options, if available, will show here</div>    <!-- /ko -->    <div class=\x22workGlobalContent\x22>    <!-- ko block: content --><!-- /ko -->  </div>    <!-- /ko --></div></div><!--background image--><div id=\x22bgimagetool\x22 class=\x22slidebar\x22 data-bind=\x22scrollable: true, css: { hidden: $root.bgImageTool() === false }\x22><div class=\x22close\x22 data-bind=\x22click: $root.closeBgTool\x22>X</div><span class=\x22pane-title\x22 data-bind=\x22text: $root.t('Background Image:')\x22>Background Image:</span>  <!-- ko if: $root.bgImageHolder  -->  <div data-drop-content=\x22Drop here\x22 class=\x22img-dropzone pane uploadzone\x22 data-bind=\x22attr: { 'data-drop-content': $root.t('Drop here') }, fudroppable: { activeClass: 'ui-state-highlight', hoverClass: 'ui-state-draghover' }\x22>  <div class=\x22mo-uploadzone\x22 style=\x22position: relative; padding: 2em; border: 2px dotted #808080\x22>    <input class=\x22fileupload\x22 type=\x22file\x22 name=\x22files[]\x22 data-bind=\x22fileupload: { onerror: $root.notifier.error, onfile: $root.setbackgroundImage }\x22 style=\x22z-index: 10; position: absolute; top: 0; left: 0; right: 0; bottom: 0; min-width: 100%; min-height: 100%; font-size: 999px; text-align: right; filter: alpha(opacity=0); opacity: 0; outline: none; cursor: inherit; display: block\x22>    <span data-bind=\x22text: $root.t('Click or drag Image File here')\x22>Click or drag Image File here</span>    <div class=\x22workzone\x22 style=\x22position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;\x22>      <div class=\x22progress\x22 style=\x22opacity: .5; width: 80%; margin-left: 10%; position: absolute; bottom: 30%; height: 20px; border: 2px solid black;\x22>        <div class=\x22progress-bar progress-bar-success\x22 style=\x22height: 20px; background-color: black; \x22></div>      </div>    </div></div></div>  <!-- /ko --></div><!--background image--><div id=\x22toolimages\x22 class=\x22slidebar\x22 data-bind=\x22scrollable: true, css: { hidden: $root.showGallery() === false }\x22 style=\x22height: 100%;\x22><div class=\x22close\x22 data-bind=\x22click: $root.showGallery.bind($element, false);\x22>X</div><span class=\x22pane-title\x22 data-bind=\x22text: $root.t('Gallery:')\x22>Gallery:</span><div data-drop-content=\x22Drop here\x22 class=\x22img-dropzone pane uploadzone\x22 data-bind=\x22attr: { 'data-drop-content': $root.t('Drop here') }, fudroppable: { activeClass: 'ui-state-highlight', hoverClass: 'ui-state-draghover' }\x22>  <div class=\x22mo-uploadzone\x22 style=\x22position: relative; padding: 2em; border: 2px dotted #808080;\x22>      <input class=\x22fileupload\x22 type=\x22file\x22 multiple name=\x22files[]\x22 data-bind=\x22fileupload: { onerror: $root.notifier.error, onfile: $root.loadImage }\x22 style=\x22z-index: 10; position: absolute; top: 0; left: 0; right: 0; bottom: 0; min-width: 100%; min-height: 100%; font-size: 999px; text-align: right; filter: alpha(opacity=0); opacity: 0; outline: none; cursor: inherit; display: block\x22>      <span><img src=\x22../rs/img/upload_img.png\x22 style=\x22width: 50px; text-align: center;\x22></span>      <div class=\x22workzone\x22 style=\x22position: absolute; top: 0; left: 0; right: 0; bottom: 0; overflow: hidden;\x22>        <div class=\x22progress\x22 style=\x22opacity: .5; width: 80%; margin-left: 10%; position: absolute; bottom: 30%; height: 20px; border: 2px solid black;\x22>          <div class=\x22progress-bar progress-bar-success\x22 style=\x22height: 20px; background-color: black; \x22></div>        </div>      </div>  </div></div><!-- ko if: $root.showGallery() --><div id=\x22toolimagestab\x22 class=\x22tabs_horizontal\x22 data-bind=\x22tabs: { active: $root.selectedImageTab }\x22>  <ul>    <li data-bind=\x22tooltips: {}\x22><a title=\x22Session images\x22 data-local=\x22true\x22 href=\x22#toolimagesrecent\x22 data-bind=\x22attr: { title: $root.t('Session images') }, text: $root.t('Recents')\x22>Recents</a></li>    <li data-bind=\x22tooltips: {}\x22><a title=\x22Remote gallery\x22 data-local=\x22true\x22 href=\x22#toolimagesgallery\x22 data-bind=\x22attr: { title: $root.t('Remote gallery') }, text: $root.t('Gallery')\x22>Gallery</a></li>  </ul>  <div id=\x22toolimagesrecent\x22>    <!-- ko if: galleryRecent().length == 0 --><div class=\x22galleryEmpty\x22 data-bind=\x22text: $root.t('No images uploaded, yet')\x22>No images uploaded, yet</div><!-- /ko -->    <!-- ko template: {name: 'gallery-images', data: { items: galleryRecent } } --># recent gallery #<!-- /ko -->  </div>  <div id=\x22toolimagesgallery\x22 style=\x22text-align: center\x22>  <!-- ko if: $root.galleryLoaded() === false --><a class=\x22loadbutton\x22 title=\x22Show images from the gallery\x22 href=\x22javascript:void(0)\x22 data-bind=\x22attr: { title: $root.t('Show images from the gallery') }, click: $root.loadGallery, button: { disabled: $root.galleryLoaded, icons: { primary: 'fa fa-fw fa-picture-o' }, label: $root.galleryLoaded() == 'loading' ? $root.t('Loading...') : $root.t('Load gallery'), text: true }\x22># load gally #</a><!-- /ko -->  <!-- ko if: $root.galleryLoaded() === 'loading' --><div class=\x22galleryEmpty\x22 data-bind=\x22text: $root.t('Loading gallery...')\x22>Loading gallery...</div><!-- /ko -->  <!-- ko if: $root.galleryLoaded() === 0 --><div class=\x22galleryEmpty\x22 data-bind=\x22text: $root.t('The gallery is empty')\x22>The gallery is empty</div><!-- /ko -->  <!-- ko template: {name: 'gallery-images', data: { items: galleryRemote } } --># remote gallery #<!-- /ko -->  </div></div><!-- /ko --></div>");
});

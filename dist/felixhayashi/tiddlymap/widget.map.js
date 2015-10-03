/*\

title: $:/plugins/felixhayashi/tiddlymap/js/widget/MapWidget
type: application/javascript
module-type: widget

@module TiddlyMap
@preserve

\*/
(function(){"use strict";var e=require("$:/core/modules/widgets/widget.js").widget;var t=require("$:/plugins/felixhayashi/tiddlymap/js/config/vis").config;var i=require("$:/plugins/felixhayashi/tiddlymap/js/utils").utils;var s=require("$:/plugins/felixhayashi/tiddlymap/js/DialogManager").DialogManager;var r=require("$:/plugins/felixhayashi/tiddlymap/js/CallbackManager").CallbackManager;var a=require("$:/plugins/felixhayashi/tiddlymap/js/ViewAbstraction").ViewAbstraction;var n=require("$:/plugins/felixhayashi/tiddlymap/js/EdgeType").EdgeType;var o=require("$:/plugins/felixhayashi/tiddlymap/js/NodeType").NodeType;var d=require("$:/plugins/felixhayashi/vis/vis.js");var h=function(t,a){e.call(this);this.initialise(t,a);this.adapter=$tw.tmap.adapter;this.opt=$tw.tmap.opt;this.indeces=$tw.tmap.indeces;this.notify=$tw.tmap.notify;this.fsapi=i.getFullScreenApis();this.getAttr=this.getAttribute;this.isDebug=i.isTrue(this.opt.config.sys.debug,false);this.callbackManager=new r;this.dialogManager=new s(this.callbackManager,this);this.computeAttributes();this.editorMode=this.getAttr("editor");this.clickToUse=i.isTrue(this.getAttr("click-to-use"),true);this.objectId=this.getAttr("object-id")||i.genUUID();if(this.editorMode){i.addListeners({"tmap:tm-create-view":this.handleCreateView,"tmap:tm-rename-view":this.handleRenameView,"tmap:tm-delete-view":this.handleDeleteView,"tmap:tm-edit-view":this.handleEditView,"tmap:tm-configure-system":this.handleConfigureSystem,"tmap:tm-store-position":this.handleStorePositions,"tmap:tm-edit-filters":this.handleEditFilters,"tmap:tm-generate-widget":this.handleGenerateWidget,"tmap:tm-download-canvas":this.handleDownloadCanvas},this,this)}i.addListeners({"tmap:tm-focus-node":this.handleFocusNode,"tmap:tm-reset-focus":this.repaintGraph},this,this);this.visHandlers={click:this.handleVisSingleClickEvent,doubleClick:this.handleVisDoubleClickEvent,stabilized:this.handleVisStabilizedEvent,dragStart:this.handleVisDragStart,selectNode:this.handleVisSelectNode,deselectNode:this.handleVisDeselectNode,dragEnd:this.handleVisDragEnd,oncontext:this.handleVisOnContext,beforeDrawing:this.handleVisBeforeDrawing,showPopup:this.handleVisShowPopup,stabilizationProgress:this.handleVisLoading,stabilizationIterationsDone:this.handleVisLoadingDone}};h.prototype=Object.create(e.prototype);h.prototype.handleConnectionEvent=function(e,t){var s={fromLabel:this.adapter.selectNodeById(e.from).label,toLabel:this.adapter.selectNodeById(e.to).label};var r="getEdgeType";this.dialogManager.open(r,s,function(s,r){if(s){var a=i.getText(r);var o=this.view.getConfig("edge_type_namespace");var d=i.hasSubString(a,":");a=new n((o&&!d?o:"")+a);if(!a.exists())a.save();e.type=a.id;var h=this.adapter.insertEdge(e);var l=this.view.getEdgeFilter("compiled");var p=this.adapter.getEdgeTypeWhiteList(l);if(!p[a.id]){var g={type:a.id,view:this.view.getLabel()};$tw.tmap.dialogManager.open("edgeNotVisible",g)}this.preventFitAfterRebuild=true}if(typeof t==="function"){t(s)}})};h.prototype.checkForFreshInstall=function(){var e=this.opt.ref.sysMeta;if(!i.getEntry(e,"showWelcomeMessage",true))return;i.setEntry(e,"showWelcomeMessage",false);var t={};var s="welcome";this.dialogManager.open(s,t,function(e,t){if(i.tiddlerExists("$:/plugins/felixhayashi/topstoryview")){i.setText("$:/view","top");i.setText("$:/config/Navigation/openLinkFromInsideRiver","above");i.setText("$:/config/Navigation/openLinkFromOutsideRiver","top");i.touch("$:/plugins/felixhayashi/topstoryview")}var s={view:this.opt.misc.defaultViewLabel};var r=this.adapter.insertNode({label:"Have fun with",x:0,y:0},s);var a=this.adapter.insertNode({label:"TiddlyMap!!",x:100,y:100},s);this.adapter.insertEdge({from:r.id,to:a.id})})};h.prototype.openStandardConfirmDialog=function(e,t){var i={message:t};this.dialogManager.open("getConfirmation",i,e)};h.prototype.logger=function(e,t){if(this.isDebug){var i=Array.prototype.slice.call(arguments,1);i.unshift("@"+this.objectId.toUpperCase());i.unshift(e);$tw.tmap.logger.apply(this,i)}};h.prototype.render=function(e,t){var s=document.createElement("div");e.insertBefore(s,t);this.parentDomNode=s;if(i.isPreviewed(this)){this.renderPreview(this.parentDomNode)}else{this.renderFullWidget(this.parentDomNode)}};h.prototype.renderPreview=function(e){$tw.utils.addClass(e,"tmap-graph-placeholder")};h.prototype.renderFullWidget=function(e){this.registerClassNames(e);this.addLoadingBar(e);this.sidebar=i.getFirstElementByClassName("tc-sidebar-scrollable");this.isContainedInSidebar=this.sidebar&&this.sidebar.contains(this.parentDomNode);this.viewHolderRef=this.getViewHolderRef();this.view=this.getView();this.doFitAfterStabilize=true;this.preventFitAfterRebuild=false;this.initAndRenderEditorBar(e);this.initAndRenderGraph(e);$tw.tmap.registry.push(this);this.reloadRefreshTriggers();this.checkForFreshInstall()};h.prototype.registerClassNames=function(e){var t=$tw.utils.addClass;t(e,"tmap-widget");if(this.clickToUse){t(e,"tmap-click-to-use")}if(this.getAttr("editor")==="advanced"){t(e,"tmap-advanced-editor")}if(!i.isTrue(this.getAttr("show-buttons"),true)){t(e,"tmap-no-buttons")}if(this.getAttr("class")){t(e,this.getAttr("class"))}};h.prototype.addLoadingBar=function(e){this.graphLoadingBarDomNode=document.createElement("div");$tw.utils.addClass(this.graphLoadingBarDomNode,"tmap-loading-bar");e.appendChild(this.graphLoadingBarDomNode)};h.prototype.initAndRenderEditorBar=function(e){this.graphBarDomNode=document.createElement("div");$tw.utils.addClass(this.graphBarDomNode,"tmap-topbar");e.appendChild(this.graphBarDomNode);this.rebuildEditorBar();this.renderChildren(this.graphBarDomNode)};h.prototype.rebuildEditorBar=function(){var e=this.view;var t={isViewBound:String(this.isViewBound()),viewRoot:e.getRoot(),viewLabel:e.getLabel(),viewHolder:this.getViewHolderRef(),edgeFilter:e.getPaths().edgeFilter,allEdgesFilter:this.opt.selector.allEdgeTypes,neighScopeBtnClass:"tmap-neigh-scope-button"+(e.isEnabled("neighbourhood_scope")?" "+"tmap-active-button":"")};for(var i in t){this.setVariable(i,t[i])}var s={type:"tiddler",attributes:{tiddler:{type:"string",value:e.getRoot()}},children:[]};if(this.editorMode==="advanced"){s.children.push({type:"transclude",attributes:{tiddler:{type:"string",value:this.opt.ref.graphBar}}})}else{s.children.push({type:"element",tag:"span",attributes:{"class":{type:"string",value:"tmap-view-label"}},children:[{type:"text",text:e.getLabel()}]})}s.children.push({type:"transclude",attributes:{tiddler:{type:"string",value:this.opt.ref.focusButton}}});this.makeChildWidgets([s])};h.prototype.refresh=function(e){if(this.isZombieWidget()||!this.network||i.isPreviewed(this))return;this.callbackManager.handleChanges(e);if(i.hasPropWithPrefix(e,this.opt.path.options)){this.reloadOptions()}if(i.hasPropWithPrefix(e,this.opt.path.nodeTypes)){this.rebuildGraph()}var t=this.checkForViewSwitch(e);var s=this.view.refresh(e);if(t||s.length&&!this.ignoreNextViewModification){var r={resetData:true,resetOptions:true,resetFocus:{delay:0,duration:0}};if(t){this.logger("warn","View switched");this.view=this.getView(true);this.reloadRefreshTriggers();this.visNetworkDomNode.focus()}else{this.logger("warn","View modified",s);r.resetData=false;if(this.preventFitAfterRebuild){r.resetFocus=false}}this.rebuildGraph(r)}else{this.checkOnGraph(e)}this.checkOnEditorBar(e,t,s);this.ignoreNextViewModification=false};h.prototype.reloadRefreshTriggers=function(){this.callbackManager.remove(this.refreshTriggers);var e=this.getAttr("refresh-triggers")||this.view.getConfig("refresh-triggers");this.refreshTriggers=$tw.utils.parseStringArray(e)||[];this.logger("debug","Registering refresh trigger",this.refreshTriggers);var t=this.handleTriggeredRefresh.bind(this);for(var i=this.refreshTriggers.length;i--;){this.callbackManager.add(this.refreshTriggers[i],t,false)}};h.prototype.rebuildGraph=function(e){if(i.isPreviewed(this))return;this.logger("debug","Rebuilding graph");e=e||{};this.hasNetworkStabilized=false;if(e.resetData){this.graphData.edges.clear();this.graphData.nodes.clear();this.graphData.edgesById=null;this.graphData.nodesById=null}if(e.resetOptions){this.reloadOptions()}if(!e.resetFocus){this.doFitAfterStabilize=false}this.rebuildGraphData(true);if(!i.hasElements(this.graphData.nodesById)){return}this.network.stabilize();if(e.resetFocus&&!this.preventFitAfterRebuild){this.doFitAfterStabilize=true;this.fitGraph(e.resetFocus.delay,e.resetFocus.duration)}this.preventFitAfterRebuild=false};h.prototype.getContainer=function(){return this.parentDomNode};h.prototype.reloadOptions=function(){this.network.setOptions({nodes:undefined,edges:undefined,interaction:undefined,layout:undefined,manipulation:undefined,physics:undefined});this.graphOptions=this.getGraphOptions();this.network.setOptions(this.graphOptions)};h.prototype.rebuildGraphData=function(e){$tw.tmap.start("Reloading Network");if(!e&&this.graphData){return this.graphData}var t=this.adapter.getGraph({view:this.view});var s=t.nodes;var r=t.edges;this.graphData.nodes=this.getRefreshedDataSet(s,this.graphData.nodesById,this.graphData.nodes);this.graphData.edges=this.getRefreshedDataSet(r,this.graphData.edgesById,this.graphData.edges);this.graphData.nodesById=s;this.graphData.edgesById=r;i.setField("$:/temp/tmap/nodes/"+this.view.getLabel(),"list",this.adapter.getTiddlersById(s));$tw.tmap.stop("Reloading Network");return this.graphData};h.prototype.isViewBound=function(){return i.startsWith(this.getViewHolderRef(),this.opt.path.localHolders)};h.prototype.checkForViewSwitch=function(e){if(this.isViewBound()){return false}if(e[this.getViewHolderRef()]){return true}return false};h.prototype.checkOnEditorBar=function(e,t,i){if(t||i.length){this.removeChildDomNodes();this.rebuildEditorBar();this.renderChildren(this.graphBarDomNode);return true}else{return this.refreshChildren(e)}};h.prototype.checkOnGraph=function(e){var t=this.view.getNodeFilter("compiled");var s=i.getMatches(t,Object.keys(e),true);for(var r in e){if(i.isSystemOrDraft(r))continue;var a=s[r];var n=this.graphData.nodesById[this.adapter.getId(r)];if(a||n){this.rebuildGraph();return}}var o=this.view.getEdgeFilter("compiled");var d=i.getMatches(o,Object.keys(e));if(d.length){this.logger("info","Changed edge-types",d);this.rebuildGraph();return}};h.prototype.initAndRenderGraph=function(e){this.logger("info","Initializing and rendering the graph");this.graphDomNode=document.createElement("div");e.appendChild(this.graphDomNode);$tw.utils.addClass(this.graphDomNode,"tmap-vis-graph");e.style["width"]=this.getAttr("width","100%");this.handleResizeEvent=this.handleResizeEvent.bind(this);this.handleClickEvent=this.handleClickEvent.bind(this);this.handleFullScreenChange=this.handleFullScreenChange.bind(this);window.addEventListener("resize",this.handleResizeEvent,false);if(!this.isContainedInSidebar){this.callbackManager.add("$:/state/sidebar",this.handleResizeEvent)}window.addEventListener("click",this.handleClickEvent,false);if(this.fsapi){window.addEventListener(this.fsapi["_fullscreenChange"],this.handleFullScreenChange,false)}this.handleResizeEvent();this.graphOptions=this.getGraphOptions();this.graphData={nodes:new d.DataSet,edges:new d.DataSet,nodesById:i.getDataMap(),edgesById:i.getDataMap()};this.network=new d.Network(this.graphDomNode,this.graphData,this.graphOptions);this.visNetworkDomNode=this.graphDomNode.firstElementChild;this.addGraphKeyBindings(this.graphDomNode);for(var t in this.visHandlers){this.network.on(t,this.visHandlers[t].bind(this))}this.addGraphButtons({"fullscreen-button":function(){this.handleToggleFullscreen(false)}});if(this.isContainedInSidebar){this.addGraphButtons({"halfscreen-button":function(){this.handleToggleFullscreen(true)}})}this.rebuildGraph({resetFocus:{delay:0,duration:0}})};h.prototype.addGraphKeyBindings=function(e){this.visNetworkDomNode.tabIndex=0;this.graphKeydownHandler=function(e){if(e.keyCode===46){this.handleRemoveElements(this.network.getSelection())}else if(e.ctrlKey){if(e.keyCode===88){if(this.editorMode){this.handleAddNodesToClipboard("move")}else{this.notify("Map is read only!")}}else if(e.keyCode===67){this.handleAddNodesToClipboard("copy")}else if(e.keyCode===86){this.handlePasteNodesFromClipboard()}e.preventDefault()}}.bind(this);e.addEventListener("keyup",this.graphKeydownHandler,true)};h.prototype.handlePasteNodesFromClipboard=function(){if(!this.editorMode){this.notify("Map is read only!");return}if($tw.tmap.clipBoard){if($tw.tmap.clipBoard.type==="nodes"){var e=$tw.tmap.clipBoard.nodes;var t=Object.keys(e);if(t.length){for(var i in e){if(this.graphData.nodesById[i])continue;this.view.addNodeToView(e[i]);this.graphData.nodes.update({id:i})}this.network.selectNodes(t);this.notify("pasted "+t.length+" nodes into map.")}return}}this.notify("TiddlyMap clipboad is empty!")};h.prototype.handleAddNodesToClipboard=function(e){var t=this.network.getSelectedNodes();if(!t.length)return;$tw.tmap.clipBoard={type:"nodes",nodes:this.graphData.nodes.get(t,{returnType:"Object"})};this.notify("Copied "+t.length+" nodes to clipboard");if(e==="move"){for(var i=t.length;i--;){this.view.removeNodeFromFilter(t[i])}}};h.prototype.isMobileMode=function(){var e=i.getText(this.opt.ref.sidebarBreakpoint,960);return window.innerWidth<=parseInt(e)};h.prototype.getGraphOptions=function(){var e=this.opt.config.vis;var t=i.parseJSON(this.view.getConfig("vis"));var s=i.merge({},e,t);s.clickToUse=this.clickToUse;s.manipulation.enabled=!!this.editorMode;s.manipulation.deleteNode=function(e,t){this.handleRemoveElements(e);this.resetVisManipulationBar(t)}.bind(this);s.manipulation.deleteEdge=function(e,t){this.handleRemoveElements(e);this.resetVisManipulationBar(t)}.bind(this);s.manipulation.addEdge=function(e,t){this.handleConnectionEvent(e);this.resetVisManipulationBar(t)}.bind(this);s.manipulation.addNode=function(e,t){this.handleInsertNode(e);this.resetVisManipulationBar(t)}.bind(this);s.manipulation.editEdge=function(e,t){this.handleReconnectEdge(e);this.resetVisManipulationBar(t)}.bind(this);s.manipulation.editNode=function(e,t){this.handleEditNode(e);this.resetVisManipulationBar(t)}.bind(this);var r=this.view.isEnabled("physics_mode")?.001:0;var a=s.physics;a[a.solver]=a[a.solver]||{};a[a.solver].centralGravity=r;a.stabilization.iterations=this.view.getStabilizationIterations();this.logger("debug","Loaded graph options",s);return s};h.prototype.resetVisManipulationBar=function(e){if(e)e(null);this.network.disableEditMode();this.network.enableEditMode()};h.prototype.handleCreateView=function(){var e={view:this.view.getLabel()};this.dialogManager.open("createView",e,function(e,t){if(!e)return;var s=i.getText(t);var r=new a(s);if(r.exists()&&r.isLocked()){this.notify("Forbidden!");return}if(t&&t.fields.clone){r=new a(s,true,this.view)}else{r=new a(s,true)}this.setView(r)})};h.prototype.handleRenameView=function(){if(!this.view.isLocked()){var e=this.view.getReferences();var t={count:e.length.toString(),filter:i.joinAndWrap(e,"[[","]]")};this.dialogManager.open("getViewName",t,function(e,t){if(e){var s=i.getText(t);var r=new a(s);if(!s||r.isLocked()){this.notify("Forbidden!")}else{this.view.rename(s);this.setView(this.view)}}})}else{this.notify("Forbidden!")}};h.prototype.handleEditView=function(){var e=JSON.stringify(this.opt.config.vis);var t={view:this.view.getLabel(),createdOn:this.view.getCreationDate(true),numberOfNodes:""+Object.keys(this.graphData.nodesById).length,numberOfEdges:""+Object.keys(this.graphData.edgesById).length,dialog:{preselects:$tw.utils.extend({},this.view.getConfig(),{"vis-inherited":e})}};this.dialogManager.open("configureView",t,function(e,t){if(!e)return;var s=i.getPropertiesByPrefix(t.fields,"config.",true);this.view.setConfig(s);if(s["physics_mode"]&&!this.view.isEnabled("physics_mode")){this.handleStorePositions()}})};h.prototype.handleDownloadCanvas=function(){var e=this.parentDomNode.getElementsByTagName("canvas")[0];var t=e.toDataURL("image/png");var i=document.createElement("a");i.download="Map snapshot – "+this.view.getLabel()+".png";i.href=t;var s=new MouseEvent("click");i.dispatchEvent(s)};h.prototype.handleDeleteView=function(){var e=this.view.getLabel();if(this.view.isLocked()){this.notify("Forbidden!");return}var t=this.view.getReferences();if(t.length){var s={count:t.length.toString(),filter:i.joinAndWrap(t,"[[","]]")};this.dialogManager.open("cannotDeleteViewDialog",s);return}var r="You are about to delete the view "+"''"+e+"'' (no tiddler currently references this view).";this.openStandardConfirmDialog(function(t){if(t){this.view.destroy();this.setView(this.opt.misc.defaultViewLabel);this.logger("debug",'view "'+e+'" deleted ');this.notify('view "'+e+'" deleted ')}},r)};h.prototype.handleTriggeredRefresh=function(e){this.logger("log",e,"Triggered a refresh");this.rebuildGraph({resetData:false,resetOptions:false,resetFocus:{delay:1e3,duration:1e3}})};h.prototype.handleConfigureSystem=function(){var e={dialog:{preselects:{"vis-inherited":JSON.stringify(t),"config.vis":i.getText(this.opt.ref.visUserConf),"config.sys":this.opt.config.sys}}};var s="configureTiddlyMap";this.dialogManager.open(s,e,function(e,t){if(e&&t){var s=i.getPropertiesByPrefix(t.fields,"config.sys.",true);this.wiki.setTiddlerData(this.opt.ref.sysUserConf,s);i.setField(this.opt.ref.visUserConf,"text",t.fields["config.vis"])}})};h.prototype.handleReconnectEdge=function(e){var t=this.graphData.edges.get(e.id);this.adapter.deleteEdge(t);var i=$tw.utils.extend(t,e);this.preventFitAfterRebuild=true;return this.adapter.insertEdge(i)};h.prototype.handleRemoveElements=function(e){if(e.nodes.length){this.handleRemoveNodes(e.nodes)}else if(e.edges.length){this.handleRemoveEdges(e.edges)}this.resetVisManipulationBar()};h.prototype.handleRemoveEdges=function(e){this.adapter.deleteEdges(this.graphData.edges.get(e));this.notify("edge"+(e.length>1?"s":"")+" removed");this.preventFitAfterRebuild=true};h.prototype.handleRemoveNodes=function(e){var t=this.adapter.getTiddlersById(e);var i={count:""+e.length,tiddlers:$tw.utils.stringifyList(t),dialog:{preselects:{"delete-from":"filter"}}};var s="deleteNodeDialog";this.dialogManager.open(s,i,function(t,i){if(!t)return;if(i.fields["delete-from"]==="system"){this.adapter.deleteNodes(e);var s=e.length}else{var s=0;for(var r=e.length;r--;){var a=this.view.removeNodeFromFilter(e[r]);if(a)s++}}this.preventFitAfterRebuild=true;this.notify("Removed "+s+" of "+e.length+" from "+i.fields["delete-from"])})};h.prototype.handleFullScreenChange=function(){if(this.fsapi&&this.enlargedMode==="fullscreen"&&!document[this.fsapi["_fullscreenElement"]]){this.handleToggleFullscreen()}};h.prototype.handleToggleFullscreen=function(e){this.logger("log","Toggled graph enlargement");if(this.enlargedMode){this.network.setOptions({clickToUse:this.clickToUse});i.findAndRemoveClassNames(["tmap-"+this.enlargedMode,"tmap-has-"+this.enlargedMode+"-child"]);if(this.enlargedMode==="fullscreen"){document[this.fsapi["_exitFullscreen"]]()}this.enlargedMode=null}else{if(!e&&!this.fsapi){this.dialogManager.open("fullscreenNotSupported");return}this.enlargedMode=this.isContainedInSidebar&&e?"halfscreen":"fullscreen";$tw.utils.addClass(this.parentDomNode,"tmap-"+this.enlargedMode);var t=this.isContainedInSidebar?this.sidebar:i.getFirstElementByClassName("tc-story-river");$tw.utils.addClass(t,"tmap-has-"+this.enlargedMode+"-child");if(this.enlargedMode==="fullscreen"){document.documentElement[this.fsapi["_requestFullscreen"]](Element.ALLOW_KEYBOARD_INPUT)}this.notify("Activated "+this.enlargedMode+" mode");this.network.setOptions({clickToUse:false})}this.handleResizeEvent()};h.prototype.handleGenerateWidget=function(e){$tw.rootWidget.dispatchEvent({type:"tmap:tm-generate-widget",paramObject:{view:this.view.getLabel()}})};h.prototype.handleStorePositions=function(e){this.view.saveNodeData(this.network.getPositions());if(e){this.notify("positions stored")}};h.prototype.handleEditFilters=function(){var e=i.getPrettyFilter(this.view.getNodeFilter("expression"));var t=i.getPrettyFilter(this.view.getEdgeFilter("expression"));var s={view:this.view.getLabel(),dialog:{preselects:{prettyNodeFilter:e,prettyEdgeFilter:t}}};this.dialogManager.open("editFilters",s,function(e,t){if(!e)return;this.view.setNodeFilter(i.getField(t,"prettyNodeFilter",""));this.view.setEdgeFilter(i.getField(t,"prettyEdgeFilter",""))})};h.prototype.handleVisStabilizedEvent=function(e){if(!this.hasNetworkStabilized){this.hasNetworkStabilized=true;this.logger("log","Network stabilized after "+e.iterations+" iterations");this.view.setStabilizationIterations(e.iterations);var t=this.view.isEnabled("physics_mode");this.network.storePositions();this.setNodesMoveable(this.graphData.nodesById,t);if(this.doFitAfterStabilize){this.doFitAfterStabilize=false;this.fitGraph(1e3,1e3)}}};h.prototype.handleFocusNode=function(e){this.network.focus(this.adapter.getId(e.param),{scale:1.5,animation:true})};h.prototype.isZombieWidget=function(){return!document.body.contains(this.getContainer())};h.prototype.fitGraph=function(e,t){window.clearTimeout(this.activeFitTimeout);var i=function(){if(this.isZombieWidget())return;this.network.redraw();this.network.fit({animation:{duration:t||0,easingFunction:"easeOutQuart"}})};this.activeFitTimeout=window.setTimeout(i.bind(this),e||0)};h.prototype.handleInsertNode=function(e){var t="getNodeTitle";this.dialogManager.open(t,null,function(t,s){if(!t)return;var r=i.getText(s);if(i.tiddlerExists(r)){if(i.isMatch(r,this.view.getNodeFilter("compiled"))){this.notify("Node already exists");return}else{e=this.adapter.makeNode(r,e);this.view.addNodeToView(e)}}else{e.label=r;this.adapter.insertNode(e,{view:this.view,editNodeOnCreate:false})}this.preventFitAfterRebuild=true})};h.prototype.handleEditNode=function(e){var t=$tw.tmap.indeces.tById[e.id];var s=i.getTiddler(t);var r=JSON.stringify(this.opt.config.vis);var a=this.view.getConfig("vis");var n=this.adapter.getInheritedNodeStyles([e.id]);var o=JSON.stringify(n[t]);var d=JSON.stringify(i.merge({},{color:s.fields["color"]},i.parseJSON(s.fields["tmap.style"])));var h=this.view.getLabel();var l={id:e.id};var p=this.view.getNodeData(e.id,true)||{};delete p.x;delete p.y;var g={view:h,tiddler:s.fields.title,tidColor:s.fields["color"],tidIcon:s.fields[this.opt.field.nodeIcon]||s.fields["tmap.fa-icon"],dialog:{preselects:{"inherited-global-default-style":r,"inherited-local-default-style":a,"inherited-group-styles":o,"global-node-style":d,"local-node-style":JSON.stringify(p)}}};this.dialogManager.open("editNode",g,function(s,r){if(!s)return;var a=r.fields["global-node-style"];i.setField(t,"tmap.style",a||null);var n=i.parseJSON(r.fields["local-node-style"]);this.view.saveNodeStyle(e.id,n);this.preventFitAfterRebuild=true})};h.prototype.handleVisSingleClickEvent=function(e){if(i.isTrue(this.opt.config.sys.singleClickMode)){this.handleVisClickEvent(e)}};h.prototype.handleVisDoubleClickEvent=function(e){if(!e.nodes.length&&!e.edges.length){if(this.editorMode){this.handleInsertNode(e.pointer.canvas)}}else if(!i.isTrue(this.opt.config.sys.singleClickMode)){this.handleVisClickEvent(e)}};h.prototype.handleVisClickEvent=function(e){if(e.nodes.length){this.openTiddlerWithId(e.nodes[0])}else if(e.edges.length){if(!this.editorMode)return;this.logger("debug","Clicked on an Edge");var t=this.opt.config.sys.edgeClickBehaviour;var i=new n(this.graphData.edgesById[e.edges[0]].type);if(t==="manager"){$tw.rootWidget.dispatchEvent({type:"tmap:tm-manage-edge-types",paramObject:{type:i.id}})}}};h.prototype.handleResizeEvent=function(e){if(this.isZombieWidget())return;var t=this.getAttr("height");if(!t&&this.isContainedInSidebar){var i=this.parentDomNode.getBoundingClientRect().top;var s=parseInt(this.getAttr("bottom-spacing",25));var r=window.innerHeight-i;t=r-s+"px"}this.parentDomNode.style["height"]=t||"300px";this.repaintGraph()};h.prototype.handleClickEvent=function(e){if(this.isZombieWidget()||!this.network)return;var t={x:e.clientX,y:e.clientY};var i=document.elementFromPoint(t.x,t.y);if(!this.parentDomNode.contains(i)){var s=this.network.getSelection();if(s.nodes.length||s.edges.length){this.logger("debug","Clicked outside; deselecting nodes/edges");this.network.selectNodes([]);this.resetVisManipulationBar()}}else if(this.graphDomNode.contains(i)){this.lastCanvasClickPos=this.network.DOMtoCanvas(t);this.visNetworkDomNode.focus()}};h.prototype.handleVisOnContext=function(e){};h.prototype.handleVisSelectNode=function(e){var t=this.graphOptions.nodes.color;var s=e.nodes;for(var r=s.length;r--;){var a=s[r];var n=this.graphData.nodesById[a];this.graphData.nodes.update({id:a,color:{highlight:i.merge({},this.graphOptions.nodes.color,n.color)}})}};h.prototype.handleVisDeselectNode=function(e){};h.prototype.handleVisShowPopup=function(e){};h.prototype.handleVisDragEnd=function(e){if(e.nodes.length){if(!this.view.isEnabled("physics_mode")){this.setNodesMoveable(this.graphData.nodes.get(e.nodes),false);this.handleStorePositions();this.ignoreNextViewModification=true}}};h.prototype.handleVisBeforeDrawing=function(e){};h.prototype.handleVisLoading=function(e){this.graphLoadingBarDomNode.style.display="block";var t="Loading "+e.iterations/e.total*100+"%";this.graphLoadingBarDomNode.innerHTML=t};h.prototype.handleVisLoadingDone=function(e){this.graphLoadingBarDomNode.style.display="none"};h.prototype.handleVisDragStart=function(e){if(e.nodes.length){this.setNodesMoveable(this.graphData.nodes.get(e.nodes),true)}};h.prototype.destruct=function(){window.removeEventListener("resize",this.handleResizeEvent);window.removeEventListener("click",this.handleClickEvent);window.removeEventListener("click",this.handleFullScreenChange);this.graphDomNode.removeEventListener("keyup",this.graphKeydownHandler,true);if(this.network){this.network.destroy()}};h.prototype.openTiddlerWithId=function(e){var t=$tw.tmap.indeces.tById[e];this.logger("debug","Opening tiddler",t,"with id",e);if(this.enlargedMode==="fullscreen"){var i=this.wiki.findDraft(t);var s=!!i;if(!s){var r="tm-edit-tiddler";this.dispatchEvent({type:r,tiddlerTitle:t});i=this.wiki.findDraft(t)}var a={draftTRef:i};var n="fullscreenTiddlerEditor";this.dialogManager.open(n,a,function(e,r){if(e){var a="tm-save-tiddler";this.dispatchEvent({type:a,tiddlerTitle:i})}else if(!s){$tw.wiki.deleteTiddler(i)}var a="tm-close-tiddler";this.dispatchEvent({type:a,tiddlerTitle:t})})}else{this.dispatchEvent({type:"tm-navigate",navigateTo:t})}};h.prototype.getViewHolderRef=function(){if(this.viewHolderRef){return this.viewHolderRef}this.logger("info","Retrieving or generating the view holder reference");var e=this.getAttr("view");if(e){this.logger("log",'User wants to bind view "'+e+'" to graph');var t=this.opt.path.views+"/"+e;if(this.wiki.getTiddler(t)){var s=this.opt.path.localHolders+"/"+i.genUUID();this.logger("log",'Created an independent temporary view holder "'+s+'"');this.wiki.addTiddler(new $tw.Tiddler({title:s,text:t}));this.logger("log",'View "'+t+'" inserted into independend holder')}else{this.logger("log",'View "'+e+'" does not exist')}}if(typeof s==="undefined"){this.logger("log","Using default (global) view holder");var s=this.opt.ref.defaultViewHolder}return s};h.prototype.setView=function(e,t){if(e){var i=new a(e).getLabel();t=t||this.viewHolderRef;this.logger("info","Inserting view '"+i+"' into holder '"+t+"'");this.wiki.addTiddler(new $tw.Tiddler({title:t,text:i}))}this.view=this.getView(true)};h.prototype.getView=function(e){if(!e&&this.view){return this.view}var t=this.getViewHolderRef();var s=new a(i.getText(t));this.logger("info",'Retrieved view "'+s.getLabel()+'" from holder "'+t+'"');if(s.exists()){return s}else{this.logger("log",'Warning: View "'+s.getLabel()+"\" doesn't exist. Default is used instead.");return new a("Default")}};h.prototype.getRefreshedDataSet=function(e,t,s){if(!s){return new d.DataSet(i.getValues(e))}if(t)s.remove(Object.keys(t));s.update(i.getValues(e));return s};h.prototype.repaintGraph=function(){if(this.network&&(!this.fsapi||!document[this.fsapi["_fullscreenElement"]]||this.enlargedMode)){this.logger("info","Repainting the whole graph");this.network.redraw();this.fitGraph(0,1e3)}};h.prototype.setGraphButtonEnabled=function(e,t){var s="vis-button"+" "+"tmap-"+e;var r=i.getFirstElementByClassName(s,this.parentDomNode);$tw.utils.toggleClass(r,"tmap-button-enabled",t)};h.prototype.dialogPostProcessor=function(){this.network.selectNodes([]);this.resetVisManipulationBar()};h.prototype.setNodesMoveable=function(e,t){this.network.storePositions();var i=[];var s=Object.keys(e);for(var r=s.length;r--;){var a=e[s[r]].id;var n={id:a,fixed:{x:!t,y:!t}};i.push(n)}this.graphData.nodes.update(i)};h.prototype.addGraphButtons=function(e){var t=i.getFirstElementByClassName("vis-navigation",this.parentDomNode);for(var s in e){var r=document.createElement("div");r.className="vis-button "+" "+"tmap-"+s;r.addEventListener("click",e[s].bind(this),false);t.appendChild(r);this.setGraphButtonEnabled(s,true)}};if($tw.boot.tasks.trapErrors){var l=window.onerror;window.onerror=function(e,t,i){if(e.indexOf("NS_ERROR_NOT_AVAILABLE")!==-1&&t=="$:/plugins/felixhayashi/vis/vis.js"){console.error("Strange firefox related vis.js error (see #125)",arguments)}else if(e.indexOf("Permission denied to access property")!==-1){console.error("Strange firefox related vis.js error (see #163)",arguments)}else if(l){l.apply(this,arguments)}}}exports.tiddlymap=h})();
/*\

title: $:/plugins/felixhayashi/tiddlymap/js/widget/MapConfigWidget
type: application/javascript
module-type: widget

@module TiddlyMap
@preserve

\*/
(function(){"use strict";var e=require("$:/core/modules/widgets/widget.js").widget;var t=require("$:/plugins/felixhayashi/tiddlymap/js/ViewAbstraction").ViewAbstraction;var i=require("$:/plugins/felixhayashi/vis/vis.js");var s=require("$:/plugins/felixhayashi/tiddlymap/js/utils").utils;var r=function(t,i){e.call(this);this.initialise(t,i);this.adapter=$tw.tmap.adapter;this.opt=$tw.tmap.opt;this.notify=$tw.tmap.notify;this.computeAttributes();s.addListeners({"tmap:tm-clear-config":function(){alert("nice")}},this,this)};r.prototype=Object.create(e.prototype);r.prototype.render=function(e,t){if(!this.parentDomNode){this.parentDomNode=e;this.wrapper=document.createElement("div");$tw.utils.addClass(this.wrapper,"tmap-config-widget");e.appendChild(this.wrapper)}if(this.network){var r=this.parentDomNode.getBoundingClientRect().height;this.parentDomNode.style["height"]=r+"px";this.network.destroy()}var n=document.createElement("div");this.wrapper.appendChild(n);this.refreshTrigger=this.getAttribute("refresh-trigger");this.pipeTRef=this.getVariable("currentTiddler");this.inheritedFields=$tw.utils.parseStringArray(this.getAttribute("inherited"));this.extensionTField=this.getAttribute("extension");this.mode=this.getAttribute("mode");for(var o=0;o<this.inheritedFields.length;o++){var a=this.inheritedFields[o];var h=s.parseFieldData(this.pipeTRef,a,{});if(this.mode==="manage-edge-types"){if(!h.edges){h={edges:h}}}else if(this.mode==="manage-node-types"){if(!h.nodes){h={nodes:h}}}this.inherited=s.merge(this.inherited,h)}this.extension=s.parseFieldData(this.pipeTRef,this.extensionTField,{});if(this.mode==="manage-edge-types"){if(!this.extension.edges){this.extension={edges:this.extension}}}else if(this.mode==="manage-node-types"){if(!this.extension.nodes){this.extension={nodes:this.extension}}}this.changes=s.isTrue(this.getAttribute("save-only-changes"))?{}:this.extension;var d={nodes:new i.DataSet([]),edges:new i.DataSet([])};this.network=new i.Network(n,d,{});this.reloadVisOptions();this.network.on("configChange",this.handleConfigChange.bind(this));$tw.tmap.registry.push(this)};r.prototype.reloadVisOptions=function(){var e=s.merge({},this.inherited,this.extension);$tw.utils.extend(e,{configure:{enabled:true,showButton:false,filter:this.getOptionFilter(this.mode)}});this.network.setOptions(e)};r.prototype.handleConfigChange=function(e){this.changes=s.merge(this.changes,e);var t=s.merge({},this.changes);if(this.mode==="manage-node-types"){t=t["nodes"]}if(this.mode==="manage-edge-types"){t=t["edges"]}s.writeFieldData(this.pipeTRef,this.extensionTField,t)};r.prototype.getOptionFilter=function(e){var t={nodes:{borderWidth:true,borderWidthSelected:true,color:{background:true,border:true},font:{color:true,size:true},icon:true,labelHighlightBold:false,shadow:true,shape:true,shapeProperties:{borderDashes:true},size:true},edges:{arrows:true,color:true,dashes:true,font:true,labelHighlightBold:false,length:true,selfReferenceSize:false,shadow:true,smooth:true,width:true},interaction:{hideEdgesOnDrag:true,hideNodesOnDrag:true,tooltipDelay:true},layout:{hierarchical:false},manipulation:{initiallyActive:true},physics:{forceAtlas2Based:{gravitationalConstant:true,springLength:true,springConstant:true,damping:true}}};if(e==="manage-edge-types"){t={edges:t.edges}}else if(e==="manage-node-types"){t={nodes:t.nodes}}return function(e,i){i=i.concat([e]);var s=t;for(var r=0,n=i.length;r<n;r++){if(s[i[r]]===true){return true}else if(s[i[r]]==null){return false}s=s[i[r]]}return false}};r.prototype.isZombieWidget=function(){return!document.body.contains(this.parentDomNode)};r.prototype.destruct=function(){if(this.network){this.network.destroy()}};r.prototype.refresh=function(e){if(this.isZombieWidget()||!this.network)return;if(e[this.refreshTrigger]){this.refreshSelf();return true}};r.prototype.setNull=function(e){for(var t in e){if(typeof e[t]=="object"){this.setNull(e[t])}else{e[t]=undefined}}};exports["tmap-config"]=r})();
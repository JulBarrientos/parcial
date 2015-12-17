/*------------------------------------------------------------------------
	- ezEditTable v1.4.1
	- By Max Guglielmi (edittable.free.fr)
	- Licensed under the MIT License
--------------------------------------------------------------------------
Copyright (c) 2011 Max Guglielmi

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
------------------------------------------------------------------------*/

function setEditTable(id){
/*========================================================================
	- Calls EditTable Constructor
	- Params:
		- id: table id (string)
		- startRow (optional): start row index (number)
		- config (optional): configuration object (literal object)
	- Returns EditTable object
========================================================================*/
	if(arguments.length==0) return;
	eval('et_'+id+' = new EditTable(arguments[0],arguments[1],arguments[2]);' +
		 'et_'+id+'.Init();');
	return window['et_'+id];
}

var EditTable = function(id){
/*========================================================================
	- EditTable object constructor
	- Params:
		- id: table id (string)
		- startRow (optional): start row index (number)
		- config (optional): configuration object (literal object)
========================================================================*/
	if(arguments.length==0) return;
	this.id = id;
	this.version = '1.4';
	this.table = this.Get(id);
	this.tBody = this.table.tBodies[0];
	this.startRow = 0;
	this.config = null;
	this.nbCells = null;
	if(!window['eg_activeGrid']) window['eg_activeGrid'] = ''; //global var for active grid in page

	if(this.table == null || this.table.nodeName.LCase() != 'table') return;
	var tBodyRows = this.Tag(this.tBody, 'tr');
	if(tBodyRows.length > 0) this.startRow = tBodyRows[0].rowIndex;

	if(arguments.length>1){
		for(var i=0; i<arguments.length; i++){
			var argtype = typeof arguments[i];
			if(argtype.LCase() == 'number') this.startRow = arguments[i];
			if(argtype.LCase() == 'object') this.config = arguments[i];
		}
	}

	//cols nb
	this.nbCells = this.GetCellsNb(this.startRow);

	/********************************************
	* 		Configuration object 				*
	*********************************************/
	var f = this.config || {};
	/*** Common properties ***/
	this.selection = f.selection==false ? false : true; //enables/disables selection model
	this.keyNav = f.key_navigation!=undefined ? f.key_navigation : true; //enables/disables keyboard navigation
	this.editable = f.editable!=undefined ? f.editable : false; //enables/disables cell edition model
	this.tableCss = f.table_css!=undefined ? f.table_css : 'ezEditableTable'; //default css class applied to html table
	this.unselectableCss = f.unselectable_css!=undefined ? f.unselectable_css : 'ezUnselectable'; //default css class applied to html table to make text unselectable
	this.basePath = f.base_path!=undefined ? f.base_path : 'ezEditTable/'; //default script base path
	this.activityIndicatorCss = f.activity_indicator_css!=undefined ? f.activity_indicator_css : 'ezOpacity'; //server activity indicator default css class
	this.onServerActivityStart = this.IsFn(f.on_server_activity_start) ? f.on_server_activity_start : null; //function called on server-side operations start
	this.onServerActivityStop = this.IsFn(f.on_server_activity_stop) ? f.on_server_activity_stop : null; //function called when server-side operation completed

	//Selection properties
	this.selectionModel = f.selection_model!=undefined ? f.selection_model.LCase() : 'single'; //selection model: multiple or single
	this.defaultSelection = f.default_selection!=undefined ? f.default_selection.LCase() : 'row'; //default selection: row, cell, both
	this.keySelection = this.editable ? true : f.key_selection!=undefined  ? f.key_selection : true; //multiple selection: select muliple rows by holding Ctrl key down
	this.selectRowAtStart = f.select_row_at_start!=undefined ? f.select_row_at_start : false; //select a row at start
	this.rowIndexAtStart = f.row_index_at_start!=undefined ? parseInt(f.row_index_at_start) : this.startRow; //select row at start
	this.scrollIntoView = f.scroll_into_view!=undefined ? f.scroll_into_view : false; //scrolls the element into view with key navigation
	if(f.active_row_css!=undefined){
		$('#planillapres tbody').find('.ezActiveRow').each(function(){
			$(this).removeClass('ezActiveRow');
		});
		this.activeRowCss = f.active_row_css;			
	}
	else{		
		$('#planillapres tbody').find('.ezActiveRow').each(function(){
			$(this).removeClass('ezActiveRow');
		});
		this.activeRowCss =  'ezActiveRow'; //default css class applied to active row
	}
	
	if(f.selected_row_css!=undefined){
		$('#planillapres tbody').find('.ezActiveRow').each(function(){
			$(this).removeClass('ezActiveRow');
		});
		this.selectedRowCss = f.selected_row_css;	
	}
	else{
		$('#planillapres tbody').find('.ezActiveRow').each(function(){
			$(this).removeClass('ezActiveRow');
		});
		this.selectedRowCss =  'ezSelectedRow'; //default css class applied to active row
		
	}	
	//this.activeRowCss = f.active_row_css!=undefined ? f.active_row_css : 'ezActiveRow'; //default css class applied to active row
	//this.selectedRowCss = f.selected_row_css!=undefined ? f.selected_row_css : 'ezSelectedRow'; //default css class applied to selected row (multiple selection)
	this.activeCellCss = f.active_cell_css!=undefined ? f.active_cell_css : 'ezActiveCell'; //default css class applied to selected row
	this.nbRowsPerPage = f.nb_rows_per_page!=undefined ? f.nb_rows_per_page : 10; //nb of rows when pageup/pagedown is pressed 

	//Selection call-backs
	this.onSelectionInit = this.IsFn(f.on_selection_initialized) ? f.on_selection_initialized : null; //selection object initialized callback
	this.onBeforeSelectedRow = this.IsFn(f.on_before_selected_row) ? f.on_before_selected_row : null; //call-back invoked before a row is selected
	this.onAfterSelectedRow = this.IsFn(f.on_after_selected_row) ? f.on_after_selected_row : null; //call-back invoked after a row is selected
	this.onBeforeSelectedCell = this.IsFn(f.on_before_selected_cell) ? f.on_before_selected_cell : null; //call-back invoked before a row is selected
	this.onAfterSelectedCell = this.IsFn(f.on_after_selected_cell) ? f.on_after_selected_cell : null; //call-back invoked after a cell is selected
	this.onBeforeDeselectedRow = this.IsFn(f.on_before_deselected_row) ? f.on_before_deselected_row : null; //call-back invoked before a row is deselected
	this.onAfterDeselectedRow = this.IsFn(f.on_after_deselected_row) ? f.on_after_deselected_row : null; //call-back invoked after a row is deselected
	this.onBeforeDeselectedCell = this.IsFn(f.on_before_deselected_cell) ? f.on_before_deselected_cell : null; //call-back invoked before a cell is deselected
	this.onAfterDeselectedCell = this.IsFn(f.on_after_deselected_cell) ? f.on_after_deselected_cell : null; //call-back invoked after a cell is deselected
	this.onValidateRow = this.IsFn(f.on_validate_row) ? f.on_validate_row : null; //call-back invoked after a row is double-clicked or enter key pressed
	this.onValidateCell = this.IsFn(f.on_validate_cell) ? f.on_validate_cell : null; //call-back invoked after a cell is double-clicked or enter key pressed

	//Editable properties
	this.editorModel = f.editor_model!=undefined ? f.editor_model.LCase() : 'cell'; //cell, row (template later)
	this.openEditorAction = f.open_editor_action!=undefined ? f.open_editor_action.LCase() : 'dblclick'; //editor is shown on a dblclick or click

	//Cells editor properties
	this.edtTypes = { none:'none', input:'input', textarea:'textarea', select:'select', multiple:'multiple', boolean:'boolean', command:'command', custom:'custom' };
	this.editors = [];
	this.cellEditors = this.IsArray(f.cell_editors) ? f.cell_editors : []; //editors configuration objects
	this.editorTypes = [], this.editorCss = [], this.editorStyles = [], this.editorAttributes = [], this.customEditor = [];
	this.editorCustomSlcOptions = [], this.editorSortSlcOptions = [], this.editorValuesSeparator = [], this.editorAllowEmptyValue = [];
	this.editorCmdColIndex, this.editorCmdBtns = {};
	for(var i=0; i<this.nbCells; i++){
		var editor = this.cellEditors[i];
		if(!editor) continue;
		this.editorTypes[i] = editor['type'], this.editorCss[i] = editor['css'];
		this.editorAttributes[i] = editor['attributes'], this.editorStyles[i] = editor['style'];
		this.editorCustomSlcOptions[i] = editor['custom_slc_options'], this.editorSortSlcOptions[i] = editor['sort_slc_options'];
		this.editorValuesSeparator[i] = editor['values_separator'], this.customEditor[i] = editor['target'], this.editorAllowEmptyValue[i] = editor['allow_empty_value'];
		if(this.editorTypes[i] == this.edtTypes.command){
			this.editorCmdColIndex = editor['command_column_index']!=undefined ? parseInt(editor['command_column_index']) : (this.nbCells-1) ;
			this.editorCmdBtns = editor['buttons'] || {};
		}
	}
	if(this.editorTypes.indexOf(this.edtTypes.command) != -1) this.editorModel = 'row';
	this.inputEditorCss = f.input_editor_css!=undefined ? f.input_editor_css : 'ezInputEditor'; //default css class applied to input editor
	this.textareaEditorCss = f.textarea_editor_css!=undefined ? f.textarea_editor_css : 'ezTextareaEditor'; //default css class applied to textarea editor
	this.selectEditorCss = f.select_editor_css!=undefined ? f.select_editor_css : 'ezSelectEditor'; //default css class applied to select editor
	this.commandEditorCss = f.command_editor_css!=undefined ? f.command_editor_css : 'ezCommandEditor'; //default css class applied to command editor
	this.modifiedCellCss = f.modified_cell_css!=undefined ? f.modified_cell_css : 'ezModifiedCell'; //default css class applied to modified cell

	//Command type editor config
	this.cmdEnabledBtns = this.editorCmdBtns.hasProp('enable') ? this.editorCmdBtns.enable : ['update', 'insert', 'delete', 'submit', 'cancel']; //command buttons to be enabled 
	this.cmdUpdateBtn = this.editorCmdBtns.hasProp('update') ? this.editorCmdBtns.update : {}; //update command button
	this.cmdInsertBtn = this.editorCmdBtns.hasProp('insert') ? this.editorCmdBtns.insert : {}; //insert command button
	this.cmdDeleteBtn = this.editorCmdBtns.hasProp('delete') ? this.editorCmdBtns['delete'] : {}; //delete command button
	this.cmdSubmitBtn = this.editorCmdBtns.hasProp('submit') ? this.editorCmdBtns['submit'] : {}; //submit command button
	this.cmdCancelBtn = this.editorCmdBtns.hasProp('cancel') ? this.editorCmdBtns.cancel : {}; //cancel command button

	this.cmdUpdateBtnText = this.cmdUpdateBtn.hasProp('text') ? this.cmdUpdateBtn.text : ''; //Default text is empty because icon is set by default
	this.cmdInsertBtnText = this.cmdInsertBtn.hasProp('text') ? this.cmdInsertBtn.text : ''; //Default text is empty because icon is set by default
	this.cmdDeleteBtnText = this.cmdDeleteBtn.hasProp('text') ? this.cmdDeleteBtn.text : ''; //Default text is empty because icon is set by default
	this.cmdSubmitBtnText = this.cmdSubmitBtn.hasProp('text') ? this.cmdSubmitBtn.text : 'Submit';
	this.cmdCancelBtnText = this.cmdCancelBtn.hasProp('text') ? this.cmdCancelBtn.text : 'Cancel';

	this.cmdUpdateBtnTitle = this.cmdUpdateBtn.hasProp('title') ? this.cmdUpdateBtn.title : 'Edit record';
	this.cmdInsertBtnTitle = this.cmdInsertBtn.hasProp('title') ? this.cmdInsertBtn.title : 'Create record';
	this.cmdDeleteBtnTitle = this.cmdDeleteBtn.hasProp('title') ? this.cmdDeleteBtn.title : 'Delete record';
	this.cmdSubmitBtnTitle = this.cmdSubmitBtn.hasProp('title') ? this.cmdSubmitBtn.title : 'Submit record';
	this.cmdCancelBtnTitle = this.cmdCancelBtn.hasProp('title') ? this.cmdCancelBtn.title : 'Cancel';

	this.cmdUpdateBtnIcon = this.cmdUpdateBtn.hasProp('icon') ? this.cmdUpdateBtn.icon : '<img src="'+this.basePath+'themes/icn_edit.gif" alt="" />';
	this.cmdInsertBtnIcon = this.cmdInsertBtn.hasProp('icon') ? this.cmdInsertBtn.icon : '<img src="'+this.basePath+'themes/icn_add.gif" alt="" />';
	this.cmdDeleteBtnIcon = this.cmdDeleteBtn.hasProp('icon') ? this.cmdDeleteBtn.icon : '<img src="'+this.basePath+'themes/icn_del.gif" alt="" />';
	this.cmdSubmitBtnIcon = this.cmdSubmitBtn.hasProp('icon') ? this.cmdSubmitBtn.icon : '';
	this.cmdCancelBtnIcon = this.cmdCancelBtn.hasProp('icon') ? this.cmdCancelBtn.icon : '';

	this.cmdUpdateBtnCss = this.cmdUpdateBtn.hasProp('css') ? this.cmdUpdateBtn.css : null;
	this.cmdInsertBtnCss = this.cmdInsertBtn.hasProp('css') ? this.cmdInsertBtn.css : null;
	this.cmdDeleteBtnCss = this.cmdDeleteBtn.hasProp('css') ? this.cmdDeleteBtn.css : null;
	this.cmdSubmitBtnCss = this.cmdSubmitBtn.hasProp('css') ? this.cmdSubmitBtn.css : null;
	this.cmdCancelBtnCss = this.cmdCancelBtn.hasProp('css') ? this.cmdCancelBtn.css : null;

	this.cmdUpdateBtnStyle = this.cmdUpdateBtn.hasProp('style') ? this.cmdUpdateBtn.style : null;
	this.cmdInsertBtnStyle = this.cmdInsertBtn.hasProp('style') ? this.cmdInsertBtn.style : null;
	this.cmdDeleteBtnStyle = this.cmdDeleteBtn.hasProp('style') ? this.cmdDeleteBtn.style : null;
	this.cmdSubmitBtnStyle = this.cmdSubmitBtn.hasProp('style') ? this.cmdSubmitBtn.style : null;
	this.cmdCancelBtnStyle = this.cmdCancelBtn.hasProp('style') ? this.cmdCancelBtn.style : null

	this.cmdInsertBtnScroll = this.cmdInsertBtn.hasProp('scrollIntoView') ? this.cmdInsertBtn.scrollIntoView : false; //scroll new added row into view

	//Editor call-backs, delegates
	this.onEditableInit = this.IsFn(f.on_editable_initialized) ? f.on_editable_initialized : null;
	this.onBeforeOpenEditor = this.IsFn(f.on_before_open_editor) ? f.on_before_open_editor : null;
	this.onAfterOpenEditor = this.IsFn(f.on_after_open_editor) ? f.on_after_open_editor : null;
	this.onBeforeCloseEditor = this.IsFn(f.on_before_close_editor) ? f.on_before_close_editor : null;
	this.onAfterCloseEditor = this.IsFn(f.on_after_close_editor) ? f.on_after_close_editor : null;
	this.setCustomEditorValue = this.IsFn(f.set_custom_editor_value) ? f.set_custom_editor_value : null;
	this.getCustomEditorValue = this.IsFn(f.get_custom_editor_value) ? f.get_custom_editor_value : null;
	this.setCellModifiedValue = this.IsFn(f.set_cell_modified_value) ? f.set_cell_modified_value : null;
	this.validateModifiedValue = this.IsFn(f.validate_modified_value) ? f.validate_modified_value : null;
	this.openCustomEditor = this.IsFn(f.open_custom_editor) ? f.open_custom_editor : null;
	this.closeCustomEditor = this.IsFn(f.close_custom_editor) ? f.close_custom_editor : null;
	this.onAddedDomRow = this.IsFn(f.on_added_dom_row) ? f.on_added_dom_row : null;

	//Server actions config
	this.actions = this.IsObj(f.actions) ? f.actions : {};
	this.updateConfig = this.actions['update']!=undefined ? this.actions['update'] : {};
	this.insertConfig = this.actions['insert']!=undefined ? this.actions['insert'] : {};
	this.deleteConfig = this.actions['delete']!=undefined ? this.actions['delete'] : {};
	this.updateURI = this.updateConfig.hasProp('uri') ? this.updateConfig['uri'] : null;
	this.insertURI = this.insertConfig.hasProp('uri') ? this.insertConfig['uri'] : null;
	this.deleteURI = this.deleteConfig.hasProp('uri') ? this.deleteConfig['uri'] : null;
	this.updateFormMethod = this.updateConfig.hasProp('form_method') ? this.updateConfig['form_method'].LCase() : 'post';
	this.insertFormMethod = this.insertConfig.hasProp('form_method') ? this.insertConfig['form_method'].LCase() : 'post';
	this.deleteFormMethod = this.deleteConfig.hasProp('form_method') ? this.deleteConfig['form_method'].LCase() : 'post';
	this.updateSubmitMethod = this.updateConfig.hasProp('submit_method') ? this.updateConfig['submit_method'].LCase() : 'form';
	this.insertSubmitMethod = this.insertConfig.hasProp('submit_method') ? this.insertConfig['submit_method'].LCase() : 'form';
	this.deleteSubmitMethod = this.deleteConfig.hasProp('submit_method') ? this.deleteConfig['submit_method'].LCase() : 'form';
	this.bulkDelete = this.deleteConfig.hasProp('bulk_delete') ? this.deleteConfig['bulk_delete'] : false; //enables delete of selected rows
	this.defaultRecord = this.insertConfig.hasProp('default_record')
							&& this.IsArray(this.insertConfig['default_record']) ? this.insertConfig['default_record'] : null;
	this.updateParams = this.updateConfig.hasProp('param_names')
							&& this.IsArray(this.updateConfig['param_names']) ? this.updateConfig['param_names'] : null;
	this.insertParams = this.insertConfig.hasProp('param_names')
							&& this.IsArray(this.insertConfig['param_names']) ? this.insertConfig['param_names'] : null;
	this.deleteParams = this.deleteConfig.hasProp('param_names')
							&& this.IsArray(this.deleteConfig['param_names']) ? this.deleteConfig['param_names'] : null;

	//Server actions delegates and callbacks
	this.onUpdateSubmit = this.updateConfig.hasProp('on_update_submit')
							&& this.IsFn(this.updateConfig['on_update_submit']) ? this.updateConfig['on_update_submit'] : null;
	this.onInsertSubmit = this.insertConfig.hasProp('on_insert_submit')
							&& this.IsFn(this.insertConfig['on_insert_submit']) ? this.insertConfig['on_insert_submit'] : null;
	this.onDeleteSubmit = this.deleteConfig.hasProp('on_delete_submit')
							&& this.IsFn(this.deleteConfig['on_delete_submit']) ? this.deleteConfig['on_delete_submit'] : null;
	this.onBeforeUpdateSubmit = this.updateConfig.hasProp('on_before_submit')
							&& this.IsFn(this.updateConfig['on_before_submit']) ? this.updateConfig['on_before_submit'] : null;
	this.onBeforeInsertSubmit = this.insertConfig.hasProp('on_before_submit')
							&& this.IsFn(this.insertConfig['on_before_submit']) ? this.insertConfig['on_before_submit'] : null;
	this.onBeforeDeleteSubmit = this.deleteConfig.hasProp('on_before_submit')
							&& this.IsFn(this.deleteConfig['on_before_submit']) ? this.deleteConfig['on_before_submit'] : null;
	this.onAfterUpdateSubmit = this.updateConfig.hasProp('on_after_submit')
							&& this.IsFn(this.updateConfig['on_after_submit']) ? this.updateConfig['on_after_submit'] : null;
	this.onAfterInsertSubmit = this.insertConfig.hasProp('on_after_submit')
							&& this.IsFn(this.insertConfig['on_after_submit']) ? this.insertConfig['on_after_submit'] : null;
	this.onAfterDeleteSubmit = this.deleteConfig.hasProp('on_after_submit')
							&& this.IsFn(this.deleteConfig['on_after_submit']) ? this.deleteConfig['on_after_submit'] : null;
	this.onUpdateError = this.updateConfig.hasProp('on_submit_error')
							&& this.IsFn(this.updateConfig['on_submit_error']) ? this.updateConfig['on_submit_error'] : null;
	this.onInsertError = this.insertConfig.hasProp('on_submit_error')
							&& this.IsFn(this.insertConfig['on_submit_error']) ? this.insertConfig['on_submit_error'] : null;
	this.onDeleteError = this.deleteConfig.hasProp('on_submit_error')
							&& this.IsFn(this.deleteConfig['on_submit_error']) ? this.deleteConfig['on_submit_error'] : null;

	//Messages
	this.msgSubmitOK = f.msg_submit_ok!=undefined ? f.msg_submit_ok : 'Modified rows were successfully submitted to server!';
	this.msgConfirmDelSelectedRows = f.msg_confirm_delete_selected_rows!=undefined ? f.msg_confirm_delete_selected_rows : 'Do you want to delete the selected row(s)?';
	this.msgErrOccur = f.msg_error_occured!=undefined ? f.msg_error_occured : 'An error occured!';
	this.msgSaveUnsuccess = f.msg_submit_unsuccessful!=undefined ? f.msg_submit_unsuccessful : 'Modified rows could not be saved correctly!';
	this.msgUndefinedSubmitUrl = f.undefined_submit_url!=undefined ? f.undefined_submit_url : 'Modified rows could not be saved! Submit URL is not defined';

	//Values
	this.valuesSeparator = ', ';
	this.defaultRecordUndefinedValue = '...';
	this.newRowClass = 'ezNewRow';
	//Counters
	this.savedRowsNb = 0;

	//prefixes
	this.attrCont = '_html';
	this.attrData = '_data';
	this.prfxEdt = 'edt_';
	this.prfxIFrm = 'iframe_';
	this.prfxFrm = 'form_';
	this.prfxScr = 'scr_';
	this.prfxParam = 'col_';

	var o = this;
	this.Editable = {
		onEditAdded: false, activeCellEditor: null, openCellEditor: null, activeRow: null,
		modifiedRows: [], newRows: [], addedRows: [], deletedRows: [],
		Init: function(){
			if(!o.editable) return;
			this.SetEvents();
			this.SetCellsEditor();
			if(o.onEditableInit) o.onEditableInit.call(null, o);
		},
		Set: function(){ o.editable = true;	this.SetEvents(); },
		Remove: function(){	o.editable = false;	this.RemoveEvents(); },
		SetEvents: function(){
			if(!this.onEditAdded){
				o.Event.Add(o.table, o.openEditorAction, this.Edit);
				this.onEditAdded = true;
			}
		},
		RemoveEvents: function(){
			if(this.onEditAdded){
				o.Event.Remove(o.table, o.openEditorAction, this.Edit);
				this.onEditAdded = false;
			}
		},
		SetCellsEditor: function(){
			for(var i=0; i<o.nbCells; i++){
				if(o.editorTypes.length == o.nbCells){
					switch(o.editorTypes[i]){
						case o.edtTypes.none:
							o.editors[i] = null;
						break;
						case o.edtTypes.input:
							o.editors[i] = this.CreateInputEditor(i);
						break;
						case o.edtTypes.textarea:
							o.editors[i] = this.CreateMultilineEditor(i);
						break;
						case o.edtTypes.select:
						case o.edtTypes.multiple:
							o.editors[i] = this.CreateSelectEditor(i);
						break;
						case o.edtTypes.boolean:
							o.editors[i] = {};
						break;
						case o.edtTypes.command:
							this.SetCommandEditor(i);
							o.editors[i] = null;
						break;
						case o.edtTypes.custom:
							o.editors[i] = o.Get(o.customEditor[i]);
						break;
						default:
							o.editors[i] = null;
						break;
					}
				} else {
					//If editor type not set, default type is input
					o.editorTypes[i] = o.edtTypes.input;
					o.editors[i] = this.CreateInputEditor(i);
				}
			}
		},
		CreateInputEditor: function(colIndex){
			if(colIndex==undefined) return null;
			var inp = o.CreateElm(o.edtTypes.input,['id',o.prfxEdt+colIndex+'_'+o.id],['type','text'], ['class',o.inputEditorCss], ['_i',colIndex]);
			var attr = o.editorAttributes[colIndex];
			if(attr) for(var i=0; i<attr.length; i++){ inp.setAttribute(attr[i][0], attr[i][1]); }//additional attributes
			if(inp.className=='') inp.className = o.inputEditorCss; //for older IE versions...
			if(o.editorCss[colIndex]) o.Css.Add(inp, o.editorCss[colIndex]); //additional css
			if(o.editorStyles[colIndex]) inp.style.cssText = o.editorStyles[colIndex]; //inline style
			o.Event.Add(inp, 'focus', this.Event.OnInputFocus);
			o.Event.Add(inp, 'blur', this.Event.OnBlur);
			o.Event.Add(inp, 'keypress', this.Event.OnKeyPress);
			return inp;
		},
		CreateMultilineEditor: function(colIndex){
			if(colIndex==undefined) return null;
			var txa = o.CreateElm(o.edtTypes.textarea,['id',o.prfxEdt+colIndex+'_'+o.id],['class',o.textareaEditorCss],['_i',colIndex]);
			var attr = o.editorAttributes[colIndex];
			if(attr) for(var i=0; i<attr.length; i++){ txa.setAttribute(attr[i][0], attr[i][1]); }//additional attributes
			if(txa.className=='') txa.className = o.textareaEditorCss; //for older IE versions...
			if(o.editorCss[colIndex]) o.Css.Add(txa, o.editorCss[colIndex]); //additional css
			if(o.editorStyles[colIndex]) txa.style.cssText = o.editorStyles[colIndex]; //inline style
			o.Event.Add(txa, 'focus', this.Event.OnInputFocus);
			o.Event.Add(txa, 'blur', this.Event.OnBlur);
			o.Event.Add(txa, 'keypress', this.Event.OnKeyPress);
			return txa;
		},
		CreateSelectEditor: function(colIndex){
			if(colIndex==undefined) return null;
			var slc = o.CreateElm(o.edtTypes.select,['id',o.prfxEdt+colIndex+'_'+o.id],['class',o.selectEditorCss],['_i',colIndex]);
			if(o.editorTypes[colIndex]==o.edtTypes.multiple) slc.setAttribute('multiple', 'multiple');
			var attr = o.editorAttributes[colIndex];
			if(attr) for(var i=0; i<attr.length; i++){ slc.setAttribute(attr[i][0], attr[i][1]); }//additional attributes
			if(slc.className=='') slc.className = o.selectEditorCss; //for older IE versions...
			if(o.editorCss[colIndex]) o.Css.Add(slc, o.editorCss[colIndex]); //additional css
			if(o.editorStyles[colIndex]) slc.style.cssText = o.editorStyles[colIndex]; //inline style
			var optArray = []; //options array
			if(o.editorCustomSlcOptions[colIndex]){//custom values
				for(var i=0; i<o.editorCustomSlcOptions[colIndex].length; i++){
					var data = o.editorCustomSlcOptions[colIndex][i];
					if(optArray.indexOf(data) == -1) optArray.push(data);
				}
			} else {//automatic column values
				for(var i=o.startRow; i<o.GetRowsNb(); i++){
					var row = o.table.rows[i];
					var cell = row.cells[colIndex];
					if(!row ||!cell) continue;
					var data = o.GetText(cell);
					if(optArray.indexOf(data) == -1) optArray.push(data);
				}
			}
			if(o.editorSortSlcOptions[colIndex]){
				var sortType = o.editorSortSlcOptions[colIndex].LCase();
				if(sortType == 'numdesc'){
					try{ optArray.sort(o.Sort.NumDesc); } catch(e){};
				} else if(sortType == 'numasc'){
					try{ optArray.sort(o.Sort.NumAsc); } catch(e){};
				} else {
					try{ optArray.sort(o.Sort.IgnoreCase); } catch(e){};
				}
			}
			for(var j=0; j<optArray.length; j++)
			{
				var opt = o.CreateElm('option', ['value',optArray[j]]);
				opt.appendChild(o.CreateText(optArray[j]));
				slc.appendChild(opt);
			}
			o.Event.Add(slc, 'blur', this.Event.OnBlur);
			o.Event.Add(slc, 'keypress', this.Event.OnKeyPress);
			return slc;
		},
		SetCommandEditor: function(colIndex){
			if(colIndex==undefined || o.editorTypes[colIndex]!=o.edtTypes.command) return;
			this.edtBtns = [], this.addBtns = [], this.delBtns = [], this.submitBtns = [], this.cancelBtns = [];
			var x = o.Editable;
			for(var i=o.startRow; i<o.GetRowsNb(); i++){
				var row = o.table.rows[i];
				var cell = row.cells[colIndex];
				if(!row ||!cell) continue;

				var div = o.CreateElm('div', ['class',o.commandEditorCss]);
				if(o.cmdEnabledBtns.indexOf('update') != -1){
					var editBtn = o.CreateElm('button', ['id','editBtn_'+i+'_'+o.id], ['title', o.cmdUpdateBtnTitle],
									['css', o.cmdUpdateBtnCss], ['_i', i]);
					if(o.cmdUpdateBtnStyle) editBtn.style.cssText = o.cmdUpdateBtnStyle; //inline style
					editBtn.innerHTML = o.cmdUpdateBtnIcon + o.cmdUpdateBtnText;
					div.appendChild(editBtn);
					o.Event.Add(editBtn, 'click', function(e){ x.Edit(e); });
					if(this.edtBtns.indexOf(editBtn)==-1) this.edtBtns[i] = editBtn;
				}
				if(o.cmdEnabledBtns.indexOf('insert') != -1){
					var createBtn = o.CreateElm('button', ['id','createBtn_'+i+'_'+o.id], ['title', o.cmdInsertBtnTitle],
									['css', o.cmdInsertBtnCss], ['_i', i]);
					if(o.cmdInsertBtnStyle) createBtn.style.cssText = o.cmdInsertBtnStyle; //inline style
					createBtn.innerHTML = o.cmdInsertBtnIcon + o.cmdInsertBtnText;
					div.appendChild(createBtn);
					o.Event.Add(createBtn, 'click', function(e){ x.AddNewRow(); x.SetCommandEditor(o.editorCmdColIndex); });
					if(this.addBtns.indexOf(createBtn)==-1) this.addBtns[i] = createBtn;
				}
				if(o.cmdEnabledBtns.indexOf('delete') != -1){
					var delBtn = o.CreateElm('button', ['id','delBtn_'+i+'_'+o.id], ['title', o.cmdDeleteBtnTitle],
									['css', o.cmdDeleteBtnCss], ['_i', i]);
					if(o.cmdDeleteBtnStyle) delBtn.style.cssText = o.cmdDeleteBtnStyle; //inline style
					delBtn.innerHTML = o.cmdDeleteBtnIcon + o.cmdDeleteBtnText;
					div.appendChild(delBtn);
					o.Event.Add(delBtn, 'click', function(e){ x.SubmitDeletedRows(); });
					if(this.delBtns.indexOf(delBtn)==-1) this.delBtns[i] = delBtn;
				}
				if(o.cmdEnabledBtns.indexOf('submit') != -1){
					var postBtn = o.CreateElm('button', ['id','postBtn_'+i+'_'+o.id], ['title', o.cmdSubmitBtnTitle],
									['style','display:none;'], ['css', o.cmdSubmitBtnCss], ['_i', i]);
					postBtn.style.display = 'none'; //older versions of IE
					if(o.cmdSubmitBtnStyle) postBtn.style.cssText += o.cmdSubmitBtnStyle; //inline style
					postBtn.innerHTML = o.cmdSubmitBtnIcon + o.cmdSubmitBtnText;
					div.appendChild(postBtn);
					o.Event.Add(postBtn, 'click', function(e){ 
						x.CloseRowEditor(); 
						if(o.GetRow(e) && o.Css.Has(o.GetRow(e), o.newRowClass)) x.SubmitAddedRows();
						else x.SubmitEditedRows();
					});
					if(this.submitBtns.indexOf(postBtn)==-1) this.submitBtns[i] = postBtn;
				}
				if(o.cmdEnabledBtns.indexOf('cancel') != -1){
					var cancelBtn = o.CreateElm('button', ['id','cancelBtn_'+i+'_'+o.id], ['title', o.cmdCancelBtnTitle], 
										['style','display:none;'], ['css', o.cmdCancelBtnCss], ['_i', i]);
					cancelBtn.style.display = 'none'; //older versions of IE
					if(o.cmdCancelBtnStyle) cancelBtn.style.cssText += o.cmdCancelBtnStyle; //inline style
					cancelBtn.innerHTML = o.cmdCancelBtnIcon + o.cmdCancelBtnText;
					div.appendChild(cancelBtn);
					o.Event.Add(cancelBtn, 'click', function(e){ x.CloseRowEditor(); });
					if(this.cancelBtns.indexOf(cancelBtn)==-1) this.cancelBtns[i] = cancelBtn;
				}
				cell.innerHTML = '';
				cell.appendChild(div);
			}
		},
		OpenCellEditor: function(cell){
			if(!cell) return;
			var cellIndex = cell.cellIndex;
			var editor = o.editors[cellIndex];
			if(o.onBeforeOpenEditor) o.onBeforeOpenEditor.call(null, o, cell, editor);
			this.activeCellEditor = cell;
			this.openCellEditor = cellIndex;
			var data = o.GetText(cell);
			this.SetCellCache(cell, data);
			this.SetEditorValue(cellIndex, data);
			if(o.editorTypes[cellIndex]!=o.edtTypes.custom){
				cell.innerHTML = '';
				cell.appendChild(editor);
				if(o.editorModel=='cell') this.SetEditorFocus(cellIndex);
			} else {
				if(o.openCustomEditor) o.openCustomEditor.call(null, o, cell, editor);
			}
			if(o.onAfterOpenEditor) o.onAfterOpenEditor.call(null, o, cell, editor);
		},
		OpenRowEditor: function(row){
			if(!row) return;
			this.activeRow = row;
			for(var i=0; i<o.nbCells; i++){
				if(!o.editors[i] || o.editorTypes[i]==o.edtTypes.boolean
					|| o.editorTypes[i]==o.edtTypes.command) continue;
				var c = row.cells[i];
				this.OpenCellEditor(c);
				if(o.Selection.activeCell && o.Selection.activeCell.cellIndex == i)
					this.SetEditorFocus(i);
			}
			this.ShowCommandBtns(row.rowIndex, false);
		},
		CloseRowEditor: function(){
			if(!this.activeRow) return;
			var row = this.activeRow;
			for(var i=0; i<o.nbCells; i++){
				if(!o.editors[i] || o.editorTypes[i] == o.edtTypes.boolean) continue;
				this.activeCellEditor = row.cells[i];
				this.CloseCellEditor(i);
			}
			this.ShowCommandBtns(row.rowIndex, true);
			this.activeRow = null;
		},
		ShowCommandBtns: function(rowIndex, showIcons){
			if(rowIndex==undefined || showIcons==undefined || o.editorModel != 'row') return;
			if(!this.edtBtns || !this.addBtns || !this.delBtns || !this.submitBtns || !this.cancelBtns) return;
			if(showIcons){
				if(this.edtBtns[rowIndex]) this.edtBtns[rowIndex].style.display = 'inline';
				if(this.addBtns[rowIndex]) this.addBtns[rowIndex].style.display = 'inline';
				if(this.delBtns[rowIndex]) this.delBtns[rowIndex].style.display = 'inline';
				if(this.submitBtns[rowIndex]) this.submitBtns[rowIndex].style.display = 'none';
				if(this.cancelBtns[rowIndex]) this.cancelBtns[rowIndex].style.display = 'none';
			} else {
				if(this.edtBtns[rowIndex]) this.edtBtns[rowIndex].style.display = 'none';
				if(this.addBtns[rowIndex]) this.addBtns[rowIndex].style.display = 'none';
				if(this.delBtns[rowIndex]) this.delBtns[rowIndex].style.display = 'none';
				if(this.submitBtns[rowIndex]) this.submitBtns[rowIndex].style.display = 'inline';
				if(this.cancelBtns[rowIndex]) this.cancelBtns[rowIndex].style.display = 'inline';
			}
		},
		CloseCellEditor: function(colIndex){
			if(colIndex==undefined || !this.activeCellEditor) return;
			if(o.onBeforeCloseEditor) o.onBeforeCloseEditor.call(null, o, this.activeCellEditor, o.editors[colIndex]);
			var edtVal = this.GetEditorValue(colIndex);
			var cache = this.GetCellCache(this.activeCellEditor);
			var cellVal = cache[1], cellHtml = cache[0];
			var editor = o.editors[colIndex];
			var val;
			if(o.editorTypes[colIndex] == o.edtTypes.multiple){//multiple selections need to be cleared
				for(var j=0; j<editor.options.length; j++)
					if(editor.options[j].selected) editor.options[j].selected = false;
			}
			if(edtVal != cellVal){
				var reg = new RegExp(cellVal.RegexpEscape(),'g');
				if(reg.test(cellHtml) && cellVal!='') val = cellHtml.replace(reg, edtVal); //value to be written
				else val = edtVal;
			}
			if(o.setCellModifiedValue){ o.setCellModifiedValue.call(null, o, this.activeCellEditor, val); }
			else{
				try{ this.activeCellEditor.removeChild(editor); } catch(e){ this.activeCellEditor.innerHTML = ''; } //for older versions of IE
				if(!o.validateModifiedValue || 
					o.validateModifiedValue.call(null, o, colIndex, cellVal, edtVal, this.activeCellEditor, editor)){ //validation ok
					if(o.editorAllowEmptyValue[colIndex]) //empty value is allowed
						this.activeCellEditor.innerHTML = (val!=undefined ? val : cellHtml);
					else this.activeCellEditor.innerHTML = (val!=undefined && val.Trim()!='' ? val : cellHtml);						
					if(edtVal != cellVal){
						if(o.editorModel=='row') this.SetModifiedCell(this.activeCellEditor, this.activeCellEditor.innerHTML, cellVal);
						else this.SetModifiedCell(this.activeCellEditor, val, cellVal);
					}
				} else{
					this.activeCellEditor.innerHTML = cellVal || cellHtml; //resets cached value
				}
			}
			if(o.onAfterCloseEditor) o.onAfterCloseEditor.call(null, o, this.activeCellEditor, editor);
			this.RemoveCellCache(this.activeCellEditor);
			if(o.editorTypes[colIndex]==o.edtTypes.custom)
				if(o.closeCustomEditor) o.closeCustomEditor.call(null, o, this.activeCellEditor, editor);
			this.activeCellEditor = null;
			this.openCellEditor = null;
		},
		IsEditorOpen: function(colIndex){ return this.openCellEditor == colIndex; },
		IsRowEditorOpen: function(){ return this.activeRow!=null },
		SetEditorFocus: function(colIndex){
			if(o.editors[colIndex] && (this.IsEditorOpen(colIndex) || this.activeRow) && 
				(o.editorTypes[colIndex]!=o.edtTypes.custom && o.editorTypes[colIndex]!=o.edtTypes.command
				&& o.editorTypes[colIndex]!=o.edtTypes.boolean)) o.editors[colIndex].focus();
		},
		BlurEditor: function(colIndex){ if(o.editors[colIndex] && (this.IsEditorOpen(colIndex) || this.activeRow)) o.editors[colIndex].blur(); },
		SetModifiedCell: function(cell, val, oldVal){
			if(!cell) return;
			var row = cell.parentNode;
			if(o.Css.Has(row, o.newRowClass)) return; //modified values of added rows don't need to be treated
			var r = {}; r.values = []; r.urlParams = ''; r.modified = [];
			var modRow = this.GetModifiedRow(row.rowIndex);
			if(!modRow){
				for(var i=0; i<row.cells.length; i++){
					if(cell.cellIndex == i) o.Css.Add(cell, o.modifiedCellCss);
					var cache = this.GetCellCache(row.cells[i]);
					var t = cell.cellIndex == i ? val : (o.editorModel=='row' && o.editorTypes[i]!=o.edtTypes.none ? cache[1] || o.GetText(row.cells[i]) : o.GetText(row.cells[i]));
					if(o.editorTypes[i] == o.edtTypes.boolean && o.Tag(row.cells[i],'input').length > 0) 
						t = o.Tag(row.cells[i],'input')[0].checked;
					var paramName = o.prfxParam+i; //param name for server-side purposes
					r.values.push(t);
					r.modified.push(cell.cellIndex == i ? true : false);
					r.urlParams += '&'+paramName+'='+encodeURIComponent(t); //params for submission
				}
				this.modifiedRows.push([row.rowIndex,r]);
			} else {
				var obj = modRow[1];
				obj.values[cell.cellIndex] = val;
				obj.modified[cell.cellIndex] = true;
				var paramName = o.prfxParam+cell.cellIndex;
				var oldParam = paramName+'='+encodeURIComponent(oldVal);
				var newParam = paramName+'='+encodeURIComponent(val);
				obj.urlParams = obj.urlParams.replace(oldParam, newParam);
			}
		},
		GetModifiedRow: function(rowIndex){
			if(rowIndex==undefined) return null;
			for(var i=0; i<this.modifiedRows.length; i++){
				if(this.modifiedRows[i][0] == rowIndex)
					return this.modifiedRows[i];
			} return null;
		},
		GetModifiedRows: function(){ return this.modifiedRows; },
		GetAddedRows: function(){ return this.addedRows; },
		SetRowsObject: function(rows, cmd){
			if(!rows) return;
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				if(!row) continue;
				var r = {}; r.values = []; r.urlParams = ''; r.modified = [];
				for(var j=0; j<row.cells.length; j++){
					var cell = row.cells[j];
					var t = o.GetText(row.cells[j]);
					if(o.editorTypes[j] == o.edtTypes.boolean && o.Tag(row.cells[j],'input').length > 0)
						t = o.Tag(row.cells[j],'input')[0].checked;
					var paramName = o.prfxParam+j; //param name for server-side purposes
					r.values.push(t);
					r.modified.push((cmd=='delete' ? false : true));
					r.urlParams += '&'+paramName+'='+encodeURIComponent(t); //params for submission
				}
				if(cmd=='delete') this.deletedRows.push([row.rowIndex,r]);
				else if(cmd=='insert') this.addedRows.push([row.rowIndex,r]);
				else this.modifiedRows.push([row.rowIndex,r]);
			}
		},
		GetDeletedRows: function(){ return this.deletedRows; },
		RemoveModifiedRow: function(rowIndex){
			if(rowIndex==undefined) return;
			for(var i=0; i<this.GetModifiedRows().length; i++){
				if(this.GetModifiedRows()[i][0] == rowIndex){
					this.modifiedRows.splice(i, 1); break;
				}
			}
		},
		RemoveModifiedCellMark: function(rowIndex, cellIndexes){
			if(rowIndex==undefined) return;
			var row = o.table.rows[rowIndex], cells = row.cells;
			for(var i=0; i<cells.length; i++){
				var cell = cells[i];
				if(!cellIndexes || cellIndexes.indexOf(i)!= -1)
					o.Css.Remove(cell, o.modifiedCellCss);
			}
		},
		SetCellCache: function(cell, data, htmlCont){
			if(!cell || data==undefined) return;
			var html = htmlCont || htmlCont=='' ? htmlCont : cell.innerHTML;
			cell.setAttribute(o.attrCont, escape(html));
			cell.setAttribute(o.attrData, escape(data));
		},
		GetCellCache: function(cell){
			if(!cell) return [];
			var a, b;
			if(cell.attributes[o.attrCont]!=undefined) a = unescape(cell.getAttribute(o.attrCont));
			if(cell.attributes[o.attrData]!=undefined) b = unescape(cell.getAttribute(o.attrData));
			return [a,b];
		},
		RemoveCellCache: function(cell){
			if(!cell) return;
			if(cell.attributes[o.attrCont]!=undefined) cell.removeAttribute(o.attrCont);
			if(cell.attributes[o.attrData]!=undefined) cell.removeAttribute(o.attrData);
		},
		GetEditorValue: function(colIndex){
			var editor = o.editors[colIndex];
			var editorType = o.editorTypes[colIndex];
			var val = '';
			if(!editor || !editorType) return val;
			switch(editorType.LCase()){
				case o.edtTypes.input:
				case o.edtTypes.textarea:
				case o.edtTypes.select:
					val = editor.value;
				break;
				case o.edtTypes.multiple:
					var sep = !o.editorValuesSeparator[colIndex] ? o.valuesSeparator : o.editorValuesSeparator[colIndex];
					for(var j=0; j<editor.options.length; j++)
						if(editor.options[j].selected)
							val = val.concat(editor.options[j].value, sep);
					val = val.substring(0, val.length - sep.length);
				break;
				case o.edtTypes.custom:
					if(o.getCustomEditorValue) val = o.getCustomEditorValue.call(null, o, editor, colIndex);
				break;
			}
			return val;
		},
		SetEditorValue: function(colIndex, val){
			var editor = o.editors[colIndex];
			var editorType = o.editorTypes[colIndex];
			switch(editorType.LCase()){
				case o.edtTypes.input:
				case o.edtTypes.textarea:
				case o.edtTypes.select:
					editor.value = val;
				break;
				case o.edtTypes.multiple:
					for(var j=0; j<editor.options.length; j++)
						if(editor.options[j].value == val) editor.options[j].selected = true;
				break;
				case o.edtTypes.custom:
					if(o.setCustomEditorValue) o.setCustomEditorValue.call(null, o, editor, colIndex, val);
				break;
			}
		},
		GetCheckBox: function(cell){
			if(!cell) return null;
			var chk = o.Tag(cell, 'input')[0];			
			if(chk.getAttribute('type').LCase()=='checkbox') return chk;
			else return null;
		},
		SetCheckBoxValue: function(e, cell){
			if(!cell) return;
			var x = o.Editable;
			var checkbox = x.GetCheckBox(cell);
			if(!checkbox || checkbox.type.LCase() != 'checkbox') return;
			if(o.Event.GetElement(e)!=checkbox){//in case user clicks on cell instead of checkbox
				if(checkbox.checked) checkbox.checked = false;
				else checkbox.checked = true;
			}
			var data = !checkbox.checked;
			x.SetCellCache(cell, data, '');
			x.SetModifiedCell(cell);
		},
		AddNewRow: function(){
			var row = o.table.insertRow(o.startRow);
			o.Css.Add(row, o.newRowClass);
			for(var i=0; i<o.nbCells; i++){
				var cell = row.insertCell(i);
				if(o.defaultRecord) cell.innerHTML = o.defaultRecord[i];
				else cell.innerHTML = o.defaultRecordUndefinedValue;
			}
			if(o.cmdInsertBtnScroll) row.scrollIntoView(false);
			this.newRows.push(row);
			if(o.onAddedDomRow) o.onAddedDomRow.call(null, o, this.newRows, row);
		},
		SubmitEditedRows: function(){ this.Submit('update'); },
		SubmitAddedRows: function(){ this.SetRowsObject(this.newRows, 'insert'); this.Submit('insert'); },
		SubmitDeletedRows: function(){
			if(o.selection){
				if(!o.Selection.activeRow && o.Selection.selectedRows.length==0) return;
				var rows = (o.bulkDelete) ? o.Selection.selectedRows : [o.Selection.activeRow];
				if(rows.length==0) return;
				this.SetRowsObject(rows, 'delete');
				if(confirm(o.msgConfirmDelSelectedRows)) this.Submit('delete');
				else this.deletedRows = [];
			} else {/* TO BE ASSESSED... */ }
		},
		Submit: function(cmd){
			var treatedRows, uri, submitMethod, formMethod, params;
			var beforeSubmitCallBack, afterSubmitCallBack, onSubmit, onSubmitError;
			switch((cmd || '').LCase()){
				case 'insert':
					treatedRows = this.GetAddedRows();
					uri = o.insertURI;
					submitMethod = o.insertSubmitMethod;
					formMethod = o.insertFormMethod;
					params = o.insertParams;
					beforeSubmitCallBack = o.onBeforeInsertSubmit;
					afterSubmitCallBack = o.onAfterInsertSubmit;
					onSubmit = o.onInsertSubmit;
					onSubmitError = o.onInsertError;
				break;
				case 'delete':
					treatedRows = this.GetDeletedRows();
					uri = o.deleteURI;
					submitMethod = o.deleteSubmitMethod;
					formMethod = o.deleteFormMethod;
					params = o.deleteParams;
					beforeSubmitCallBack = o.onBeforeDeleteSubmit;
					afterSubmitCallBack = o.onAfterDeleteSubmit;
					onSubmit = o.onDeleteSubmit;
					onSubmitError = o.onDeleteError;
				break;
				case 'update':
				default:
					treatedRows = this.GetModifiedRows();
					uri = o.updateURI;
					submitMethod = o.updateSubmitMethod;
					formMethod = o.updateFormMethod;
					params = o.updateParams;
					beforeSubmitCallBack = o.onBeforeUpdateSubmit;
					afterSubmitCallBack = o.onAfterUpdateSubmit;
					onSubmit = o.onUpdateSubmit;
					onSubmitError = o.onUpdateError;
				break;
			}
			if(beforeSubmitCallBack) beforeSubmitCallBack.call(null, o, treatedRows);
			if(onSubmit) onSubmit.call(null, o, treatedRows);
			else{
				if(!uri) alert(o.msgUndefinedSubmitUrl);
				else{
					for(var i=0; i<treatedRows.length; i++){
						var modArr = treatedRows[i], rowIndex = modArr[0], row = modArr[1];
						if(rowIndex<0) continue;
						var rowValues = row.values;
						var urlParams = row.urlParams, paramParts = urlParams.split('&');
						var rowId = o.table.rows[rowIndex].getAttribute('id');
						if(params && o.IsArray(params)){//params are replaced if defined
							for(var j=0; j<params.length; j++)
								urlParams = urlParams.replace(paramParts[j+1].split('=')[0], params[j]);
							paramParts = urlParams.split('&');
						}
						o.Css.Add(o.table, o.activityIndicatorCss);
						if(o.onServerActivityStart) o.onServerActivityStart.call(null, o, o.table.rows[rowIndex]);

						if(submitMethod=='script'){//GET method by using script element generation
							var prm = (uri.indexOf('?')==-1 ? '?rowId=' : '&rowId=')+rowId+urlParams;
							try{//window.open(uri+prm);
								o.IncludeFile(o.prfxScr+rowIndex+'_'+o.id, uri+prm,
									function(eg, scriptElm){ eg.savedRowsNb++; var rIndex = scriptElm.id.replace(eg.prfxScr,'').replace('_'+eg.id,'');
										eg.Editable.RemoveModifiedCellMark(parseInt(rIndex)); if(eg.savedRowsNb==treatedRows.length) SubmitComplete(); });
							} catch(e){
								o.Css.Remove(o.table, o.activityIndicatorCss);
								if(o.onServerActivityStop) o.onServerActivityStop.call(null, o, o.table.rows[rowIndex]);
								if(o.onSubmitError) o.onSubmitError.call(null, o, e, e.description);
								else alert(o.msgErrOccur +'\n'+e.description+'\n' + o.msgSaveUnsuccess);
							}
						} else {//GET or POST method by using form and iframe elements
							if(!o.ifrmContainer) o.ifrmContainer = o.CreateElm('div',['id','cont_'+o.id],['style','display:none;']);
							var iframeId = o.prfxIFrm+rowIndex+'_'+o.id;
							var iframe; //below for older versions of IE, name attribute dynamically created problem, very ugly solution...
							try{ var iframe = document.createElement('<iframe name="'+iframeId+'" id="'+iframeId+'" _rowIndex="'+rowIndex+'"></iframe>') }
							catch(e){ var iframe = o.CreateElm('iframe', ['id',iframeId], ['name',iframeId], ['_rowIndex', rowIndex]); }
							iframe.style.cssText = 'display:none; width:0; height:0;';

							var form = o.CreateElm('form', ['id', o.prfxFrm+rowIndex+'_'+o.id], ['method', formMethod], ['action', uri], ['target', iframeId]);
							for(var j=1; j<paramParts.length; j++) {
								var paramName = paramParts[j].split('=')[0];
								var paramValue = paramParts[j].split('=')[1];
								var hiddenField = o.CreateElm('input', ['type','hidden'], ['name',paramName], ['value', paramValue]);
								form.appendChild(hiddenField);
							}
							var hiddenField = o.CreateElm('input', ['type','hidden'], ['name','rowId'], ['value', rowId]);
							form.appendChild(hiddenField);

							document.body.appendChild(o.ifrmContainer);
							o.ifrmContainer.appendChild(iframe);
							o.ifrmContainer.appendChild(form);
							try{
								form.submit();
								iframe.onload = iframe.onreadystatechange = function(){ //Iframe onload event
									if(!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete'){
										var iframeDoc = this.contentDocument || this.contentWindow.document;
										//Below for FF, it doesn 't seem to submit multiple forms correctly, this operation needs to be forced										
										if(iframeDoc.location.href == 'about:blank') o.Get(this.id.replace(o.prfxIFrm, o.prfxFrm)).submit(); //form is re-submitted
										else{
											o.savedRowsNb++; var rIndex = this.getAttribute('_rowIndex');
											o.Editable.RemoveModifiedCellMark(rIndex);
											if(o.savedRowsNb==treatedRows.length) SubmitComplete();
										}
									}
								};
							} catch(e){
								o.Css.Remove(o.table, o.activityIndicatorCss);
								if(o.onServerActivityStop) o.onServerActivityStop.call(null, o, o.table.rows[rowIndex]);
								if(onSubmitError) onSubmitError.call(null, o, e, e.description);
								else alert(o.msgErrOccur +'\n'+e.description+'\n' + o.msgSaveUnsuccess);
							}
						}
					}
				}
			}
			function SubmitComplete(){
				if(o.savedRowsNb==treatedRows.length){
					treatedRows = [], o.savedRowsNb = 0;
					if(cmd=='insert'){ o.Editable.newRows = []; o.Editable.addedRows = []; }
					else if(cmd=='delete'){
						o.Selection.ClearSelections();
						var a =[]; 
						for(var k=0; k<o.Editable.deletedRows.length; k++) a.push(o.Editable.deletedRows[k][0]);
						a.sort(o.Sort.NumDesc); //rows indexes need to be sorted in desc manner for rows deleting operation
						for(var k=0; k<a.length; k++) o.table.deleteRow(a[k]);
						o.Editable.deletedRows = [];
						o.Editable.SetCommandEditor(o.editorCmdColIndex);
					}
					else o.Editable.modifiedRows = [];
					o.Css.Remove(o.table, o.activityIndicatorCss);
					if(o.onServerActivityStop) o.onServerActivityStop.call(null, o, o.table.rows[rowIndex]);
					if(submitMethod=='form') o.ifrmContainer.innerHTML = '';
					if(afterSubmitCallBack) afterSubmitCallBack.call(null, o, treatedRows);
					else alert(o.msgSubmitOK);
				}
			}
		},
		Edit: function(e){
			var x = o.Editable, row, cell;
			if(e.type.LCase().indexOf('click') != -1){
				row = o.GetRow(e);
				cell = o.GetCell(e);
			} else {
				if(!o.selection) return;
				if(!o.Selection.activeRow && !o.Selection.activeCell) return;
				row = o.Selection.activeRow;
				cell = o.Selection.activeCell;
			}
			if(!row || row.rowIndex < o.startRow) return;

			if(o.editorModel=='cell' && cell){
				var cellIndex = cell.cellIndex;
				if(!x.activeCellEditor && o.editors[cellIndex]){
					if(o.editorTypes[cellIndex]==o.edtTypes.boolean)
						x.SetCheckBoxValue(e, cell);
					else x.OpenCellEditor(cell);
				}
			}
			if(o.editorModel=='row' && !x.IsRowEditorOpen()){ x.OpenRowEditor(row); }
		},
		Event: {
			OnInputFocus: function(e){
				var x = o.Editable;
				var elm = o.Event.GetElement(e);
				elm.select();
			},
			OnBlur: function(e){
				var x = o.Editable;
				var elm = o.Event.GetElement(e);
				var colIndex = elm.getAttribute('_i');
				if(colIndex==null){ 
					var cell = o.GetElement(e, 'td');
					colIndex = cell.cellIndex;
				}
				if(o.editorModel=='cell') x.CloseCellEditor(colIndex);
			},
			OnKeyPress: function(e){
				var keyCode = o.Event.GetKey(e);
				var elm = o.Event.GetElement(e);
				var colIndex = elm.getAttribute('_i');
				var x = o.Editable;
				if(!elm) return;
				switch(keyCode){
					case 13: //enter
						if(!o.selection && o.editorTypes[colIndex]==o.edtTypes.input && o.editorModel=='cell') x.CloseCellEditor(colIndex);
					break;
					case 27: //escape
						if(o.editorModel=='cell') x.CloseCellEditor(colIndex);
						if(o.editorModel=='row') x.CloseRowEditor();
					break;
					case 9: //tab
						if(!o.selection && o.editorModel=='cell') x.CloseCellEditor(colIndex);
					break;
				}
			}
		}
	};

	this.Selection = {
		onClickAdded: false, activeRow: null, activeCell: null,	selectedRows: [],
		Init: function(){		
			if(!o.selection) return;
			this.SetEvents();
			if(o.selectRowAtStart){
				this.SelectRowByIndex(o.rowIndexAtStart);
				if(this.activeRow) this.SelectCell(this.activeRow.cells[0]);
			}
			if(o.onSelectionInit) o.onSelectionInit.call(null, o);
		},
		Set: function(){
			o.selection = true;
			o.keyNav = true;
			this.SetEvents();
		},
		Remove: function(){
			o.selection = false;
			o.keyNav = false;
			this.RemoveEvents();
		},
		SetEvents: function(){
			if(!this.onClickAdded){ 
				o.Event.Add(o.table, 'click', this.OnClick);
				if(o.onValidateRow || o.onValidateCell) o.Event.Add(o.table, 'dblclick', this.OnDblClick);
				this.onClickAdded = true; 
			}
			if(o.keyNav){ o.Event.Add(o.StandardBody(), 'keydown', this.OnKeyDown); }
		},
		RemoveEvents: function(){
			if(this.onClickAdded){ 
				o.Event.Remove(o.table, 'click', this.OnClick);
				if(o.onValidateRow || o.onValidateCell) o.Event.Remove(o.table, 'dblclick', this.OnDblClick);
				o.Event.Remove(o.StandardBody(), 'keydown', this.OnKeyDown);
				this.onClickAdded = false;
			}
		},
		GetActiveRow: function(){ return this.activeRow; },
		GetActiveCell: function(){ return this.activeCell; },
		GetSelectedRows: function(){ return this.selectedRows; },
		GetSelectedValues: function(){
			var values = [];
			for(var i=0; i<this.GetSelectedRows().length; i++){
				var row = this.GetSelectedRows()[i];
				var r = this.GetRowValues(row);
				values.push(r);
			}
			return values;
		},
		GetActiveRowValues: function(){
			if(!this.GetActiveRow()) return [];
			return this.GetRowValues(this.GetActiveRow());
		},
		GetRowValues: function(row){
			if(!row) return [];
			var values = [];
			for(var i=0; i<row.cells.length; i++){
				var cell = row.cells[i];
				values.push(o.GetText(cell));
			}
			return values;
		},
		SelectRowByIndex: function(rowIndex){
			if(rowIndex==undefined || isNaN(rowIndex)) rowIndex = 0;
			var row = o.table.rows[rowIndex];
			if(!row) return;
			this.SelectRow(row);
		},
		SelectRow: function(row, e){
			if(o.defaultSelection == 'cell' || row.rowIndex<0) return;
			if(o.onBeforeSelectedRow) o.onBeforeSelectedRow.call(null, o, row, e);
			o.Css.Remove(this.activeRow, o.activeRowCss);
			if(o.selectionModel == 'multiple'){
				o.Css.Add(row, o.selectedRowCss);
				if(this.selectedRows.indexOf(row) == -1) this.selectedRows.push(row);
			}
			o.Css.Add(row, o.activeRowCss);
			this.activeRow = row;
			eg_activeGrid = o.id;
			if(o.onAfterSelectedRow) o.onAfterSelectedRow.call(null, o, row, e);
		},
		DeselectRow: function(row, e){
			if(o.defaultSelection == 'cell') return;
			if(!this.IsRowSelected(row)) return;
			if(o.onBeforeDeselectedRow) o.onBeforeDeselectedRow.call(null, o, row, e);
			o.Css.Remove(row, o.activeRowCss);
			o.Css.Remove(row, o.selectedRowCss);
			if(o.selectionModel == 'multiple'){
				for(var i=0; i<this.GetSelectedRows().length; i++){
					var r = this.selectedRows[i];
					if(row == r){
						this.selectedRows.splice(i, 1);
						break;
					}
				}
			}
			o.Css.Remove(this.activeRow, o.activeRowCss);
			this.activeRow = null;
			if(o.onAfterDeselectedRow) o.onAfterDeselectedRow.call(null, o, row, e);
		},
		SelectCell: function(cell, e){
			if(o.defaultSelection == 'row') return;
			if(o.onBeforeSelectedCell) o.onBeforeSelectedCell.call(null, o, cell, e);
			o.Css.Add(cell, o.activeCellCss);
			this.activeCell = cell;
			try{ if(o.defaultSelection == 'cell' && cell.parentNode && cell.parentNode.nodeName.LCase()=='tr') 
					this.activeRow = cell.parentNode; } catch(ex){} //ugly try-catch solution for old IE
			eg_activeGrid = o.id;
			if(o.onAfterSelectedCell) o.onAfterSelectedCell.call(null, o, cell, e);
		},
		DeselectCell: function(cell, e){
			if(o.defaultSelection == 'row') return;
			if(o.onBeforeDeselectedCell) o.onBeforeDeselectedCell.call(null, o, cell, e);
			if(this.IsCellSelected(cell)){ 
				o.Css.Remove(cell, o.activeCellCss);
				this.activeCell = null;
				if(o.defaultSelection == 'cell') this.activeRow = null;
			}
			if(o.onAfterDeselectedCell) o.onAfterDeselectedCell.call(null, o, cell, e);
		},
		ClearSelections: function(){
			var selRow = this.activeRow;
			var selCell = this.activeCell;
			if(selCell) this.DeselectCell(selCell);
			if(selRow) this.DeselectRow(selRow);
			for(var i=0; i<this.GetSelectedRows().length; i++){
				var row = this.selectedRows[i];
				if(o.onBeforeDeselectedRow) o.onBeforeDeselectedRow.call(null, o, row);
				o.Css.Remove(row, o.selectedRowCss);
				o.Css.Remove(row, o.activeRowCss);
				if(o.onAfterDeselectedRow) o.onAfterDeselectedRow.call(null, o, row);
			}
			this.selectedRows = [];
		},
		IsRowSelected: function(row){
			if(o.selectionModel == 'single'){
				return row == this.activeRow;
			} else {
				for(var i=0; i<this.GetSelectedRows().length; i++){
					var r = this.selectedRows[i];
					if(r == row) return true;
				}
				return false;
			}
		},
		IsCellSelected: function(cell){
			return cell == this.activeCell;
		},
		OnDblClick: function(e){
			var x = o.Selection;			
			var row = o.GetRow(e);
			var cell = o.GetCell(e);
			if(!row || row.rowIndex < o.startRow) return;
			if(!o.editable){ 
				if(o.onValidateRow && o.defaultSelection != 'cell') o.onValidateRow.call(null, o, x.activeRow);
				if(o.onValidateCell && o.defaultSelection != 'row') o.onValidateCell.call(null, o, x.activeCell);
			} 
		},
		OnClick: function(e){
			if($("#planillapres") && $("#planillapres")!=null && $("#planillapres")!= undefined){
				$('#planillapres tbody').find('.ezActiveRow').each(function(){
					$(this).removeClass('ezActiveRow');
				});
				$('#hizodown').val('0');
			}
				
			var x = o.Selection;			
			var row = o.GetRow(e);
			var cell = o.GetCell(e);
			if(!row || row.rowIndex < o.startRow) return;

			if(o.selectionModel == 'single'){
				x.ClearSelections();
				x.SelectRow(row);
				x.SelectCell(cell);
			} else {
				if(!o.keySelection){
					//Selection keys are disabled, multiple selection is performed with clicks
					if( x.selectedRows.length > 0){
						if(!x.IsRowSelected(row)) x.SelectRow(row);
						else x.DeselectRow(row);
					} else x.SelectRow(row);
				}
				else if(o.keySelection && (!e.ctrlKey && !e.shiftKey)){
					x.ClearSelections();
					x.SelectRow(row);
				}
				else if(o.keySelection && e.ctrlKey && x.selectedRows.length > 0)
					x.SelectRow(row);						
				else if(o.keySelection && e.shiftKey && x.selectedRows.length > 0){
					if(!x.activeRow) return;
					var prevRowIndex = x.activeRow.rowIndex;
					x.SelectRow(row);
					var curRowIndex = x.activeRow.rowIndex;
					if(prevRowIndex < curRowIndex){
						for(var i=prevRowIndex+1; i<curRowIndex; i++){
							var r = o.table.rows[i];
							if(r){
								if(!x.IsRowSelected(r)) x.SelectRow(r);
								else x.DeselectRow(r);
							}
						}
						if(!x.IsRowSelected(o.table.rows[prevRowIndex+1]))
							x.DeselectRow(o.table.rows[prevRowIndex]);
					} else {
						for(var i=prevRowIndex-1; i>curRowIndex; i--){
							var r = o.table.rows[i];
							if(r){
								if(!x.IsRowSelected(r)) x.SelectRow(r);
								else x.DeselectRow(r);
							}
						}
						if(!x.IsRowSelected(o.table.rows[prevRowIndex-1]))
							x.DeselectRow(o.table.rows[prevRowIndex]);
					}
					x.SelectRow(row);
				} 
				else{ x.SelectRow(row); }
				x.DeselectCell(x.activeCell);
				if(x.IsRowSelected(row)) x.SelectCell(cell);
			}

			if(o.editable){
				if(o.editorModel=='cell'){
					var activeCellEditor = o.Editable.activeCellEditor;
					if(!activeCellEditor && cell && o.editors[cell.cellIndex]){
						//Boolean is set if cell clicked even if editor action is dblclick
						if(o.editorTypes[cell.cellIndex]==o.edtTypes.boolean && o.openEditorAction=='dblclick')
							o.Editable.SetCheckBoxValue(e, cell);
					}
					//Custom editor is closed if cell selection changes
					if(activeCellEditor && o.editorTypes[activeCellEditor.cellIndex]==o.edtTypes.custom 
						&& (cell && cell.cellIndex!=activeCellEditor.cellIndex || row.rowIndex!=activeCellEditor.parentNode.rowIndex)){
						o.Editable.CloseCellEditor(activeCellEditor.cellIndex);
					}
				}
				if(o.editorModel=='row'){
					if(row != o.Editable.activeRow) o.Editable.CloseRowEditor();
				}
			}			
		},
		OnKeyDown: function(e){
			var x = o.Selection;
			if(!x.activeRow) return;
			var t = o.GetTableFromElement(x.activeRow);
			if(!t || t.nodeName.LCase() != 'table' || t['id'] != eg_activeGrid) return;
			var keyCode = o.Event.GetKey(e);
			var maxRowIndex = (o.table.rows.length - 1);
			var nbCells = (o.GetCellsNb() - 1);
			var curRowIndex = x.activeRow.rowIndex;
			var rowIndex, cellIndex;

			var navigate = function(cmd){
				if(!x.activeRow){
					rowIndex = o.startRow; cellIndex = 0;								
				} else {
					var curCellIndex = (x.activeCell ? x.activeCell.cellIndex : 0);
					if(o.selectionModel == 'single' || (o.selectionModel == 'multiple' && !e.shiftKey) || !o.keySelection) x.ClearSelections();
					else if(o.selectionModel == 'multiple' && e.shiftKey) x.DeselectCell(x.activeCell, e);
					cellIndex = curCellIndex;
					if(cmd == 'down'){
						if(($("#inpage").val()=="presentismo")){
							if(parseInt($("#hizodown").val())==1){
								rowIndex = (curRowIndex < maxRowIndex) ? curRowIndex + 2 : maxRowIndex;
								$("#hizodown").val('0');
							}
							else
								rowIndex = (curRowIndex < maxRowIndex) ? curRowIndex + 1 : maxRowIndex;
						}						
						else
							rowIndex = (curRowIndex < maxRowIndex) ? curRowIndex + 1 : maxRowIndex;
					}							
					else if(cmd == 'up'){
						if(($("#inpage").val()=="presentismo")){
							if(parseInt($("#hizodown").val())==1){
								rowIndex = (curRowIndex < o.startRow) ? o.startRow  : curRowIndex;
								$("#hizodown").val('0');
							}						
							else
								rowIndex = (curRowIndex < o.startRow) ? o.startRow  : curRowIndex -1;
						}						
						else
							rowIndex = (curRowIndex < o.startRow) ? o.startRow  : curRowIndex -1;
					} 
					else if(cmd == 'pgdown') rowIndex = (curRowIndex+o.nbRowsPerPage < maxRowIndex) ? curRowIndex + o.nbRowsPerPage : maxRowIndex;
					else if(cmd == 'pgup') rowIndex = (curRowIndex-o.nbRowsPerPage <= o.startRow) ? o.startRow : curRowIndex - o.nbRowsPerPage;
					else if(cmd == 'home') rowIndex = o.startRow;
					else if(cmd == 'end') rowIndex = maxRowIndex;
					else if(cmd == 'right'){
						if(o.defaultSelection != 'row'){
							rowIndex = curRowIndex;
							cellIndex = (curCellIndex+1 > nbCells) ? 0 : curCellIndex+1;
							if((curCellIndex+1) > nbCells) rowIndex = (curRowIndex < maxRowIndex) ? curRowIndex + 1 : maxRowIndex;
						} else rowIndex = (curRowIndex < maxRowIndex) ? curRowIndex + 1 : maxRowIndex;
					}
					else if(cmd == 'left'){
						if(o.defaultSelection != 'row'){
							rowIndex = curRowIndex;
							cellIndex = (curCellIndex-1 < 0) ? nbCells : curCellIndex-1;
							if(curCellIndex-1 < 0) rowIndex = (curRowIndex == o.startRow) ? o.startRow : curRowIndex - 1;
						} else rowIndex = (curRowIndex == o.startRow) ? o.startRow : curRowIndex - 1;
					}
				}
				var row = o.table.rows[rowIndex];
				if(o.keySelection && e.shiftKey && x.selectedRows.length > 0 && (cmd=='pgdown' || cmd=='pgup' || cmd=='home' || cmd=='end')){
					if(!x.activeRow) return;
					if(curRowIndex < rowIndex){
						for(var i=curRowIndex+1; i<rowIndex; i++){
							var r = o.table.rows[i];
							if(r){
								if(!x.IsRowSelected(r)) x.SelectRow(r, e);
								else x.DeselectRow(r, e);
							}
						}
						if(!x.IsRowSelected(o.table.rows[curRowIndex+1]))
							x.DeselectRow(o.table.rows[curRowIndex], e);
					} else {
						for(var i=curRowIndex-1; i>rowIndex; i--){
							var r = o.table.rows[i];
							if(r){ 
								if(!x.IsRowSelected(r)) x.SelectRow(r, e);
								else x.DeselectRow(r, e);
							}
						}
						if(!x.IsRowSelected(o.table.rows[curRowIndex-1]))
							x.DeselectRow(o.table.rows[curRowIndex], e);
					}
					x.SelectRow(row, e);
				} else {
					if(o.keySelection && e.shiftKey && x.IsRowSelected(row)) x.DeselectRow(o.table.rows[curRowIndex], e);
					x.SelectRow(row, e);
				}

				if(o.defaultSelection != 'row'){
					var cell = row.cells[cellIndex];
					x.SelectCell(cell, e);
					if(o.scrollIntoView) cell.scrollIntoView(false);
				}
				if(o.scrollIntoView && o.defaultSelection=='row') row.scrollIntoView(false);
				o.Event.Cancel(e);
			}

			var ed = o.Editable;
			function closeEditor(){			
				if(o.editable && ed.activeCellEditor && o.editorModel=='cell')
					ed.CloseCellEditor(ed.activeCellEditor.cellIndex);

				if(o.editable && ed.activeRow && o.editorModel=='row')				
					if(ed.activeRow != x.activeRow) ed.CloseRowEditor();
			}
			
			switch(keyCode){			
				case 40: //arrow down
					var secondsOpen=0;
					var tr =null;
					if($("#inpage").val()=="presentismo"){
						if(parseInt($("#noenter").val())==0){
							if(!o.editable || (o.editable && !ed.activeCellEditor && !ed.activeRow)){	
								$("#planillapres tbody").find(".ezActiveRow").removeClass("ezActiveRow");
								navigate('down');		
								$("#planillapres tbody").find(".ezActiveRow").click();
								//$("#rowselected").val(parseInt($("#planillapres tbody").find(".ezActiveRow").attr("id").split("_")[1]));
								//disableddiv("divdatosplanilla");								
							}
						}
					}
					if($("#inpage").val()=="contentfichaje"){												
						if(!o.editable || (o.editable && !ed.activeCellEditor && !ed.activeRow)){
							navigate('down');
							$("#rowselected").val(parseInt($("#tablafichaje tbody").find(".ezActiveRow").attr("id").split("_")[1]));							
						}
				}
				break;
				case 38: //arrow up
					if($("#inpage").val()=="presentismo"){
						if(parseInt($("#noenter").val())==0){
							if(!o.editable || (o.editable && !ed.activeCellEditor && !ed.activeRow)){
								$("#planillapres tbody").find(".ezActiveRow").removeClass("ezActiveRow");
								navigate('up');		
								$("#planillapres tbody").find(".ezActiveRow").click();
								
								//$("#rowselected").val(parseInt($("#planillapres tbody").find(".ezActiveRow").attr("id").split("_")[1]));
								//disableddiv("divdatosplanilla");
							}
						}
					}
					if($("#inpage").val()=="contentfichaje"){												
							if(!o.editable || (o.editable && !ed.activeCellEditor && !ed.activeRow)){
								navigate('up');
								$("#rowselected").val(parseInt($("#tablafichaje tbody").find(".ezActiveRow").attr("id").split("_")[1]));								
							}
					}
				break;
				case 37: //arrow left
					//if(!o.editable || (o.editable && !ed.activeCellEditor && !ed.activeRow)) navigate('left');
				break;
				case 39: //arrow right
					//if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow) navigate('right');
				break;
				case 34: //pagedown
					if($("#inpage").val()=="presentismo"){												
						if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow){	
							$("#planillapres tbody").find(".ezActiveRow").removeClass("ezActiveRow");
							navigate('pgdown');								
							$("#rowselected").val(parseInt($("#planillapres tbody").find(".ezActiveRow").attr("id").split("_")[1]));
							$("#planillapres tbody").find(".ezActiveRow").click();
							//disableddiv("divdatosplanilla");
						}
						
					}
					if($("#inpage").val()=="contentfichaje"){												
						if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow){
							navigate('pgdown');
							$("#rowselected").val(parseInt($("#tablafichaje tbody").find(".ezActiveRow").attr("id").split("_")[1]));			
						}
					}			
				break;
				case 33: //pageup
					if($("#inpage").val()=="presentismo"){												
						if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow){
							$("#planillapres tbody").find(".ezActiveRow").removeClass("ezActiveRow");
							navigate('pgup');
							$("#rowselected").val(parseInt($("#planillapres tbody").find(".ezActiveRow").attr("id").split("_")[1]));
							//disableddiv("divdatosplanilla");
							$("#planillapres tbody").find(".ezActiveRow").click();
						}						
					}	
					if($("#inpage").val()=="contentfichaje"){												
						if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow){
							navigate('pgup');
							$("#rowselected").val(parseInt($("#tablafichaje tbody").find(".ezActiveRow").attr("id").split("_")[1]));							
						}						
					}			
				break;
				case 36: //home
					if($("#inpage").val()=="presentismo"){												
						if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow){
							 navigate('home');
							 $("#rowselected").val(parseInt($("#planillapres tbody").find(".ezActiveRow").attr("id").split("_")[1]));
							 //disableddiv("divdatosplanilla");
						}
					}	
					if($("#inpage").val()=="contentfichaje"){												
						if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow){
							navigate('home');
							$("#rowselected").val(parseInt($("#tablafichaje tbody").find(".ezActiveRow").attr("id").split("_")[1]));							
						}
					}			
				break;
				case 35: //end
					if($("#inpage").val()=="presentismo"){												
						if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow){
							navigate('end');	
							$("#rowselected").val(parseInt($("#planillapres tbody").find(".ezActiveRow").attr("id").split("_")[1]));
							disableddiv("divdatosplanilla");
						}
					}
					if($("#inpage").val()=="contentfichaje"){												
						if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow){
							navigate('end');	
							$("#rowselected").val(parseInt($("#planillapres tbody").find(".ezActiveRow").attr("id").split("_")[1]));							
						}
					}				
				break;				
				case 109:	
					if($("#inpage").val()=="presentismo"){		
						if(parseInt($("#nomenos").val())==0){		
							if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow){
								sacarpresentismo();
								/*if(parseInt($("#hizoMenos").val())==0){								
									$("#hizoMenos").val("1");
									$("#hizoEnter").val("0");
									$("#planillapres tbody").find(".ezActiveRow").click();		
									
								}*/
							}
						}
					}
				break;
				case 13: //enter
					if($("#inpage").val()=="presentismo"){		
						if(!o.editable){ 						
							if(!o.onValidateRow && !o.onValidateCell){
								if(parseInt($("#noenter").val())==0){		
									if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow){
										confirmarpresentismo();
										/*if(parseInt($("#hizoEnter").val())==0){
											$("#hizoEnter").val("1")													
											$("#hizoMenos").val("0");
											var  trclick = $("#planillapres tbody").find(".ezActiveRow");																						
											trclick.click();											
										}*/
									}
								}
							}						
						}
					}
				break;
				case 113: //F2
				break;
				case 17: //crtl	
					if(($("#inpage").val()=="presentismo") || ($("#inpage").val()=="contentfichaje") ){		
						if(!o.editable || (o.editable && !ed.activeCellEditor) && !ed.activeRow){								  
							if(parseInt($("#hizobarra").val())==0){
								$("#hizobarra").val("1");								
								$("#trid_"+$("#rowselected").val()).click();
								enablediv("divdatosplanilla");
							}
						}
					}					
				break;
			}
			if(o.editable && o.openEditorAction=='click') ed.Edit(e);
		}
	};//Selection
}

EditTable.prototype = {
	Init: function(){
		this.Css.Add(this.table, this.tableCss+' '+this.unselectableCss);
		this.Selection.Init();
		this.Editable.Init();
	},
	GetCellsNb: function(rowIndex){
		var tr = (rowIndex == undefined) ? this.table.rows[this.startRow] : this.table.rows[rowIndex];
		return tr.cells.length;
	},
	GetRowsNb: function(){ return this.table.rows.length; },
	GetRow: function(e){ return this.GetElement(e, 'tr'); },
	GetRowByIndex: function(rowIndex){ return this.table.rows[rowIndex]; },
	GetCell: function(e){ return this.GetElement(e, 'td') || this.GetElement(e, 'th'); },
	GetTableFromElement: function(elm){
		if(!elm) return null;
		while(elm.parentNode){
			if(elm.nodeName.UCase() == 'TABLE') return elm;
			elm = elm.parentNode;
		}
		return null;
	},
	GetElement: function(e, tagName){
		var elm, target = this.Event.GetElement(e);
		while(target.parentNode){
			if(target.nodeName.UCase() == tagName.UCase()
				&& this.IsParentValid(target)){
				elm = target; break;
			}
			target = target.parentNode;
		}
		return elm;
	},
	IsParentValid: function(elm){
		while(elm.parentNode){
			if(elm.nodeName.UCase() == 'TABLE'){
				if(elm.id == this.id) return true;
				else return false;
			}
			elm = elm.parentNode;
		}
		return false;
	},
	IsSelectable: function(){ return this.selection; },
	IsEditable: function(){ return this.editable; },
	ClearSelections: function(){ this.Selection.ClearSelections(); },
	IsObj: function(o){ return (o && o.constructor == Object); },
	IsFn: function(fn){ return (fn && fn.constructor == Function); },
	IsArray: function(a){ return (a && a.constructor == Array); },
	Get: function(id){ return document.getElementById(id); },
	Tag: function(o, tagname){ if(!o) return null; else return o.getElementsByTagName(tagname); },
	GetText: function(n){
		if(!n) return '';
		var s = n.textContent || n.innerText || n.innerHTML.replace(/\<[^<>]+>/g, '');
		return s.replace(/^\s+/, '').replace(/\s+$/, '').Trim();
	},
	CreateElm: function(tag){
		if(tag==undefined || tag==null || tag=='') return;
		var el = document.createElement(tag);
		if(arguments.length>1){
			for(var i=0; i<arguments.length; i++){
				var argtype = typeof arguments[i];
				if(argtype.LCase() == 'object' && arguments[i].length == 2)
					el.setAttribute(arguments[i][0],arguments[i][1]);
			}
		}
		return el;
	},
	CreateText: function(text){ return document.createTextNode(text) },
	StandardBody: function(){
		return (document.compatMode=="CSS1Compat") ? document.documentElement : document.body;
	},
	Css: {
		Has: function(elm,cl){
			if(!elm) return false;
			return elm.className.match(new RegExp('(\\s|^)'+cl+'(\\s|$)'));
		},
		Add: function(elm,cl){
			if(!elm) return;
			if(!this.Has(elm,cl))
				elm.className += ' '+cl;
		},
		Remove: function(elm,cl){
			if(!elm) return;
			if(!this.Has(elm,cl)) return;
			var reg = new RegExp('(\\s|^)'+cl+'(\\s|$)');
			elm.className = elm.className.replace(reg,'');
		}
	},
	Event: {
		Add: function(obj,event_name,func_name){
			if(obj.attachEvent)
				obj.attachEvent('on'+event_name, func_name);
			else if(obj.addEventListener)
				obj.addEventListener(event_name,func_name,true);
			else obj['on'+event_name] = func_name;
		},
		Remove: function(obj,event_name,func_name){
			if(obj.detachEvent)
				obj.detachEvent('on'+event_name,func_name);
			else if(obj.removeEventListener)
				obj.removeEventListener(event_name,func_name,true);
			else obj['on'+event_name] = null;
		},
		Get: function(e){
			return e || window.event;
		},
		GetElement: function(e){
			return (e && e.target) || (event && event.srcElement);
		},
		GetKey: function(e){
			var evt = this.Get(e);
			var key = (evt.charCode) ? evt.charCode:
						((evt.keyCode) ? evt.keyCode: ((evt.which) ? evt.which : 0));
			return key;
		},
		Stop: function(e){
			var evt = this.Get(e);
			if(evt.stopPropagation) evt.stopPropagation();
			else evt.cancelBubble = true;
		},
		Cancel: function(e){
			var evt = this.Get(e);
			if(evt.preventDefault) evt.preventDefault();
			else evt.returnValue = false;
		}
	},
	IncludeFile: function(fileId, filePath, callback, type){
		var ftype = (type==undefined) ? 'script' : type;
		var x = this, isLoaded = false, file;
		var head = this.Tag(document,'head')[0];
		if(ftype.LCase() == 'link')
			file = this.CreateElm('link', ['id',fileId],['type','text/css'],['rel','stylesheet'],['href',filePath]);
		else
			file = this.CreateElm('script', ['id',fileId],['type','text/javascript'],['src',filePath]);

		file.onload = file.onreadystatechange = function(){
		//Browser <> IE onload event works only for scripts, not for stylesheets
			if(!isLoaded && 
				(!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete'))
			{
				isLoaded = true;
				if(typeof callback === 'function'){
					head.removeChild(file);
					callback.call(null,x, this);
				}
			}
		}
		head.appendChild(file);
	},
	Sort:{
		NumAsc: function(a, b){ return (a-b); },
		NumDesc: function(a, b){ return (b-a); },
		IgnoreCase: function(a, b){
			var x = a.LCase();
			var y = b.LCase();
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		}
	}
};

String.prototype.LCase = function(){ return this.toLowerCase(); }
String.prototype.UCase = function(){ return this.toUpperCase(); }
String.prototype.Trim = function(){//optimised by Anthony Maes
	return this.replace(/(^[\s\xA0]*)|([\s\xA0]*$)/g,'');
}
String.prototype.RegexpEscape = function(){
	var s = this;
	function escape(e){
		a = new RegExp('\\'+e,'g');
		s = s.replace(a,'\\'+e);
	}
	chars = new Array('\\','[','^','$','.','|','?','*','+','(',')','�');
	for(var e=0; e<chars.length; e++) escape(chars[e]);
	return s;
}
Object.prototype.hasProp = function(prop){ return this.hasOwnProperty(prop); }
if(!Array.prototype.indexOf){
	Array.prototype.indexOf = function(obj, start) {
		for (var i = (start || 0), j = this.length; i < j; i++)
			if (this[i] === obj) { return i; }
		return -1;
	}
}

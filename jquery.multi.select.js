(function($, window){


	/**
	 * Defaults
	 */
	
	var defaults = {

		placeholder : 	"Please select",
		selectedText: "{{count}} item{{plural}} selected",
		selectAll   : 	true,
		template    : 	'<div class="multiselect">\
							<div class="multiselect-wrapper">\
								<div class="multiselect-selected"></div>\
								<div class="multiselect-dropdown">\
									<input type="text" class="multiselect-input" placeholder="Enter keywords">\
									<ul class="multiselect-list"></ul>\
								</div>\
							</div>\
							<div class="multiselect-tags"></div>\
						</div>',
		templateTag :   '<span class="multiselect-tag" data-index="">\
							<span class="multiselect-tagname"></span>\
							<button type="remove">Remove</button>\
						</span>',
		onChange    : 	null, /* On Change Event [pluginData, index, value, isSelected] */
		onInit      : 	null, /* On Init Event [this, newvalue] */
		showDisabled: 	true,
		useValueLabel : true
	}


	/**
	 * Variables
	 */
	
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test( (window.navigator.userAgent||window.navigator.vendor||window.opera) )


	/**
	 * Events
	 */
	
	var events = {

		'click.open .multiselect-selected'      : "open",
		'click.checkbox input[type="checkbox"]' : '_refreshCheckbox',
		'click button[type="remove"]'            : 'removeItem',
		'click' : '_handleClick',
		'keyup .multiselect-input': '_filterList'

	}

	/**
	 * Constructor
	 */
	

	function MultiSelect(el, options){
		

		/* References */

		this.el = el

		this.$el = $(el)


		/* Options */

		this.options = $.extend({}, defaults, options, this.$el.data())


		/* Select options */

		this.$eloptions = this.$el.find('option').not(':disabled')

		if(this.options.showDisabled){
			this.$eloptions = this.$el.find('option')			
		}

		/* Optgroup */

		this.$elgroup = this.$el.find('optgroup')

		/* All Children */

		this.$elchildren = this.$el.find('option, optgroup')


		/* Template References */

		this.$multiselect = $(this.options.template)

		
		/* Input */

		this.$filter = this.$multiselect.find('.multiselect-input')

		/* List */

		this.$list = this.$multiselect.find('.multiselect-list')

		/* Selected Item */

		this.$selected = this.$multiselect.find('.multiselect-selected')


		/* Tag Container */

		this.$tagcontainer = this.$multiselect.find('.multiselect-tags')


		/* Tag Template */

		this.$tagtemplate = $(this.options.templateTag)


		/* Append Multi Select to Select item */

		this.$multiselect.insertAfter(this.$el)


		/* Bind Change Event to rebuild Tags */

		this.$el
			.on('change.multiselect', this, this.refresh)
			.on('focus.multiselect', this, this.open)
			.on('blur.multiselect', this, this.close)


		/* Close on Click Outside */

		$('html').bind('click', $.proxy(this.close, this))

		/**
		 * Initialize
		 */
		
		this._initEvents()._init();

	}


	/**
	 * Prototype
	 */
	
	MultiSelect.prototype = {

		_init: function(){


			/* Check if Disalbed */
			
			if(this.$el.prop('disabled')) this.$multiselect.addClass('multiselect-disabled')


			/* Placeholder */

			this.$selected.text(this.options.placeholder)
			

			/* Append List */

			this._appendList()

			/* Add Active Class to the Select */

			this.$el.addClass('multiselect-enabled')
			

			/* Trigger Initialize Event */

			this.$el.trigger('multiselect.init')


			/* Fire Callback */

			if($.isFunction(this.options.onInit) ){
				this.options.onInit.call(this, data)
			}


			/* Call Refresh */

			this.refresh()

			
			return this

		},

		_initEvents: function(){

			for(var event in events){

				var e = event.split(/\s+/)
				
				if(events.hasOwnProperty(event)){
					
					this.$multiselect.on(e[0], e[1], this, this[events[event]])	
				}
			}

			return this

		},

		_appendList: function(){

			var self = this,				
				html = '',
				index = 0

			this.$elchildren.each(function(i, e){

				/* Check if the item or Optgroup is disabled */

				var isDisabled = e.disabled || e.parentNode.disabled
				

				/* Optgroup Found */

				if(e.tagName == 'OPTGROUP' && !(e.disabled && !self.options.showDisabled)){

					html+='<li class="multiselect-group">' + e.label + '</li>'

				}

				/* Option Found */

				if(e.tagName == 'OPTION' && !(isDisabled && !self.options.showDisabled)){

					html+= '<li><label>';

					html+= '<input data-index="' + index + '" type="checkbox"' + 
					(e.selected? "checked": "") + 
					(isDisabled? "disabled": "") + '>'

					html+= (self.options.useValueLabel? e.value: e.textContent) + '</label></li>'

					index++
				}
			})

			this.$list.html(html)

		},

		_handleClick: function(event){

			var data = event.data

			$('.multiselect').not(data.$multiselect).removeClass('multiselect-active');

			event.stopPropagation()
		},

		_filterList: function(event){

			var data = event.data,
				needle = $(event.currentTarget).val().toLowerCase(),
				$children = data.$list.children().not('.multiselect-group')

			$children.hide()
			
			if(needle){
				data.$list.children().each(function(i, el){

					if(el.textContent.
						toLowerCase().indexOf(needle) != -1){

						$(this).show()
					}

				})
			}else{

				$children.show();
			}

		},

		_refreshCheckbox: function(event){


			var data = event.data,			
				$this = $(event.currentTarget)
				checked = $this.prop('checked'),
				index = $this.data('index')
			
			var value = data.$eloptions
							.eq(index)
							.prop('selected', checked)	
							.val()

			/* Trigger Change Event */

			data.$el.trigger('change')


			/* Change Callback */

			if($.isFunction(data.options.onChange) ){
				data.options.onChange.call(this, data, index, value, checked)
			}			
			

		},

		_rebuildCheckbox: function(event){


			var data = event? event.data : this,
				count = 0,
				text = data.options.placeholder

			data.$eloptions.each(function(i, el){

				if(!el.disabled && !el.parentNode.disabled){

					data.$multiselect
						.find(':checkbox')
						.eq(i)
						.prop('checked', el.selected)

					if(el.selected) count++

				}

			})


			/* Updated Placeholder Text */

			if(count) text = data.options.selectedText
							.replace('{{count}}', count)
							.replace('{{plural}}', count > 1? 's': '');

			data.$selected.text(text)

		},

		_rebuildTags: function(event){


			var self = this,
				data = event? event.data : this				

			data.$tagcontainer.empty()
			

			data.$eloptions.each(function(i, el){
				
				if(el.selected && !el.disabled){

					var tagtemplate = self.$tagtemplate.clone()

					tagtemplate
						.data('index', i)
						.find('.multiselect-tagname')
						.text(self.options.useValueLabel? el.value : el.textContent)

					data.$tagcontainer.append(tagtemplate)

				}
			})

		},

		removeItem: function(event, index){

			var data = event? event.data : this,
				index = $(this).parent().data('index')				


			data.$eloptions
				.eq(index)
				.prop('selected', false)	


			/* Trigger Select Change */

			data.$el.trigger('change')

		},

				

		api: {

		}
	}


	
	


	/**
	 * Methods
	 */
	
	var methods = {

		selectItem: function(value){


			/* Select the Item and trigger Change */

			this.$el.val(value).trigger('change')

		},

		destroy: function(){

			
			/**
			 * Remove Event Bindings
			 */
			
			for(var event in events){

				var e = event.split(/\s+/)
				
				if(events.hasOwnProperty(event)){
					
					this.$multiselect.off(e[0], e[1])	
				}
			}

			/* Remove change event for the Element */

			this.$el.off('change.multiselect')

			/* Remove Multi Select */

			this.$multiselect.remove()


			/* Remove Active Class from Select */

			this.$el.removeClass('multiselect-enabled')


			/* Trigger Initialize Event */

			this.$el.trigger('multiselect.afterDestroy')
			
		},

		refresh: function(event){

			
			var data = event? event.data : this
			

			/* Refresh Tags */

			data._rebuildTags()


			/* Handle Checkboxes */

			data._rebuildCheckbox(event)


			/* Trigger Initialize Event */

			data.$el.trigger('multiselect.afterRefresh')

		},

		open: function(event){

			var data = event? event.data : this

			if(data.$el.prop('disabled')) return ;

			data.$multiselect.toggleClass('multiselect-active')

		},

		close: function(event){

			$('.multiselect').removeClass('multiselect-active')
		}
	}


	/**
	 * Extend Prototype
	 */
	
	MultiSelect.prototype = $.extend({}, MultiSelect.prototype, methods)



	/**
	 * Plugin Method
	 */
	
	$.fn.extend({

		multiselect: function(options){

			return this.each(function(){

				var $this = $(this),
					multiselect = $this.data('multiselect')

				/*
				If you are passing a method
				 */
				if(typeof options == "string" && multiselect && methods.hasOwnProperty(options)){

					multiselect[options].apply(multiselect)

				}else{

					/*
					Initialize the plugin
					 */

					$this.data('multiselect', new MultiSelect(this, options))

				}


			})
		}
	})


})(jQuery, window, undefined)
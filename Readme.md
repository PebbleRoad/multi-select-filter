# jQuery Multi - Select pattern with checkboxes 

## TBC


## Options

    var defaults = {

        placeholder :   "Please select",
        selectedText:   "{{count}} item{{plural}} selected",
        selectAll   :   true,
        template    :   '<div class="multiselect">\
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
        onChange    :   null, /* On Change Event [pluginData, index, value, isSelected] */
        onInit      :   null, /* On Init Event [this, newvalue] */
        showDisabled:   true,
        useValueLabel : true

    }


## Methods

* destroy
* init
* refresh
* open
* close

## Events

* After Initialized
* After Refresh
* After close
* After Open
* After destroy

## Todo

* Keyboard navigation
* Focus/blur
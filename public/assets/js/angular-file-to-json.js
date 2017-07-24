var ngFileToJson = angular.module('ngFileToJson',[]);

ngFileToJson.directive('ngFileToJson', function(){
    'use strict';

    var module,
        splitColumns,
        createObject,
        cleanUpString,
        parseString,
        validTypes = ['string', 'number', 'object', 'boolean', 'array'];

    // module to be returned
    module = {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
            result: '=',
            headerField: '@headerField',
            typeField: '@typeField',
            delimiter: '@delimiter',
            rowDelimiter: '@rowDelimiter'
        },
        template: '<div><input ng-model="uploadFile" type="file"></div>',
        link: function(scope, element){
            // when the element changes (eg. file selected) the HTML5 FileReader will load the file
            element.on('change', function(event){
                var uploadedFile = new FileReader();

                uploadedFile.readAsBinaryString(event.target.files[0]);

                uploadedFile.onload = function(e){
                    scope.$apply(function(){
                        scope.result = createObject(e.target.result, scope);
                    });
                };
            });
        }
    };

    // The function that actually converts the string into an object
    createObject = function(str, overrides) {
        var options = {
            headerField: 'true',
            typeField: 'false',
            delimiter: ',',
            rowDelimiter: '\n'
        };

        // override the defaults if set in the attributes
        options.headerField = overrides.headerField || options.headerField;
        options.typeField = overrides.typeField || options.typeField;
        options.delimiter = overrides.delimiter || options.delimiter;
        options.rowDelimiter = overrides.rowDelimiter || options.rowDelimiter;

        var obj = [],
            rows,
            row,
            columns,
            header,
            types = [],
            items,
            i,
            value;

        options.headerField = options.headerField && options.headerField === 'true' ? true : false;
        options.typeField = options.typeField && options.typeField === 'true' ? true : false;


        rows = cleanUpString(str).split(options.rowDelimiter);

        if(options.headerField){
            // set keys
            row = rows.shift();
            header = row.split(options.delimiter);
        }

        if(options.typeField){
            // set type
            row = rows.shift();
            types = row.split(options.delimiter);

            // check for valid types
            for(i = 0; i < types.length; i++){
                if(validTypes.indexOf(types[i].toLowerCase()) === -1){
                    types[i] = 'string';
                } else {
                    types[i] = types[i].toLowerCase();
                }
            }
        }

        while(rows.length > 0){
            // set values
            row = rows.shift();
            columns = splitColumns(row, options.delimiter);

            // if header row exists use this for the keys
            if(header){
                items = {};
                for(i = 0; i < columns.length; i++){
                    if(types.length && types[i]){
                        // if the types array is set
                        value = parseString(types[i], columns[i]);
                        items[header[i] || ''] = value;
                    } else {
                        // set the key/value
                        items[header[i] || ''] = columns[i];
                    }
                }
                obj.push(items);

            // otherwise will be an array
            } else {
                items = [];
                for(i = 0; i < columns.length; i++){
                    value = parseString(types[i], columns[i]);
                    items.push(value);
                }
                obj.push(items);
            }
        }

        // return compiled JSON object
        return obj;
    };

    // special function to split row into columns using a delimiter since RegEx does not have a good way to do this
    splitColumns = function(row, delimiter){
        var characters = row.split(''),
            inQuotes = false,
            indexes = [],
            i,
            lastIndex = 0,
            columns = [];

        // if a delimiter is between two double quotes, then it is part of the string and not counted
        for(i = 0; i < characters.length; i++){
            if(characters[i] === '"'){
                inQuotes = !inQuotes;
            }

            if(!inQuotes && characters[i] === delimiter){
                indexes.push(i);
            }
        }

        // all indexes are now used to split the columns
        if(indexes.length) {
            for(i = 0; i < indexes.length; i++){
                columns.push(row.slice(lastIndex, indexes[i]));
                lastIndex = indexes[i] + 1;
            }
            // last column
            columns.push(row.slice(lastIndex, characters.length));
        }

        return columns;
    };

    // helper function to clean up line breaks
    // this breaks down the string into characters, removes the carriage return, and builds the string again
    // it also replaces invalid characters inserted by spreadsheets and other text editors
    cleanUpString = function(str){
        var arr = str.split(''),
            i;

        // start from the last item since items will be removed which will mess up the loop
        for(i = arr.length - 1; i >=0; i--){
            if(arr[i] === '\r'){
                arr.splice(i, 1);
            }
        }

        str = arr.join('');

        // smart single quotes and apostrophe
        str = str.replace(/[\u2018\u2019\u201Aâ]/g, "\'");
        // smart double quotes
        str = str.replace(/[\u201C\u201D\u201E]/g, "\"");
        // ellipsis
        str = str.replace(/\u2026/g, "...");
        // dashes
        str = str.replace(/[\u2013\u2014]/g, "-");
        // circumflex
        str = str.replace(/\u02C6/g, "^");
        // open angle bracket
        str = str.replace(/\u2039/g, "<");
        // close angle bracket
        str = str.replace(/\u203A/g, ">");
        // spaces
        str = str.replace(/[\u02DC\u00A0]/g, " ");

        return str;
    };

    parseString = function(type, value){
        var obj,
            arr;

        switch(type) {
            case 'string':
                return String(value);
            case 'number':
                return parseInt(value);
            case 'object':
                if(value) {
                    value = value.replace(/^"|"$/g, '');
                    try {
                        obj = JSON.parse(JSON.stringify(eval("(" + value + ")")));
                    } catch(e){
                        return {};
                    }
                    return obj;
                } else {
                    return {};
                }
                break;
            case 'array':
                if(value) {
                    try {
                        obj = [];
                        value = value.replace(/^"?\[|\]"?$/g, '');
                        arr = value.split(',');
                        angular.forEach(arr, function(item) {
                            if((item.toLowerCase().indexOf('true') > -1) || (item.toLowerCase().indexOf('false') > -1)){
                                obj.push(parseString('boolean', item));
                            } else if(item.indexOf('{') > -1){
                                obj.push(parseString('object', item));
                            } else if(item.indexOf('[') > -1){
                                obj.push(parseString('array', item));
                            } else if(item.indexOf("'") > -1){
                                item = item.replace(/["']/g, '');
                                obj.push(parseString('string', item));
                            } else if(item.match(/\d/)){
                                obj.push(parseString('number', item));
                            }
                        });
                    } catch(e){
                        return [];
                    }
                    return obj;
                } else {
                    return [];
                }
                break;
            case 'boolean':
                return Boolean(value.toLowerCase());
            default:
                return String(value);
        }
    };

    // Expose directive
    return module;
});

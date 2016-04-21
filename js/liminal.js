const transitions = {
	functionopen: [{F: 1, action: 'newword'}],
	type: [
		{F: 0.6, action: 'type'}, 
		{F: 0.7, action: 'delete'}, 
		{F: 0.8, action: 'newword'}, 
		{F: 0.9, action: 'newline'}, 
		{F: 1, action: 'pause'}
	],
	newword: [
		{F: 1, action: 'type'}
	],
	delete: [
		{F: 0.3, action: 'delete'}, 
		{F: 1, action: 'newword'}
	],
	newline: [
		{F: 1, action: 'pause'}
	],
	pause: [
		{F: 0.5, action: 'pause'}, 
		{F:0.8, action: 'newword'}, 
		{F: 0.9, action: 'moveup'}, 
		{F: 1, action: 'movedown'}
	],
	movedown: [
		{F: 0.7, action: 'movedown'}, 
		{F: 0.8, action: 'pause'}, 
		{F: 1, action: 'newword'}
	],
	moveup: [
		{F: 0.7, action: 'moveup'}, 
		{F: 0.8, action: 'pause'}, 
		{F: 1, action: 'newword'}
	]
};

const codeColors = [
	'gray', 
	'gray', 
	'gray', 
	'gray', 
	'gray', 
	'green', 
	'orange', 
	'violet'
];

var timer = null;
var posRow = 0;
var posCol = 0;
var container = document.getElementById('code-hero');
var firstRow;
var cursor;
var state = {
	pos: {
		row: 0,
		col: 0
	},
}

var start = function () {
	container.innerHTML = null;
	posRow = 0;
	posCol = 0;
	cursorBlink = false;
	firstRow = document.createElement('div');
	cursor = document.createElement('span');
	firstRow.className = 'code-row';
	container.appendChild(firstRow);
	cursor.className = 'code-cursor';
	cursor.id = 'code-cursor';
	firstRow.appendChild(cursor);
	if (timer) clearTimeout(timer);
	codeFrame('functionopen');
};

var stop = function () {
	if (timer) clearTimeout(timer)
};

var carriageReturn = function (indent) {
	var lines = container.childNodes;
	var line = lines[posRow];
	var newline = document.createElement('div');

	newline.classList.add('code-row');
	if (indent || indent === 0)
		newline.classList.add('code-row--indent-' + indent);
	else if (line.classList.contains('code-row--indent-1'))
		newline.classList.add('code-row--indent-1');
	else if (line.classList.contains('code-row--indent-2')) 
		newline.classList.add('code-row--indent-2');

	if (posRow === lines.length - 1) container.appendChild(newline);
	else container.insertBefore(lines[posRow + 1], line);
	posCol = 1;
	moveTo(posRow + 1);
}

var addWord = function (width, color) {
	var lines = container.childNodes
	var line = lines[posRow];
	var newword;
	newword = document.createElement('span');
	newword.className = 'code-word';
	newword.style.width = (width || 20) + 'px';
	if (color) newword.style.borderColor = color
	line.insertBefore(newword, cursor);
	posCol++;
}

var moveTo = function (pos) {
	var lines = container.childNodes
	var oldline
	var newline

	pos = Math.max(Math.min(pos, lines.length - 1), 1)
	oldline = lines[posRow];
	newline = lines[pos];
	posRow = pos;

	oldline.classList.remove('code-row--hilite');
	newline.classList.add('code-row--hilite');
	posCol = Math.min(posCol, newline.childNodes.length);

	if (posCol >= newline.childNodes.length) newline.appendChild(cursor)
	else newline.insertBefore(cursor, newline.childNodes[posCol])
}

var codeFrame = function (action) {
	var cursor = document.getElementById('code-cursor');
	var lines = container.childNodes;
	var line = lines[posRow];
	var words = line.childNodes;
	var word = words[posCol - 1];
	var col = Math.min(posCol, words.length);
	var direction = action === 'moveup' ? -1 : 1;

	var rand = Math.random();
	var nextAction;

	transitions[action].some(function (transition) {
		if (transition.F > rand) {
			nextAction = transition.action;
			return true;
		} else return false;
	})
	
	if (words.length > 6 && (action === 'type' || action === 'newword')) 
		action = 'newline';

	switch(action) {
		case 'functionopen':
			addWord(50, 'green');
			addWord(100);
			carriageReturn(1);
			addWord(30);
			carriageReturn(1);
			carriageReturn(1);
			moveTo(posRow -2);
			break;
		case 'type':
			if (word && word !== cursor) {
				var width = parseInt(word.style.width.slice(0, -2)) || 0;
				word.style.width = (width + 20) + 'px';
				if (nextAction !== 'type') word.style.borderColor = codeColors[Math.floor(Math.random() * codeColors.length)]
				break;
			}
		case 'newword':
			addWord	(20);
			break;
		case 'delete':
			if (word && word !== cursor) line.removeChild(word)
			posCol--;
			break;
		case 'newline':
			carriageReturn()
			break;
		case 'movedown':
			moveTo(posRow - 1)
			break;
		case 'moveup':
			moveTo(posRow + 1)
			break;
	}

	if (lines.length > 15) {
		start();
		timer = setTimeout(codeFrame.bind(null, 'functionopen'), 100)
	} else timer = setTimeout(codeFrame.bind(null, nextAction), nextAction === 'pause' ? 500 : 70);
}

start()

/*
 * global Modernizr 
 */
 
(function ($) {
	'use strict';

	var ScrollHijack = function (context) {
	var api 		 = {};
	var $el          = $(context);
	var $body        = $('body');
	var $window      = $(window);
	var $slides      = $el.find('.scroll-hijack__slides__slide');
	var currentIndex = 0;
	var isTransitioning = false;
    
    function transitionEnd () {
     	var transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
			'MozTransition'    : 'transitionend',      // only for FF < 15
			'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
      };
      return transEndEventNames[ Modernizr.prefixed('transition') ];
    }

	function next () {
		if (currentIndex < $slides.length - 1) {
			isTransitioning = true;
			$slides.eq(currentIndex).one(transitionEnd(), function () {
				isTransitioning = false;
			});
			$slides.eq(currentIndex).addClass('out');
			currentIndex++;
		}
	}

	function prev () {
		if (currentIndex > 0) {
			currentIndex--;
			isTransitioning = true;
			$slides.eq(currentIndex).one(transitionEnd(), function () {
				isTransitioning = false;
			})
			$slides.eq(currentIndex).removeClass('out');
		}
		else {
		}
	}
    
    function onMouseWheel (e) {
		var e = e.originalEvent ? e.originalEvent : e;

		// normalize mouse wheel event
		var delta = e.wheelDelta ? e.wheelDelta / 40 : e.detail ? -e.detail / 3 : 0;

		if (isTransitioning) {
			return;
		}

		if (delta < 0) {
			next();
			return e.preventDefault() && false;
		}
		else if (delta > 0) {
			prev();
			return e.preventDefault() && false;
		}
	}

	function onKeyUp (e) {
		if (e.keyCode === 40) {
		 next();
		}
		else if (e.keyCode === 38) {
		 prev();
		}
	}
 	
	api.init = function () {

		var handleScroll = 
			$window.on("DOMMouseScroll mousewheel", onMouseWheel);
			$window.on("keyup", onKeyUp);
		   
		Hammer($el[0]).on("swipeup", function () {
			setTimeout(next, 0);
		});
		Hammer($el[0]).on("swipedown", function () {
			setTimeout(prev, 0);
		});
      
		};

		return api;
	};

	new ScrollHijack( $('.js-component-scroll-hijack') ).init();


}(jQuery));

 
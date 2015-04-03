function quote(text) {
	if (document.selection) {
		document.post.com.focus();
		var sel = document.selection.createRange();
		sel.text = ">>" + text + "\n";
	} else if (document.post.com.selectionStart || document.post.com.selectionStart == "0") {
		var startPos = document.post.com.selectionStart;
		var endPos = document.post.com.selectionEnd;
		document.post.com.value = document.post.com.value.substring(0, startPos) + ">>" + text + "\n" + document.post.com.value.substring(endPos, document.post.com.value.length);
	} else {
		document.post.com.value += ">>" + text + "\n";
	}
}

function repquote(rep) {
	if (document.post.com.value == "") {
		quote(rep);
	}
}

function reppop(url) {
	var day = new Date();
	var id = day.getTime();
	window.open(url, id, 'toolbar=0,scrollbars=0,location=0,status=1,menubar=0,resizable=1,width=660,height=192');
	return false;
}

function recaptcha_load() {
	var d = document.getElementById("recaptcha_div");
	if (!d) return;

	Recaptcha.create("6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc", "recaptcha_div",{theme: "clean"});
}

function onParsingDone(e) {
  var i, c, nodes, n, p, uid;
  
  if (e.detail) {
    nodes = document.getElementsByClassName('nameBlock');
    for (i = e.detail * 2 + 1; nodes[i]; i+=2) {
      n = nodes[i].children[1];
      if (currentHighlighted
        && n.className.indexOf('id_' + currentHighlighted) != -1) {
        p = n.parentNode.parentNode.parentNode;
        p.className = 'highlight ' + p.className;
      }
      n.addEventListener('click', idClick, false)
    }
  }
}

function toggleMobilePostForm(index, scrolltotop) {
	elem = document.getElementById('mpostform');
	postForm = document.getElementById('postForm');

	if( elem.className.match('hidden') ) {
		elem.className = elem.className.replace('hidden', 'shown');
		postForm.className = postForm.className.replace(' hideMobile', '');

		elem.innerHTML = 'Close Post Form';
	} else {
		elem.className = elem.className.replace('shown', 'hidden');
		postForm.className += ' hideMobile';

		elem.innerHTML = (index) ? 'Start a Thread' : 'Reply to Thread';
	}

	if( scrolltotop ) {
		window.scroll(0,0);
	}
}

function toggleGlobalMessage() {
	elem = document.getElementById('globalToggle');
	postForm = document.getElementById('globalMessage');

	if( elem.className.match('hidden') ) {
		elem.className = elem.className.replace('hidden', 'shown');
		postForm.className = postForm.className.replace(' hideMobile', '');

		elem.innerHTML = 'Close Announcement';
	} else {
		elem.className = elem.className.replace('shown', 'hidden');
		postForm.className += ' hideMobile';

		elem.innerHTML = 'View Important Announcement';
	}
}

function checkRecaptcha()
{
	if( typeof RecaptchaState.timeout != 'undefined' ) {
		if( RecaptchaState.timeout == 1800 ) {
			RecaptchaState.timeout = 570;
			Recaptcha._reset_timer();
			clearInterval(captchainterval);
		}
	}
}

var activeStyleSheet;

function initStyleSheet() {
	// hack for people on old things
	if (typeof style_group != "undefined" && style_group) {
		var cookie = readCookie(style_group);
		activeStyleSheet = cookie ? cookie : getPreferredStyleSheet();
	}

	switch(activeStyleSheet) {
	case "Yotsuba B":
		setActiveStyleSheet("Yotsuba B New", true);
		break;

	case "Yotsuba":
		setActiveStyleSheet("Yotsuba New", true);
		break;

	case "Burichan":
		setActiveStyleSheet("Burichan New", true);
		break;

	case "Futaba":
		setActiveStyleSheet("Futaba New", true);
		break;

		default:
			setActiveStyleSheet(activeStyleSheet, true);
		break;
	}
}

captchainterval = null;
function init() {
	var board = location.href.match(/4chan\.org\/(\w+)/)[1];
	var arr = location.href.split(/#/);
	if( arr[1] && arr[1].match(/q[0-9]+$/) ) {
		repquote( arr[1].match(/q([0-9]+)$/)[1] );
	}


	if (typeof jsMath != "undefined" && typeof jsMath.Easy.onload != "undefined" && !jsMath.Easy.loaded) jsMath.Easy.onload();

	if(navigator.userAgent) {
		if( navigator.userAgent.match( /iP(hone|ad|od)/i ) ) {
			links = document.querySelectorAll('.spoiler');
			len = links.length;

			for( var i = 0; i < len; i++ ) {
				links[i].onclick = function() {
					this.setAttribute('style', ( this.getAttribute('style').match('fff') ? 'color: #000!important;' : 'color: #fff!important;' ) );
				}
			}
		}
	}

	if( document.getElementById('styleSelector') ) {
        styleSelect = document.getElementById('styleSelector');
        len = styleSelect.options.length;
        for ( var i = 0; i < len; i++) {
            if (styleSelect.options[i].value == activeStyleSheet) {
                styleSelect.selectedIndex = i;
                continue;
            }
        }
    }

	document.getElementById('delPassword').value = get_pass('4chan_pass');

	window.addEventListener('onhashchange', locationHashChanged, false);

	if( board != 'i' && board != 'ic' && board != 'f' ) {
		if (window.File && window.FileReader && window.FileList && window.Blob) {
  			document.getElementById('postFile').addEventListener('change', handleFileSelect, false);
		}
	}

	if( typeof extra != "undefined" && extra ) extra.init();
}

function contentLoaded()
{
	try {
		document.getElementsByClassName('recaptcha_image_cell')[0].setAttribute('style', 'padding: 0px!important; padding-bottom: 3px!important;');
	} catch(err){}

	//if( check_for_block ) checkForBlock();
	if( clickable_ids ) enableClickableIds();
}

var adHolder = null;
var adHolderLen = 0;
function checkForBlock()
{
	adHolder = document.querySelectorAll('div > a > img[src*=support]');
	adHolderLen = adHolder.length;
	var hasSeenAd = 0;
	var i = 0;

	for( i = 0; i < adHolderLen; i++ ) {
		if( adHolder[i].offsetWidth == 468 || adHolder[i].offsetWidth == 728 ) hasSeenAd = 1;
	}

	if( !hasSeenAd ) plea();
}

function plea()
{
	var width = 0;
	var height = 0;

	var i = 0;
	for( i = 0; i < adHolderLen; i++ ) {
		if( adHolder[i].getAttribute('src').match( '728' ) ) continue;

		//var blockPleaBuilt = '<div style="border: 1px solid #000; width: ' + width + 'px; margin: 0 auto;"><div style="position: relative; top: 0; right: 0; width: ' + (width - 4) + 'px; margin: 0 auto -15px auto; text-align: right;">[X]</div><table style="height: ' + height + 'px;"><tr><td>' + blockPlea + '</td></tr></table></div>';
		var blockPleaBuilt = '<a href="//www.4chan.org/adplea" target="_new">' + blockPlea + '</a>';

		adHolder[i].parentNode.parentNode.innerHTML = blockPleaBuilt;
	}
}


var currentHighlighted = null;
function enableClickableIds()
{
	var i = 0, len = 0;
	var elems = document.getElementsByClassName('posteruid');
	var capcode = document.getElementsByClassName('capcode');

	if( capcode != null ) {
		for( i = 0, len = capcode.length; i < len; i++ ) {
			capcode[i].addEventListener("click", idClick, true);
		}
	}

	if( elems == null ) return;
	for( i = 0, len = elems.length; i < len; i++ ) {
		elems[i].addEventListener("click", idClick, true);
	}
}

function idClick(evt)
{
	var i = 0, len = 0, node;
	var uid = evt.target.className == 'hand' ? evt.target.parentNode.className.match(/id_([^ $]+)/)[1] : evt.target.className.match(/id_([^ $]+)/)[1];

	// remove all .highlight classes
	var hl = document.getElementsByClassName('highlight');
	len = hl.length;
	for( i = 0; i < len; i++ ) {
		var cn = hl[0].className.toString();
		hl[0].className = cn.replace(/highlight /g, '');
	}

	if( currentHighlighted == uid ) {
		currentHighlighted = null;
		return;
	}

	currentHighlighted = uid;

	var nhl = document.getElementsByClassName('id_' + uid);
	len = nhl.length;
	for( i = 0; i < len; i++ ) {
		node = nhl[i].parentNode.parentNode.parentNode;
		if( !node.className.match(/highlight /) ) node.className = "highlight " + node.className;
	}
}

function handleFileSelect(evt)
{
	var fileSize = evt.target.files[0].size;
	document.getElementById('fileError').innerHTML = '';

	if( fileSize > maxFilesize ) {
		document.getElementById('fileError').innerHTML = '<span style="font-weight:bold;padding:5px;color:red;">' + file_too_big + '</span>';
	}
}

function locationHashChanged()
{
	if( window.location.href.match(/#(top|bottom)_r$/) ) {
		var newHash = window.location.href.match(/#((top|bottom)_r)/)[1];
	} else {
		return true;
	}

	switch( newHash )
	{
		case 'top_r':
			window.location = window.location.href.replace(/#top_r/, '#top');
			window.location.reload();
			break;

		case 'bottom_r':
			window.location = window.location.href.replace(/#bottom_r/, '#bottom');
			window.location.reload();
			break;

		default:break;
	}

	return true;

}

function setActiveStyleSheet(title, init) {

    if( document.querySelectorAll('link[title]').length == 1 ) {
        return;
    }

    var a;
    var link;
    var href = '';
    for (var i = 0; (a = document.getElementsByTagName("link")[i]); i++) {
          if (a.getAttribute("title") == "switch")
               link = a;
          if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
                if (a.getAttribute("title") == title) {
                    href = a.href;
                    }
               }
    }

    link.setAttribute("href", href);
    
    if (!init) {
      createCookie(style_group, title, 365, ".4chan.org");
    }
}

function getActiveStyleSheet() {
	var i, a;
	var link;

    if( document.querySelectorAll('link[title]').length == 1 ) {
        return 'Yotsuba P';
    }

	for (i = 0; (a = document.getElementsByTagName("link")[i]); i++) {
		if (a.getAttribute("title") == "switch")
               link = a;
		else if (a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && a.href==link.href) return a.getAttribute("title");
	}
	return null;
}

function getPreferredStyleSheet() {
	return (style_group == "ws_style") ? "Yotsuba B New" : "Yotsuba New";
}

function createCookie(name, value, days, domain) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else expires = "";
	if (domain) domain = "; domain=" + domain;
	else domain = "";
	document.cookie = name + "=" + value + expires + "; path=/" + domain;
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}

window.onload = init;

if (clickable_ids) {
  document.addEventListener('4chanParsingDone', onParsingDone, false);
}
document.addEventListener('DOMContentLoaded', contentLoaded, true);

initStyleSheet();
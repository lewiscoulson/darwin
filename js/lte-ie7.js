/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'CoopIcons\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-facebook' : '&#xe002;',
			'icon-twitter' : '&#xe003;',
			'icon-flickr' : '&#xe004;',
			'icon-search' : '&#xe000;',
			'icon-right_arrow' : '&#xe001;',
			'icon-phone' : '&#xe005;',
			'icon-padlock' : '&#xe006;',
			'icon-open_nav' : '&#xe007;',
			'icon-youtube' : '&#xe008;',
			'icon-linkedin' : '&#xe009;',
			'icon-location' : '&#xe00a;',
			'icon-FAQs' : '&#xe00b;',
			'icon-email' : '&#xe00c;',
			'icon-down_arrow' : '&#xe00d;',
			'icon-contact' : '&#xe00e;',
			'icon-close_nav' : '&#xe00f;',
			'icon-basket' : '&#xe010;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};
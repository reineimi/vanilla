/*
|	This code is licensed under VPCDP-1.0 - [https://github.com/eimirein/VPCDP]
|			by Eimi Rein (霊音・永旻) - @eimirein - [https://github.com/eimirein]
*/
"use strict"
// Return element by id
function emi(id) { if (document.getElementById(id)) { return document.getElementById(id) } else { return null } }
const va2 = {
	// Return all children of the element by tag
	tags: function(id, tag) { if (emi(id)) { return emi(id).querySelectorAll(tag) } },
	// Loop through a class using --> for (let v of classes('classname')) { ... }
	classes: function(_class) { if (document.getElementsByClassName(_class)) { return document.getElementsByClassName(_class) } },
	// Calculate percentage
	per: function(this_num, of_the) { return Math.round( (100 * this_num) / of_the ) },
	// Generate a random hexadecimal color
	hex: function() {
		return '#'+Math.floor(Math.random()*16777215).toString(16)
	},
	// Request full screen mode
	fs: function() {
		let em = document.documentElement
		if ( !em.fs || em.fs === 'false' ) {
			if (em.requestFullscreen) { em.requestFullscreen() }
			else if (em.webkitRequestFullscreen) { em.webkitRequestFullscreen() }
			else if (em.msRequestFullscreen) { em.msRequestFullscreen() }
			em.fs = 'true'
		}
		else if ( em.fs === 'true' ) {
			if (document.exitFullscreen) { document.exitFullscreen() }
			else if (document.webkitExitFullscreen) { document.webkitExitFullscreen() }
			else if (document.msExitFullscreen) { document.msExitFullscreen() }
			em.fs = 'false'
		}
	},
	// Generate a simple unique id, optionally put a string in the front
	uid: function(str) {
		return (str || '')+ Math.floor(Math.random() * 0xFFF).toString(16)
		+'-'+ Math.floor(Math.random() * 0xFFFFFF).toString(16).padEnd(6, '0')
	},
	// Return current local session time/date/timeElapsed as a string
	sessionStart: new Date(),
	time: function(separator) {
		let x = (separator || ':')
		let get_time = new Date()
		let hour = get_time.getHours()
		let min = get_time.getMinutes()
		let sec = get_time.getSeconds()
		if (hour.toString().length==1) {hour = '0'+hour}
		if (min.toString().length==1) {min = '0'+min}
		if (sec.toString().length==1) {sec = '0'+sec}
		return hour+x+min+x+sec
	},
	date: function(separator) {
		let x = (separator || '')
		let get_date = new Date()
		let dd = get_date.getDate()
		let mm = get_date.getMonth()+1
		let yyyy = get_date.getFullYear()
		if (dd.toString().length==1) {dd = '0'+dd}
		if (mm.toString().length==1) {mm = '0'+mm}
		return yyyy+x+mm+x+dd
	},
	elapsed: function() {
		let current = new Date()
		let dif = (current - va2.sessionStart)/1000
		let sec = Math.floor(dif%60)
		let min = Math.floor((dif/60)%60)
		let hour = Math.floor((dif/60)/60)%24
		return hour+'h '+min+'m '+sec+'s'
	},
	// Execute js from string after a cooldown
	wait: async function(ms, str) {
		await new Promise(resolve => setTimeout(resolve, ms)); eval(str)
	},
	// Changes text content for the selected ids on call
	txt: function(arr_ids, arr_or_str_text) {
		let t = arr_or_str_text
		let id = arr_ids
		for (let i=0; i<id.length; i++) {
			if (emi(id[i])) {
				if (typeof t == 'string') { emi(id[i]).textContent = t }
				else if (Array.isArray(t)) { emi(id[i]).textContent = t[i] }
			}
		}
	},
	// Copy text from the selected input or a string
	copy: function(id_or_str) {
		let data
		if (emi(id_or_str)) {
			const em = emi(id_or_str)
			em.select(); em.setSelectionRange(0, 99999)
			data = em.value
		} else { data = id_or_str }
		navigator.clipboard.writeText(data)
	},
	// Retrieve data from clipboard
	paste: async function() {
		let txt;
		await navigator.clipboard.readText().then((str) => { txt=str });
		return txt
	},
	// Print any data in the console and the element with id ["console"]
	print: function(...data) {
		let em = emi('console')
		data.forEach(function(msg) {
			if (em) {
				em.innerHTML = em.innerHTML + '['+va2.time()+'] '+(msg || 'nil').toString()
				em.appendChild(document.createElement('br'))
			}
			console.log('['+va2.time()+']: '+(msg || 'nil').toString())
		})
	},
	// Push a log entry in the console and the element with id ["log"]
	// 0=root 1=info 2=warn 3=error 4=crash
	log: function(lvl, ...data) {
		let em = emi('log')
		let levels = ['ROOT', 'INFO', 'WARN', 'ERROR', 'CRASH']
		data.forEach(function(msg) {
			if (em) {
				let levels = [
				"<x style='color:#95f'>ROOT</x>",
				"<x style='color:#5af'>INFO</x>",
				"<x style='color:#fc5'>WARN</x>",
				"<x style='color:#f62'>ERROR</x>",
				"<x style='color:#f09'>CRASH</x>" ]
				em.innerHTML = em.innerHTML+
				`<p>[<x style='color:#7fb'>${va2.time()}</x>][${levels[lvl]}]: `+(msg || 'nil').toString()+'</p>'
				em.appendChild(document.createElement('br'))
			}
			console.log(`[${va2.time()}][${levels[lvl]}]: `+(msg || 'nil').toString())
		})
	},
	// Open an url link, pass any value as a second argument to open the link in new tab
	href: function(https, any) {
		if (any) { window.open(https, '_blank') }
		else { window.open(https, '_self') }
	},
	// Local/session storage. Set [val] to 0(int) to delete an item, 1(int) to parse JSON object, and leave all fields empty to clean up
	st: {
		l: function (id, val) {
			if (val && (val !== 0) && (val !== 1)) {
				if (typeof val === 'object') {
					window.localStorage.setItem(id, JSON.stringify(val))
				} else { window.localStorage.setItem(id, val) }
			}
			else if (val == 0) {
				window.localStorage.removeItem(id)
			}
			else if (val == 1) {
				return JSON.parse(window.localStorage.getItem(id))
			}
			else if (id) { return window.localStorage.getItem(id) }
			else { window.localStorage.clear(); location.reload() }
			if (emi('userdata') && settings) {
				emi('userdata').value = JSON.stringify(settings)
			}
		},
		s: function (id, val) {
			if (val && (val !== 0) && (val !== 1)) {
				if (typeof val === 'object') {
					window.sessionStorage.setItem(id, JSON.stringify(val))
				} else { window.sessionStorage.setItem(id, val) }
			}
			else if (val == 0) {
				window.sessionStorage.removeItem(id)
			}
			else if (val == 1) {
				return JSON.parse(window.sessionStorage.getItem(id))
			}
			else if (id) { return window.sessionStorage.getItem(id) }
			else { window.sessionStorage.clear(); location.reload() }
			if (emi('userdata') && settings) {
				emi('userdata').value = JSON.stringify(settings)
			}
		}
	},
	// Set a global CSS variable
	css: function(CSSVar, val) { document.documentElement.style.setProperty('--'+CSSVar, val) },
	// Remove elements
	rm: function(...ids) {
		ids.forEach(function(id) {
			if ( emi(id) ) {
				emi(id).remove()
			} else { va2.log(2, `rm :: Element with id [${id}] does not exist`) }
		})
	},
	// Fully clean up elements' content
	wipe: function(...ids) {
		ids.forEach(function(id) {
			if ( emi(id) ) {
				emi(id).innerHTML = ''
			} else { va2.log(2, `wipe :: Element with id [${id}] does not exist`) }
		})
	},
	// Make one or more elements in the selected root element; [data == html/object/element]
	mk: function(data, root) {
		let em
		// Check if id/DOM element exists
		if ((typeof root==='string')&&emi(root)) {
			em = emi(root)
		} else if (root&&root.style) {
			em = root
		} else { em = document.body }

		if (typeof data === 'object') {
			for (let i in data) {
				em.innerHTML = em.innerHTML + data[i]
			}
		} else if (typeof data === 'string') {
			em.innerHTML = em.innerHTML + data
		} else if (data) {
			em.appendChild(data)
		} else { va2.log(2, `mk :: Element with id [${id}] does not exist`) }
	},
	// Load JS script or CSS sheet, or load/create and download a file
	// JS/CSS : (string) or (url, 1)
	// File: (url) or (filename, filedata)
	deploy: {
		js: function (str, bool) {
			const _root = document.body // emi('head')
			if (!bool) { // String
				let uid = 'ext.JS.generic'
				if (emi(uid)) { emi(uid).remove() }
				let em = document.createElement('script')
				em.id = uid
				em.innerHTML = str
				_root.appendChild(em)
				em.onload = ()=>{ va2.log(0, 'deployed :: '+em.id) }
			} else { // URL
				let em = document.createElement('script')
				em.id = va2.uid('ext.JS.')
				em.src = str
				_root.appendChild(em)
				em.onload = ()=>{ va2.log(0, 'deployed :: '+em.id+` (${str})`) }
			}
		},

		css: function (str, bool) {
			const _root = document.body
			if (!bool) { // String
				let uid = 'ext.CSS.generic'
				if (emi(uid)) { emi(uid).remove() }
				let em = document.createElement('style')
				em.id = uid
				em.innerHTML = str
				_root.appendChild(em)
				em.onload = ()=>{ va2.log(0, 'deployed :: '+em.id) }
			} else { // URL
				let em  = document.createElement('link')
				em.id = va2.uid('ext.CSS.')
				em.rel = 'stylesheet'
				em.href = str
				_root.appendChild(em)
				em.onload = ()=>{ va2.log(0, 'deployed :: '+em.id+` (${str})`) }
			}
		},

		f: function(str, filedata) {
			let em = document.createElement('a')
			if (!filedata) { // URL
				em.setAttribute('href', str)
				em.setAttribute('download', '')
			} else { // Create new file
				em.download = str
				let blob = new Blob([filedata], {type: 'text/plain'})
				em.href = window.URL.createObjectURL(blob)
			}
			body.appendChild(em)
			em.click(); em.remove()
			va2.log(1, `downloading... [${str}]`)
		}
	},
	// Show an element, declare [int_display] if the target element is not a 'block'
	show: function(id, int_display) {
		const disp = ['block', 'flex', 'grid']
		if (emi(id)) {
			if (int_display) {
				emi(id).style.display = disp[int_display]
			} else { emi(id).style.display = disp[0] }
		} else { va2.log(2, `show :: Element with id [${id}] does not exist`) }
	},
	// Show another element on hover
	hshow: function(root, id) {
		emi(root).onmouseover = ()=>{ va2.show(id) }
		emi(root).onmouseout = ()=>{ va2.hide(id) }
	},
	// Fully hide element(s) --> (display: none)
	hide: function(...ids) {
		ids.forEach(function(id) {
			if (emi(id)) {
				emi(id).style.display = 'none'
			} else { va2.log(2, `show :: Element with id [${id}] does not exist`) }
		})
	},
	// Toggle visibility (display) of an element
	trig: function(id, display) {
		if (emi(id)) {
			if (emi(id).style.display=='none') { emi(id).style.display = (display || 'block') }
			else { emi(id).style.display = 'none' }
		} else { va2.log(2, `trig :: Element with id [${id}] does not exist`) }
	},
	// Find all elements at the specified coordinates
	box: {},
	inspect: function(x, y) {
		va2.box = {}
		if (document.elementsFromPoint) {
			let queue = document.elementsFromPoint(x, y)
			for (const v of queue) {
				if ((v.tagName!=='HTML') && (v.tagName!=='BODY') && (v.tagName!=='VA2OBJ')) {
					va2.box[queue.indexOf(v)] = v
					//va2.log(1, v.tagName +' :: '+ (v.id || '?'))
				}
			}
		} else { alert('Unfortunately, your browser does not support "document.elementsFromPoint()".') }
	},
	// Set functions for device type
	vport: function(func_desktop, func_mobile) {
		let h = window.innerHeight
		let w = window.innerWidth
		if ( va2.per(h, w) > 75 ) { func_mobile() }
		else { func_desktop() }
	},
	// Animate an element, optionally set a timer to clear the animation
	ani: function(id, animation, timer) {
		const em = emi(id)
		if (em) {
			em.style.animation = animation
			if (timer) {
				void emi(id).offsetWidth //reflow
				setTimeout(()=>{ em.style.animation = null }, timer)
			}
		} else { log('a8 :: Element with id ['+id+'] does not exist', 1) }
	},
	// Slider widget function, ex:
	// <div onclick="va2.slide('cat', 'n')"></div>
	// <img id='cat1'> <img id='cat2'>
	slides: {},
	slide: function(id, dir) {
		const slides = va2.slides
		// Create [slides] and slides[id] arrays if they doesn't exist
		if (!slides[id]) {
			var amount = 0
			document.querySelectorAll(`[id^=${id}]`).forEach((i)=>{ amount++ })
			slides[id]=[]
			for (let i=1; i<(amount+1); i++) {
				slides[id].push(i)
				if (i>1 && emi(id+i)) { emi(id+i).classList.add('slided') }
				if (!emi(id+i)) { va2.log(2, `slide :: element with id [${id+i}] does not exist`) }
			}
		}
		// Change class for this [id] and switch to next
		if (dir=='n') {
			if (emi(id+slides[id][0])) {
				emi(id+slides[id][0]).classList.remove("slide", "slideN", "slideP")
				emi(id+slides[id][0]).style.animation = null
				emi(id+slides[id][0]).classList.add("slided")
			}
			slides[id][0] = slides[id][0]+1
			if (emi(id+slides[id][0])) { // Change class for the new [id]
				emi(id+slides[id][0]).classList.remove("slided")
				emi(id+slides[id][0]).classList.add("slide", "slideN")
			} else { // If next [id] doesn't exist, set index to 1 and change class
				slides[id][0] = 1
				emi(id+slides[id][0]).classList.remove("slided")
				emi(id+slides[id][0]).classList.add("slide", "slideN")
			}
		}
		// Change class for this [id] and switch to previous
		if (dir=='p') {
			if (emi(id+slides[id][0])) {
				emi(id+slides[id][0]).classList.remove("slide", "slideP", "slideN")
				emi(id+slides[id][0]).style.animation = null
				emi(id+slides[id][0]).classList.add("slided")
			}
			slides[id][0] = slides[id][0]-1
			if (emi(id+slides[id][0])) { // Change class for the new [id]
				emi(id+slides[id][0]).classList.remove("slided")
				emi(id+slides[id][0]).classList.add("slide", "slideP")
			} else { // If previous [id] doesn't exist, set index to [max] and change class
				slides[id][0] = slides[id].length
				emi(id+slides[id][0]).classList.remove("slided")
				emi(id+slides[id][0]).classList.add("slide", "slideP")
			}
			console.log(slides[id][0])
		}
		// Check if [id] with [dir] index exists and change classes for this and selected [id]
		if (typeof dir=='number' && emi(id+dir)) {
			if (emi(id+slides[id][0])) {
				emi(id+slides[id][0]).classList.remove("slide", "slideN", "slideP")
				emi(id+slides[id][0]).style.animation = null
				emi(id+slides[id][0]).classList.add("slided")
			}
			slides[id][0] = dir
			emi(id+slides[id][0]).classList.remove("slided")
			emi(id+slides[id][0]).classList.add("slide")
		} //2022.11.05 :: Assigns 3 classes, clears animation states
	},
	// Pops up a notification (timed div) with id ["popupNotification"] and assigned message
	notify: function(str) {
		let id = 'popupNotification'
		if (emi(id)) {
			va2.hide(id)
			void emi(id).offsetWidth //reflow
			va2.show(id)
			emi(id).innerHTML = str
		} else { va2.log(2, `notify :: Element with id [${id}] does not exist`) }
	},

}

document.body.onload = function() {
	if (!CSS.supports('height: 100dvh')) {
		document.documentElement.style.setProperty('--deviceHeight', window.innerHeight+'px')
	}
	if (typeof twemoji !== 'undefined') {
		twemoji.parse(document.documentElement, {folder: 'svg', ext: '.svg'})
	}
}

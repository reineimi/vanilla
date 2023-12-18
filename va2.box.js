/*	[va2.box + va2.util]
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
	// Slider widget function
	//1. Create a bunch of elements with equal incrementing ids --> 'cat1', 'cat2', 'cat3'
	//2. Initiate them in the body.onload() --> slide('cat', 1, 3)
	//3. Set styles for given elements --> .cats.slide {display: block}; .cats.slided {display: none}
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

const va2b = {
	// User settings
	user: {
		sessionId: va2.uid('va2env.'),
		storage: 'local',
		preset: {
			backgroundColor: 'black',
			width: '80vmin',
			height: '20vmin',
			margin: 'auto',
		},
	},
	// Container for all created objects
	data: {}, // [id]: attrArray

	// Initiate and open an editor
	edit: function(id) {
		va2.hide('va2menu')
		va2.show('va2editor')
		if (id && emi(id)) {
			va2b.save(id); va2b.gen(id)
		} else {
			let id = va2.uid()
			va2b.make(id); va2b.gen(id)
		}
	},
	// Initiate and open raw data editor
	editRaw: function() {
		va2.hide('va2menu')
		va2.show('va2raw')
		emi('va2rawHTML').value = document.body.innerHTML.replace(/^\n/gm, '')

		if (va2b.data['va2b.raw.css']) {
			emi('va2rawCSS').value = va2b.data['va2b.raw.css']
		} else {
			emi('va2rawCSS').value = va2b_temp.init_css
		}

		if (va2b.data['va2b.raw.js']) {
			emi('va2rawJS').value = va2b.data['va2b.raw.js']
		} else {
			emi('va2rawJS').value = va2b_temp.init_js
		}
	},
	saveRaw: function() {
		document.body.innerHTML = emi('va2rawHTML').value
		va2.deploy.css(emi('va2rawCSS').value)
		va2.deploy.js(emi('va2rawJS').value)
		emi('va2rawHTML').value = document.body.innerHTML.replace(/^\n/gm, '')
		va2b.data['va2b.raw.css'] = emi('va2rawCSS').value
		va2b.data['va2b.raw.js'] = emi('va2rawJS').value
		va2b.store()
	},
	// Replace Spaces With Tabs
	RSWT: function(id) { emi(id).value = emi(id).value.replace(/  /gm, '	') },
	// Create a new element
	make: function(_id, _root, _tag) {
		let id = (_id || va2.uid())
		let root = (_root || null)
		let tag = (_tag || 'div')
		let ext = ''
		if (!root) { ext = '\n' }
		va2.mk(`<${tag} id='${id}'>\n</${tag}>\n${ext}`, root)
		for (const [i, v] of Object.entries(va2b.user.preset)) {
			emi(id).style[i] = v
		}
		va2b.save(id); va2b.gen(id); va2b.store()
	},
	// Change element tag
	retag: function(id, _tag) {
		let root = emi(id).parentNode.id
		let tag
		if (_tag && (_tag !== '')) { tag = _tag } else { tag = 'div' }
		va2b.save(id); va2.rm(id)
		va2.mk(`<${tag} id='${id}'></${tag}>`, root)
		va2b.load(id); va2b.gen(id); va2b.store()
	},
	// Change element ID
	rename: function(id, _val) {
		let val
		if (_val && (_val !== '')) { val = _val } else { val = va2.uid() }
		va2b.data[val] = va2b.data[id]
		delete va2b.data[id]
		emi(id).id = val
		if (emi(id+'-text')) { emi(id+'-text').id = val+'-text' }
		va2b.save(val); va2b.gen(val); va2b.store()
	},
	// Generate attribute fields
	addText: function(id, txt) {
		if (!emi(id+'-text')) {
			va2.mk(`<x id='${id}-text'>${txt}</x>`, id)
		}
		emi(`${id}-text`).innerHTML = txt
	},
	field: function(name, value, func_str) {
		return `<va2F class='center'><div class='center'><p>${name}</p></div><input type='text' value="${value}" onfocusout="${func_str}"></va2F>`
	},
	btn: function(name, func_str) {
		return `<va2btn class='center' onclick="${func_str}"><p>${name}</p></va2btn>`
	},
	gen: function(id) {
		va2.wipe('va2fields', 'va2head', 'va2foot')
		for (const attr of va2b.fields) {
			let val = emi(id).style[attr]
			va2.mk(va2b.field(`${attr}`, `${val}`, `va2b.set('${id}', '${attr}', this.value)`), 'va2fields')
		}
		for (const i of va2b.funcs) {
			let v = va2b.data[id].metadata.f[i]
			va2.mk(va2b.field(`${i}`, `${v}`, `va2b.setf('${id}', '${i}', this.value)`), 'va2fields')
		}
		let em = emi(id)
		va2.mk(`<div style='width: 100%; height: 1em'></div>`, 'va2fields')
		va2.mk(va2b.field('Tag name', `${em.tagName.toLowerCase()}`, `va2b.retag('${id}', this.value)`), 'va2head')
		va2.mk(va2b.field('Unique ID', `${id}`, `va2b.rename('${id}', this.value)`), 'va2head')
		va2.mk(va2b.field('Classes', `${em.className}`, `emi('${id}').className=this.value; va2b.data['${id}'].metadata.clist=this.value; va2b.store()`), 'va2head')
		va2.mk(va2b.field('Content', `${va2b.data[id].metadata.txt || ''}`, `va2b.addText('${id}', this.value); va2b.data['${id}'].metadata.txt=this.value; va2b.store()`), 'va2head')
		va2.mk(va2b.btn('Delete', `va2.rm('${id}'); va2.hide('va2editor', 'va2esc'); va2b.store()`), 'va2foot')
		va2.mk(va2b.btn('Save', `va2b.store(1)`), 'va2foot')
		va2.mk(va2b.btn('Load', `va2b.retrieve(1)`), 'va2foot')
		va2.mk(va2b.btn('Add', `va2b.make(null, '${id}')`), 'va2foot')
	},
	// Set attribute and save it
	set: function(id, attr, val) {
		emi(id).style[attr] = val
		va2b.data[id][attr] = val
		va2b.store()
	},
	// Set a function and save it
	setf: function(id, fname, fdata) {
		emi(id)[fname] = Function(fdata)
		va2b.data[id].metadata.f[fname] = fdata
		va2b.store()
	},
	// Data exchange: array --> element
	load: function(id) {
		if ((id !== 'va2b.raw.css') && (id !== 'va2b.raw.js')) {
			let em = emi(id)
			for (const [i,v] of Object.entries(va2b.data[id])) {
				if (i!=='metadata') { em.style[i] = v }
			}
			for (const [i,f] of Object.entries(va2b.data[id].metadata.f)) {
				emi(id)[i] = Function(f)
			}
			em.className = va2b.data[id].metadata.clist
			if (va2b.data[id].metadata.txt) {
				va2b.addText(id, va2b.data[id].metadata.txt)
			}
		}
	},
	// Data exchange: element --> array
	save: function(id) {
		if ((id !== 'va2b.raw.css') && (id !== 'va2b.raw.js')) {
			if (!va2b.data[id]) { va2b.data[id] = {} }
			if (!va2b.data[id].metadata) { va2b.data[id].metadata = {} }
			if (!va2b.data[id].metadata.f) { va2b.data[id].metadata.f = {} }
			for (const i of va2b.fields) {
				va2b.data[id][i] = emi(id).style[i]
			}
			for (const i of va2b.funcs) {
				if (!va2b.data[id].metadata.f[i]) {
					va2b.data[id].metadata.f[i] = ''
				}
			}
			va2b.data[id].metadata.root = (emi(id).parentNode.id || 'body')
			va2b.data[id].metadata.tag = emi(id).tagName
			va2b.data[id].metadata.clist = emi(id).className
			if (emi(id+'-text')) {
				va2b.data[id].metadata.txt = emi(id+'-text').innerHTML
			}
		}
	},
	// Save data to storage. Download and copy to clipboard if true
	store: function(bool) {
		let where = (va2b.user.storage || 'session')
		let v = 'va2box'
		for (const [id,_] of Object.entries(va2b.data)) {
			if ((id !== 'va2b.raw.css') && (id !== 'va2b.raw.js')) {
				if (emi(id)) { va2b.save(id) }
				else { delete va2b.data[id] }
			}
		}
		if (where=='local') { va2.st.l(v, va2b.data) }
		if (where=='session') { va2.st.s(v, va2b.data) }
		if (bool) {
			va2.deploy.f(`eimirein.va2box.data.${va2.date()}_${va2.time('-')}.txt`, JSON.stringify(va2b.data))
			va2.deploy.f(`eimirein.va2box(${va2b.user.sessionId}).html`, document.body.innerHTML.replace(/^\n/gm, ''))
			va2.copy(JSON.stringify(va2b.data))
		}
	},
	// Clear current session and retrieve data from storage or clipboard (if bool passed)
	clear: function() {
		for (const [id,_] of Object.entries(va2b.data)) {
			delete va2b.data[id]
			if (emi(id)) { va2.rm(id) }
		}
	},
	retrieve: async function(bool) {
		va2b.clear()
		if (bool) {
			let json = await va2.paste()
			try { JSON.parse(json) }
			catch (e) { va2b.retrieve() }
			va2b.data = JSON.parse(json)
			va2b.assemble()
		}
		else if (va2.st.l('va2box')) { va2b.data = va2.st.l('va2box', 1) }
		else if (va2.st.s('va2box')) { va2b.data = va2.st.s('va2box', 1) }
		else { alert('[WARN] No Vanilla Project data stored in the local/session storage.'); return false }
	},
	// Recreate all elements from data array
	assemble: function() {
		va2.hide('va2editor')
		for (const [id,arr] of Object.entries(va2b.data)) {
			if ((id !== 'va2b.raw.css') && (id !== 'va2b.raw.js')) {
				if (emi(id)) { va2.rm(id) }
				let tag = arr.metadata.tag
				let ext = ''
				if (arr.metadata.root==='body') { ext = '\n' }
				va2.mk(`<${tag} id='${id}'>\n</${tag}>\n${ext}`, arr.metadata.root)
				va2b.load(id)
			}
		}
		va2b.store()
		va2.deploy.css(va2b.data['va2b.raw.css'])
		va2.deploy.js(va2b.data['va2b.raw.js'])
	},

	// Event functionality logic
	call: function(e) { if ( (emi('va2box').style.display!=='none')&&(emi('va2esc').style.display=='none')) {
		// Open a menu...
		if (e.clientX) {
			let x = e.clientX; let y = e.clientY
			va2.inspect(x, y)
		}
		else if (e.targetTouches) {
			let touch = e.targetTouches[0]
			let x = touch.pageX; let Y = touch.pageY
			va2.inspect(x, y)
		}
		va2.wipe('va2menu'); va2.show('va2menu', 1); va2.show('va2esc')
		va2.mk(`<va2obj class='center' onclick="va2b.edit()" style='border:none'><p style='color:var(--va2a)'>Create new</p></va2obj>`, 'va2menu')
		va2.mk(`<hr>`, 'va2menu')
		va2.mk(`<va2obj class='center' onclick="va2b.editRaw()" style='border:none'><p style='color:var(--va2a)'>Edit raw</p></va2obj>`, 'va2menu')
		/// ...And add found objects to it
		for (const [i,v] of Object.entries(va2.box)) {
			if (v) {
				const entry = `<va2obj class='center' onclick="va2b.edit('${v.id}')"><p>${v.tagName} :: ${v.id || '(No ID)'}</p></va2obj>`
				va2.mk(`<hr>`, 'va2menu')
				va2.mk(entry, 'va2menu')
			}
		}
	}},
	// Initiate VaniBox
	deploy: async function() {
		let partA = document.createElement('va2obj')
		partA.id = 'va2switch'
		partA.className = 'center nosel'
		partA.style.position = 'fixed'
		partA.innerHTML = `<va2obj>VA二</va2obj>`
		partA.onclick = Function("va2b.enable('va2switch')")
		document.documentElement.appendChild(partA)

		let partB = document.createElement('va2obj')
		partB.id = 'va2box'
		partB.className = 'fill center nosel'
		partB.style.position = 'fixed'
		partB.innerHTML = va2b_temp.box
		document.documentElement.appendChild(partB)

		va2.css('va2a', '#fb6'); va2.css('va2b', '#a75')
		va2.hide('va2box', 'va2esc', 'va2menu', 'va2editor')
		window.addEventListener('mousedown', va2b.call)
		window.addEventListener('touchstart', va2b.call)
		await va2b.retrieve()
		va2b.assemble()
	},
	// Fully remove VaniBox
	destroy: function() {
		va2.rm('va2switch', 'va2box')
		window.removeEventListener('mousedown', va2b.call)
		window.removeEventListener('touchstart', va2b.call)
	},
	// VaniBox on|off switch button
	enabled: false,
	enable: function(id) {
		let em = emi(id)
		va2.trig('va2box', 'flex')
		if (va2b.enabled) {
			em.style.color='#fff'
			em.style.border='1px solid #000'
			va2b.enabled=false
		} else {
			em.style.color='var(--va2a)'
			em.style.border='1px solid var(--va2a)'
			va2b.enabled=true
		}
	},

	fields: [ //'Left', 'Right', 'Top', 'Bottom',
		'zIndex', 'display', 'position', 'width', 'height', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight',
		'float', 'left', 'right', 'top', 'bottom', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
		'color', 'background', 'backgroundColor', 'padding', 'paddingLeft', 'paddingRight', 'paddingTop',
		'paddingBottom', 'borderRadius', 'border', 'borderLeft', 'borderRight', 'borderTop', 'borderBottom',
		'boxShadow', 'outline', 'font', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'textAlign',
		'lineHeight', 'letterSpacing', 'textIndent', 'textDecoration', 'textShadow', 'whiteSpace', 'wordWrap',
		'opacity', 'backgroundImage', 'backgroundPosition', 'backgroundRepeat', 'order',
		'flex', 'flexWrap', 'flexDirection', 'overflow', 'overflowX', 'overflowY', 'overflowWrap',
		'justifyContent', 'alignItems', 'transform', 'filter', 'backdropFilter', 'animation', 'transition', 'visibility',
		'mixBlendMode',
	],
	funcs: ['onclick', 'onmouseover', 'onmouseout', 'oninput', 'onfocusout'],
}

const va2b_temp = {
	box: `
<va2obj id='va2esc' class='fill' onclick="va2.hide('va2esc', 'va2menu', 'va2editor', 'va2raw')">
	<va2obj id='va2b-stats' style='position: absolute; top: 0.7em; left: 0.7em; opacity: 0.6'></va2obj>
</va2obj>
<va2obj id='va2menu' class='center va2x'></va2obj>
<va2obj id='va2editor' class='center bounded'>
	<va2obj id='va2head' class='center'></va2obj>
	<va2obj id='va2fields' class='center bounded'></va2obj>
	<va2obj id='va2foot' class='center nosel'></va2obj>
</va2obj>
<va2obj id='va2raw' class='bounded' spellcheck='false'>
	<textarea id='va2rawHTML' onfocusout='va2b.RSWT(this.id)'></textarea>
	<textarea id='va2rawCSS' onfocusout='va2b.RSWT(this.id)'></textarea>
	<textarea id='va2rawJS' onfocusout='va2b.RSWT(this.id)'></textarea>
	<va2obj class='center nosel' style='top: 0; box-shadow: 2vh 0 3vh #0007'>
		<p onclick="va2.hide('va2rawCSS', 'va2rawJS'); va2.show('va2rawHTML')" style='border-right: 2px solid #333'>HTML</p>
		<p onclick="va2.hide('va2rawHTML', 'va2rawJS'); va2.show('va2rawCSS')">CSS</p>
		<p onclick="va2.hide('va2rawHTML', 'va2rawCSS'); va2.show('va2rawJS')" style='border-left: 2px solid #333'>JS</p>
	</va2obj>
	<va2obj class='center nosel' style='bottom: 0; box-shadow: -2vh 0 3vh #0007'>
		<p onclick='va2b.saveRaw()'>Save</p>
	</va2obj>
</va2obj>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400&display=swap');
.center { position: relative; display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; transition: 0.1s }
.center p { position: relative; margin: auto; text-align: center; overflow-wrap: break-word; max-width: 100%; max-height: 100% }
.fill { position: absolute; width: 100%; height: 100%; left: 0; top: 0; margin: 0 }
.nosel { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; user-drag: none; -webkit-user-drag: none }
.bounded { overflow: hidden; overscroll-behavior-x: none; overscroll-behavior-y: none; }
textarea { white-space: nowrap; border: none; outline: none; color: inherit; font: inherit; resize: none }

va2obj { position: relative; margin: auto; font: 400 calc(0.1vw + 1.7vh) 'Noto Sans JP' }
#va2switch { color: #fff; z-index: 999; width: calc(6vh + 3vmin); height: calc(6vh + 3vmin); position: absolute; top: 3vh; right: 3vh; border-radius: 1.5vh; background: #3337; border: 1px solid #0007 }
#va2switch va2obj { display: block; margin: auto; font-size: calc(1.8vh + 1vmin) }
#va2switch:hover { background: #444; box-shadow: 0 0 20px var(--va2b) }
#va2box { z-index: 998; color: #ddd; background: #0005 }
#va2esc { background: #0005; position: fixed }
#va2menu { background: #222; border: 1px solid #444; border-radius: 0.5em; min-width: 25vmin; max-width: 80vmin; max-height: 60vh; margin: auto; padding: 0.4em 0.6em; overflow-y: scroll }
#va2menu hr { width: 90%; border: none; border-top: 1px solid #333; margin: 0 }
#va2menu va2obj { width: 100%; min-height: 2em; border-radius: 0.3em; margin: 2px 0 }
#va2menu va2obj:hover { background: #333 }
#va2editor, #va2raw { width: 90vmin; height: 75vh; border: 3px solid #222; border-radius: 1.5vh; background: #333; color: #ccc; transform: translateY(2vh) }
#va2head { width: 100%; height: 20%; background: #444; border-bottom: 2px solid #222; box-shadow: 5px 0 20px #0005; z-index: 2 }
#va2head va2F { width: 90%; height: 1.3em; margin: auto; border-radius: 0; background: none; border: none }
#va2head va2F div { min-height: 100%; max-height: 100%; width: 30%; background: #333; border-radius: 1vh }
#va2head va2F input { height: 100%; width: calc(70% - 5px); margin-left: 5px; background: #555; color: #fff; border-radius: 1vh }
#va2foot { width: 100%; height: 10%; border-top: 2px solid #222; box-shadow: -5px 0 20px #000a; z-index: 2 }
#va2fields { width: 100%; height: 70%; overflow-y: scroll; z-index: 1 }
va2F { width: 80%; margin-top: 0.5em; border-radius: 1.5vh; border: 2px solid #222; overflow: hidden; background: #222 }
va2F div { all: unset; width: 45%; min-height: 4vh; background: #444 }
va2F div p { all: unset; margin: auto; width: 90%; padding: 2px 0; line-height: 1 }
va2F input { all: unset; width: 55%; height: 1.3em; margin: auto; text-indent: 0.7em }
va2F:hover div { color: var(--va2a); background: #393939 }
va2btn { height: 1.2em; margin: auto; padding: 0.3em 1em; border: 2px solid var(--va2b); color: var(--va2a); border-radius: 1vh }
va2btn p { margin: auto; transform: translateY(-2px) }
va2btn:hover { border: 2px solid #0000; background: var(--va2b); color: #fff }
#va2raw { display: none }
#va2raw va2obj, #va2raw textarea { position: absolute }
#va2raw va2obj { width: 100%; height: 2.5em; background: #444; display: flex; left: 0 }
#va2raw textarea { width: 94%; height: calc(100% - 7em); margin: 3.5em 3%; background: none }
#va2raw p { flex: 1; padding: 0.5em }
#va2raw p:hover { background: #555; color: var(--va2a) }
#va2rawCSS, #va2rawJS { display: none }
</style>`,

init_js: `va2b.user = {
	sessionId: va2.uid('va2env.'),
	storage: 'local',
	preset: {
		backgroundColor: 'black',
		width: '80vmin',
		height: '20vmin',
		margin: 'auto',
	},
}`,

init_css: `:root {
	/* Color accent */
	--a: #fb6;
	--aSub: #a75;
	--aLink: #ccc;
	--aBg: #222;
	--aBgSub: #fffd;
	--aBgItem: #333;
	--aBgHov: #333;
	--aFont: #eee;
	--aFontSub: #ccc;
	--aFontHov: #fff;
	--aFontBg: #fff;
	--aBorder: #444;
	--aBody: #000;
	--aSel: #fb6;

	/* Fonts */
	--font: 'Noto Sans JP';
	--fontSub: 'Montserrat';
	--fontPrint: 'Roboto Slab';
	--fontStory: 'Cinzel';
	--fontCode: 'Inconsolata';
	--fontFancy: 'Dancing Script';
	--fontPixel: 'Pixelify Sans';
	--fontBlog: 'Smooch Sans';

	/* Other meta */
	--rounding: calc(1.5vh + 2vmin);
	--border: none;
	--blockDistance: 0;
	--blockHeight: 100%;
	--blockWidth: 100%;
	--bgFront: none;
	--bgBack: none;
}`,
}

document.body.onload = function() {
	if (!CSS.supports('height: 100dvh')) {
		document.documentElement.style.setProperty('--deviceHeight', window.innerHeight+'px')
	}
	if (typeof twemoji !== 'undefined') {
		twemoji.parse(document.documentElement, {folder: 'svg', ext: '.svg'})
	}
	va2b.deploy()
	setInterval(()=>{
		emi('va2b-stats').innerHTML = `${va2b.user.sessionId}<br>${va2.date('-')} | ${va2.time(':')}<br>Elapsed:  ${va2.elapsed()}`
	}, 1000)
}

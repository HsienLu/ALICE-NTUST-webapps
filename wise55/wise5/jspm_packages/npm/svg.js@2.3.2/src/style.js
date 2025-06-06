/* */ 
"format cjs";
SVG.extend(SVG.Element, {
  // Dynamic style generator
  style: function(s, v) {
    if (arguments.length == 0) {
      // get full style 
      return this.node.style.cssText || ''
    
    } else if (arguments.length < 2) {
      // apply every style individually if an object is passed 
      if (typeof s == 'object') {
        for (v in s) this.style(v, s[v])
      
      } else if (SVG.regex.isCss.test(s)) {
        // parse css string 
        s = s.split(';')

        // apply every definition individually 
        for (var i = 0; i < s.length; i++) {
          v = s[i].split(':')
          this.style(v[0].replace(/\s+/g, ''), v[1])
        }
      } else {
        // act as a getter if the first and only argument is not an object 
        return this.node.style[camelCase(s)]
      }
    
    } else {
      this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v
    }
    
    return this
  }
})
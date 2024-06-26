/* */ 
"format cjs";
describe('Gradient', function() {
  var rect, gradient

  beforeEach(function() {
    rect = draw.rect(100,100)
    gradient = draw.gradient('linear', function(stop) {
      stop.at({ offset: 0, color: '#333', opacity: 1 })
      stop.at({ offset: 1, color: '#fff', opacity: 1 })
    })
  })

  afterEach(function() {
    rect.remove()
    gradient.remove()
  })
  
  it('is an instance of SVG.Gradient', function() {
    expect(gradient instanceof SVG.Gradient).toBe(true)
  })

  it('allows creation of a new gradient without block', function() {
    gradient = draw.gradient('linear')
    expect(gradient.children().length).toBe(0)
  })
  
  describe('fill()', function() {
    it('returns the id of the gradient wrapped in url()', function() {
      expect(gradient.fill()).toBe('url(#' + gradient.attr('id') + ')')
    })
  })

  describe('toString()', function() {
    it('returns the id of the gradient wrapped in url()', function() {
      expect(gradient + '').toBe('url(#' + gradient.attr('id') + ')')
    })
    it('is called when instance is passed as an attribute value', function() {
      rect.attr('fill', gradient)
      expect(rect.attr('fill')).toBe('url(#' + gradient.attr('id') + ')')
    })
  })

  describe('input values', function() {
    var s1, s2

    it('accepts floats', function() {
      gradient = draw.gradient('linear', function(stop) {
        s1 = stop.at({ offset: 0.12, color: '#333', opacity: 1 })
        s2 = stop.at({ offset: 0.93, color: '#fff', opacity: 1 })
      })
      expect(s1.attr('offset')).toBe(0.12)
      expect(s2.attr('offset')).toBe(0.93)
    })
    it('accepts string floats', function() {
      gradient = draw.gradient('linear', function(stop) {
        s1 = stop.at({ offset: '0.13', color: '#333', opacity: 1 })
        s2 = stop.at({ offset: '0.92', color: '#fff', opacity: 1 })
      })
      expect(s1.attr('offset')).toBe(0.13)
      expect(s2.attr('offset')).toBe(0.92)
    })
    it('accept percentages', function() {
      gradient = draw.gradient('linear', function(stop) {
        s1 = stop.at({ offset: '14%', color: '#333', opacity: 1 })
        s2 = stop.at({ offset: '91%', color: '#fff', opacity: 1 })
      })
      expect(s1.attr('offset')).toBe('14%')
      expect(s2.attr('offset')).toBe('91%')
    })
  })

  describe('update()', function() {

    it('removes all existing children first', function() {
      gradient = draw.gradient('linear', function(stop) {
        s1 = stop.at({ offset: 0.12, color: '#333', opacity: 1 })
        s2 = stop.at({ offset: 0.93, color: '#fff', opacity: 1 })
      })
      expect(gradient.children().length).toBe(2)
      gradient.update(function(stop) {
        s1 = stop.at({ offset: 0.33, color: '#666', opacity: 1 })
        s2 = stop.at({ offset: 1, color: '#000', opacity: 1 })
      })
      expect(gradient.children().length).toBe(2)
    })

    it('accepts multiple aruments on fixed positions', function() {
      gradient = draw.gradient('linear', function(stop) {
        s1 = stop.at(0.11, '#333')
        s2 = stop.at(0.94, '#fff', 0.5)
      })
      expect(gradient.children().length).toBe(2)
      expect(s1.attr('offset')).toBe(0.11)
      expect(s1.attr('stop-color')).toBe('#333333')
      expect(s2.attr('offset')).toBe(0.94)
      expect(s2.attr('stop-color')).toBe('#ffffff')
      expect(s2.attr('stop-opacity')).toBe(0.5)
    })
    
  })

  describe('get()', function() {

    it('returns the stop at a given index', function() {
      gradient = draw.gradient('linear', function(stop) {
        s1 = stop.at({ offset: 0.12, color: '#333', opacity: 1 })
        s2 = stop.at({ offset: 0.93, color: '#fff', opacity: 1 })
      })
      expect(gradient.get(0)).toBe(s1)
      expect(gradient.get(1)).toBe(s2)
      expect(gradient.get(2)).toBe(undefined)
    })

  })
  
})
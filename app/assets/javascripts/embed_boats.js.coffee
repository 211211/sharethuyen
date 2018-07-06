Isotope.Item.prototype._create = () ->
  this.id = this.layout.itemGUID++
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };
  this.sortData = {}

Isotope.Item.prototype.layoutPosition = () ->
  this.emitEvent( 'layout', [ this ] )

Isotope.prototype.arrange = (opts) ->
  this.option( opts )
  this._getIsInstant()
  this.filteredItems = this._filter( this.items )
  this._isLayoutInited = true

Isotope.LayoutMode.create('none');

$(document).ready(() ->
  $table = $('.table.sticky')

  $('.dropdown-toggle').dropdown()

  $table.on('sorted', () ->
    $table.stickyTableHeaders()
  )

  $grid = $('.gallery-view').isotope({
    itemSelector: '.gallery-item',
    layoutMode: 'none'
  })

  $('.filter-button-group').on( 'click', 'button, a', (e) ->
    filterValue = $(this).attr('data-filter')
    $grid.isotope({ filter: filterValue })
    e.preventDefault()

    return
  )

  # Clickable row on Inventory page
  $(".clickable-row").click(() ->
    window.location = $(this).data("href")
  )


  # Change boat feature image
  $('.show-boat .boat-images .thumbs').on( 'click', 'a', (e) ->
    imageUrl = $(this).attr('data-full-image')
    $('.boat-images img#feature-image').attr("src", imageUrl)
    e.preventDefault()

    return
  )

  return
)

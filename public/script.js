$(document).ready(() => {
  $('.fa.fa-trash').click(() => {
    if (confirm('Are you sure you want to delete this post?')) {
      const reviewID = $('#delete').closest('div.single-post').attr('id')
      $.ajax({
        url: `http://localhost:3000/users/reviews/${reviewID}`,
        method: 'delete'
      })
      .done((response) => {
        $('#delete').closest('div.single-post').fadeOut(500, () => {
          $(this).remove()
        })
      })
    }
  })
})

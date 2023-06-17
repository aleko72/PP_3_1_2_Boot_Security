$(function () {
    // $('.left-link').on('click', function () {
    //     $('.left-link').removeClass('active');
    //     $(this).addClass('active');
    // });
    // $('.tab-link').on('click', function () {
    //     $('.tab-link').removeClass('active');
    //     $(this).addClass('active');
    //     if ($(this).text() === 'New User') {
    //         getNewUserForm();
    //         $('.uc-users-table').hide();
    //         $('.uc-new-user-form').show();
    //         $('.uc-navbar-title').text('Add new user');
    //     } else {
    //         $('.uc-users-table').show();
    //         $('.uc-new-user-form').hide();
    //         $('.uc-navbar-title').text('All users');
    //     }
    // });
    $('.fn-btn-add-new-user').on('click', function () {

    });
});
(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('form-edit-user');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();
$(function (){
    $('btn-submit-edit-user').on('click', function () {

    })
});
function getEditUserForm(id) {
    $.ajax({
        url: "/admin/" + id + "/edit",
        type: "GET",
        cash: false,
        success: function (data) {
            $('.modal-body').html(data);
        }
    });
}

function getNewUserForm() {
    $.ajax({
        url: "/new",
        type: "GET",
        cash: false,
        success: function (data) {
            $('.uc-new-user-form').html(data);
        }
    });
}

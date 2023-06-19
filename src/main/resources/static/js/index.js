$(function () {
    $('#editModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const modal = $(this);
        const isDisabled = button.text() === 'Delete';

        if(isDisabled){
            modal.find('.btn-action').addClass("btn-danger").text("Delete")
            modal.find("[name='_method']").val('DELETE');
        }else{
            modal.find('.btn-action').addClass("btn-primary").text("Edit")
            modal.find("[name='_method']").val('PATCH');
        }

        modal.find('.form-edit-user').attr('action', '/admin/' + button.attr('data-id')).prop("disabled", isDisabled);
        modal.find('#firstName').val(button.attr('data-firstName')).prop("disabled", isDisabled);
        modal.find('#lastName').val(button.attr('data-lastName')).prop("disabled", isDisabled);
        modal.find('#age').val(button.attr('data-age')).prop("disabled", isDisabled);
        modal.find('#email').val(button.attr('data-email')).prop("disabled", isDisabled);
        modal.find('#password').prop("disabled", isDisabled);
        modal.find('#roles').val(button.attr('data-roles').split(' ')).prop("disabled", isDisabled);
    });

    $('.tab-link').on('click', function () {
        $('.tab-link').removeClass('active');
        $(this).addClass('active');
        if ($(this).text() === 'New User') {
            $('.list-user').hide();
            $('.form-new').show();
            $('.uc-navbar-title').text('Add new user');
        } else {
            $('.list-user').show();
            $('.form-new').hide();
            $('.uc-navbar-title').text('All users');
        }
    });
    // $('.left-link').on('click', function () {
    //     $('.left-link').removeClass('active');
    //     $(this).addClass('active');
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
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('form-new-user');
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

// function getEditUserForm(id) {
//     $.ajax({
//         url: "/admin/" + id + "/edit",
//         type: "GET",
//         cash: false,
//         success: function (data) {
//             $('.modal-body').html(data);
//         }
//     });
// }

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

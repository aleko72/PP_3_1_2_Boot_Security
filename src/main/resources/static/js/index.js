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

        modal.find('.form-edit-user').attr('action', '/admin/' + button.attr('data-id'))
            .attr('data-id', button.attr('data-id')).prop("disabled", isDisabled);
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

        function setDefaultValuesForm(formNew) {
            formNew.find('#firstName').val('');
            formNew.find('#lastName').val('');
            formNew.find('#age').val(0);
            formNew.find('#email').val('').removeClass('error-email');
            formNew.find('#password').val('');
            formNew.find('#roles').val([1])
            formNew.find('.custom-new-email-invalid-feedback').hide();
        }

        if ($(this).text() === 'New User') {
            $('.list-user').hide();
            $('.form-new').show();
            $('.uc-navbar-title').text('Add new user');
            setDefaultValuesForm($('.form-new-user'));
        } else {
            $('.list-user').show();
            $('.form-new').hide();
            $('.uc-navbar-title').text('All users');
        }
    });

    $(function (){
        $('.fn-btn-add-new-user').on('click', function () {
            $('.custom-new-email-invalid-feedback').hide();
            $('input#email.new').removeClass('error-email');

            const email = $('input#email.new').val();
            if(email !== ''){
                checkEmail(0, email, 'form-new-user');
            }else{
                $('.form-new-user').trigger('submit');
            }
        })
    });

    $('.form-new-user' ).on( 'submit', function( event ) {

        if (this.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.classList.add('was-validated');
    });

    $(function (){
        $('.fn-btn-edit-user').on('click', function () {
            $('.custom-edit-email-invalid-feedback').hide();
            $('input#email.edit').removeClass('error-email');

            const id = $('.form-edit-user').attr('data-id');
            const email = $('input#email.edit').val();
            if(email !== ''){
                checkEmail(id, email, 'form-edit-user');
            }else{
                $('.form-edit-user').trigger('submit');
            }
        })
    });

    $('.form-edit-user' ).on( 'submit', function( event ) {

        if (this.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.classList.add('was-validated');
    });
});

function checkEmail(id, email, formName) {
    $.ajax({
        url: "/util/checkEmail",
        type: "GET",
        cash: false,
        data: {id: id, email: email},
        success: function (data) {
            if(data){
                $('.' + formName).trigger('submit');
            }else{
                if(formName === 'form-new-user'){
                    $('.custom-new-email-invalid-feedback').show();
                    $('input#email.new').addClass('error-email');
                }else if(formName === 'form-edit-user'){
                    $('.custom-edit-email-invalid-feedback').show();
                    $('input#email.edit').addClass('error-email');
                }

            }
        }
    });
}


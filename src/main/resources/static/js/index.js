const tableUsers = document.querySelector('.uc-users-table-body');
const formNewUser = document.querySelector('.form-new-user');
const formEditUser = document.querySelector('.form-edit-user');
const error = document.getElementById('error-content');

$(function () {
    switchPanel($('.left-link.active').text())

    $('.left-link').on('click', function (){
        $('.left-link').removeClass('active');
        $(this).addClass('active');
        const panelName = $(this).text();
        switchPanel(panelName);
    });


    $('.tab-link.tab-list-user').on('click', function () {
        getUsers();
    });

    $('#editModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const modal = $(this);
        const isDisabled = button.text() === 'Delete';

        if (isDisabled) {
            modal.find('.btn-action').addClass("btn-danger").text("Delete")
            modal.find("[name='_method']").val('DELETE');
        } else {
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
        //modal.find('#roles').val(button.attr('data-roles').split(' ')).prop("disabled", isDisabled);
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


    $('.fn-btn-add-new-user').on('click', function () {
        error.style.visibility = 'hidden';
        $('.custom-new-email-invalid-feedback').hide();
        $('input#email.new').removeClass('error-email');

        const email = $('input#email.new').val();
        if (email !== '') {
            checkEmail(0, email, 'form-new-user');
        } else {
            formNewUser.classList.add('was-validated');
        }
    });



    $('.fn-btn-edit-user').on('click', function () {
        error.style.visibility = 'hidden';
        $('.custom-edit-email-invalid-feedback').hide();
        $('input#email.edit').removeClass('error-email');

        const id = $('.form-edit-user').attr('data-id');
        const email = $('input#email.edit').val();
        if (email !== '') {
            checkEmail(id, email, 'form-edit-user');
        } else {
            $('.form-edit-user').trigger('submit');
        }
    })

});

function switchPanel(leftPanel) {
    if(leftPanel === 'Admin'){
        $('.uc-title').html('<h1>Admin panel</h1>');
        $('.nav-tabs').show();
        $('.uc-navbar-title').text('All users');
        $('th.action').show();
        getUsers();
    }
    if(leftPanel === 'User'){
        $('.uc-title').html('<h1>User information-page</h1>')
        $('.nav-tabs').hide();
        $('.uc-navbar-title').text('About user');
        $('.tab-link').removeClass('active');
        $('.tab-list-user').addClass('active');
        $('.list-user').show();
        $('.form-new').hide();
        const id = $('.left-link.active').attr('data-id');
        $('th.action').hide();
        getUser(id, bindTableUsers);
    }
}

function getUsers() {
    fetch('/adminRest/users')
        .then(res => res.json())
        .then(data => {
            let html = '';
            data.forEach(user => {
                html += `<tr>
                <th scope='row'>${user.id}</th>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.rolesString}</td>
                <td><button type='button' class='btn btn-info' data-toggle='modal' data-target='#editModal' data-id='${user.id}'>Edit</button>
                </td><td><button type='button' class='btn btn btn-danger' data-toggle='modal' data-target='#editModal' data-id='${user.id}'>Delete</button></td></tr>`
            });
            tableUsers.innerHTML = html;
        });
}

function getUser(id, callback) {
    fetch('/adminRest/user/' + id)
        .then(res => res.json())
        .then(user => {
            callback(user);
        });
}

function bindTableUsers(user) {
    tableUsers.innerHTML = `<tr>
                <th scope='row'>${user.id}</th>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.rolesString}</td>`;
}

function addUser() {
    if (formNewUser.checkValidity() === false) {
        formNewUser.classList.add('was-validated');
        return;
    }

    const formData = new FormData(formNewUser);
    fetch('/adminRest/', {
        method: 'POST',
        mode: "cors",
        credentials: "same-origin",
        body: formData
    })
        .then(res => res.text())
        .then(data => {
            if(data !== ''){
                error.style.visibility = 'visible';
                error.innerHTML = data;
            }
            $('.tab-list-user').trigger('click');
        });
}

function checkEmail(id, email, formName) {
    $.ajax({
        url: '/util/checkEmail',
        type: "GET",
        cash: false,
        data: {id: id, email: email},
        success: function (data) {
            if(data){
                addUser();
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


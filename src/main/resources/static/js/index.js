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
        const id = button.attr('data-id');
        modal.find('.form-edit-user').attr('data-id', id);
        if (isDisabled) {
            modal.find('.btn-action').addClass("btn-danger").text("Delete")
        } else {
            modal.find('.btn-action').addClass("btn-primary").text("Edit")
        }
        getUser(id, bindEditForm)
    });

    $('.tab-link').on('click', function () {
        error.style.visibility = 'hidden';
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
        const email = $('input#email.new').removeClass('error-email').val();
        if (email !== '') {
            checkEmail(0, email, 'form-new-user');
        } else {
            formNewUser.classList.add('was-validated');
        }
    });

    $('.fn-btn-edit-user').on('click', function () {
        error.style.visibility = 'hidden';
        const formEditUser = $('.form-edit-user');
        const id = formEditUser.attr('data-id');

        if($(this).text() === 'Delete'){
            deleteUser(id);
            return;
        }

        $('.custom-edit-email-invalid-feedback').hide();
        const email = $('input#email.edit').removeClass('error-email').val();
        if (email !== '') {
            checkEmail(id, email, 'form-edit-user');
        } else {
            formEditUser.addClass('was-validated');
        }
    })

});

function switchPanel(leftPanel) {
    error.style.visibility = 'hidden';
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
        getUser(id, bindDetailsUser);
    }
}

function getUsers() {
    fetch('/users')
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
    fetch('/user/' + id)
        .then(res => res.json())
        .then(user => {
            callback(user);
        });
}

function bindDetailsUser(user) {
    tableUsers.innerHTML = `<tr>
                <th scope='row'>${user.id}</th>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.rolesString}</td>`;
}

function bindEditForm(user) {
    const modal = $(formEditUser);
    const isDisabled = modal.find('.btn-action').text() === 'Delete';
    modal.find('#firstName').val(user.firstName).prop("disabled", isDisabled);
    modal.find('#lastName').val(user.lastName).prop("disabled", isDisabled);
    modal.find('#age').val(user.age).prop("disabled", isDisabled);
    modal.find('#email').val(user.email).prop("disabled", isDisabled);
    modal.find('#password').prop("disabled", isDisabled);
    modal.find('#roles').val(user.roleIdsString.split(' ')).prop("disabled", isDisabled);
}

function addUser() {
    if (formNewUser.checkValidity() === false) {
        formNewUser.classList.add('was-validated');
        return;
    }

    const formData = new FormData(formNewUser);
    fetch('/', {
        method: 'POST',
        mode: "cors",
        body: formData
    })
        .then(res => res.text())
        .then(data => {
            if(data !== ''){
                setError(data)
            }
            $('.tab-list-user').trigger('click');
        });
}

function editUser(id) {
    if (formEditUser.checkValidity() === false) {
        formEditUser.classList.add('was-validated');
        return;
    }

    const formData = new FormData(formEditUser);
    fetch('/' + id, {
        method: 'PATCH',
        mode: "cors",
        body: formData
    })
        .then(res => res.text())
        .then(data => {
            if(data !== ''){
                setError(data)
            }
            $('#editModal').modal('hide');
            $('.tab-list-user').trigger('click');
        });
}

function deleteUser(id) {
    const formData = new FormData(formEditUser);
    fetch('/' + id, {
        method: 'DELETE',
        mode: "cors",
        body: formData
    })
        .then(() => {
            $('#editModal').modal('hide');
            $('.tab-list-user').trigger('click');
        });
}

function checkEmail(id, email, formName) {
    fetch(`/checkEmail?id=${id}&email=${email}`)
        .then(res => res.json())
        .then(data => {
            if(data){
                if(formName === 'form-new-user'){
                    addUser();
                }else if(formName === 'form-edit-user'){
                    editUser(id);
                }
            }else{
                if(formName === 'form-new-user'){
                    $('.custom-new-email-invalid-feedback').show();
                    $('input#email.new').addClass('error-email');
                }else if(formName === 'form-edit-user'){
                    $('.custom-edit-email-invalid-feedback').show();
                    $('input#email.edit').addClass('error-email');
                }
            }
        });
}

function setError(data){
    error.style.visibility = 'visible';
    error.innerHTML = data.replace('#', '<br>');
}


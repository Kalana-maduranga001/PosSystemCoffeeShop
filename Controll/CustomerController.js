import { customer_db } from "/db/db.js";
import CustomerModel from "/model/CustomerModel.js";

let selectedIndex = -1;

function generateNextCustomerId() {
    if (customer_db.length === 0) return 'C001';
    let lastId = customer_db[customer_db.length - 1].id;
    let number = parseInt(lastId.replace('C', '')) + 1;
    return 'C' + number.toString().padStart(3, '0');
}

function resetCustomerForm() {
    $('#cus-id').val(generateNextCustomerId());
    $('#fname, #lname, #email, #phone, #address').val('');
    selectedIndex = -1;
    $('#customer-tbody tr').removeClass('table-active');
}

function loadCustomers() {
    const tbody = $('#customer-tbody');
    tbody.empty();
    customer_db.forEach((c) => {
        tbody.append(`
            <tr data-id="${c.id}">
                <td>${c.id}</td>
                <td>${c.fname}</td>
                <td>${c.lname}</td>
                <td>${c.address}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
            </tr>
        `);
    });
}

function getFormData() {
    return {
        id: $('#cus-id').val().trim(),
        fname: $('#fname').val().trim(),
        lname: $('#lname').val().trim(),
        address: $('#address').val().trim(),
        email: $('#email').val().trim(),
        phone: $('#phone').val().trim()
    };
}

function validateCustomer({ id, fname, lname, address }) {
    return id && fname && lname && address;
}

$(document).ready(() => {
    loadCustomers();
    resetCustomerForm();

    $('#customer_save').on('click', () => {
        const customer = getFormData();

        if (!validateCustomer(customer)) {
            Swal.fire("Error!", "Please fill required fields", "error");
            return;
        }

        if (customer_db.some(c => c.id === customer.id)) {
            Swal.fire("Error!", "Customer ID already exists!", "error");
            return;
        }

        customer_db.push(new CustomerModel(customer.id, customer.fname, customer.lname, customer.address, customer.email, customer.phone));
        loadCustomers();
        resetCustomerForm();
        Swal.fire("Success!", "Customer added successfully", "success");
    });

    $('#customer_update').on('click', () => {
        if (selectedIndex === -1) {
            Swal.fire("No Selection!", "Please select a customer to update.", "info");
            return;
        }

        const updated = getFormData();

        if (!validateCustomer(updated)) {
            Swal.fire("Error!", "Please fill required fields", "error");
            return;
        }

        customer_db[selectedIndex] = new CustomerModel(updated.id, updated.fname, updated.lname, updated.address, updated.email, updated.phone);
        loadCustomers();
        resetCustomerForm();
        Swal.fire("Updated!", "Customer updated successfully", "success");
    });

    $('#customer_delete').on('click', () => {
        if (selectedIndex === -1) {
            Swal.fire("No Selection!", "Please select a customer to delete.", "info");
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the customer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then(result => {
            if (result.isConfirmed) {
                customer_db.splice(selectedIndex, 1);
                loadCustomers();
                resetCustomerForm();
                Swal.fire("Deleted!", "Customer deleted successfully", "success");
            }
        });
    });

    $('#customer_reset').on('click', resetCustomerForm);

    $('#customer-tbody').on('click', 'tr', function () {
        const id = $(this).data('id');
        const customer = customer_db.find(c => c.id === id);
        selectedIndex = customer_db.findIndex(c => c.id === id);

        if (customer) {
            $('#cus-id').val(customer.id);
            $('#fname').val(customer.fname);
            $('#lname').val(customer.lname);
            $('#address').val(customer.address);
            $('#email').val(customer.email);
            $('#phone').val(customer.phone);
            $('#customer-tbody tr').removeClass('table-active');
            $(this).addClass('table-active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('Property Management App initialized');

    // Handle the add tenant form submission
    const addTenantForm = document.querySelector('#addTenantForm');
    const propertySelect = document.getElementById('property_id');
    if (addTenantForm) {
        addTenantForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const selectedPropertyId = propertySelect.value;

            // Dynamically update the form action to include the property_id
            addTenantForm.action = `/property/${selectedPropertyId}/add_tenant`;

            fetch(addTenantForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    alert(data.message);

                    // Close the modal
                    const modal = bootstrap.Modal.getInstance(document.querySelector('#addTenantModal'));
                    modal.hide();

                    // Add the new tenant to the table
                    addTenantToTable(data.tenant);

                    // Reset the form
                    addTenantForm.reset();
                } else {
                    // Show error messages
                    Object.keys(data.errors).forEach(field => {
                        const errorElement = document.createElement('div');
                        errorElement.className = 'invalid-feedback';
                        errorElement.textContent = data.errors[field].join(', ');
                        const inputElement = addTenantForm.querySelector(`#${field}`);
                        inputElement.classList.add('is-invalid');
                        inputElement.parentNode.appendChild(errorElement);
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while adding the tenant. Please try again.');
            });
        });
    }
});

// Function to dynamically add the tenant to the table
function addTenantToTable(tenant) {
    const tableBody = document.querySelector('#tenantsTableBody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${tenant.name}</td>
        <td>${tenant.contact_email}</td>
        <td>${tenant.phone_number}</td>
        <td>${tenant.property_name}</td>
        <td>${tenant.lease_start}</td>
        <td>${tenant.lease_end}</td>
        <td>$${tenant.rent_amount}</td>
        <td>${tenant.application_status}</td>
    `;
    tableBody.appendChild(newRow);
}

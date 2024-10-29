document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation for Tailwind tabs
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');
    const addButton = document.getElementById('addButton');
    const filterDropdown = document.getElementById('filterDropdown');

    tabs.forEach(tab => {
        tab.addEventListener('click', function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            // Hide all content
            contents.forEach(content => content.classList.add('hidden'));
            // Show targeted content
            target.classList.remove('hidden');

            // Update Add Button and Filter Dropdown for active tab
            if (target.id === 'properties-tab') {
                addButton.textContent = 'Add Property';
                addButton.href = '/add_property';
                filterDropdown.innerHTML = `
                    <option value="all">All Properties</option>
                    <option value="vacant">Vacant</option>
                    <option value="occupied">Occupied</option>
                `;
            } else if (target.id === 'tenants-tab') {
                addButton.textContent = 'Add Tenant';
                addButton.href = '/add_tenant';
                filterDropdown.innerHTML = `
                    <option value="all">All Tenants</option>
                    <option value="overdue">Overdue</option>
                    <option value="paid">Paid</option>
                `;
            } else if (target.id === 'documents-tab') {
                addButton.textContent = 'Upload Document';
                addButton.href = '/add_document';
                filterDropdown.innerHTML = `
                    <option value="all">All Documents</option>
                    <option value="leases">Leases</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="other">Other</option>
                `;
            }
        });
    });

    // Tenant form submission logic
    const addTenantForm = document.querySelector('#addTenantForm');
    const propertySelect = document.getElementById('property_id');
    const addTenantModal = document.getElementById('addTenantModal');

    if (addTenantForm) {
        addTenantForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const selectedPropertyId = propertySelect.value;

            // Update form action dynamically
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
                    alert(data.message);
                    addTenantModal.classList.add('hidden');
                    addTenantToTable(data.tenant);
                    addTenantForm.reset();
                } else {
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
    // Toggle profile dropdown visibility
    const profileMenuButton = document.getElementById('profileMenuButton');
    const profileDropdown = document.getElementById('profileDropdown');

    profileMenuButton.addEventListener('click', () => {
        profileDropdown.classList.toggle('hidden');
    });
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


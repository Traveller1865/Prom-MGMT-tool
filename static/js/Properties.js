document.addEventListener("DOMContentLoaded", function () {
    const addPropertyModal = document.getElementById('add-property-modal');
    const addButton = document.getElementById('addButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const portfolioSelect = document.getElementById('portfolio-select');

    // Ensure elements are found
    if (!addPropertyModal || !addButton || !closeModalButton || !portfolioSelect) {
        console.error('One or more elements not found.');
        return;
    }

    // Open and close modal functions
    function openModal() {
        console.log('Opening modal');
        addPropertyModal.classList.remove('hidden');
    }

    function closeModal() {
        console.log('Closing modal');
        addPropertyModal.classList.add('hidden');
    }

    // Attach event listeners
    addButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);

    // Form submission event listener
    document.getElementById('add-property-form').addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Property added successfully!');
        closeModal();
    });

    // Portfolio select change event
    portfolioSelect.addEventListener('change', function () {
        if (this.value === 'create') {
            const portfolioName = prompt('Enter new portfolio name:');
            if (portfolioName) {
                fetch('{{ url_for("create_portfolio") }}', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: portfolioName }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.id) {
                        const newOption = new Option(data.name, data.id);
                        portfolioSelect.add(newOption, portfolioSelect.options[0]);
                        portfolioSelect.value = data.id;
                        alert('Portfolio created successfully!');
                    } else {
                        alert(data.error || 'Failed to create portfolio.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error creating portfolio: ' + error.message);
                });
            } else {
                this.value = ''; // Reset if no name entered
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const addPropertyModal = document.getElementById('add-property-modal');
    const addButton = document.getElementById('addButton');
    const closeModalButtons = document.querySelectorAll('#closeModalButton');

    function openModal() {
        addPropertyModal.classList.remove('hidden');
    }

    function closeModal() {
        addPropertyModal.classList.add('hidden');
    }

    addButton.addEventListener('click', openModal);
    closeModalButtons.forEach(button => button.addEventListener('click', closeModal));

    document.getElementById('add-property-form').addEventListener('submit', function (event) {
        event.preventDefault();
        alert('Property added successfully!');
        closeModal();
    });
});

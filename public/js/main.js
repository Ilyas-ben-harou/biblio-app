// Add event listener to enable search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Book search
    const bookSearchInput = document.getElementById('bookSearch');
    if (bookSearchInput) {
      bookSearchInput.addEventListener('keyup', function() {
        const searchValue = this.value.toLowerCase();
        const bookTable = document.querySelector('table');
        const bookRows = bookTable.querySelectorAll('tbody tr');
        
        bookRows.forEach(row => {
          const bookTitle = row.cells[0].textContent.toLowerCase();
          const bookAuthor = row.cells[1].textContent.toLowerCase();
          const bookIsbn = row.cells[2].textContent.toLowerCase();
          
          if (bookTitle.includes(searchValue) || bookAuthor.includes(searchValue) || bookIsbn.includes(searchValue)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }
    
    // Student search
    const studentSearchInput = document.getElementById('studentSearch');
    if (studentSearchInput) {
      studentSearchInput.addEventListener('keyup', function() {
        const searchValue = this.value.toLowerCase();
        const studentTable = document.querySelector('table');
        const studentRows = studentTable.querySelectorAll('tbody tr');
        
        studentRows.forEach(row => {
          const studentName = row.cells[0].textContent.toLowerCase();
          const studentId = row.cells[1].textContent.toLowerCase();
          const studentEmail = row.cells[2].textContent.toLowerCase();
          
          if (studentName.includes(searchValue) || studentId.includes(searchValue) || studentEmail.includes(searchValue)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }
    
    // Set min date for due date input to today
    const dueDateInput = document.getElementById('dueDate');
    if (dueDateInput) {
      const today = new Date().toISOString().split('T')[0];
      dueDateInput.setAttribute('min', today);
      
      // Set default due date to 14 days from today
      if (!dueDateInput.value) {
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
        dueDateInput.value = twoWeeksLater.toISOString().split('T')[0];
      }
    }
  });
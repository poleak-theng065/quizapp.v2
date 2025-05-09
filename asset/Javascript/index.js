fetch('../../data.json')
  .then(response => response.json())
  .then(data => {
    const tbody = document.getElementById('userTableBody');

    data.users.forEach((user, index) => {
      const row = document.createElement('tr');
      row.className = "hover:bg-gray-50 transition-colors";

    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">${index + 1}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${user.email}</td>
      <td class="px-6 py-4 whitespace-nowrap text-center">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-100 text-green-800' : user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}">
            <i class="fas fa-check-circle mr-1"></i> ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button aria-label="Edit ${user.name}" class="text-indigo-600 hover:text-indigo-900 mr-4 focus:outline-none">
        <i class="fas fa-edit"></i>
        </button>
        <button aria-label="Delete ${user.name}" class="text-red-600 hover:text-red-900 focus:outline-none">
        <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;

      tbody.appendChild(row);
    });
  })
  .catch(error => console.error('Error loading data:', error));

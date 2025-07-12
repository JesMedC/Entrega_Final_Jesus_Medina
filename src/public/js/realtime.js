const socket = io();

socket.on('productListUpdated', products => {
  const ul = document.getElementById('productList');
  ul.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price} 
      <button class="deleteBtn">Eliminar</button>`;
    ul.appendChild(li);
  });
});

document.getElementById('addForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;

  const product = {
    title: form.title.value,
    description: form.description.value,
    code: form.code.value,
    price: parseFloat(form.price.value),
    status: form.status.value === 'true',
    stock: parseInt(form.stock.value),
    category: form.category.value,
    thumbnails: form.thumbnails.value.split(',').map(t => t.trim())
  };

  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });

  form.reset();
});

document.getElementById('productList').addEventListener('click', async e => {
  if (e.target.classList.contains('deleteBtn')) {
    const li = e.target.closest('li');
    const id = li.dataset.id;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
  }
});

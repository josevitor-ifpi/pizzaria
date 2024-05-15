
const query = (element) => document.querySelector(element);
const queryAll = (element) => document.querySelectorAll(element);

let qntModal = 1;
let modalKey = 0;
let cart = [];

pizzaJson.map((pizzas, index) => {
	let pizzaItem = query('.models .pizza-item').cloneNode(true);

	pizzaItem.setAttribute('data-key', index);

	pizzaItem.querySelector('.pizza-item--img img').src = pizzas.img;
	pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizzas.price.toFixed(2).replace('.', ',')}`;
	pizzaItem.querySelector('.pizza-item--name').innerHTML = pizzas.name;
	pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizzas.description;

	pizzaItem.querySelector('a').addEventListener('click', (event) => {
		let key = event.target.closest('.pizza-item').getAttribute('data-key');
		modalKey = key;
		qntModal = 1;
		event.preventDefault();
	
		query('.pizzaWindowArea').style.opacity = 0;
		query('.pizzaWindowArea').style.display = 'flex';

		setTimeout(() => {
			query('.pizzaWindowArea').style.opacity = 1;
		}, 200);

		query('.pizzaBig img').src = pizzaJson[key].img;
		query('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
		query('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
		query('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2).replace('.', ',')}`;

		query('.pizzaInfo--size.selected').classList.remove('selected');

		queryAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
			if (sizeIndex === 2) {
				size.classList.add('selected');
			};

			size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
		});

		query('.pizzaInfo--qt').innerHTML = qntModal;
	})

	query('.pizza-area').append(pizzaItem);	
});

function closeModal()	{ 
	query('.pizzaWindowArea').style.opacity = 0;

	setTimeout(() => {
		query('.pizzaWindowArea').style.display = 'none';
	}, 200);
}

queryAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
	item.addEventListener('click', closeModal);
});

query('.pizzaInfo--qtmenos').addEventListener('click', () => {
	if (qntModal > 1) {
		qntModal--;
		query('.pizzaInfo--qt').innerHTML = qntModal;
	}
});

query('.pizzaInfo--qtmais').addEventListener('click', () => {
	qntModal++;
	query('.pizzaInfo--qt').innerHTML = qntModal;
});

queryAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
	size.addEventListener('click', (item) => {
		query('.pizzaInfo--size.selected').classList.remove('selected');
		size.classList.add('selected');
	})
});

query('.pizzaInfo--addButton').addEventListener('click', () => {
	let size = query('.pizzaInfo--size.selected').getAttribute('data-key');
	let identifier = `${parseInt(pizzaJson[modalKey].id)} @ ${size}`;
	let key = cart.findIndex((item) => item.identifier == identifier);

	if (key > -1){
		cart[key].qntModal += qntModal;
	} else {
		cart.push({
			identifier,
			id: pizzaJson[modalKey].id,
			size,
			qntModal: qntModal
		})	
	}

	updateCart();
	closeModal();
});

query('.menu-openner').addEventListener('click', () => {
	if (cart.length > 0) {
		query('aside').style.left = 0;
	}	
})

query('.menu-closer').addEventListener('click', () => {
	query('aside').style.left = '100vh';
})

function updateCart() {
	query('.menu-openner span').innerHTML = cart.length;

	if (cart.length > 0) {
		query('aside').classList.add('show');
		query('.cart').innerHTML = "";

		let subtotal = 0;
		let desconto = 0;
		let total = 0;

		for (let i in cart) {
			let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
			let cartItem = query('.models .cart--item').cloneNode(true);
			let pizzaSizeName;
			subtotal += pizzaItem.price * cart[i].qntModal;
			
			switch(cart[i].size) {
				case '0':
					pizzaSizeName = "P";
					break;
				case '1': 
					pizzaSizeName = "M";
					break;
				case '2':
					pizzaSizeName = "G";
					break;
			}

			let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;


			cartItem.querySelector('.cart--item img').src = pizzaItem.img;
			cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qntModal;

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				if (cart[i].qntModal > 1) {
					cart[i].qntModal--;
				} else {
					cart.splice(i, 1);
				}
				updateCart();
			});

			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				cart[i].qntModal++;
				updateCart();
			});

			query('.cart').append(cartItem);
		};

		desconto = subtotal * 0.1;
		total = subtotal - desconto;

		query('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
		query('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
		query('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
	} else {
		query('aside').classList.remove('show');
		query('aside').style.left = '100vh';
	}
}

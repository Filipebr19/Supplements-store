let select = el => document.querySelector(el);
let selectAll = el => document.querySelectorAll(el);
let moeda = el => el.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
let key;
let modalQt = 1;
let cart = [];



suplementosJson.forEach((item, index) => {
    const produto = select('.models .suple--produto').cloneNode(true);

    produto.setAttribute('data-key', index)
    produto.querySelector('.suple--img a img').src = item.image;
    produto.querySelector('.suple--info .suple--price').innerHTML = moeda(item.price[2]);
    produto.querySelector('.suple--info .suple--title').innerHTML = item.name;
    produto.querySelector('.suple--info .suple--desc').innerHTML = item.descripition;

    
    produto.querySelector('.suple--img a').addEventListener('click', (e) => {
        e.preventDefault();
        key = e.target.closest('.suple--produto').getAttribute('data-key');
        modalQt = 1;

        select('.window--img img').src = suplementosJson[key].image;
        select('.product--title').innerHTML = suplementosJson[key].name;
        select('.product--flavor').innerHTML = suplementosJson[key].flavor;
        select('.product--desc').innerHTML = suplementosJson[key].descripition;

        select('.weight--info.select').classList.remove('select');
        selectAll('.weight--info').forEach((weight, indexWeight) => {
            if(indexWeight === 2) {
                weight.classList.add('select');
            }

            weight.querySelector('span').innerHTML = suplementosJson[key].weight[indexWeight];

            select('.product--priceActual').innerHTML = moeda(suplementosJson[key].price[indexWeight]);
        });

        select('.qt--actual').innerHTML = modalQt;

        
        select('.window--Area').style.opacity = 0;
        select('.window--Area').style.display = 'flex';
        setTimeout(() => {
            select('.window--Area').style.opacity = 1;
        }, 500)
    });


    select('.suple--area').append(produto);
});


function closeModal() {
    select('.window--Area').style.opacity = 0;
    setTimeout(() => {
        select('.window--Area').style.display = 'none';
    }, 500)
};
selectAll('.button--voltarMobile, .button--voltarDesktop').forEach((item) => {
    item.addEventListener('click', closeModal);
});
    
selectAll('.weight--info').forEach((weight, indexWeight) => {
    weight.addEventListener('click', () => {
        select('.weight--info.select').classList.remove('select');
        weight.classList.add('select');

        select('.product--priceActual').innerHTML = moeda(suplementosJson[key].price[indexWeight]);
    });    
});

select('.qt--menos').addEventListener('click', () => {
    if(modalQt > 1) {
        modalQt--;
        select('.qt--actual').innerHTML = modalQt;
    }
});

select('.qt--mais').addEventListener('click', () => {
    modalQt++;
    select('.qt--actual').innerHTML = modalQt;
});

select('.button--add--cart').addEventListener('click', () => {
    
    let weight = parseInt(select('.weight--info.select').getAttribute('data-key'));
    let price = suplementosJson[key].price[weight];
    let identifier = suplementosJson[key].id+'#'+weight;

    let keyIdentifier = cart.findIndex(item => item.identifier === identifier);

    if(keyIdentifier > -1) {
        cart[keyIdentifier].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: suplementosJson[key].id,
            qt: modalQt,
            weight,
            price
        })
    }

    openCart();
    closeModal();
});



function openCart() {
    if(cart.length > 0) {
        select('.carrinho--icon').addEventListener('click', openCompras)

        select('.carrinho--icon span').innerHTML = cart.length;
        select('.carrinho--icon span').style.display = 'block';


        select('.cart--product').innerHTML = '';
    
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
    
        for(let i in cart){
            const cartItem = select('.cart--product--info').cloneNode(true);
            let suplementoItem = suplementosJson.find((item) => item.id === cart[i].id);
            subtotal += suplementoItem.price[cart[i].weight] * cart[i].qt;
    
            let weightName;
            switch (cart[i].weight) {
                case 0:
                    weightName = '(P)';
                    break;
                case 1:
                    weightName = '(M)';
                    break;
                case 2:
                    weightName = '(G)';
                    break;    
            }
    
            cartItem.querySelector('.cart--img  img').src = suplementoItem.image;
            cartItem.querySelector('.cart--title').innerHTML = suplementoItem.name;
            cartItem.querySelector('.cart--weight').innerHTML = weightName;
            cartItem.querySelector('.cart--qt--actual').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--qt--menos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                openCart();
            });
            cartItem.querySelector('.cart--qt--mais').addEventListener('click', () => {
                cart[i].qt++;
                openCart();
            })
        
            select('.cart--product').append(cartItem);
        }
    
        desconto = subtotal * 0.1; 
        total = subtotal - desconto;
    
        select('.subtotal span').innerHTML = moeda(subtotal);
        select('.desconto span').innerHTML = moeda(desconto);
        select('.total span').innerHTML = moeda(total);
        
    } else {
        select('.carrinho--icon span').style.display = 'none';
        closeCompras();
        select('.carrinho--icon').removeEventListener('click', openCompras);
    }
}

function openCompras() {
    select('.area--aside').style.opacity = 0;
        select('.area--aside').style.display = 'flex';
        setTimeout(() => {
           select('.area--aside').style.opacity = 1;
    }, 500)  
}

function closeCompras() {
    select('.area--aside').style.opacity = 0;
    setTimeout(() => {
            select('.area--aside').style.display = 'none';
    }, 500)
}
select('.button--fecharCart--mobile').addEventListener('click', closeCompras)
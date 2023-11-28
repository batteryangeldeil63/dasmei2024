import { createContext, useContext, useEffect, useState } from "react";

import { api } from "../services/api";

export const ProductsContext = createContext({});

function ProductsProvider({ children }) {
  const [ allProducts, setAllProducts ] = useState([]); //todos os produtos encontrados;
  const [ lastViewedProduct, setLastViewedProduct ] = useState({}); //ultimo produto visualizado;
  const [ favorites, setFavorites ] = useState([]); //produtos favoritos;
  const [ cartBuy, setCartBuy ] = useState({ products: [], length: 0, price: "R$ 00,00" }); //produtos no carrinho de compras;
  const [ chosenProductsInCart, setChosenProductsInCart ] = useState([]); //produtos do carrinho selecionado pelos user;

  async function createProduct({ name, category, price, promotion, description }) {
    try {
      const response = await api.post("/products/", { name, category, price, description });
      const product_id = response.data;

      if(promotion) {
        await api.post("/products_promotions/", { product_id, percentage: promotion });
      }

      return product_id;

    } catch(error) {
      if(error) {
        alert(error.response.data.message);
      } else {
        alert("Ocorreu um erro");
      }
      
    }
  }

  async function findProductsByCategory(category) {
    try {
      const response = await api.get(`/products/index?category=${ category }`);
      const array = [];

      for(let product of response.data) {
        const imgs = await api.get(`/products_images/index?product_id=${ product.id }`);
        product.img = imgs.data[0].image;

        array.push(product);
      };

      setAllProducts(array);
      
    } catch(error) {
      console.log("Ocorreu um erro");
    }
    
  }

  async function searchProducts({ name, id }) {
    //retorna uma lista de produtos;
      let response = null;
      let products = [];

      if(name == "") {
        return [];
      }

      if(isNaN(id)) {
        response = await api.post("/products/show", { name });
      } else {
        response = await api.post("/products/show", { id });
      }

      if(response.data.length > 0) {
        for(let product of response.data) {
          if(product) {
          const imgs = await api.get(`/products_images/index?product_id=${ product.id }`);
          product.img = imgs.data[0].image;

          products.push(product);
          }
        };
      }

      setAllProducts(products);
      return products;
  }

  async function findProduct({ name, id }) {
    //retorna um produto especifico;
    try {
      let products = null;
      let product = null;

      if(isNaN(id)) {
        products = await api.post("/products/show", { name });
        product = products.data[0];
      } else {
        products = await api.post("/products/show", { id });
        product = products.data;
      }

      const [promotion, images, sizes, details, model_details] = await Promise.all([
        api.get(`/products_promotions/show?product_id=${ product.id }`),
        api.get(`/products_images/index?product_id=${ product.id }`),
        api.get(`/products_sizes/index?product_id=${ product.id }`),
        api.get(`/products_details/index?product_id=${ product.id }`),
        api.get(`/products_model_details/index?product_id=${ product.id }`)
      ]);
    
      const response = {
        ...product,
        promotion: promotion.data,
        images: images.data,
        sizes: sizes.data,
        details: details.data,
        model_details: model_details.data
      };

      return { newProduct: response };

    } catch(error) {
      return({ newProduct: undefined, error: error.response.data.message ?? "Nenhum produto encontrado" });
      
    }
  }

  async function deleteProducts(products_id) {
    try {
      await api.post("/products/delete", { products: products_id });

    } catch(error) {
      if(error) {
        console.error(error);
      } else {
        console.log("erro ao deletar produtos.");
      }
    }
  }

  function setLastViewedProductStorage(product) {
    sessionStorage.setItem("@zer01modas:product", JSON.stringify(product));
    setLastViewedProduct(product);
  }

  async function updateProduct({ id, name, category, price, promotion, description }) {
    try {
      await api.patch(`/products?id=${ id }`, { name, category, price, description });

      if(promotion) {
        await api.post("/products_promotions/delete", { product_id: id });
        await api.post("/products_promotions", { product_id: id, percentage: promotion });
      }

    } catch(error) {
      if(error) {
        console.log(error);
      } else {
        console.log("erro ao atualizar o produto");
      }
      
    }
  }

  async function findPromotions() {
    //retorna todas as promocoes disponiveis;
    try {
      const response = await api.get("/products_promotions/index");
      const products = [];

      if(response.data.length > 0) {
        for(let product of response.data) {
          if(product) {
          const imgs = await api.get(`/products_images/index?product_id=${ product.id }`);
          product.img = imgs.data[0].image;

          products.push(product);
          }
        };
      }

      setAllProducts(products);

    } catch(error) {
      if(error) {
        alert(error);
      } else {
        console.log("erro ao buscar promocoes");
      }
    }
  }

  async function insertFavorite(product) {
    try {
      await api.post(`/products_favorites?product_id=${ product.id }&category=${ product.category }`);
      await findAllFavorites();

    } catch(error) {
      if(error) {
        alert(error);
      } else {
        alert("erro ao adicionar produto em favoritos");
      }
      
    }
  }

  async function findIfIsFavorite(product) {
    //verificar se um produto está na lista de favoritos do usuário;
    try {
      const response = await api.get(`/products_favorites/show?product_id=${ product.id }`);
      
      if(response.data == false) {
        return false;
      }

      return true;

    } catch(error) {
      if(error) {
        alert("erro ao buscar produto em products_favorites");
      }
      
    }
  }

  async function removeFavorite(product) {
    try {
      await api.delete(`/products_favorites/delete?product_id=${ product.id }`);
      await findAllFavorites();

    } catch(error) {
      if(error) {
        alert(error);
      } else {
        alert("erro ao remover produto de favoritos");
      }
      
    }
  }

  async function findAllFavorites() {
    //buscar a lista de todos os produtos favoritos do user;
    try {
      const response = await api.get("/products_favorites/index");
      const products = [];

      for(let fav of response.data) {
        const { newProduct } = await findProduct({ id: fav.product_id });
        const imgs = await api.get(`/products_images/index?product_id=${ fav.product_id }`);

        fav.name = newProduct[0].name;
        fav.price = newProduct[0].price;
        fav.img = imgs.data[0].image;

        products.push(fav);
      };

      setFavorites(products);
      return products;
    
    } catch(error) {
      if(error) {
        console.log(error, error.response.data.message);
        alert("erro ao lista favoritos");
      }
    }
  }

  async function addShoppingCart(product_id, size, color) {
    //adiciona o produto no carrinho de compras;
    try {
      const product = await checkExistsInTheShoppingCart(size, color);

      if(product) {
        await updateQuantityProductInShoppingCart(product, "increment");
      } else {
        await api.post("/shopping_cart", { product_id, size, color_name: color.name, color_hex: color.hex });
      }
      
      findAllProductsShoppingCart();

    } catch {
      alert("erro ao adicionar produto no carrinho");
    }
  }

  async function checkExistsInTheShoppingCart(size, color) {
    //verifica se ja existe no carrinho de compras;
    try {
      const response = await api.post("/shopping_cart/show", { size, color_name: color.name, color_hex: color.hex });
      
      return response.data;

    } catch {
      alert("erro ao buscar produtos no carrinho rota /show");
    }
  }

  async function updateQuantityProductInShoppingCart(product, params) {
    //atualiza a quantidade de um produto no carrinho de compras;
    try {
      if(params == "increment") {
        await api.patch("/shopping_cart/patch", { product, increment: params });
      } else {
        await api.patch("/shopping_cart/patch", { product, decrement: params });
      }

      await findAllProductsShoppingCart();
      await calculateValueShoppingCart(chosenProductsInCart);

    } catch(error) {
      console.log(error);
      alert("erro ao alterar quantidade do produto no carrinho de compras");
    }
  }

  async function findAllProductsShoppingCart() {
    //retorna todos os produtos do carrinho de compras;
    try {
      const response = await api.get("/shopping_cart/index");
      const products = [];

      for(let index of response.data) {
        const { newProduct } = await findProduct({ id: index.product_id });
        const imgs = await api.get(`/products_images/index?product_id=${ index.product_id }`);

        index.name = newProduct[0].name;
        index.price = newProduct[0].price;
        index.img = imgs.data[0].image;

        products.push(index);
      };

      setCartBuy(prevState => { return {...prevState, products: products }});
      return products;

    } catch(error) {
      console.log(error);
      alert("erro ao buscar produtos no carrinho rota /index");
    }
  }

  async function removeShoppingCart(product_id, size, color_name, color_hex) {
    //remove o produto do carrinho de compras;
    try {
      await api.post("/shopping_cart/delete", { product_id, size, color_name, color_hex }); //remover no banco de dados

      const newArrayProductsInCart = chosenProductsInCart.filter(product => product.id != product_id && product.size != size && product.color_name != color_name && product.color_hex != color_hex
      ); //remover na lista de compras;

      setChosenProductsInCart(newArrayProductsInCart);

      await findAllProductsShoppingCart();

    } catch(error) {
      console.log(error);
      alert("erro ao remover produto do carrinho");
    }
  }

  async function calculateValueShoppingCart(products) {
    //calcular valor da compra;
    let totalPrice = 0;
    let length = 0;

    for(const product of products) {
      const product_color = {
        name: product.color_name,
        hex: product.color_hex
      }

      const response = await checkExistsInTheShoppingCart(product.size, product_color);

      let price = product.price.replace(/[^0-9,]/g, "");
      price = parseFloat(price.replace(",", "."));
      totalPrice = totalPrice + (Number(price) * response.quantity);

      length = length + response.quantity;
    }

    totalPrice = Number(totalPrice.toFixed(2));
    totalPrice = Number(totalPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    setCartBuy(prevState => { return {...prevState, price: totalPrice, length: length }});
  }

  useEffect(() => {
    const product = JSON.parse(sessionStorage.getItem("@zer01modas:product"));
    if(product) {
      setLastViewedProduct(product);
    }

  }, []);

  useEffect(() => {
    (async() => {
  	  await calculateValueShoppingCart(chosenProductsInCart);
    })();

  }, [ chosenProductsInCart ]);

  return (
    <ProductsContext.Provider value={{ allProducts, setAllProducts, lastViewedProduct, createProduct, findProductsByCategory, findProduct, deleteProducts, setLastViewedProductStorage, updateProduct, searchProducts,findPromotions, favorites, setFavorites, insertFavorite, findIfIsFavorite, removeFavorite, findAllFavorites, cartBuy, setCartBuy, addShoppingCart, findAllProductsShoppingCart, removeShoppingCart, updateQuantityProductInShoppingCart, chosenProductsInCart, setChosenProductsInCart }}>
      { children }
    </ProductsContext.Provider>
  )
}

function useProducts() {
  const context = useContext(ProductsContext);
  return context;
}

export { ProductsProvider, useProducts };
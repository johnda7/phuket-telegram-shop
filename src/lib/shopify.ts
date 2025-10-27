// Shopify API Configuration for Phuket Telegram Shop
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'phuket-telegram-shop-117ck.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '89e6c827e100c3d0b35e5957424b3cc7';

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    handle: string;
    productType: string;
    tags: string[];
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
    metafields?: Array<{
      namespace: string;
      key: string;
      value: string;
      type: string;
    }>;
  };
}

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          descriptionHtml
          handle
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 50) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
          metafields(identifiers: [
            {namespace: "place_info", key: "coordinates"},
            {namespace: "place_info", key: "rating"},
            {namespace: "place_info", key: "reviews_count"},
            {namespace: "place_info", key: "duration"},
            {namespace: "place_info", key: "best_time"},
            {namespace: "place_info", key: "amenities"},
            {namespace: "place_info", key: "tips"},
            {namespace: "place_info", key: "map_url"},
            {namespace: "place_info", key: "working_hours"},
            {namespace: "place_info", key: "district"},
            {namespace: "place_info", key: "price_level"},
            {namespace: "place_info", key: "website"}
          ]) {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      productType
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 50) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
          metafields(identifiers: [
            {namespace: "place_info", key: "coordinates"},
            {namespace: "place_info", key: "rating"},
            {namespace: "place_info", key: "district"},
            {namespace: "custom", key: "coordinates"},
            {namespace: "custom", key: "rating"},
            {namespace: "custom", key: "district"},
        {namespace: "place_info", key: "map_url"},
        {namespace: "custom", key: "coordinates"},
        {namespace: "custom", key: "rating"},
        {namespace: "custom", key: "district"},
        {namespace: "custom", key: "working_hours"},
        {namespace: "custom", key: "price_level"},
        {namespace: "custom", key: "duration"},
        {namespace: "custom", key: "best_time"},
        {namespace: "custom", key: "amenities"},
        {namespace: "custom", key: "website"}
      ]) {
        namespace
        key
        value
        type
      }
    }
  }
`;

export async function storefrontApiRequest(query: string, variables: any = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    throw new Error('Shopify: Payment required. Store needs to be upgraded to a paid plan.');
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: any) => e.message).join(', ')}`);
  }

  return data;
}

export async function fetchProducts(limit: number = 20): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first: limit });
  return data.data.products.edges;
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  if (!data.data.product) {
    throw new Error('Product not found');
  }
  return { node: data.data.product };
}

/**
 * Fetch products by category (using tag filter)
 * Example: fetchProductsByCategory('shopping') returns products tagged with 'category:shopping'
 */
export async function fetchProductsByCategory(categoryId: string, limit: number = 50): Promise<ShopifyProduct[]> {
  const allProducts = await fetchProducts(limit);
  const categoryTag = `category:${categoryId}`;
  return allProducts.filter(product => 
    product.node.tags.includes(categoryTag)
  );
}

/**
 * Fetch products by multiple tags
 */
export async function fetchProductsByTags(tags: string[], limit: number = 50): Promise<ShopifyProduct[]> {
  const allProducts = await fetchProducts(limit);
  return allProducts.filter(product => 
    tags.some(tag => product.node.tags.includes(tag))
  );
}

export { SHOPIFY_STORE_PERMANENT_DOMAIN };

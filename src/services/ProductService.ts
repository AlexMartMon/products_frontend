import { number, parse, pipe, safeParse, string, transform } from "valibot";
import {
  DraftProductSchema,
  Product,
  ProductSchema,
  ProductsSchema,
} from "../types";
import axios from "axios";
import { toBoolean } from '../utils/index';

type ProductData = {
  [k: string]: FormDataEntryValue;
};

export async function addProduct(data: ProductData) {
  try {
    const result = safeParse(DraftProductSchema, {
      name: data.name,
      price: +data.price,
    });
    if (result.success) {
      const url = `${import.meta.env.VITE_API_URL}/products`;
      await axios.post(url, {
        name: result.output.name,
        price: result.output.price,
      });
    } else {
      throw new Error("Invalid data");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getProducts() {
  try {
    const url = `${import.meta.env.VITE_API_URL}/products`;
    const { data } = await axios.get(url);
    const result = safeParse(ProductsSchema, data.data);
    if (result.success) {
      return result.output;
    } else {
      throw new Error("It was an unexpected error...");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getProductById(id: Product["id"]) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/products/${id}`;
    const { data } = await axios.get(url);
    const result = safeParse(ProductSchema, data.data);
    if (result.success) {
      return result.output;
    } else {
      throw new Error("It was an unexpected error...");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateProduct(product: ProductData, id: Product["id"]) {
  try {
    const NumberSchema = pipe(string(), transform(Number), number())
    const result = safeParse(ProductSchema, {
      id,
      name: product.name,
      price: parse(NumberSchema, product.price),
      availability: toBoolean(product.availability.toString()),
    });
    
    if (result.success) {
        const url = `${import.meta.env.VITE_API_URL}/products/${id}`;
        await axios.put(url, result.output)
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProduct(id: Product["id"]) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/products/${id}`;
        await axios.delete(url)
    } catch (error) {
        console.log(error);
    }
}

export async function patchProductAvailability(id: Product['id']) {
    try {
        const url = `${import.meta.env.VITE_API_URL}/products/${id}`;
        await axios.patch(url)
    } catch (error) {
        console.log(error);
    }
}
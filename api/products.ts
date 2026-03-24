// import { supabase } from "@/lib/supabase"
// import { Product } from "@/types"

// export const uploadImage = async (file: File): Promise<string> => {
//   const fileName = `${Date.now()}-${file.name}`
//   const path = `public/${fileName}`

//   const { error } = await supabase.storage
//     .from("product-images")
//     .upload(path, file)

//   if (error) throw new Error(error.message)

//   const { data } = supabase.storage
//     .from("product-images")
//     .getPublicUrl(path)

//   if (!data.publicUrl) throw new Error("Не удалось получить URL изображения")

//   return data.publicUrl
// }

// export type CreateProductPayload = Omit<Product, "id"> & { isAvailable?: boolean }

// export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
//   const { data, error } = await supabase
//     .from("products")
//     .insert([
//       {
//         name: payload.name,
//         description: payload.description,
//         price: payload.price,
//         image: payload.image,
//         available: payload.isAvailable ?? true,
//       },
//     ])
//     .select("*")
//     .single()

//   if (error) throw new Error(error.message)
//   if (!data) throw new Error("Не удалось создать продукт")

//   return {
//     id: data.id,
//     name: data.name,
//     description: data.description,
//     price: data.price,
//     image: data.image,
//     isAvailable: data.available,
//   }
// }

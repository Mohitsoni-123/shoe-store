import Product from "../models/Product.js";

export const createProduct = async (req, res)=>{
    try{
        const { name, brand, description, price, discountPrice, category, sizes, colors, images, stock, isFeatured, } = req.body;

        if(!name || !brand || !description || !price || !category || !sizes || !colors || !stock == undefined){
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            })
        }
        const product = await Product.create({
            name, brand, description, price, discountPrice, category, sizes, colors, images, stock, isFeatured
        })

        res.status(201).json({
            success: true,
            message: "Product create successfully",
            product,
        });

    }catch(error){
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to create product",
        })
    }
}
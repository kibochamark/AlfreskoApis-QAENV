import { Request, Response } from 'express';
import { categories } from '../db/schema';
import { createcategory, createconfigoption, deleteConfigOption, getCategories, getCategoryById, getConfigoptionswithvalues, getConfigoptionswithvaluesbyproductid, getconfigoptionbyproductid, getconfigoptions, updateCategory, updateconfigoption } from '../db';
import { deleteCategory } from '../db/index';


export const retrieveconfigoptions =async(req:Request, res:Response)=>{
    try{

        const retrievedoptions = await getConfigoptionswithvalues()
        return res.status(200).json(retrievedoptions).end()
    }catch{
        return res.status(500).json({
            error:"something went wrong"
        }).end()
    }

}

export const retrieveoption=async(req:Request, res:Response)=>{
    try{
        const id = req.query.id as string
        if(!id){
            return res.status(400).json({
                error:"id misiing in query"
            }).end()
        }

        const retrievedoption = await getConfigoptionswithvaluesbyproductid(parseInt(id))
        return res.status(200).json(retrievedoption).end()
    }catch{
        return res.status(500).json({
            error:"something went wrong"
        }).end()
    }

}



export const removeoption =async(req:Request, res:Response)=>{
    try{
        const id = req.query.id as string
        if(!id){
            return res.status(400).json({
                error:"id misiing in query"
            }).end()
        }
        await deleteConfigOption(parseInt(id))
        return res.status(204).end()
    }catch{
        return res.status(500).json({
            error:"something went wrong"
        }).end()
    }

}



export const newconfigoption =async(req:Request, res:Response)=>{
    try{
        const {optionname, product_id} = req.body
        if(!optionname || !product_id){
            return res.status(400).json({
                error:"Name or description missing in schema"
            }).end()
        }



        const option = await createconfigoption({option_name:optionname, product_id:parseInt(product_id)})
        if(!option) return res.status(400).json({
            error:"failed to create resource"
        }).end()
        return res.status(201).json(option).end()
    }catch(error){
        return res.status(500).json({
            error:error?.message
        }).end()
    }

}

export const updateoption =async(req:Request, res:Response)=>{
    try{
        const {optionname} = req.body
        const id = req.query.id as string
        if(!id){
            return res.status(400).json({
                error:"id misiing in query"
            }).end()
        }
        
        const updatedoption = await updateconfigoption({
            option_name: optionname,
        }, parseInt(id))
        if(updatedoption.length <= 0) return res.status(400).json({
            error:"failed to update resource or it does not exist"
        }).end()
        return res.status(201).json(updatedoption).end()
    }catch{
        return res.status(500).json({
            error:"something went wrong"
        }).end()
    }

}
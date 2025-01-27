import { Request, Response } from 'express';
import { categories } from '../db/schema';
import { createcategory, getCategories, getCategoryById, updateCategory } from '../db';
import { deleteCategory } from '../db/index';


export const retrievecategories =async(req:Request, res:Response)=>{
    try{

        const retrievedcategories = await getCategories()
        return res.status(200).json(retrievedcategories).end()
    }catch{
        return res.status(500).json({
            error:"something went wrong"
        }).end()
    }

}

export const retrievecategory =async(req:Request, res:Response)=>{
    try{
        const id = req.query.id as string
        if(!id){
            return res.status(400).json({
                error:"id misiing in query"
            }).end()
        }

        const retrievedcategory = await getCategoryById(parseInt(id))
        return res.status(200).json(retrievedcategory).end()
    }catch{
        return res.status(500).json({
            error:"something went wrong"
        }).end()
    }

}


export const removecategory =async(req:Request, res:Response)=>{
    try{
        const id = req.query.id as string
        if(!id){
            return res.status(400).json({
                error:"id misiing in query"
            }).end()
        }
        await deleteCategory(parseInt(id))
        return res.status(204).end()
    }catch{
        return res.status(500).json({
            error:"something went wrong"
        }).end()
    }

}



export const newcategory =async(req:Request, res:Response)=>{
    try{
        const {name, description} = req.body
        if(!name || !description){
            return res.status(400).json({
                error:"Name or description missing in schema"
            }).end()
        }

        const cat = await createcategory({name:name, description:description})
        if(!cat) return res.status(400).json({
            error:"failed to create resource"
        }).end()
        return res.status(201).json(cat).end()
    }catch{
        return res.status(500).json({
            error:"something went wrong"
        }).end()
    }

}

export const updatecategory =async(req:Request, res:Response)=>{
    try{
        const {name, description} = req.body
        const id = req.query.id as string
        if(!id){
            return res.status(400).json({
                error:"id misiing in query"
            }).end()
        }
        
        const updatedcat = await updateCategory({name:name, description:description}, parseInt(id))
        if(!updatedcat) return res.status(400).json({
            error:"failed to update resource or it does not exist"
        }).end()
        return res.status(201).json(updatedcat).end()
    }catch{
        return res.status(500).json({
            error:"something went wrong"
        }).end()
    }

}
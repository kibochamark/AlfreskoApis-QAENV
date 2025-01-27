import { createConfigValue, deleteConfigValue, getConfigValueById, getConfigValues, updateConfigValue } from '../db';
import { Request, Response } from 'express';
import { getconfigoptionbyid } from '../db/index';

export const createConfigValueHandler = async (req: Request, res: Response) => {
    try {
        const { option_id, value_name, price_adjustment } = req.body;
        if(!option_id || !value_name || !price_adjustment){
            return res.status(400).json({
                error:"missing values in schema"
            })
        }

        console.log(option_id, value_name, price_adjustment)

        const option = await getconfigoptionbyid(parseInt(option_id))

        console.log(option)

        if(option.length > 0){
            const newConfigValue = await createConfigValue({
                option_id:parseInt(option_id),
                value_name:value_name,
                price_adjustment:price_adjustment
            });
    
        
            return res.status(201).json(newConfigValue).end();
        }

        return res.status(404).json({
            error:"option not found"
        }).end()

       
    } catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};


export const getConfigValuesHandler = async (req: Request, res: Response) => {
    try {
        const configValues = await getConfigValues();
        return res.status(200).json(configValues).end();
    } catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};



export const getConfigValueByIdHandler = async (req: Request, res: Response) => {
    try {
        const id = req.query.id as string;
        if(!id){
            return res.status(400).json({
                error:"id misiing in query"
            }).end()
        }

        const configValue = await getConfigValueById(parseInt(id, 10));
        if (!configValue) {
            return res.status(404).json({ error: "Config value not found" }).end();
        }
        return res.status(200).json(configValue).end();
    } catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};


export const updateConfigValueHandler = async (req: Request, res: Response) => {
    try {
        const id = req.query.id as string;
        if(!id){
            return res.status(400).json({
                error:"id misiing in query"
            }).end()
        }
        
        const updatedValues = req.body;
        const updatedConfigValue = await updateConfigValue(parseInt(id, 10), updatedValues);
        if (!updatedConfigValue) {
            return res.status(404).json({ error: "Config value not found" }).end();
        }
        return res.status(201).json(updatedConfigValue).end();
    } catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};



export const deleteConfigValueHandler = async (req: Request, res: Response) => {
    try {
        const id  = req.query.id as string;
        const deleted = await deleteConfigValue(parseInt(id, 10));
        if (!deleted) {
            return res.status(404).json({ error: "Config value not found" }).end();
        }
        return res.status(204).end();
    } catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};


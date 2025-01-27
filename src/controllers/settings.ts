import { createConfigSettings, createConfigValue, deleteConfigSettings, deleteConfigValue, getConfigSettings, getConfigSettingsById, getConfigValueById, getConfigValues, getUser, updateConfigSettings, updateConfigValue } from '../db';
import { Request, Response } from 'express';
import { getconfigoptionbyid } from '../db/index';
import Joi from 'joi';


const ConfigSettingsSchema = Joi.object({
    priceToggle: Joi.boolean().required()
})
const ConfigSettingsUpdateFetchSchema = Joi.object({
    id: Joi.number().required(),
    priceToggle: Joi.boolean().required()
})

const ConfigSettingsFetchSchema = Joi.object({
    id: Joi.number().required(),
  
})


export const createConfigSettingsHandler = async (req: Request, res: Response) => {
    try {

        const { error, value } = ConfigSettingsSchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {


            return res.status(400).json({
                error: error.details.map((detail) => detail.message),
            })
        }


        const { priceToggle } = value;


        const user = req.user as any

        const userrole = await getUser(user?.id as number)

        if(userrole[0].role !== 3){
            return res.status(403).json({
                error: "You are not authorized to perform this action"
            }).end()
        }


        const existingconfigsettings = await getConfigSettings();

        if(existingconfigsettings.length >= 1){
            return res.status(403).json({
                error: "There is an already consisting config"
            }).end()
        }
        

        const newConfigSetting = await createConfigSettings({
            priceToggle
        });

        return res.status(201).json(newConfigSetting).end();
    } catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};


export const getConfigSettingsHandler = async (req: Request, res: Response) => {
    try {
        const user = req.user as any

        const userrole = await getUser(user?.id as number)

        if(userrole[0].role !== 3){
            return res.status(403).json({
                error: "You are not authorized to perform this action"
            }).end()
        }

        const configsettings = await getConfigSettings();
        return res.status(200).json(configsettings).end();
    } catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};



export const getConfigSettingByIdHandler = async (req: Request, res: Response) => {
    try {
        const { error, value } = ConfigSettingsFetchSchema.validate(req.params, {
            abortEarly: false,
        });

        if (error) {


            return res.status(400).json({
                error: error.details.map((detail) => detail.message),
            })
        }



        const user = req.user as any

        const userrole = await getUser(user?.id as number)

        if(userrole[0].role !== 3){
            return res.status(403).json({
                error: "You are not authorized to perform this action"
            }).end()
        }

        const {id}= value

        const configValue = await getConfigSettingsById(parseInt(id, 10));
        if (!configValue) {
            return res.status(404).json({ error: "Config setting not found" }).end();
        }
        return res.status(200).json(configValue).end();
    } catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};


export const updateConfigSettingsHandler = async (req: Request, res: Response) => {
    try {
        const { error, value } = ConfigSettingsUpdateFetchSchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {


            return res.status(400).json({
                error: error.details.map((detail) => detail.message),
            })
        }


        const user = req.user as any

        const userrole = await getUser(user?.id as number)

        if(userrole[0].role !== 3){
            return res.status(403).json({
                error: "You are not authorized to perform this action"
            }).end()
        }


        const {id, priceToggle} = value;
        const updatedConfigValue = await updateConfigSettings(parseInt(id, 10), priceToggle);
        if (!updatedConfigValue) {
            return res.status(404).json({ error: "Config setting not found" }).end();
        }
        return res.status(201).json(updatedConfigValue).end();
    } catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};



export const deleteConfigSettingsHandler = async (req: Request, res: Response) => {
    try {
        const { error, value } = ConfigSettingsFetchSchema.validate(req.params, {
            abortEarly: false,
        });

        if (error) {


            return res.status(400).json({
                error: error.details.map((detail) => detail.message),
            })
        }

        const {id}= value

        const user = req.user as any

        const userrole = await getUser(user?.id as number)

        if(userrole[0].role !== 3){
            return res.status(403).json({
                error: "You are not authorized to perform this action"
            }).end()
        }


        const deleted = await deleteConfigSettings(parseInt(id, 10));
        if (!deleted) {
            return res.status(404).json({ error: "Config setting not found" }).end();
        }
        return res.status(204).end();
    } catch (error) {
        return res.status(500).json({ error: error?.message }).end();
    }
};


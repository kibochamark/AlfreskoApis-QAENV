import { Request, Response } from 'express';
import { categories } from '../db/schema';
import { createQuote, createcategory, createconfigoption, deleteConfigOption, deleteQuote, getCategories, getCategoryById, getConfigSettings, getConfigoptionswithvalues, getConfigoptionswithvaluesbyproductid, getQuoteById, getQuotes, getconfigoptionbyproductid, getconfigoptions, updateCategory, updateQuote, updateQuoteStatus, updateconfigoption } from '../db';
import { deleteCategory } from '../db/index';
import Joi from 'joi';
import { sendQuoteNotification, sendQuoteNotificationToClient } from '../utils/sendMail';


const getSchema = Joi.object({
    id: Joi.number().integer().positive().required()
})


const createQuoteSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    dimensions: Joi.string().required(),
    price: Joi.number().required(),
    canopyType: Joi.string().required(),
    rooffeature: Joi.string().required(),
    roofBlinds: Joi.string().optional(),
    budget: Joi.number().required(),
    wallfeatures: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
        })
    ).required(),
    backside: Joi.string().required(),
    additionalfeatures: Joi.string().required(),
    installation: Joi.boolean().default(false),
    status: Joi.string().valid(
        "contacted",
        "left message",
        "survey booked",
        "survey completed",
        "revised estimate sent",
        "sale agreed",
        "invoiced",
        "payment received",
        "ordered",
        "installed",
        "complete",
        "pending"
    ).default("pending")
})
const updateQuoteSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    price: Joi.number().required(),
    dimensions: Joi.string().required(),
    canopyType: Joi.string().required(),
    rooffeature: Joi.string().required(),
    roofBlinds: Joi.string().optional(),
    budget: Joi.number().required(),
    wallfeatures: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
        })
    ).required(),
    backside: Joi.string().required(),
    additionalfeatures: Joi.string().required(),
    installation: Joi.boolean().default(false),
    status: Joi.string().valid(
        "contacted",
        "left message",
        "survey booked",
        "survey completed",
        "revised estimate sent",
        "sale agreed",
        "invoiced",
        "payment received",
        "ordered",
        "installed",
        "complete",
        "pending"
    )
})


const updateQuoteStatusSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
    status: Joi.string().valid(
        "contacted",
        "left message",
        "survey booked",
        "survey completed",
        "revised estimate sent",
        "sale agreed",
        "invoiced",
        "payment received",
        "ordered",
        "installed",
        "complete",
        "pending"
    ).required()
})



export const retrievecquotes = async (req: Request, res: Response) => {
    try {

        const configsettings = await getConfigSettings()

        let priceToggled: boolean = configsettings[0]?.priceToggle ?? false

        const retrievedquotes = await getQuotes(priceToggled)
        return res.status(200).json(retrievedquotes).end()
    } catch {
        return res.status(500).json({
            error: "something went wrong"
        }).end()
    }

}

export const retrievequote = async (req: Request, res: Response) => {
    try {
        const { error, value } = getSchema.validate(req.params, { abortEarly: false });

        if (error) {
            let statusError = new Error(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ))
            throw statusError
        }


        const { id } = value;
        const configsettings = await getConfigSettings()

        let priceToggled: boolean = configsettings[0]?.priceToggle ?? false

        const retrievequote = await getQuoteById(parseInt(id), priceToggled)
        return res.status(200).json(retrievequote).end()
    } catch (e: any) {
        return res.status(500).json({
            error: e.message
        }).end()
    }

}



export const removequote = async (req: Request, res: Response) => {
    try {
        const { error, value } = getSchema.validate(req.params, { abortEarly: false });

        if (error) {
            let statusError = new Error(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ))
            throw statusError
        }


        const { id } = value;
        await deleteQuote(parseInt(id))
        return res.status(204).end()
    } catch (e: any) {
        return res.status(500).json({
            error: e.message
        }).end()
    }

}



export const newquote = async (req: Request, res: Response) => {
    try {
        const { error, value } = createQuoteSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let statusError = new Error(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ))
            throw statusError
        }


        const createdquote = await createQuote(value)
        if (!createdquote) return res.status(400).json({
            error: "failed to create resource"
        }).end()
        // Send OTP code to user's email
        await sendQuoteNotification("info@alfresko.co.uk", createdquote[0]);
        await sendQuoteNotificationToClient(createdquote[0]?.email as string, createdquote[0]);

        return res.status(201).json({
            message: "success",
            data: createdquote
        }).end()
    } catch (error) {
        return res.status(500).json({
            error: error?.message
        }).end()
    }

}

export const updatequote = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateQuoteSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let statusError = new Error(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ))
            throw statusError
        }


        const {
            id,
            name,
            email,
            phone,
            address,
            dimensions,
            canopyType,
            rooffeature,
            wallfeatures,
            price,
            status,
            budget,
            roofBlinds,
            backside,
            additionalfeatures,
            installation
        } = value


        const updatedquote = await updateQuote(parseInt(id), {
            name,
            email,
            phone,
            price,
            address,
            dimensions,
            canopyType,
            budget,
            roofBlinds,
            rooffeature,
            wallfeatures,
            backside,
            status,
            additionalfeatures,
            installation,

        })

        if (!updatedquote) return res.status(400).json({
            error: "failed to update resource or it does not exist"
        }).end()

        return res.status(201).json({
            message: "success",
            data: updatedquote
        }).end()
    } catch (e: any) {
        return res.status(500).json({
            error: e.message
        }).end()
    }

}
export const updatequotestatus = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateQuoteStatusSchema.validate(req.body, { abortEarly: false });

        if (error) {
            let statusError = new Error(JSON.stringify(
                {
                    error: error.details.map(detail => detail.message),
                }
            ))
            throw statusError
        }


        const {
            id,

            status
        } = value


        const updatedquote = await updateQuoteStatus(parseInt(id), status)

        if (!updatedquote) return res.status(400).json({
            error: "failed to update resource or it does not exist"
        }).end()

        return res.status(201).json({
            message: "success",
            data: updatedquote
        }).end()
    } catch (e: any) {
        return res.status(500).json({
            error: e.message
        }).end()
    }

}
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");
const productService = require("../service/productService");
const Joi = require("joi");

const checkCompleteCategoryFrom = (form) => async (req, res, next) => {
    const { title, description, image } = req[form];

    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().max(100).required(),
        image: Joi.string().required()
    })

    try {
        await schema.validateAsync({
            title, 
            description,
            image,
        })
    } catch(error) {
        const result = Object.entries(req[form]).reduce((map, [key, value])=>{
            map += `[${key} : ${value}] `;
            return map;
        }, '');
        next(
            new AppError(commonErrors.inputError, 400, `${result}: 유효한 데이터 셋이 아닙니다.`)
        )
    }
};

const checkCategoryIdFrom = (from) => (req, res, next) => {
    const { id } = req[from];

    if (id === undefined) {
        next(
            new AppError(commonErrors.inputError, 400, `${from}: id는 필수값입니다.`)
        );
    }
    next();
};

//삭제하려는 카테고리 내 상품이 존재할 경우, 포함된 상품을 모두 삭제하거나 카테고리를 변경해야 한다.
const checkRemainedProduct = (form) => async (req, res, next) => {
    const { title } = req[form]; 
    try {
        const products = productService.getProducts({ category: title });
        if (products) {

        }
    } catch(error) {
        new AppError(
            commonErrors.inputError,
            400,
            `삭제하려는 카테고리에 포함된 상품이 존재합니다.`
        )
    }
}


module.exports = {
    checkCompleteCategoryFrom,
    checkCategoryIdFrom,
    checkRemainedProduct
}


// import models
var db = require("../models");

// import cloudinary
var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

exports.products_get_all = async (req, res, next) => {
    // Product.find()
    try {
        let documents = await db.product.findAll({
            attributes: ['name', 'value', 'id', 'productImage']
        });
        // console.log("Products:", documents);
        if (documents) {
            const response = {
                count: documents.length,
                products: documents.map(document => {
                    return {
                        name: document.dataValues.name,
                        value: document.dataValues.value,
                        _id: (document.dataValues.id).toString(),
                        productImage: document.dataValues.productImage,
                        request: {
                            type: 'GET',
                            // url: `http://localhost:3000/products/${document._id}`
                            url: `http://localhost:3000/products/`
                        }
                    };
                })
            }; //response
            res.set({
                'Content-Type': 'application/json'
            });

            //Correct:
            /***********/
            res.status(200).json(response);

            console.log("STATUS:", res.statusCode);
            console.log("CONTENT:", res.get('Content-Type'));
        }//if
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};

// CLOUDINARY UPLOAD:
/****************************************/
exports.cb_image_upload = async (req, res, next) => {
    // The form data comes in an Object with keys that will vary by the type of file that was uploaded

    let cloudifyResponse = await cloudinary.uploader.upload(req.body.file, (error, result) => {
        if (error) {
            console.log("Failed", error);
            res.status(400).json({ error: error });
        }
        else {
            console.log("Success", result);
            // console.log(cloudinary.image());
            res.status(200).json(result);
        }
    });
};
/****************************************/

exports.products_insert_product = async (req, res, next) => {

    try {
        let insertProps = {};

        // Populate Properties to insert:
        for (let key of req.body) {
            // validate that data has been supplied
            if (key.value) {
                insertProps[key.propName] = key.value;
                // console.log("PRODUCTS: KEY/VALUE:", key.propName, " = ", key.value);
            }
        }
        console.log("insertProps.authToken:", insertProps.authToken);

        // create a new product document, to be sent in the request
        let product = await db.product.create({
            name: insertProps.name,
            value: insertProps.value,
            productImage: insertProps.productImage,
            cloudId: insertProps.cloudId
        });
        if(product) {
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: product.name,
                    value: product.value,
                    _id: product.id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'
                    }
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}; // product_insert_product.

exports.products_create_product = async (req, res, next) => {
    try {
        // req.file is availabe with upload
        console.log(req.file);
        let path = req.file.path.split('\\');
        console.log("Path:", path[1]);
        // create a new product document, to be sent in the request
        let product = await db.product.create({
            name: req.body.name,
            value: req.body.value,
            productImage: 'uploads/' + path[1]
        });
        if (product) {
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: product.name,
                    value: product.value,
                    _id: product.id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + product.id
                    }
                }
            });
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
};


exports.products_get_product = async (req, res, next) => {
    try {
        // Extract the productId
        const id = req.params.productId;
        console.log("products_get_product", id);
        // Find document by id

        // Find a document by product id
        const document = await db.product.findOne({
            attributes: ['name', 'value', 'id', 'productImage'],
            where: {
                id: id
            }
        });


        const product = {
            name: document.dataValues.name,
            value: document.dataValues.value,
            productImage: document.dataValues.productImage,
            _id: document.dataValues.id,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + document.id
            }
        };

        if (document) {
            console.log("Product:", product);
            res.status(200).json(product);
        }
        else {
            res.status(404).json({
                message: 'No valid entry found for ID'
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
};

exports.products_update_product = async (req, res, next) => {
    console.log("IN PRODUCT UPDATE")
    try {
        // Step 1: After the access token is verified, send a new access and refresh token
        ;

        const id = req.params.productId;
        const updateProps = {};
        // Step 2: Loop through the array of objects sent in the request, which will choose the field you want to update from the request body (name). The new object (updateProps) will have the field and value you want to update
        for (let key of req.body) {
            // validate that data has been supplied
            if (key.value) {
                updateProps[key.propName] = key.value;
            }
        } // for
        // console.log("Products_update: updateProps:", updateProps);
        // Step 3: Perform the update
        const document = await db.product.update(
                updateProps,
            {
                where: {
                    id: id
                }
            });

            // console.log("Products Controller: Updated Product:", document);
        if (document) {
            const product = {
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/product/update/' + id
                }
            };
            res.status(200).json(product);
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            err: err
        });
    }
}; // products_update_product

exports.products_delete_product = async (req, res, next) => {
    try {
        console.log("IN PRODUCTS_DELETE_PRODUCT");
        const id = req.params.productId;
        // Product.deleteOne( {_id: id} )
        /***************************** */
        const cloudResult = await db.product.findOne({
            attributes: ['cloudId'],
            where: {
                id
            }
        });

        if (cloudResult.cloudId) {
            try {
                let cloudImageDestroyed = await cloudinary.uploader.destroy(cloudResult.cloudId);
                console.log("CLOUDDESTROYED", cloudImageDestroyed);
                // res.status(200).json(cloudId);
                /********************************** */
                const document = await db.product.destroy({
                    where: { id: id }
                });

                if (document) {
                    const response = {
                        message: 'Product deleted',
                        request: {
                            type: 'POST',
                            url: 'http://localhost:3000/products/product/delete/' + id,
                            // body: { name: 'String', value: 'Number'}
                        }
                    };
                    res.status(200).json(response);
                }// if
            }
            catch (err) {
                console.log(err);
                res.status(500).json({
                    message: err
                });
            }
            /********************************* */
        }
        else {
            res.status(404).json({
                message: 'No valid entry found for ID'
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }

};


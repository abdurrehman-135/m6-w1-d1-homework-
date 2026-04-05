const Inventory = require('../models/inventory.model');

exports.createInventory = async (req, res) => {
    try {
        const inventory = await Inventory.create({
            prodname: req.body.prodname,
            qty: req.body.qty,
            price: req.body.price,
            status: req.body.status
        });

        res.status(201).json(inventory);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating inventory',
            error: error.message
        });
    }
};

exports.getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id).select('-__v');

        if (!inventory) {
            return res.status(404).json({
                message: 'Inventory not found with id ' + req.params.id
            });
        }

        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving inventory with id ' + req.params.id,
            error: error.message
        });
    }
};

exports.inventories = async (req, res) => {
    try {
        const inventoryInfos = await Inventory.find().select('-__v');
        res.status(200).json(inventoryInfos);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: 'Error fetching inventories',
            error: error.message
        });
    }
};

exports.deleteInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findByIdAndDelete(req.params.id);

        if (!inventory) {
            return res.status(404).json({
                message: 'No inventory found with id = ' + req.params.id,
                error: '404'
            });
        }

        res.status(200).json({});
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can't delete inventory with id = " + req.params.id,
            error: error.message
        });
    }
};

exports.updateInventory = async (req, res) => {
    const inventoryId = req.params.id || req.body._id;

    try {
        const inventory = await Inventory.findByIdAndUpdate(
            inventoryId,
            {
                prodname: req.body.prodname,
                qty: req.body.qty,
                price: req.body.price,
                status: req.body.status
            },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!inventory) {
            return res.status(404).json({
                message: "Error -> Can't update an inventory with id = " + inventoryId,
                error: 'Not Found!'
            });
        }

        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({
            message: "Error -> Can't update an inventory with id = " + inventoryId,
            error: error.message
        });
    }
};

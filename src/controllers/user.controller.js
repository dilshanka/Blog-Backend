const userservice = require("../services/user.service");

exports.getAllUsers = async (req, res) => {

    console.log("Fetching all users");


    try {
        const users = await userservice.getAllUsers();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await userservice.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}


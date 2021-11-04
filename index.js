const http = require("http");
const app = require("./app");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const {userRegisterRules, userLoginRules, validate} = require('./validator/user')
const auth = require("./middleware/auth");
// importing user context
const User = require("./model/user");

const server = http.createServer(app);

const {PORT, TOKEN_KEY} = process.env;
const port = process.env.PORT || PORT;

// server listening 
server.listen(port, () => {
    console.log(`Server running on port ${port}: http://localhost:${port}`);
});

app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const {username, email, password} = req.body;

        // Validate user input
        if (!(email && password && username)) {
            return res.status(400).json({
                status: 'error',
                message: 'All input is required'
            });
        }

        // check if user already exist
        // Validate if user exist in our database
        let oldUser = await User.findOne({email});
        if (oldUser) {
            return res.status(409).json({
                status: 'error',
                message: 'This email address is already being used. Please Login or use another email address.'
            });
        }

        oldUser = await User.findOne({username});
        if (oldUser) {
            return res.status(409).json({
                status: 'error',
                message: 'This username is already being used. Please Login or use another username.'
            });
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            username: username,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        user.token = jwt.sign(
            {user_id: user._id, email},
            TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        // return success
        return res.status(201).json({
            status: 'success',
            message: 'The user account has been created.',
        });

    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const {email, password} = req.body;

        // Validate user input
        if (!(email && password)) {
            return res.status(400).json({
                status: 'error',
                message: 'All input is required'
            });
        }
        // Validate if user exist in our database
        const user = await User.findOne({email});

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            user.token = jwt.sign(
                {user_id: user._id, email},
                TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            return res.status(200).json({
                status: 'success',
                message: 'User has been successfully logged in',
                user: user
            });
        }

        return res.status(400).json({
            status: 'error',
            message: 'Wrong password or account doesn’t exist.',
        });
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

app.get("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});
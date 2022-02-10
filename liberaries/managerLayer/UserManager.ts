import { config } from 'dotenv';
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../../model/User")
const Task = require("../../model/Task")


config();

export class UserManager {

    private static instance: UserManager;

    //#region "singleton design pattern"

    /**
     * The UserManager's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */

    private constructor() { }

    /**
 * The static method that controls the access to the UserManager instance.
 *
 * This implementation let you subclass the UserManager class while keeping
 * just one instance of each subclass around.
 */

    public static getInstance(): UserManager {
        if (!UserManager.instance) {
            UserManager.instance = new UserManager();
        }

        return UserManager.instance;
    }

    /**
 * Finally, any UserManager should define some business logic, which can be
 * executed on its instance.
 */
    //#endregion "END"

    //#region "Function"

    public getUser = async (email: string) => {
        let result: object = {};
        try {

            let users = await User.find({ email: email })
            result = users ? { id: users[0]._id, email: users[0].email } : {};

        } catch (error) {
            console.log(`Error in Manager Layer ${error}`);
        }
        return result;
    }

    public tasks = async () => {
        let result: object = [];
        try {
            const tasks = await Task.find();
            result = tasks ? tasks : [];

        } catch (error) {
            console.log(`Error in Manager Layer Tasks List${error}`);
        }
        return result;
    }


    public register = async (email: string, password: string) => {
        let res: boolean = false;
        let result: object = {};
        try {

            const exist = await User.findOne({ email: email })
            if (exist) return res

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            if (!exist) {
                const newUser = new User({
                    email: email,
                    password: hashPassword
                })
                let obj = await newUser.save();

                result = {
                    id: obj._id,
                    email: obj.email
                }

                res = true
            }

        } catch (error) {
            console.log(`Error in Manager Layer during register ${error}`);
        }
        return { result, res };
    }

    public login = async (email: string, password: string) => {
        let res: boolean = false;
        let result: any = {};
        try {

            const exist = await User.findOne({ email: email })
            if (!exist) return res

            const verifyUser = await bcrypt.compare(password, exist.password)

            if (exist && verifyUser) {
                const payload = {
                    email: email
                }
                const accessToken = await jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: '1h' /* 30 Days */
                });

                result = `Bearer ${accessToken}`;
                res = true;

            } else {
                return res
            }

        } catch (error) {
            console.log(`Error in Manager Layer during login ${error}`);
        }
        return { result, res };
    }

    public taskCreate = async (name: string) => {
        let res: boolean = false;
        let result: object = {};
        try {
            const newTask = new Task({
                name: name,
            })
            let obj = await newTask.save();

            result = {
                id: obj._id,
                name: obj.name
            }

            res = true
        }
        catch (error) {
            console.log(`Error in Manager Layer during Task Create ${error}`);
        }
        return { result, res };
    }
}
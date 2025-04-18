import { Request, Response}  from "express";
import { EntityCourses } from "../entities";
import { ResponseHandler } from "../utils/response";




// @desc  :   Create Course
// @route :   POST /api/course/create
// @access:   Private: Users
const createCourse = async (req: Request, res: Response ) => {
    const { name, description } = req.body;
    const user = req.user;

    if (!user) {
        return ResponseHandler.unauthorized(res, "User not authenticated");
    }

    // Course title is required
    if (!name){
        return ResponseHandler.badRequest(res, "Bad request: Name of the course is required")
    }

    // Check if the course already exists for this user:
    const courseExist = await EntityCourses.findOne({
        where: {
            name: name,
            creator: { id: user.id }
        }
    });

    if (courseExist) {
        return ResponseHandler.badRequest(res, "Bad request: Course exists already")
    } else {
        const course = await EntityCourses.create({
            name,
            description,
            creator: user,
        }).save();

        return ResponseHandler.success({
            res,
            data: course,
            message: "Course created successfully."
        })
    }
   
}


// @desc  :   Get user's all courses
// @route :   GET /api/course/create
// @access:   Private: Users
const getUserCourses = async (req: Request, res: Response) => {

    const user = req.user;

    // User Auth is required.
    if (!user) {
        return ResponseHandler.unauthorized(res, "User not authenticated");
    }
    
    
    // getting all the courses created by user
    const courses = await EntityCourses.find({
        where: {
            creator: { id: user.id }
        }
    })
 
    // sending back the courses on response
    return ResponseHandler.success({
        res,
        data: courses, 
        message: "Courses fetched successfully."
    })
}


// @desc  :   Get a course
// @route :   GET /api/course/:id
// @access:   Private: Users
const getCourse = async (req: Request, res: Response) => {
    const id = req.params.id


    try {
        const course = await EntityCourses.findOne({
            where: {id: id}
        })
        if (course){
            return ResponseHandler.success({
                res, 
                message: "Course fetched succesfully",
                data: course,
            })
        }else{
            return ResponseHandler.notFound(res, "Not Found: no course found")
        }
    } catch (error) {
        return ResponseHandler.error({
            statusCode: 400,
            message: "Invalid id",
            res,
        })
    }


}

// @desc  :   Delete a course
// @route :   DELETE /api/course/:id
// @access:   Private: Users
const deleteCourse = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const course = await EntityCourses.findOne({
            where: {id: id}
        })
        if (course){
            await EntityCourses.delete({ id: id })
            return ResponseHandler.success({
                res, 
                message: "Course Deleted successfully",
            })
        }else{
            return ResponseHandler.notFound(res, "Not Found: no course found")
        }
    } catch (error) {
        return ResponseHandler.error({
            statusCode: 400,
            message: "Invalid id",
            res,
        })
    }
}


export {createCourse, getUserCourses, getCourse, deleteCourse};
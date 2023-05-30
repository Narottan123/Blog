const { default: mongoose } = require('mongoose');
const blogModel = require('../Models/blogModel');
const authorModel = require('../Models/authorModel')


const createBlog = async (req, res) => {
    try {
        const data = req.body;
        if (!data.title || !data.body || !data.authorId || !data.category || !data.tags || !data.subcategory) {
            return res.status(400).send({ status: false, message: "missing mandatory fields" })
        }
        if (!Array.isArray(data.tags) || !Array.isArray(data.subcategory)) {
            return res.status(400).send({ status: false, message: "missing array format" })
        }
        if (data.authorId != req["x-api-key"].authorId) {
            return res.status(403).send({ status: false, message: "unauthorized" })
        }

        // Check if the authorId exists or not
        /*const author = await authorModel.findById(data.authorId)
        if (!author) {
            return res.status(400).json({
                status: false,
                message: "invalid authorId",
            });
        }*/
        data.publishedAt = new Date();

        const createdBlog = await blogModel.create(data);
        return res.status(201).json({ status: true, data: createdBlog });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};
const getAllBlogs = async (req, res) => {
    try {
        const { authorId, category, tags, subcategory } = req.query;
        const filters = { isDeleted: false, isPublished: true, };
        //If the authorId parameter exists, it is added to the filters object.
        if (authorId) {
            const isValid = mongoose.isValidObjectId(authorId);
            if (!isValid) {
                return res.status(400).json({ status: false, message: "Invalid authorid" });
            }
            filters.authorId = authorId;

        }
        if (category) {
            filters.category = category
        }
        if (tags) {
            filters.tags = { $in: tags.split(",") };
        }
        if (subcategory) {
            filters.subcategory = { $in: subcategory.split(",") };
        }
        let blogs = await blogModel.find(filters);
        if (blogs.length == 0) {
            return res.status(400).json({ status: false, message: "No blogs found" });
        }
        return res.status(200).json({ status: true, message: "Blogs List", data: blogs });
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message })
    }

}
const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const isValidId = mongoose.isValidObjectId(blogId);
        if (!isValidId) {
            return res.status(400).json({ status: false, message: "Invalid blogId" });
        }
        console.log(blogId)

        let blog = await blogModel.findOne({ _id: blogId, isDeleted: false })
        if (!blog) {
            return res.status(404).json({ status: false, message: "Blog not found Unauthorizes Access" })
        }
        // checking the decoded token's authorId and blog's authorId is same or not    
        //:- checking authorization
        if (req["x-api-key"].authorId != blog.authorId) {
            return res.status({ status: false, message: "Unauthorized" })
        }
        let { title, body, tags, subcategory } = req.body;
        //If title is updated then it will store updated title otherwise store
        //previous title
        blog.title = title || blog.title;
        blog.body = body || blog.body;
        
        if(typeof blog.title !=="string" || typeof blog.body !=="string"){
            return res.status(400).send({status : false , message : "mention correct format of the field"})
        }

        if (typeof tags != "object") {
            tags = [tags]
        }
        if (tags && tags.length > 0) {
            tags.forEach(tag => {
                if (tag !== null&&!blog.tags.includes(tag)) {
                    blog.tags.push(tag);
                }
                
            });
            blog.tags = blog.tags.filter(tag => tag !== null);
        }

        if (typeof subcategory != "object") {
            subcategory = [subcategory]
        }

        if (subcategory && subcategory.length > 0) {
            subcategory.forEach(subcategories => {
                if (subcategories!==null&&!blog.subcategory.includes(subcategories)) {
                    blog.subcategory.push(subcategories);
                }
            });
            blog.subcategory = blog.subcategory.filter(subcategories=> subcategories !== null);
        }

        blog.isPublished = true;
        blog.publishedAt = new Date();

        const updatedBlog = await blog.save();
        res.status(200).json({
            status: true, message: "Blog updated", data: updatedBlog
        });
    } catch (error) {
        res.status(500).json({
            status: false, message: error.message
        });
    }
};
const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;

        // Check if the blogId is valid
        const isValidId = mongoose.isValidObjectId(blogId);
        if (!isValidId) {
            return res.status(400).json({
                status: false, message: "Invalid blogId"
            });
        }

        // Check if the blogId exists and is not deleted
        const blog = await blogModel
            .findOne({ _id: blogId, isDeleted: false });

        if (!blog) {
            return res.status(404).json({
                status: false, message: "Blog not found"
            });
        }

        // checking rights of author  for deletion
        if (blog.authorId != req["x-api-key"].authorId)
            return res.status(403).send({
                status: false, message: "unauthorized"
            })

        blog.isDeleted = true;
        blog.deletedAt = new Date();

        const deleted = await blog.save();
        res.status(200).json({
            status: true,
            message: "successful deleted"
        });
    } catch (error) {
        res.status(500).json({
            status: false, message: error.message
        });
    }
};

/*const deleteByQuery = async (req, res) => {
    try {
        const queryparams = req.query;
        if (Object.keys(queryparams).length === 0) {
            return res.status(400).json({ status: false, message: "No search parameters provided" });
        }
        const filter = { isDeleted: false };
        if (queryparams.category) {
            filter.category = queryparams.category
        }
        if (queryparams.authorId) {
            filter.authorId = queryparams.authorId
        }
        if (queryparams.tags) {
            filter.tags = queryparams.tags
        }
        if (queryparams.subcategory) {
            filter.subcategory = queryparams.subcategory;
        }
        if (queryparams.isPublished) {
            filter.isPublished = queryparams.isPublished;
        }
        let blogData = await blogModel.updateMany( filter , { $set: { isDeleted: true, deletedAt: new Date() } },{new:true});
        if(blogData.authorId!=req['x-api-key'].authorId){
            return res.status(403).send({status : false , message : "unauthorized"})
        }
        if (blogData.matchedCount == 0) {//matchedCount is nothing but one of the return key of updateMany query
            return res.status(404).send({ status: false, msg: "Data  Already Deleted or Not Found !!" });
        };
        return res.status(200).send({ status: true, msg: "Data Deleted Sucessfully !!" });
        /*if(blogData.authorId===req.access_token && blogData.isDeleted==='true'){
            return res.status(400).send({status : false , message : "Bad Request Decument is already deleted"})
        }*/


//blogData.isDeleted=tru
//blogData.deletedAt=new Date();
//const saved=await blogData.save();

/*res.status(200).json({ message: "Deleted Successfully",blogData });



}
catch (err) {
res.status(500).send({ status: false, message: err.message })
}
}*/


const deleteBlogsByQuery = async (req, res) => {
    try {
        const { authorId, category, tags, subcategory, unpublished } = req.query;

        // Check if no any query parameters are provided
        if (Object.keys(req.query).length === 0) {
            return res.status(400).json({
                status: false,
                message: "No search parameters provided",
            });
        }

        const filters = { isDeleted: false };

        // Apply filters based on the query parameters
        if (category) {
            filters.category = category;
        }

        if (authorId) {
            const isValidId = mongoose.isValidObjectId(authorId);
            if (!isValidId) {
                return res.status(400).json({
                    status: false,
                    message: "Invalid authorId",
                });
            }

            if (authorId != req["x-api-key"].authorId)
                return res.status(403).send({
                    status: false,
                    message: "unauthorized",
                });

            filters.authorId = authorId;
        }

        if (!authorId) {
            filters.authorId = req["x-api-key"].authorId;
        }

        if (tags) {
            filters.tags = { $in: tags.split(",") };
        }

        if (subcategory) {
            filters.subcategory = { $in: subcategory.split(",") };
        }

        if (unpublished === "true") {
            filters.isPublished = false;
        }

        const blogDeleted = await blogModel.updateMany({$or:[filters]}, {
            $set: { isDeleted: true, deletedAt: new Date() },
        });
        if (blogDeleted.modifiedCount === 0) {
            return res
                .status(404)
                .send({ status: false, message: "no such blog exists" });
        }
        console.log(blogDeleted);
        res.status(200).json({
            status: true,
            message: "successful deleted",
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};


module.exports.createBlog = createBlog;
module.exports.getAllBlogs = getAllBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogsByQuery= deleteBlogsByQuery
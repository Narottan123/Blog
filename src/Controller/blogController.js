const { default: mongoose } = require('mongoose');
const blogModel = require('../Models/blogModel');
const authorModel = require('../Models/authorModel')


const createBlog = async (req, res) => {
    try {
        const data = req.body;

        // Check if the authorId exists or not
        const author = await authorModel.findById(data.authorId)
        if (!author) {
            return res.status(400).json({
                status: false,
                message: "invalid authorId",
            });
        }
        data.publishedAt = new Date();

        const createdBlog = await blogModel.create(data);
        res.status(201).json({ status: true, data: createdBlog });
    } catch (error) {
        res.status(400).json({ status: false, message: error.message });
    }
};
const getAllBlogs = async (req, res) => {
    try {
        const { authorId, category, tags, subcategory } = req.query;
        const filters = { isDeleted: false, isPublished: true };
        //If the authorId parameter exists, it is added to the filters object.
        if (authorId) {
            filters.authorId = authorId
        }
        if (category) {
            filters.category = category
        }
        if (tags) {
            filters.tags = tags
        }
        if (subcategory) {
            filters.subcategory = subcategory
        }
        let blogs = await blogModel.find(filters);
        if (blogs.length == 0) {
            res.status(400).json({ status: false, message: "No blogs found" });
        }
        res.status(200).json({ status: true, message: "Blogs List", data: blogs });
    }
    catch (err) {
        res.status(500).json({ status: false, message: err.message })
    }

}
const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const isValidId = mongoose.isValidObjectId(blogId);
        if (!isValidId) {
            return res.status(400).json({ status: false, message: "Invalid blogId" });
        }
        const { title, body, tags, subcategory } = req.body;
        const blog = await blogModel.findOne({ _id: blogId, isDeleted: false })
        if (!blog) {
            return res.status(404).json({ status: false, message: "Blog not found" })
        }
        //If title is updated then it will store updated title otherwise store
        //previous title
        blog.title = title || blog.title
        blog.body = body || blog.body
        blog.tags = tags || blog.tags
        blog.subcategory = subcategory || blog.subcategory
        blog.isPublished = true;
        blog.publishedAt = new Date();
        const updatedBlog = await blog.save();
        res.status(200).json({ status: true, message: "Blog updated", data: updatedBlog });
    }
    catch (err) {
        res.status(500).json({ status: false, message: err.message })
    }

}
const deleteBlog = async (req, res) => {
    try {
      const blogId = req.params.blogId;
  
      // Check if the blogId exists and is not deleted
      const blog = await blogModel.findOne({ _id: blogId, isDeleted: false });
      if (!blog) {
        return res.status(404).json({ status : false , message: "Blog not found" });
      }
  
      blog.isDeleted = true;
      blog.deletedAt = new Date();
  
      const deleted = await blog.save();
      res.status(200).json({
          status: true,
          message: ""
        });
    } catch (error) {
      res.status(400).json({status:false , message : error.message });
    }
  };
  
module.exports.createBlog = createBlog;
module.exports.getAllBlogs = getAllBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog=deleteBlog;
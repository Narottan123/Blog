const express=require('express');
const router=express.Router();
const authorController=require('../Controller/authorController')
const blogController=require('../Controller/blogController')
const middleware=require('../middleware/middleware')
const validation = require('../middleware/validation')
router.post('/authors',middleware.emailvalidation,validation.authorValidation,authorController.authorCreate);
router.get('/authordetails',authorController.getAllAuthors)
router.post('/login',authorController.login);

router.post('/blogs',middleware.middlewarefunc,validation.blogValidation,blogController.createBlog)
router.get('/blogs',middleware.middlewarefunc,blogController.getAllBlogs)
router.put('/blogs/:blogId',middleware.middlewarefunc,blogController.updateBlog);
router.delete('/blogs/:blogId',middleware.middlewarefunc,blogController.deleteBlog);
router.delete('/blogs',middleware.middlewarefunc,blogController.deleteBlogsByQuery);

module.exports=router;

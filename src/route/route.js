const express=require('express');
const router=express.Router();
const authorController=require('../Controller/authorController')
const blogController=require('../Controller/blogController')
const middleware=require('../middleware/middleware')
router.post('/authors',authorController.authorCreate);
router.post('/blogs',blogController.createBlog)
router.get('/blogs',middleware.middlewarefunc,blogController.getAllBlogs)
router.put('/blogs/:blogId',blogController.updateBlog);
router.delete('/blogs/:blogId',blogController.deleteBlog);
router.post('/login',authorController.login);
module.exports=router;

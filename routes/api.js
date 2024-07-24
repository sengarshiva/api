const express = require('express')
const TeacherController = require('../controllers/TeacherController')
const UserController = require('../controllers/UserController')
const { ChangeUserAuth } = require('../Middleware/auth')
const route =express.Router()

//route
//http://localhost:4000/api/teacherDisplay
route.get('/teacherDisplay',TeacherController.display)

//userController api
route.get('/getAllUser',ChangeUserAuth,UserController.getAllUser)
route.post('/userInsert',UserController.registerUser)
route.post('/loginUser',UserController.loginUser)
route.get('/logout',UserController.logout)
route.post('/updatePassword',ChangeUserAuth,UserController.updatePassword)
route.post('/updateProfile', ChangeUserAuth, UserController.updateProfile)
route.get('/admin/getUser/:id', UserController.getSingleUser)
route.get('/me', ChangeUserAuth, userController.getUserDetail);
route.delete('/admin/deleteUser/:id', userController.deleteUser);







module.exports =route